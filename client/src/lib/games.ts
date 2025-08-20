import { gameRegistry } from './game-registry';
import { BreathingBubble } from '@/games/breathing-bubble';
import { ColorPattern } from '@/games/color-pattern';
import { DrawingPad } from '@/games/drawing-pad';
import { ShapeMatch } from '@/games/shape-match';
import { ZenBlocks } from '@/games/zen-blocks';
import { CritterCare } from '@/games/critter-care';
import { BubblePop } from '@/games/bubble-pop';
import { AnimalCheckers } from '@/games/animal-checkers';
import { AnimalChess } from '@/games/animal-chess';

// Register all games
gameRegistry.register({
  config: {
    id: 'breathing-bubble',
    name: 'Breathing Bubble',
    description: 'A gentle breathing exercise with a visual guide to help you relax and center yourself.',
    emoji: '🐡',
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
    emoji: '🦋',
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
    emoji: '🐙',
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
    emoji: '🦜',
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
    emoji: '🐢',
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

gameRegistry.register({
  config: {
    id: 'critter-care',
    name: 'Critter Companion',
    description: 'Nurture a cozy critter by feeding, playing, and letting it rest.',
    emoji: '🐾',
    category: 'calming',
    difficulty: 'easy',
    estimatedTime: '5–10 min',
    accessibility: {
      motionSensitive: false,
      soundRequired: false,
      colorBlindFriendly: true
    },
    tags: ['pet', 'care', 'calming', 'mindfulness']
  },
  Component: CritterCare
});

gameRegistry.register({
  config: {
    id: 'bubble-pop',
    name: 'Bubble Pop',
    description: 'Pop soothing bubbles that gently deflate.',
    emoji: '🫧',
    category: 'calming',
    difficulty: 'easy',
    estimatedTime: '1-3 min',
    accessibility: {
      motionSensitive: false,
      soundRequired: false,
      colorBlindFriendly: true
    },
    tags: ['bubbles', 'calming', 'sensory']
  },
  Component: BubblePop
});

gameRegistry.register({
  config: {
    id: 'animal-checkers',
    name: 'Critter Checkers',
    description: 'Friendly foxes and bunnies play a gentle game of checkers against a calm CPU opponent.',
    emoji: '🦊',
    category: 'focus',
    difficulty: 'easy',
    estimatedTime: '5-15 min',
    accessibility: {
      motionSensitive: false,
      soundRequired: false,
      colorBlindFriendly: true
    },
    tags: ['board', 'strategy', 'animals', 'checkers']
  },
  Component: AnimalCheckers
});

gameRegistry.register({
  config: {
    id: 'animal-chess',
    name: 'Critter Chess',
    description: 'A calm chessboard with animal pieces and a gentle CPU opponent.',
    emoji: '🦉',
    category: 'focus',
    difficulty: 'medium',
    estimatedTime: '10-30 min',
    accessibility: {
      motionSensitive: false,
      soundRequired: false,
      colorBlindFriendly: true
    },
    tags: ['board', 'strategy', 'animals', 'chess']
  },
  Component: AnimalChess
});


// Export the registry for use in components
export { gameRegistry };
