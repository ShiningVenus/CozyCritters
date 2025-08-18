import { Card, CardContent } from "@/components/ui/card";

const Support = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6 space-y-4">
          <h1 className="text-2xl font-bold">Support</h1>
          <p>💬 Need help? Support resources are coming soon.</p>
          <p>❓ FAQ: Coming soon...</p>
          <p>📚 More help resources on the way.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Support;
