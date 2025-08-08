import { Switch, Route } from "wouter";
import Home from "@/pages/home";
import GamesPage from "@/pages/games-page";
import NotFound from "@/pages/not-found";

export default function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/games" component={GamesPage} />
      <Route component={NotFound} />
    </Switch>
  );
}
