import React, { useState, useEffect } from 'react';
import { Lightbulb, Plus, Heart, Search, Filter, CheckCircle, AlertCircle, Users, Sparkles } from 'lucide-react';

interface CopingStrategy {
  id: string;
  title: string;
  description: string;
  category: 'sensory' | 'executive-function' | 'social' | 'emotional' | 'daily-life' | 'general';
  difficulty: 'easy' | 'medium' | 'challenging';
  tags: string[];
  contributedAt: number;
  helpfulVotes?: number;
  isAnonymous: boolean;
}

interface CommunityCopingStrategiesProps {
  className?: string;
}

const SAMPLE_STRATEGIES: CopingStrategy[] = [
  {
    id: '1',
    title: 'Texture Comfort Kit',
    description: 'Keep a small box of different textures (velvet fabric, stress ball, smooth stone) for sensory regulation when overwhelmed.',
    category: 'sensory',
    difficulty: 'easy',
    tags: ['portable', 'discreet', 'sensory-regulation'],
    contributedAt: Date.now() - 86400000,
    helpfulVotes: 24,
    isAnonymous: true
  },
  {
    id: '2',
    title: 'Energy Tracking with Colors',
    description: 'Use colored sticky dots to mark your energy levels throughout the day. Green = high energy, yellow = medium, red = low. Helps identify patterns.',
    category: 'executive-function',
    difficulty: 'easy',
    tags: ['visual', 'energy-management', 'self-awareness'],
    contributedAt: Date.now() - 172800000,
    helpfulVotes: 18,
    isAnonymous: true
  },
  {
    id: '3',
    title: 'Script for Difficult Conversations',
    description: 'Write down key points before important conversations. Include: 1) What you need to say, 2) Questions you might be asked, 3) Your boundaries.',
    category: 'social',
    difficulty: 'medium',
    tags: ['communication', 'preparation', 'boundaries'],
    contributedAt: Date.now() - 259200000,
    helpfulVotes: 31,
    isAnonymous: true
  },
  {
    id: '4',
    title: 'Emotional Thermometer Check-in',
    description: 'Rate your emotional temperature from 1-10 throughout the day. When you hit 7+, use your cooling strategies (deep breaths, step outside, stim).',
    category: 'emotional',
    difficulty: 'medium',
    tags: ['emotional-regulation', 'self-monitoring', 'prevention'],
    contributedAt: Date.now() - 345600000,
    helpfulVotes: 27,
    isAnonymous: true
  }
];

