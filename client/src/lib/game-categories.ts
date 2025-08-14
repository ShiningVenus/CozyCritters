import { GameConfig } from '@/types/game';

const iconMap: Record<GameConfig['category'], string> = {
  calming: '🌙',
  focus: '🎯',
  sensory: '✨',
  creative: '🎨',
};

const colorMap: Record<GameConfig['category'], string> = {
  calming:
    'from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-700',
  focus:
    'from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 border-green-200 dark:border-green-700',
  sensory:
    'from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-700',
  creative:
    'from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 border-pink-200 dark:border-pink-700',
};

const defaultIcon = '🎮';
const defaultColor =
  'from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 border-gray-200 dark:border-gray-700';

export function getCategoryIcon(category: GameConfig['category']): string {
  return iconMap[category] ?? defaultIcon;
}

export function getCategoryColor(category: GameConfig['category']): string {
  return colorMap[category] ?? defaultColor;
}

