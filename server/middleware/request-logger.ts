import type { Request, Response, NextFunction } from "express";
import { log } from "../vite";

// Sensitive field patterns to mask
const SENSITIVE_PATTERNS = [
  /password/i,
  /token/i,
  /secret/i,
  /key/i,
  /auth/i,
  /credential/i,
  /session/i
];

// Fields to whitelist for logging (metadata only)
const WHITELISTED_FIELDS = [
  'id', 'status', 'message', 'count', 'length', 'type', 'timestamp', 
  'success', 'error', 'code', 'version', 'method'
];

function sanitizeString(str: string): string {
  // Remove newlines, carriage returns, tabs, and other control characters
  return str.replace(/[\r\n\t\u0000-\u001f\u007f-\u009f]/g, ' ').trim();
}

function maskSensitiveData(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  
  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }
  
  if (typeof obj !== 'object') return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(item => maskSensitiveData(item));
  }
  
  const masked: any = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const isSensitive = SENSITIVE_PATTERNS.some(pattern => pattern.test(key));
    
    if (isSensitive) {
      masked[key] = '[MASKED]';
    } else if (WHITELISTED_FIELDS.includes(key.toLowerCase())) {
      masked[key] = maskSensitiveData(value);
    } else if (typeof value === 'object' && value !== null) {
      // For nested objects, only include whitelisted fields
      const nestedMasked = maskSensitiveData(value);
      if (Object.keys(nestedMasked).length > 0) {
        masked[key] = nestedMasked;
      }
    }
  }
  
  return masked;
}

function getResponseMetadata(response: any): string {
  if (response === undefined) return '';
  
  let metadata: any = {};
  
  if (typeof response === 'object' && !Buffer.isBuffer(response)) {
    const maskedResponse = maskSensitiveData(response);
    
    // Only log basic metadata
    metadata = {
      type: Array.isArray(response) ? 'array' : 'object',
      ...(Array.isArray(response) ? { length: response.length } : {}),
      ...maskedResponse
    };
    
    // Limit the size of logged metadata
    const metadataStr = JSON.stringify(metadata);
    if (metadataStr.length > 100) {
      metadata = {
        type: metadata.type,
        ...(metadata.length !== undefined ? { length: metadata.length } : {}),
        ...(metadata.message ? { message: sanitizeString(String(metadata.message)) } : {}),
        ...(metadata.status ? { status: metadata.status } : {}),
        truncated: true
      };
    }
  } else {
    metadata = {
      type: Buffer.isBuffer(response) ? 'buffer' : typeof response,
      ...(Buffer.isBuffer(response) ? { size: response.length } : {})
    };
  }
  
  return JSON.stringify(metadata);
}

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  const path = req.originalUrl;
  let capturedResponse: any = undefined;

  const originalResJson = res.json.bind(res);
  res.json = function (bodyJson: any) {
    capturedResponse = bodyJson;
    return originalResJson(bodyJson);
  } as typeof res.json;

  const originalResSend = res.send.bind(res);
  res.send = function (body: any) {
    capturedResponse = body;
    return originalResSend(body);
  } as typeof res.send;

  const originalResEnd = res.end.bind(res);
  res.end = function (chunk?: any, ...args: any[]) {
    if (chunk !== undefined) {
      capturedResponse = chunk;
    }
    return originalResEnd(chunk, ...args);
  } as typeof res.end;

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      const sanitizedPath = sanitizeString(path);
      let logLine = `${req.method} ${sanitizedPath} ${res.statusCode} in ${duration}ms`;
      
      const responseMetadata = getResponseMetadata(capturedResponse);
      if (responseMetadata) {
        logLine += ` :: ${responseMetadata}`;
      }
      
      // Ensure final log line is sanitized and reasonably sized
      logLine = sanitizeString(logLine);
      if (logLine.length > 200) {
        logLine = logLine.slice(0, 199) + "…";
      }
      
      log(logLine);
    }
  });

  next();
}
