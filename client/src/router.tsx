import { Switch, Route } from "wouter";
import Home from "@/pages/home";
import MiniGames from "@/pages/mini-games";
import NotFound from "@/pages/not-found";

export default function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/games" component={() => <MiniGames onBack={() => window.history.back()} />} />
      <Route component={NotFound} />
    </Switch>
  );
}
