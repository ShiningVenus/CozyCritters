import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, Clock, Heart, MessageSquare, Star, Award, Target } from 'lucide-react';

interface CommunityStats {
  totalPosts: number;
  totalReplies: number;
  totalReactions: number;
  activeUsers: number;
  weeklyGoals: {
    completed: number;
    total: number;
  };
}

interface CommunityDashboardProps {
  className?: string;
}

export function CommunityDashboard({ className = "" }: CommunityDashboardProps) {
  const [stats, setStats] = useState<CommunityStats>({
    totalPosts: 0,
    totalReplies: 0,
    totalReactions: 0,
    activeUsers: 0,
    weeklyGoals: { completed: 0, total: 0 }
  });

  useEffect(() => {
    // Calculate stats from localStorage data
    const calculateStats = () => {
      // Forum posts and replies
      const forumPosts = JSON.parse(localStorage.getItem('cozy-critter-forum-posts') || '[]');
      const totalPosts = forumPosts.length;
      const totalReplies = forumPosts.reduce((sum: number, post: any) => sum + (post.replies?.length || 0), 0);
      const totalReactions = forumPosts.reduce((sum: number, post: any) => {
        const postReactions = (post.reactions?.hearts || 0) + (post.reactions?.helpful || 0);
        const replyReactions = (post.replies || []).reduce((replySum: number, reply: any) => 
          replySum + (reply.reactions?.hearts || 0) + (reply.reactions?.helpful || 0), 0);
        return sum + postReactions + replyReactions;
      }, 0);

      // Active users (unique authors in the last week)
      const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      const recentAuthors = new Set();
      forumPosts.forEach((post: any) => {
        if (post.timestamp > weekAgo) {
          recentAuthors.add(post.author);
        }
        (post.replies || []).forEach((reply: any) => {
          if (reply.timestamp > weekAgo) {
            recentAuthors.add(reply.author);
          }
        });
      });

      // Weekly community goals (simplified for Phase 2)
      const copingStrategies = JSON.parse(localStorage.getItem('cozy-critter-coping-strategies') || '[]');
      const recentStrategies = copingStrategies.filter((strategy: any) => 
        strategy.contributedAt > weekAgo
      ).length;

      setStats({
        totalPosts,
        totalReplies,
        totalReactions,
        activeUsers: recentAuthors.size,
        weeklyGoals: {
          completed: recentStrategies + Math.floor(totalReactions / 5), // Simple goal calculation
          total: 10 // Weekly target
        }
      });
    };

    calculateStats();
    
    // Recalculate stats when storage changes
    const handleStorageChange = () => calculateStats();
    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const progressPercentage = Math.min((stats.weeklyGoals.completed / stats.weeklyGoals.total) * 100, 100);

  return (
    <div className={`bg-card dark:bg-card border border-border dark:border-border rounded-xl p-6 ${className}`}>
      <div className="flex items-start gap-3 mb-6">
        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
          <TrendingUp size={20} className="text-green-600 dark:text-green-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-brown dark:text-brown mb-1">
            Community Dashboard
          </h3>
          <p className="text-muted-foreground dark:text-muted-foreground text-sm">
            See how our supportive community is growing together.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare size={16} className="text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-medium text-blue-800 dark:text-blue-200">Posts</span>
          </div>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.totalPosts}</p>
          <p className="text-xs text-blue-700 dark:text-blue-300">Community conversations</p>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users size={16} className="text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-medium text-purple-800 dark:text-purple-200">Replies</span>
          </div>
          <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{stats.totalReplies}</p>
          <p className="text-xs text-purple-700 dark:text-purple-300">Supportive responses</p>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Heart size={16} className="text-red-600 dark:text-red-400" />
            <span className="text-xs font-medium text-red-800 dark:text-red-200">Reactions</span>
          </div>
          <p className="text-2xl font-bold text-red-900 dark:text-red-100">{stats.totalReactions}</p>
          <p className="text-xs text-red-700 dark:text-red-300">Hearts & helpful votes</p>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-orange-600 dark:text-orange-400" />
            <span className="text-xs font-medium text-orange-800 dark:text-orange-200">Active</span>
          </div>
          <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{stats.activeUsers}</p>
          <p className="text-xs text-orange-700 dark:text-orange-300">Users this week</p>
        </div>
      </div>

      {/* Weekly Community Goals */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Target size={16} className="text-yellow-600 dark:text-yellow-400" />
          <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Weekly Community Goals</h4>
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-yellow-700 dark:text-yellow-300">
            Supportive interactions this week
          </span>
          <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            {stats.weeklyGoals.completed} / {stats.weeklyGoals.total}
          </span>
        </div>
        
        <div className="w-full bg-yellow-200 dark:bg-yellow-800 rounded-full h-2 mb-2">
          <div 
            className="bg-yellow-500 dark:bg-yellow-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        <p className="text-xs text-yellow-700 dark:text-yellow-300">
          {progressPercentage >= 100 
            ? "🎉 Amazing! Our community has exceeded this week's goal!"
            : "Together we're building a more supportive space for everyone."
          }
        </p>
      </div>

      {/* Community Highlights */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Star size={16} className="text-green-600 dark:text-green-400" />
            <h5 className="font-medium text-green-800 dark:text-green-200">Most Helpful</h5>
          </div>
          <p className="text-sm text-green-700 dark:text-green-300">
            Posts about sensory strategies and self-advocacy tips are getting lots of helpful reactions this week.
          </p>
        </div>

        <div className="bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Award size={16} className="text-pink-600 dark:text-pink-400" />
            <h5 className="font-medium text-pink-800 dark:text-pink-200">Celebrations</h5>
          </div>
          <p className="text-sm text-pink-700 dark:text-pink-300">
            Community members are sharing wins and celebrating each other's growth and self-acceptance.
          </p>
        </div>
      </div>

      {/* Privacy Note */}
      <div className="mt-4 p-3 bg-muted/30 rounded-lg">
        <p className="text-xs text-muted-foreground">
          All statistics are calculated from anonymous community interactions. No personal data is tracked or stored.
        </p>
      </div>
    </div>
  );
}