export function CommunityCopingStrategies({ className = "" }: CommunityCopingStrategiesProps) {
  const [strategies, setStrategies] = useState<CopingStrategy[]>([]);
  const [showContributeForm, setShowContributeForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [contributionStatus, setContributionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // New strategy form state
  const [newStrategy, setNewStrategy] = useState({
    title: '',
    description: '',
    category: 'general' as CopingStrategy['category'],
    difficulty: 'easy' as CopingStrategy['difficulty'],
    tags: [] as string[]
  });

  useEffect(() => {
    loadStrategies();
  }, []);

  const loadStrategies = () => {
    // Load from localStorage and merge with sample strategies
    const savedStrategies = JSON.parse(localStorage.getItem('cozy-critter-coping-strategies') || '[]');
    const allStrategies = [...SAMPLE_STRATEGIES, ...savedStrategies];
    setStrategies(allStrategies);
  };

  const getCategoryLabel = (category: CopingStrategy['category']) => {
    switch (category) {
      case 'sensory': return 'Sensory';
      case 'executive-function': return 'Executive Function';
      case 'social': return 'Social';
      case 'emotional': return 'Emotional';
      case 'daily-life': return 'Daily Life';
      case 'general': return 'General';
    }
  };

  const getCategoryColor = (category: CopingStrategy['category']) => {
    switch (category) {
      case 'sensory': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200';
      case 'executive-function': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200';
      case 'social': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200';
      case 'emotional': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200';
      case 'daily-life': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200';
      case 'general': return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200';
    }
  };

  const getDifficultyColor = (difficulty: CopingStrategy['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800';
      case 'medium': return 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
      case 'challenging': return 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800';
    }
  };

  const filteredStrategies = strategies.filter(strategy => {
    const matchesCategory = filterCategory === 'all' || strategy.category === filterCategory;
    const matchesSearch = searchTerm === '' || 
      strategy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      strategy.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      strategy.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const handleContributeStrategy = async () => {
    if (!newStrategy.title.trim() || !newStrategy.description.trim()) {
      setContributionStatus('error');
      setTimeout(() => setContributionStatus('idle'), 3000);
      return;
    }

    try {
      const strategy: CopingStrategy = {
        id: crypto.randomUUID(),
        title: newStrategy.title.trim(),
        description: newStrategy.description.trim(),
        category: newStrategy.category,
        difficulty: newStrategy.difficulty,
        tags: newStrategy.tags.filter(tag => tag.trim() !== ''),
        contributedAt: Date.now(),
        helpfulVotes: 0,
        isAnonymous: true
      };

      // Save to localStorage
      const savedStrategies = JSON.parse(localStorage.getItem('cozy-critter-coping-strategies') || '[]');
      savedStrategies.push(strategy);
      localStorage.setItem('cozy-critter-coping-strategies', JSON.stringify(savedStrategies));

      // Reset form
      setNewStrategy({
        title: '',
        description: '',
        category: 'general',
        difficulty: 'easy',
        tags: []
      });

      setContributionStatus('success');
      setShowContributeForm(false);
      loadStrategies();

      setTimeout(() => setContributionStatus('idle'), 3000);

    } catch (error) {
      console.error('Failed to contribute strategy:', error);
      setContributionStatus('error');
      setTimeout(() => setContributionStatus('idle'), 3000);
    }
  };

  const addTag = (tagText: string) => {
    const tag = tagText.trim().toLowerCase();
    if (tag && !newStrategy.tags.includes(tag)) {
      setNewStrategy(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewStrategy(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <div className={`bg-card dark:bg-card border border-border dark:border-border rounded-xl p-6 ${className}`}>
      <div className="flex items-start gap-3 mb-6">
        <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
          <Lightbulb size={20} className="text-yellow-600 dark:text-yellow-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-brown dark:text-brown mb-1">
            Community Coping Strategies
          </h3>
          <p className="text-muted-foreground dark:text-muted-foreground text-sm">
            Browse and share anonymous coping strategies, life hacks, and helpful tips from the neurodivergent community.
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search strategies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border dark:border-border bg-background dark:bg-background text-foreground dark:text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-muted-foreground" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-border dark:border-border bg-background dark:bg-background text-foreground dark:text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="all">All Categories</option>
            <option value="sensory">Sensory</option>
            <option value="executive-function">Executive Function</option>
            <option value="social">Social</option>
            <option value="emotional">Emotional</option>
            <option value="daily-life">Daily Life</option>
            <option value="general">General</option>
          </select>
        </div>
      </div>

      {/* Contribute Button */}
      <div className="mb-6">
        {!showContributeForm ? (
          <button
            onClick={() => setShowContributeForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <Plus size={16} />
            Share Your Strategy
          </button>
        ) : (
          <div className="border border-border dark:border-border rounded-lg p-4 bg-muted/30">
            <h4 className="font-medium text-foreground dark:text-foreground mb-3">Share an Anonymous Strategy</h4>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="strategy-title" className="block text-sm font-medium text-foreground dark:text-foreground mb-1">
                  Strategy Title *
                </label>
                <input
                  id="strategy-title"
                  type="text"
                  value={newStrategy.title}
                  onChange={(e) => setNewStrategy(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Brief, descriptive title..."
                  className="w-full p-2 border border-border dark:border-border bg-background dark:bg-background text-foreground dark:text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  maxLength={100}
                />
              </div>

              <div>
                <label htmlFor="strategy-description" className="block text-sm font-medium text-foreground dark:text-foreground mb-1">
                  Description *
                </label>
                <textarea
                  id="strategy-description"
                  value={newStrategy.description}
                  onChange={(e) => setNewStrategy(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Explain your strategy, how it works, and when to use it..."
                  className="w-full p-3 border border-border dark:border-border bg-background dark:bg-background text-foreground dark:text-foreground rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                  rows={4}
                  maxLength={500}
                />
                <div className="text-xs text-muted-foreground mt-1 text-right">
                  {newStrategy.description.length}/500
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="strategy-category" className="block text-sm font-medium text-foreground dark:text-foreground mb-1">
                    Category
                  </label>
                  <select
                    id="strategy-category"
                    value={newStrategy.category}
                    onChange={(e) => setNewStrategy(prev => ({ ...prev, category: e.target.value as CopingStrategy['category'] }))}
                    className="w-full p-2 border border-border dark:border-border bg-background dark:bg-background text-foreground dark:text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="general">General</option>
                    <option value="sensory">Sensory</option>
                    <option value="executive-function">Executive Function</option>
                    <option value="social">Social</option>
                    <option value="emotional">Emotional</option>
                    <option value="daily-life">Daily Life</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="strategy-difficulty" className="block text-sm font-medium text-foreground dark:text-foreground mb-1">
                    Difficulty
                  </label>
                  <select
                    id="strategy-difficulty"
                    value={newStrategy.difficulty}
                    onChange={(e) => setNewStrategy(prev => ({ ...prev, difficulty: e.target.value as CopingStrategy['difficulty'] }))}
                    className="w-full p-2 border border-border dark:border-border bg-background dark:bg-background text-foreground dark:text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="challenging">Challenging</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground dark:text-foreground mb-1">
                  Tags (Optional)
                </label>
                <div className="flex flex-wrap gap-1 mb-2">
                  {newStrategy.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Add tags (press Enter)"
                  className="w-full p-2 border border-border dark:border-border bg-background dark:bg-background text-foreground dark:text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleContributeStrategy}
                  disabled={!newStrategy.title.trim() || !newStrategy.description.trim()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-green-500/50"
                >
                  <Heart size={16} />
                  Contribute Strategy
                </button>
                <button
                  onClick={() => {
                    setShowContributeForm(false);
                    setNewStrategy({
                      title: '',
                      description: '',
                      category: 'general',
                      difficulty: 'easy',
                      tags: []
                    });
                  }}
                  className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  Cancel
                </button>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h5 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">Anonymous Sharing</h5>
                <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Your identity is completely anonymous</li>
                  <li>• Only your strategy content is shared</li>
                  <li>• Help others without revealing personal information</li>
                  <li>• All contributions are permanent once submitted</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Success/Error Messages */}
      {contributionStatus === 'success' && (
        <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg mb-4">
          <CheckCircle size={16} className="text-green-600 dark:text-green-400" />
          <span className="text-sm text-green-800 dark:text-green-200">
            Thank you! Your strategy has been added to the community collection. 💚
          </span>
        </div>
      )}

      {contributionStatus === 'error' && (
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mb-4">
          <AlertCircle size={16} className="text-red-600 dark:text-red-400" />
          <span className="text-sm text-red-800 dark:text-red-200">
            Please fill in all required fields to share your strategy.
          </span>
        </div>
      )}

      {/* Strategies List */}
      <div className="space-y-4">
        {filteredStrategies.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-3xl mb-3">💡</div>
            <h4 className="text-lg font-semibold text-brown dark:text-brown mb-2">
              {searchTerm || filterCategory !== 'all' ? 'No strategies found' : 'No strategies yet'}
            </h4>
            <p className="text-muted-foreground dark:text-muted-foreground">
              {searchTerm || filterCategory !== 'all' 
                ? 'Try adjusting your search or filter to find strategies.'
                : 'Be the first to share a helpful strategy with the community!'
              }
            </p>
          </div>
        ) : (
          filteredStrategies.map(strategy => (
            <div key={strategy.id} className="border border-border dark:border-border rounded-lg p-4 bg-background/50 dark:bg-background/50">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-foreground dark:text-foreground">{strategy.title}</h4>
                <div className="flex items-center gap-2 ml-4">
                  <div className={`px-2 py-1 rounded text-xs border ${getDifficultyColor(strategy.difficulty)}`}>
                    {strategy.difficulty}
                  </div>
                  {strategy.helpfulVotes && strategy.helpfulVotes > 0 && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Heart size={12} className="text-red-500" />
                      {strategy.helpfulVotes}
                    </div>
                  )}
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground dark:text-muted-foreground mb-3">
                {strategy.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(strategy.category)}`}>
                    {getCategoryLabel(strategy.category)}
                  </span>
                  {strategy.tags.length > 0 && (
                    <div className="flex gap-1">
                      {strategy.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                      {strategy.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded">
                          +{strategy.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users size={12} />
                  <span>Community</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-6 p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
        <div className="flex items-start gap-2">
          <Sparkles size={16} className="text-purple-600 dark:text-purple-400 mt-0.5" />
          <div>
            <h5 className="text-sm font-medium text-purple-800 dark:text-purple-200 mb-1">
              Community Wisdom
            </h5>
            <p className="text-xs text-purple-700 dark:text-purple-300">
              These strategies come from real community members sharing what works for them. 
              Remember that different strategies work for different people - try what resonates with you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}