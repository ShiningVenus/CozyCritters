import { Switch, Route } from "wouter";
import Home from "@/pages/home";
 bekn8k-codex/refactor-app-for-modular-design
=======
import GamesPage from "@/pages/games-page";
 main
import NotFound from "@/pages/not-found";

export default function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
 bekn8k-codex/refactor-app-for-modular-design
=======
      <Route path="/games" component={GamesPage} />
 main
      <Route component={NotFound} />
    </Switch>
  );
}
