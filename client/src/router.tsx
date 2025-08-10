import React, { Suspense } from "react";
import { Switch, Route } from "wouter";
import { LoadingPage } from "@/components/loading";

// Lazy load pages for better performance
const Home = React.lazy(() => import("@/pages/home"));
const GamesPage = React.lazy(() => import("@/pages/games-page"));
const NotFound = React.lazy(() => import("@/pages/not-found"));

export default function Router() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/games" component={GamesPage} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}
