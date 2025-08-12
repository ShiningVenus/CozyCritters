// client/src/router.tsx
import React, { Suspense } from "react";
import { Switch, Route } from "wouter";
import { LoadingPage } from "@/components/loading";

const Home = React.lazy(() => import("@/pages/home"));
const GamesPage = React.lazy(() => import("@/pages/games-page"));
const HtaccessAdmin = React.lazy(() => import("@/pages/htaccess-admin"));
const NotFound = React.lazy(() => import("@/pages/not-found"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/games" component={GamesPage} />
        <Route path="/admin/htaccess" component={HtaccessAdmin} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

