import React, { useState, useEffect } from 'react';
import { MessageSquare, Heart, User, Clock, ChevronDown, ChevronUp, Plus, Flag, ThumbsUp, Pin, EyeOff, Edit3, Shield } from 'lucide-react';
import { useUserSession } from '../hooks/useUserSession';
import { ForumPostModeration, ForumReplyModeration, ModerationAction, UserRole } from '../../../shared/schema';

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string; // Anonymous identifier like "Helpful Fox" or "Anonymous"
  timestamp: number;
  category: 'support' | 'celebration' | 'question' | 'share' | 'general';
  replies: ForumReply[];
  reactions: {
    hearts: number;
    helpful: number;
  };
  userReacted?: {
    hearts?: boolean;
    helpful?: boolean;
  };
  moderation?: ForumPostModeration;
}

interface ForumReply {
  id: string;
  content: string;
  author: string;
  timestamp: number;
  reactions: {
    hearts: number;
    helpful: number;
  };
  userReacted?: {
    hearts?: boolean;
    helpful?: boolean;
  };
  moderation?: ForumReplyModeration;
}

interface CommunityForumProps {
  className?: string;
}

export function CommunityForum({ className = "" }: CommunityForumProps) {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'general' as ForumPost['category']
  });
  const [newReply, setNewReply] = useState<{ [postId: string]: string }>({});
  const [showRolePanel, setShowRolePanel] = useState(false);
  
  const { userSession, updateUserRole, hasModeratorAccess, hasAdminAccess } = useUserSession();

  // Load posts from localStorage
  useEffect(() => {
    const savedPosts = localStorage.getItem('cozy-critter-forum-posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      // Initialize with some sample posts for Phase 2
      const samplePosts: ForumPost[] = [
        {
          id: '1',
          title: 'Finding sensory-friendly spaces in public',
          content: 'Has anyone found good strategies for managing sensory overload in grocery stores? I struggle with the bright lights and noise.',
          author: 'Gentle Penguin',
          timestamp: Date.now() - 86400000, // 1 day ago
          category: 'support',
          replies: [
            {
              id: '1-1',
              content: 'I bring noise-canceling headphones and shop during off-peak hours. Early morning or late evening are usually quieter.',
              author: 'Wise Owl',
              timestamp: Date.now() - 43200000, // 12 hours ago
              reactions: { hearts: 3, helpful: 5 }
            }
          ],
          reactions: { hearts: 2, helpful: 4 }
        },
        {
          id: '2',
          title: 'Small victory: Finally told my friend about my autism diagnosis',
          content: 'It was scary but they were so understanding and supportive. Feeling grateful for good friends.',
          author: 'Brave Rabbit',
          timestamp: Date.now() - 172800000, // 2 days ago
          category: 'celebration',
          replies: [],
          reactions: { hearts: 8, helpful: 2 }
        }
      ];
      setPosts(samplePosts);
      localStorage.setItem('cozy-critter-forum-posts', JSON.stringify(samplePosts));
    }
  }, []);

  const savePosts = (updatedPosts: ForumPost[]) => {
    setPosts(updatedPosts);
    localStorage.setItem('cozy-critter-forum-posts', JSON.stringify(updatedPosts));
  };

  const handleCreatePost = () => {
    if (!newPost.title.trim() || !newPost.content.trim() || !userSession) return;

    const post: ForumPost = {
      id: crypto.randomUUID(),
      title: newPost.title.trim(),
      content: newPost.content.trim(),
      author: userSession.username,
      timestamp: Date.now(),
      category: newPost.category,
      replies: [],
      reactions: { hearts: 0, helpful: 0 }
    };

    const updatedPosts = [post, ...posts];
    savePosts(updatedPosts);
    setNewPost({ title: '', content: '', category: 'general' });
    setShowNewPostForm(false);
  };

  const handleAddReply = (postId: string) => {
    const replyContent = newReply[postId]?.trim();
    if (!replyContent || !userSession) return;

    const reply: ForumReply = {
      id: crypto.randomUUID(),
      content: replyContent,
      author: userSession.username,
      timestamp: Date.now(),
      reactions: { hearts: 0, helpful: 0 }
    };

    const updatedPosts = posts.map(post => 
      post.id === postId 
        ? { ...post, replies: [...post.replies, reply] }
        : post
    );

    savePosts(updatedPosts);
    setNewReply({ ...newReply, [postId]: '' });
  };

  const handleReaction = (postId: string, replyId: string | null, type: 'hearts' | 'helpful') => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        if (replyId) {
          // Reaction on reply
          const updatedReplies = post.replies.map(reply => {
            if (reply.id === replyId) {
              const currentUserReacted = reply.userReacted?.[type] || false;
              return {
                ...reply,
                reactions: {
                  ...reply.reactions,
                  [type]: currentUserReacted 
                    ? reply.reactions[type] - 1 
                    : reply.reactions[type] + 1
                },
                userReacted: {
                  ...reply.userReacted,
                  [type]: !currentUserReacted
                }
              };
            }
            return reply;
          });
          return { ...post, replies: updatedReplies };
        } else {
          // Reaction on post
          const currentUserReacted = post.userReacted?.[type] || false;
          return {
            ...post,
            reactions: {
              ...post.reactions,
              [type]: currentUserReacted 
                ? post.reactions[type] - 1 
                : post.reactions[type] + 1
            },
            userReacted: {
              ...post.userReacted,
              [type]: !currentUserReacted
            }
          };
        }
      }
      return post;
    });

    savePosts(updatedPosts);
  };

  const togglePostExpansion = (postId: string) => {
    const newExpanded = new Set(expandedPosts);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
    }
    setExpandedPosts(newExpanded);
  };

  const generateAnonymousName = () => {
    const animals = ['Fox', 'Owl', 'Rabbit', 'Penguin', 'Deer', 'Cat', 'Bear', 'Wolf', 'Squirrel', 'Hedgehog'];
    const adjectives = ['Gentle', 'Wise', 'Kind', 'Brave', 'Calm', 'Thoughtful', 'Patient', 'Creative', 'Curious', 'Peaceful'];
    const animal = animals[Math.floor(Math.random() * animals.length)];
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    return `${adjective} ${animal}`;
  };

  // Moderation functions
  const moderatePost = (postId: string, action: 'hide' | 'pin' | 'show' | 'unpin', reason?: string) => {
    if (!hasModeratorAccess() || !userSession) return;

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const moderation = post.moderation || { isHidden: false, isPinned: false, isEdited: false, actions: [] };
        
        const moderationAction: ModerationAction = {
          id: crypto.randomUUID(),
          type: action === 'show' ? 'hide' : action === 'unpin' ? 'pin' : action,
          moderatorId: userSession.id,
          moderatorName: userSession.username,
          reason,
          timestamp: Date.now()
        };

        let updatedModeration = { ...moderation };
        
        switch (action) {
          case 'hide':
            updatedModeration.isHidden = true;
            break;
          case 'show':
            updatedModeration.isHidden = false;
            break;
          case 'pin':
            updatedModeration.isPinned = true;
            break;
          case 'unpin':
            updatedModeration.isPinned = false;
            break;
        }

        updatedModeration.actions.push(moderationAction);

        return { ...post, moderation: updatedModeration };
      }
      return post;
    });

    savePosts(updatedPosts);
  };

  const moderateReply = (postId: string, replyId: string, action: 'hide' | 'show', reason?: string) => {
    if (!hasModeratorAccess() || !userSession) return;

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const updatedReplies = post.replies.map(reply => {
          if (reply.id === replyId) {
            const moderation = reply.moderation || { isHidden: false, isEdited: false, actions: [] };
            
            const moderationAction: ModerationAction = {
              id: crypto.randomUUID(),
              type: action === 'show' ? 'hide' : action,
              moderatorId: userSession.id,
              moderatorName: userSession.username,
              reason,
              timestamp: Date.now()
            };

            let updatedModeration = { ...moderation };
            updatedModeration.isHidden = action === 'hide';
            updatedModeration.actions.push(moderationAction);

            return { ...reply, moderation: updatedModeration };
          }
          return reply;
        });
        return { ...post, replies: updatedReplies };
      }
      return post;
    });

    savePosts(updatedPosts);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      support: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
      celebration: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
      question: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200',
      share: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200',
      general: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    };
    return colors[category as keyof typeof colors] || colors.general;
  };

  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  // Filter out hidden posts for regular users, sort pinned posts to top
  const visiblePosts = filteredPosts
    .filter(post => hasModeratorAccess() || !post.moderation?.isHidden)
    .sort((a, b) => {
      // Pinned posts first
      if (a.moderation?.isPinned && !b.moderation?.isPinned) return -1;
      if (!a.moderation?.isPinned && b.moderation?.isPinned) return 1;
      // Then by timestamp (newest first)
      return b.timestamp - a.timestamp;
    });

  return (
    <div className={`bg-card dark:bg-card border border-border dark:border-border rounded-xl p-6 ${className}`}>
      <div className="flex items-start gap-3 mb-6">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <MessageSquare size={20} className="text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-brown dark:text-brown mb-1">
            Community Forum (Phase 2)
          </h3>
          <p className="text-muted-foreground dark:text-muted-foreground text-sm">
            Share experiences, ask questions, and support each other in a safe, anonymous space.
          </p>
          {userSession && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-muted-foreground">
                Logged in as: {userSession.username}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                userSession.role === 'admin' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200' :
                userSession.role === 'moderator' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200' :
                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
              }`}>
                {userSession.role}
              </span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          {hasAdminAccess() && (
            <button
              onClick={() => setShowRolePanel(!showRolePanel)}
              className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors text-sm"
            >
              <Shield size={16} />
              Admin
            </button>
          )}
          <button
            onClick={() => setShowNewPostForm(true)}
            className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
          >
            <Plus size={16} />
            New Post
          </button>
        </div>
      </div>

      {/* Admin Role Panel */}
      {showRolePanel && hasAdminAccess() && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-red-900 dark:text-red-200 mb-3">Admin Panel - Role Management</h4>
          <div className="space-y-2">
            <p className="text-sm text-red-700 dark:text-red-300">
              For demo purposes - in a real app, this would be a proper admin interface
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => updateUserRole('user')}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded"
              >
                Set as User
              </button>
              <button
                onClick={() => updateUserRole('moderator')}
                className="px-3 py-1 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200 rounded"
              >
                Set as Moderator
              </button>
              <button
                onClick={() => updateUserRole('admin')}
                className="px-3 py-1 text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 rounded"
              >
                Set as Admin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {['all', 'support', 'celebration', 'question', 'share', 'general'].map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 rounded-full text-xs transition-colors ${
              selectedCategory === category
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {category === 'all' ? 'All Posts' : category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* New Post Form */}
      {showNewPostForm && (
        <div className="bg-muted/30 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-foreground mb-3">Create New Post</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Category
              </label>
              <select
                value={newPost.category}
                onChange={(e) => setNewPost({...newPost, category: e.target.value as ForumPost['category']})}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="general">General</option>
                <option value="support">Support</option>
                <option value="celebration">Celebration</option>
                <option value="question">Question</option>
                <option value="share">Share</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Title
              </label>
              <input
                type="text"
                value={newPost.title}
                onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                placeholder="What would you like to discuss?"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Content
              </label>
              <textarea
                value={newPost.content}
                onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                placeholder="Share your thoughts, experiences, or questions..."
                rows={4}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCreatePost}
                disabled={!newPost.title.trim() || !newPost.content.trim()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Post
              </button>
              <button
                onClick={() => setShowNewPostForm(false)}
                className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Posts */}
      <div className="space-y-4">
        {visiblePosts.map(post => (
          <div key={post.id} className={`bg-background border border-border rounded-lg p-4 ${
            post.moderation?.isHidden ? 'opacity-60 border-red-300 dark:border-red-800' : ''
          } ${
            post.moderation?.isPinned ? 'border-yellow-300 dark:border-yellow-700 bg-yellow-50/50 dark:bg-yellow-900/10' : ''
          }`}>
            {/* Post Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(post.category)}`}>
                  {post.category}
                </span>
                {post.moderation?.isPinned && (
                  <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200 flex items-center gap-1">
                    <Pin size={10} />
                    Pinned
                  </span>
                )}
                {post.moderation?.isHidden && hasModeratorAccess() && (
                  <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 flex items-center gap-1">
                    <EyeOff size={10} />
                    Hidden
                  </span>
                )}
                <span className="text-xs text-muted-foreground">
                  by {post.author}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock size={12} />
                  {new Date(post.timestamp).toLocaleDateString()}
                </span>
              </div>
              
              {/* Moderation Controls */}
              {hasModeratorAccess() && (
                <div className="flex gap-1">
                  <button
                    onClick={() => moderatePost(post.id, post.moderation?.isPinned ? 'unpin' : 'pin')}
                    className={`p-1 rounded text-xs transition-colors ${
                      post.moderation?.isPinned 
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200 hover:bg-yellow-200 dark:hover:bg-yellow-900/50' 
                        : 'text-muted-foreground hover:bg-muted/50'
                    }`}
                    title={post.moderation?.isPinned ? 'Unpin post' : 'Pin post'}
                  >
                    <Pin size={14} />
                  </button>
                  <button
                    onClick={() => moderatePost(post.id, post.moderation?.isHidden ? 'show' : 'hide')}
                    className={`p-1 rounded text-xs transition-colors ${
                      post.moderation?.isHidden 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-900/50' 
                        : 'text-muted-foreground hover:bg-muted/50'
                    }`}
                    title={post.moderation?.isHidden ? 'Show post' : 'Hide post'}
                  >
                    <EyeOff size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Post Content */}
            <h4 className="font-medium text-foreground mb-2">{post.title}</h4>
            <p className="text-muted-foreground text-sm mb-3">{post.content}</p>

            {/* Post Reactions */}
            <div className="flex items-center gap-4 mb-3">
              <button
                onClick={() => handleReaction(post.id, null, 'hearts')}
                className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors ${
                  post.userReacted?.hearts
                    ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                    : 'text-muted-foreground hover:bg-muted/50'
                }`}
              >
                <Heart size={12} />
                {post.reactions.hearts}
              </button>
              <button
                onClick={() => handleReaction(post.id, null, 'helpful')}
                className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors ${
                  post.userReacted?.helpful
                    ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                    : 'text-muted-foreground hover:bg-muted/50'
                }`}
              >
                <ThumbsUp size={12} />
                {post.reactions.helpful}
              </button>
              <button
                onClick={() => togglePostExpansion(post.id)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {expandedPosts.has(post.id) ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                {post.replies.length} replies
              </button>
            </div>

            {/* Replies */}
            {expandedPosts.has(post.id) && (
              <div className="border-t border-border pt-3 mt-3">
                {/* Existing Replies */}
                {post.replies
                  .filter(reply => hasModeratorAccess() || !reply.moderation?.isHidden)
                  .map(reply => (
                  <div key={reply.id} className={`bg-muted/30 rounded-lg p-3 mb-3 ${
                    reply.moderation?.isHidden ? 'opacity-60 border border-red-300 dark:border-red-800' : ''
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {reply.moderation?.isHidden && hasModeratorAccess() && (
                        <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 flex items-center gap-1">
                          <EyeOff size={8} />
                          Hidden
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {reply.author}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock size={10} />
                        {new Date(reply.timestamp).toLocaleDateString()}
                      </span>
                      
                      {/* Reply Moderation Controls */}
                      {hasModeratorAccess() && (
                        <button
                          onClick={() => moderateReply(post.id, reply.id, reply.moderation?.isHidden ? 'show' : 'hide')}
                          className={`p-1 rounded text-xs transition-colors ml-auto ${
                            reply.moderation?.isHidden 
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-900/50' 
                              : 'text-muted-foreground hover:bg-muted/50'
                          }`}
                          title={reply.moderation?.isHidden ? 'Show reply' : 'Hide reply'}
                        >
                          <EyeOff size={12} />
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-foreground mb-2">{reply.content}</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleReaction(post.id, reply.id, 'hearts')}
                        className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors ${
                          reply.userReacted?.hearts
                            ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                            : 'text-muted-foreground hover:bg-muted/50'
                        }`}
                      >
                        <Heart size={10} />
                        {reply.reactions.hearts}
                      </button>
                      <button
                        onClick={() => handleReaction(post.id, reply.id, 'helpful')}
                        className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors ${
                          reply.userReacted?.helpful
                            ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                            : 'text-muted-foreground hover:bg-muted/50'
                        }`}
                      >
                        <ThumbsUp size={10} />
                        {reply.reactions.helpful}
                      </button>
                    </div>
                  </div>
                ))}

                {/* New Reply Form */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newReply[post.id] || ''}
                    onChange={(e) => setNewReply({...newReply, [post.id]: e.target.value})}
                    placeholder="Write a supportive reply..."
                    className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <button
                    onClick={() => handleAddReply(post.id)}
                    disabled={!newReply[post.id]?.trim()}
                    className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Reply
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {visiblePosts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
            <p>No posts in this category yet.</p>
            <p className="text-sm">Be the first to start a conversation!</p>
          </div>
        )}
      </div>
    </div>
  );
}