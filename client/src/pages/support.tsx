import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

const Support = () => {
  useEffect(() => {
    (function (d, t) {
      var BASE_URL = "https://app.chatwoot.com";
      var g = d.createElement(t),
        s = d.getElementsByTagName(t)[0];
      g.src = BASE_URL + "/packs/js/sdk.js";
      g.async = true;
      s.parentNode.insertBefore(g, s);
      g.onload = function () {
        // @ts-ignore
        window.chatwootSDK.run({
          websiteToken: "DwYjbjX3oedt2ZPeTKZqBqmE",
          baseUrl: BASE_URL,
        });
      };
    })(document, "script");
  }, []);

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
};

export default Support;
