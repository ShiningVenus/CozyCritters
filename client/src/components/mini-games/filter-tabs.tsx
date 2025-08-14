import React from 'react';
import { Filter, Star, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GameConfig } from '@/types/game';

export type GameFilter = GameConfig['category'] | 'all' | 'completed' | 'favorites';

interface FilterTabsProps {
  filter: GameFilter;
  onFilterChange: (filter: GameFilter) => void;
}

export function FilterTabs({ filter, onFilterChange }: FilterTabsProps) {
  const categories: GameFilter[] = [
    'all',
    'completed',
    'favorites',
    'calming',
    'focus',
    'sensory',
    'creative',
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Button
          key={category}
          onClick={() => onFilterChange(category)}
          variant={filter === category ? 'default' : 'outline'}
          size="sm"
          className="gap-2"
        >
          {category === 'completed' ? (
            <Star size={14} />
          ) : category === 'favorites' ? (
            <Heart size={14} />
          ) : (
            <Filter size={14} />
          )}
          {category === 'all'
            ? 'All Games'
            : category === 'completed'
            ? 'Completed'
            : category === 'favorites'
            ? 'Favorites'
            : category.charAt(0).toUpperCase() + category.slice(1)}
        </Button>
      ))}
    </div>
  );
}

