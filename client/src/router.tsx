// client/src/router.tsx
import React, { Suspense } from "react";
import { Switch, Route } from "wouter";
import { LoadingPage } from "@/components/loading";

const Home = React.lazy(() => import("@/pages/home"));
const GamesPage = React.lazy(() => import("@/pages/games-page"));
const ForumPage = React.lazy(() => import("@/pages/forum"));
const ThemeCustomizer = React.lazy(() => import("@/pages/ThemeCustomizer"));
const Support = React.lazy(() => import("@/pages/support"));
const NotFound = React.lazy(() => import("@/pages/not-found"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/games" component={GamesPage} />
        <Route path="/forum" component={ForumPage} />
        <Route path="/settings/theme" component={ThemeCustomizer} />
        <Route path="/support" component={Support} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

