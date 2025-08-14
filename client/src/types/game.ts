export interface GameConfig {
  id: string;
  name: string;
  description: string;
  emoji: string;
  category: 'calming' | 'focus' | 'sensory' | 'creative';
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string; // e.g., "2-5 min"
  accessibility: {
    motionSensitive: boolean;
    soundRequired: boolean;
    colorBlindFriendly: boolean;
  };
  tags: string[];
}

export interface GameState {
  isActive: boolean;
  isPaused: boolean;
  score?: number;
  level?: number;
  timeElapsed: number;
  customData?: Record<string, any>;
}

export interface GameProps {
  onComplete?: (result: GameResult) => void;
  onExit?: () => void;
  config: GameConfig;
}

export interface GameResult {
  completed: boolean;
  score?: number;
  timeSpent: number;
  achievements?: string[];
  moodImpact?: 'positive' | 'neutral' | 'calming';
}

export interface Game {
  config: GameConfig;
  loader: () => Promise<React.ComponentType<GameProps>>;
  Component?: React.ComponentType<GameProps>;
}