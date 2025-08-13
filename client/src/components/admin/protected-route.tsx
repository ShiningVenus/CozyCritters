import React, { useEffect, useState } from "react";
import { LoadingPage } from "@/components/loading";

interface Props {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: Props) {
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/admin/users", { credentials: "include" })
      .then((res) => {
        if (res.ok) {
          setAuthorized(true);
        } else {
          setAuthorized(false);
        }
      })
      .catch(() => setAuthorized(false));
  }, []);

  if (authorized === null) {
    return <LoadingPage />;
  }

  if (!authorized) {
    window.location.href = "/cms-login.html";
    return null;
  }

  return <>{children}</>;
}
