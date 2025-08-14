// client/src/router.tsx
import React, { Suspense } from "react";
import { Switch, Route } from "wouter";
import { LoadingPage } from "@/components/loading";
import { ProtectedRoute } from "@/components/admin/protected-route";

const Home = React.lazy(() => import("@/pages/home"));
const GamesPage = React.lazy(() => import("@/pages/games-page"));
const ThemeCustomizer = React.lazy(() => import("@/pages/ThemeCustomizer"));
const AdminUsers = React.lazy(() => import("@/pages/admin/users"));
const Support = React.lazy(() => import("@/pages/support"));
const NotFound = React.lazy(() => import("@/pages/not-found"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/games" component={GamesPage} />
        <Route path="/settings/theme" component={ThemeCustomizer} />
        <Route
          path="/admin"
          component={() => (
            <ProtectedRoute>
              <AdminUsers />
            </ProtectedRoute>
          )}
        />
        <Route path="/support" component={Support} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

