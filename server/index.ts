import express, { type Request, Response, NextFunction } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import path from "path";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { requestLogger } from "./middleware/request-logger";
import { cmsAuth } from "./middleware/cms-auth";
import crypto from "crypto";
import { getUser, verifyPassword } from "./admin-users";

const JWT_SECRET = process.env.JWT_SECRET || "change-me";

function base64url(input: Buffer): string {
  return input
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function signToken(payload: Record<string, any>): string {
  const data = base64url(Buffer.from(JSON.stringify(payload)));
  const sig = base64url(
    crypto.createHmac("sha256", JWT_SECRET).update(data).digest()
  );
  return `${data}.${sig}`;
}

const app = express();

// Configure trust proxy for accurate IP detection behind proxies
// This is required for rate limiting to work properly in production
app.set('trust proxy', process.env.NODE_ENV === 'production' ? 1 : false);

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        // Add your production domains here
        'https://your-app-name.replit.app',
        /\.replit\.app$/,  // Allow any .replit.app subdomain
        /\.replit\.dev$/   // Allow any .replit.dev subdomain
      ]
    : [
        'http://localhost:3000',
        'http://localhost:5000',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5000',
        // Add the current Replit domain for development
        `https://${process.env.REPLIT_DOMAINS}`,
        /\.spock\.replit\.dev$/,  // Allow Replit dev domains
        /\.replit\.dev$/         // Allow any .replit.dev subdomain
      ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With', 
    'Content-Type', 
    'Accept',
    'Authorization',
    'Cache-Control'
  ],
  credentials: true, // Allow cookies and credentials
  maxAge: 86400 // Cache preflight for 24 hours
};

app.use(cors(corsOptions));

// Security middleware
const isProduction = process.env.NODE_ENV === 'production';

const scriptSrc = ["'self'"];
const styleSrc = ["'self'", "https://fonts.googleapis.com"];

if (!isProduction) {
  // Allow inline scripts/styles and eval in development for Vite and Replit banner
  scriptSrc.push("'unsafe-inline'", "'unsafe-eval'", "https://replit.com");
  styleSrc.push("'unsafe-inline'");
} else {
  // In production, inline scripts or styles should use nonces, hashes, or be moved to external files
}

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc,
        scriptSrc,
        imgSrc: ["'self'", "data:", "blob:"],
        connectSrc: ["'self'", "ws:", "wss:"], // Allow WebSocket for HMR
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false, // Disable for dev compatibility
  })
);

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 1000 : 200, // Higher limit in development
  message: {
    error: "Too many requests from this IP, please try again later.",
    retryAfter: "15 minutes"
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting for static assets in development
  skip: (req) => {
    if (process.env.NODE_ENV === 'development') {
      const path = req.path;
      // Skip common static asset paths
      return path.endsWith('.css') || 
             path.endsWith('.js') || 
             path.endsWith('.tsx') || 
             path.endsWith('.ts') || 
             path.includes('/src/') ||
             path.includes('/@') || // Vite internal paths
             path === '/favicon.ico' ||
             path === '/manifest.json';
    }
    return false;
  }
});

// Stricter rate limiting for API routes only
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 500 : 100,
  message: {
    error: "Too many API requests from this IP, please try again later.",
    retryAfter: "15 minutes"
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply general rate limiting to all requests
app.use(limiter);

// Apply stricter rate limiting only to API routes
app.use('/api', apiLimiter);

app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: false, limit: '100kb' }));

app.post('/api/login', (req, res) => {
  const { username, password } = req.body as { username: string; password: string };
  const user = getUser(username);
  if (!user || !verifyPassword(password, user.password)) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }
  const token = signToken({
    username,
    passwordHash: user.password,
    role: user.role,
  });
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  res.json({ token });
});

// Authentication for CMS related routes
app.use(["/admin", "/api", "/content"], cmsAuth);

app.use("/content", express.static(path.resolve("content")));

app.use(requestLogger);

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Structured error logging
    log(`Error ${status}: ${message} - ${req.method} ${req.originalUrl}`, "error");
    
    // Log full error details in development
    if (app.get("env") === "development") {
      console.error("Full error details:", err);
    }

    // Send error response and end request lifecycle
    res.status(status).json({ message });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})().catch((err) => {
  log(err.message);
  process.exit(1);
});
