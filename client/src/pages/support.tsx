import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Support() {
  return (
    <div className="min-h-screen max-w-md mx-auto bg-background shadow-lg relative">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <header
        role="banner"
        className="bg-primary text-primary-foreground p-6 rounded-b-3xl shadow-md relative"
      >
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <h1 className="text-2xl font-bold text-center">Support</h1>
      </header>
      <main id="main-content" role="main" className="p-6">
        <Card aria-labelledby="support-heading">
          <CardHeader>
            <CardTitle id="support-heading">How can we help?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              <span role="img" aria-label="email">
                📧
              </span>{" "}
              Email: <a href="mailto:support@example.com" className="underline">support@example.com</a>
            </p>
            <p>
              <span role="img" aria-label="question mark">
                ❓
              </span>{" "}
              FAQ: Coming soon...
            </p>
            <p>
              <span role="img" aria-label="speech balloon">
                💬
              </span>{" "}
              More help resources on the way.
            </p>
          </CardContent>
        </Card>
        <p className="mt-4 text-center">
          <a href="/" className="underline">
            ← Back to Home
          </a>
        </p>
      </main>
    </div>
  );
}

import { Card, CardContent } from "@/components/ui/card";

export default function Support() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6 space-y-4">
          <h1 className="text-2xl font-bold">Support</h1>
          <p>📧 Email: support@example.com</p>
          <p>❓ FAQ: Coming soon...</p>
          <p>💬 More help resources on the way.</p>
        </CardContent>
      </Card>
    </div>
  );
}
