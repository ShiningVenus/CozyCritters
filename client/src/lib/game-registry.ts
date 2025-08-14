import { Game, GameConfig } from '@/types/game';

class GameRegistry {
  private games = new Map<string, Game>();

  register(game: Game) {
    this.games.set(game.config.id, game);
  }

  async getComponent(id: string) {
    const game = this.games.get(id);
    if (!game) return undefined;
    if (!game.Component) {
      game.Component = await game.loader();
    }
    return game.Component;
  }

  getGame(id: string): Game | undefined {
    return this.games.get(id);
  }

  getAllGames(): Game[] {
    return Array.from(this.games.values());
  }

  getGamesByCategory(category: GameConfig['category']): Game[] {
    return this.getAllGames().filter(game => game.config.category === category);
  }

  getGamesByTags(tags: string[]): Game[] {
    return this.getAllGames().filter(game => 
      tags.some(tag => game.config.tags.includes(tag))
    );
  }

  getAccessibleGames(preferences: {
    avoidMotion?: boolean;
    requireSound?: boolean;
    colorBlindFriendly?: boolean;
  }): Game[] {
    return this.getAllGames().filter(game => {
      const { accessibility } = game.config;
      
      if (preferences.avoidMotion && accessibility.motionSensitive) return false;
      if (preferences.requireSound && !accessibility.soundRequired) return false;
      if (preferences.colorBlindFriendly && !accessibility.colorBlindFriendly) return false;
      
      return true;
    });
  }
}

export const gameRegistry = new GameRegistry();