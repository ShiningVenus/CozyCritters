import { gameRegistry } from './game-registry';
import { BreathingBubble } from '@/games/breathing-bubble';
import { ColorPattern } from '@/games/color-pattern';
import { DrawingPad } from '@/games/drawing-pad';
import { ShapeMatch } from '@/games/shape-match';
import { ZenBlocks } from '@/games/zen-blocks';

// Register all games
gameRegistry.register({
  config: {
    id: 'breathing-bubble',
    name: 'Breathing Bubble',
    description: 'A gentle breathing exercise with a visual guide to help you relax and center yourself.',
    emoji: '🫧',
    category: 'calming',
    difficulty: 'easy',
    estimatedTime: '2-5 min',
    accessibility: {
      motionSensitive: false,
      soundRequired: false,
      colorBlindFriendly: true
    },
    tags: ['breathing', 'meditation', 'anxiety', 'calming', 'mindfulness']
  },
  Component: BreathingBubble
});

gameRegistry.register({
  config: {
    id: 'color-pattern',
    name: 'Gentle Patterns',
    description: 'A soothing memory game with soft colors and no time pressure. Great for focus practice.',
    emoji: '🌈',
    category: 'focus',
    difficulty: 'easy',
    estimatedTime: '3-10 min',
    accessibility: {
      motionSensitive: false,
      soundRequired: false,
      colorBlindFriendly: false
    },
    tags: ['memory', 'focus', 'patterns', 'colors', 'concentration']
  },
  Component: ColorPattern
});

gameRegistry.register({
  config: {
    id: 'shape-match',
    name: 'Shape Match',
    description: 'Flip cards to find matching shapes. A gentle memory challenge.',
    emoji: '🔷',
    category: 'focus',
    difficulty: 'easy',
    estimatedTime: '2-5 min',
    accessibility: {
      motionSensitive: false,
      soundRequired: false,
      colorBlindFriendly: true
    },
    tags: ['memory', 'matching', 'shapes', 'focus']
  },
  Component: ShapeMatch
});

gameRegistry.register({
  config: {
    id: 'drawing-pad',
    name: 'Drawing Pad',
    description: 'A simple canvas for free drawing with soft color swatches.',
    emoji: '🎨',
    category: 'creative',
    difficulty: 'easy',
    estimatedTime: '2-5 min',
    accessibility: {
      motionSensitive: false,
      soundRequired: false,
      colorBlindFriendly: true
    },
    tags: ['drawing', 'art', 'creative', 'expression']
  },
    Component: DrawingPad
  });

gameRegistry.register({
  config: {
    id: 'zen-blocks',
    name: 'Zen Blocks',
    description: 'A relaxing block-stacking game with slow falling pieces and no game over.',
    emoji: '🧘',
    category: 'calming',
    difficulty: 'easy',
    estimatedTime: '5-10 min',
    accessibility: {
      motionSensitive: false,
      soundRequired: false,
      colorBlindFriendly: true
    },
    tags: ['blocks', 'calming', 'focus', 'tetris']
  },
  Component: ZenBlocks
});

// Export the registry for use in components
export { gameRegistry };