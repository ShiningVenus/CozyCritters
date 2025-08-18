import { Card, CardContent } from "@/components/ui/card";

const Support = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6 space-y-4">
          <h1 className="text-2xl font-bold">Support</h1>
          <p>
            💬 Need help? Visit our{' '}
            <a
              href="https://chatwoot.help/hc/help-and-support/en"
              className="text-blue-600 underline"
              target="_blank"
              rel="noreferrer"
            >
              Help Center
            </a>
            .
          </p>
          <p>❓ FAQ: Coming soon...</p>
          <p>📚 More help resources on the way.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Support;
