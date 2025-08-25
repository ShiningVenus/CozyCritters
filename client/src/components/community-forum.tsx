import React, { useState, useEffect } from 'react';
import { MessageSquare, Heart, User, Clock, ChevronDown, ChevronUp, Plus, Flag, ThumbsUp, Pin, EyeOff, Edit3, Shield, Folder, Users, FileText, UserPlus, LogIn } from 'lucide-react';
import { useUserSession } from '../hooks/useUserSession';
import { ForumPostModeration, ForumReplyModeration, ModerationAction, UserRole } from '../../../shared/schema';
import { UserAuthModal } from './user-auth-modal';
import { ForumThemeSelector } from './forum-theme-selector';
import { initializeForumTheme } from '../lib/forum-themes';
import './phpbb-forum.css';

interface ForumBoard {
  id: string;
  name: string;
  description: string;
  icon: string;
  topicCount: number;
  postCount: number;
  lastPost?: {
    topicTitle: string;
    author: string;
    timestamp: number;
  };
}

interface ForumTopic {
  id: string;
  title: string;
  author: string; // Anonymous identifier like "Helpful Fox"
  timestamp: number;
  boardId: string;
  posts: ForumPost[];
  isPinned?: boolean;
  isLocked?: boolean;
  viewCount: number;
  lastPostTimestamp: number;
  lastPostAuthor: string;
}

interface ForumPost {
  id: string;
  content: string;
  author: string; // Anonymous identifier like "Helpful Fox"
  timestamp: number;
  topicId: string;
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

// Legacy interface for migration
interface LegacyForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  timestamp: number;
  category: 'support' | 'celebration' | 'question' | 'share' | 'general';
  replies: LegacyForumReply[];
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

interface LegacyForumReply {
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

type ViewMode = 'boards' | 'topics' | 'posts';

export function CommunityForum({ className = "" }: CommunityForumProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('boards');
  const [selectedBoardId, setSelectedBoardId] = useState<string>('');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('');
  
  const [boards, setBoards] = useState<ForumBoard[]>([]);
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  
  const [showNewTopicForm, setShowNewTopicForm] = useState(false);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newTopic, setNewTopic] = useState({
    title: '',
    content: ''
  });
  const [newPost, setNewPost] = useState({
    content: ''
  });
  const [showRolePanel, setShowRolePanel] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'register' | 'login'>('register');
  
  const { userSession, updateUserRole, hasModeratorAccess, hasAdminAccess, generateAnonymousName } = useUserSession();

  // Load forum data from localStorage and migrate legacy data
  useEffect(() => {
    // Initialize forum theme
    initializeForumTheme();
    
    const savedBoards = localStorage.getItem('cozy-critter-forum-boards');
    const savedTopics = localStorage.getItem('cozy-critter-forum-topics');
    const savedPosts = localStorage.getItem('cozy-critter-forum-posts-new');
    const legacyPosts = localStorage.getItem('cozy-critter-forum-posts');

    if (savedBoards && savedTopics && savedPosts) {
      setBoards(JSON.parse(savedBoards));
      setTopics(JSON.parse(savedTopics));
      setPosts(JSON.parse(savedPosts));
    } else if (legacyPosts) {
      // Migrate legacy data to new structure
      migrateLegacyData(JSON.parse(legacyPosts));
    } else {
      // Initialize with default forum structure
      initializeDefaultForums();
    }
  }, []);

  const migrateLegacyData = (legacyPosts: LegacyForumPost[]) => {
    // Create boards based on categories
    const categoryBoardMap: { [key: string]: string } = {
      'support': 'support-board',
      'celebration': 'celebration-board', 
      'question': 'question-board',
      'share': 'share-board',
      'general': 'general-board'
    };

    const newBoards: ForumBoard[] = [
      {
        id: 'support-board',
        name: 'Support & Help',
        description: 'Get help and support from the community',
        icon: '🤝',
        topicCount: 0,
        postCount: 0
      },
      {
        id: 'celebration-board',
        name: 'Celebrations',
        description: 'Share your victories and positive moments',
        icon: '🎉',
        topicCount: 0,
        postCount: 0
      },
      {
        id: 'question-board',
        name: 'Questions',
        description: 'Ask questions and get answers',
        icon: '❓',
        topicCount: 0,
        postCount: 0
      },
      {
        id: 'share-board',
        name: 'Sharing',
        description: 'Share experiences and stories',
        icon: '💬',
        topicCount: 0,
        postCount: 0
      },
      {
        id: 'general-board',
        name: 'General Discussion',
        description: 'General conversations and discussions',
        icon: '💭',
        topicCount: 0,
        postCount: 0
      }
    ];

    const newTopics: ForumTopic[] = [];
    const newPosts: ForumPost[] = [];

    legacyPosts.forEach(legacyPost => {
      const boardId = categoryBoardMap[legacyPost.category];
      const author = generateAnonymousName();
      
      // Create topic from legacy post
      const topic: ForumTopic = {
        id: legacyPost.id,
        title: legacyPost.title,
        author: author,
        timestamp: legacyPost.timestamp,
        boardId: boardId,
        posts: [],
        viewCount: 0,
        lastPostTimestamp: legacyPost.timestamp,
        lastPostAuthor: author
      };

      // Create first post in topic
      const firstPost: ForumPost = {
        id: `${legacyPost.id}-post-1`,
        content: legacyPost.content,
        author: author,
        timestamp: legacyPost.timestamp,
        topicId: legacyPost.id,
        reactions: legacyPost.reactions || { hearts: 0, helpful: 0 }
      };

      // Convert replies to posts
      legacyPost.replies?.forEach(reply => {
        const replyPost: ForumPost = {
          id: reply.id,
          content: reply.content,
          author: generateAnonymousName(),
          timestamp: reply.timestamp,
          topicId: legacyPost.id,
          reactions: reply.reactions || { hearts: 0, helpful: 0 }
        };
        newPosts.push(replyPost);
        
        if (reply.timestamp > topic.lastPostTimestamp) {
          topic.lastPostTimestamp = reply.timestamp;
          topic.lastPostAuthor = replyPost.author;
        }
      });

      newTopics.push(topic);
      newPosts.push(firstPost);
    });

    // Update board statistics
    newBoards.forEach(board => {
      const boardTopics = newTopics.filter(t => t.boardId === board.id);
      board.topicCount = boardTopics.length;
      
      const boardPosts = newPosts.filter(p => 
        boardTopics.some(t => t.id === p.topicId)
      );
      board.postCount = boardPosts.length;

      if (boardTopics.length > 0) {
        const latestTopic = boardTopics.reduce((latest, current) => 
          current.lastPostTimestamp > latest.lastPostTimestamp ? current : latest
        );
        board.lastPost = {
          topicTitle: latestTopic.title,
          author: latestTopic.lastPostAuthor,
          timestamp: latestTopic.lastPostTimestamp
        };
      }
    });

    setBoards(newBoards);
    setTopics(newTopics);
    setPosts(newPosts);
    
    saveForumData(newBoards, newTopics, newPosts);
  };

  const initializeDefaultForums = () => {
    const defaultBoards: ForumBoard[] = [
      {
        id: 'support-board',
        name: 'Support & Help',
        description: 'Get help and support from the community',
        icon: '🤝',
        topicCount: 2,
        postCount: 3,
        lastPost: {
          topicTitle: 'Finding sensory-friendly spaces in public',
          author: 'Wise Owl',
          timestamp: Date.now() - 43200000
        }
      },
      {
        id: 'celebration-board',
        name: 'Celebrations',
        description: 'Share your victories and positive moments',
        icon: '🎉',
        topicCount: 1,
        postCount: 1,
        lastPost: {
          topicTitle: 'Small victory: Finally told my friend about my diagnosis',
          author: 'Brave Rabbit',
          timestamp: Date.now() - 172800000
        }
      },
      {
        id: 'general-board',
        name: 'General Discussion',
        description: 'General conversations and discussions',
        icon: '💭',
        topicCount: 0,
        postCount: 0
      }
    ];

    const defaultTopics: ForumTopic[] = [
      {
        id: 'topic-1',
        title: 'Finding sensory-friendly spaces in public',
        author: 'Gentle Penguin',
        timestamp: Date.now() - 86400000,
        boardId: 'support-board',
        posts: [],
        viewCount: 12,
        lastPostTimestamp: Date.now() - 43200000,
        lastPostAuthor: 'Wise Owl'
      },
      {
        id: 'topic-2',
        title: 'Small victory: Finally told my friend about my diagnosis',
        author: 'Brave Rabbit',
        timestamp: Date.now() - 172800000,
        boardId: 'celebration-board',
        posts: [],
        viewCount: 8,
        lastPostTimestamp: Date.now() - 172800000,
        lastPostAuthor: 'Brave Rabbit'
      }
    ];

    const defaultPosts: ForumPost[] = [
      {
        id: 'post-1-1',
        content: 'Has anyone found good strategies for managing sensory overload in grocery stores? I struggle with the bright lights and noise.',
        author: 'Gentle Penguin',
        timestamp: Date.now() - 86400000,
        topicId: 'topic-1',
        reactions: { hearts: 2, helpful: 4 }
      },
      {
        id: 'post-1-2',
        content: 'I bring noise-canceling headphones and shop during off-peak hours. Early morning or late evening are usually quieter.',
        author: 'Wise Owl',
        timestamp: Date.now() - 43200000,
        topicId: 'topic-1',
        reactions: { hearts: 3, helpful: 5 }
      },
      {
        id: 'post-2-1',
        content: 'It was scary but they were so understanding and supportive. Feeling grateful for good friends.',
        author: 'Brave Rabbit',
        timestamp: Date.now() - 172800000,
        topicId: 'topic-2',
        reactions: { hearts: 8, helpful: 2 }
      }
    ];

    setBoards(defaultBoards);
    setTopics(defaultTopics);
    setPosts(defaultPosts);
    
    saveForumData(defaultBoards, defaultTopics, defaultPosts);
  };

  const saveForumData = (boardsData: ForumBoard[], topicsData: ForumTopic[], postsData: ForumPost[]) => {
    localStorage.setItem('cozy-critter-forum-boards', JSON.stringify(boardsData));
    localStorage.setItem('cozy-critter-forum-topics', JSON.stringify(topicsData));
    localStorage.setItem('cozy-critter-forum-posts-new', JSON.stringify(postsData));
  };

  const handleCreateTopic = () => {
    if (!newTopic.title.trim() || !newTopic.content.trim() || !selectedBoardId) return;

    const author = generateAnonymousName();
    const topicId = crypto.randomUUID();
    const postId = crypto.randomUUID();

    const topic: ForumTopic = {
      id: topicId,
      title: newTopic.title.trim(),
      author: author,
      timestamp: Date.now(),
      boardId: selectedBoardId,
      posts: [],
      viewCount: 0,
      lastPostTimestamp: Date.now(),
      lastPostAuthor: author
    };

    const firstPost: ForumPost = {
      id: postId,
      content: newTopic.content.trim(),
      author: author,
      timestamp: Date.now(),
      topicId: topicId,
      reactions: { hearts: 0, helpful: 0 }
    };

    const updatedTopics = [topic, ...topics];
    const updatedPosts = [firstPost, ...posts];
    
    // Update board statistics
    const updatedBoards = boards.map(board => {
      if (board.id === selectedBoardId) {
        return {
          ...board,
          topicCount: board.topicCount + 1,
          postCount: board.postCount + 1,
          lastPost: {
            topicTitle: topic.title,
            author: author,
            timestamp: Date.now()
          }
        };
      }
      return board;
    });

    setBoards(updatedBoards);
    setTopics(updatedTopics);
    setPosts(updatedPosts);
    saveForumData(updatedBoards, updatedTopics, updatedPosts);
    
    setNewTopic({ title: '', content: '' });
    setShowNewTopicForm(false);
  };

  const handleCreatePost = () => {
    if (!newPost.content.trim() || !selectedTopicId) return;

    const author = generateAnonymousName();
    const postId = crypto.randomUUID();

    const post: ForumPost = {
      id: postId,
      content: newPost.content.trim(),
      author: author,
      timestamp: Date.now(),
      topicId: selectedTopicId,
      reactions: { hearts: 0, helpful: 0 }
    };

    const updatedPosts = [...posts, post];
    
    // Update topic and board statistics
    const updatedTopics = topics.map(topic => {
      if (topic.id === selectedTopicId) {
        return {
          ...topic,
          lastPostTimestamp: Date.now(),
          lastPostAuthor: author
        };
      }
      return topic;
    });

    const currentTopic = topics.find(t => t.id === selectedTopicId);
    const updatedBoards = boards.map(board => {
      if (board.id === currentTopic?.boardId) {
        return {
          ...board,
          postCount: board.postCount + 1,
          lastPost: {
            topicTitle: currentTopic.title,
            author: author,
            timestamp: Date.now()
          }
        };
      }
      return board;
    });

    setBoards(updatedBoards);
    setTopics(updatedTopics);
    setPosts(updatedPosts);
    saveForumData(updatedBoards, updatedTopics, updatedPosts);
    
    setNewPost({ content: '' });
    setShowNewPostForm(false);
  };

  const handleReaction = (postId: string, type: 'hearts' | 'helpful') => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
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
      return post;
    });
    
    setPosts(updatedPosts);
    saveForumData(boards, topics, updatedPosts);
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString([], { 
        month: 'short', 
        day: 'numeric', 
        year: diffDays > 365 ? 'numeric' : undefined 
      });
    }
  };

  // Filter functions
  const getCurrentTopics = () => {
    return topics.filter(topic => topic.boardId === selectedBoardId)
      .sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return b.lastPostTimestamp - a.lastPostTimestamp;
      });
  };

  const getCurrentPosts = () => {
    return posts.filter(post => post.topicId === selectedTopicId)
      .sort((a, b) => a.timestamp - b.timestamp);
  };

  // Render different views based on current mode
  const renderBoardsView = () => (
    <div className="phpbb-container">
      {/* phpBB2 Style Header */}
      <div className="phpbb-header">
        <div className="phpbb-logo">
          <MessageSquare size={24} className="text-blue-600" />
          <h2 className="phpbb-title">CozyCritters Forum</h2>
        </div>
        {userSession && (
          <div className="phpbb-user-info">
            <span className="text-sm">Welcome, {userSession.username}</span>
            {!userSession.isRegistered && (
              <>
                <button
                  onClick={() => {
                    setAuthModalMode('register');
                    setShowAuthModal(true);
                  }}
                  className="phpbb-admin-btn"
                  title="Register to secure your username"
                >
                  <UserPlus size={14} />
                  Register
                </button>
                <button
                  onClick={() => {
                    setAuthModalMode('login');
                    setShowAuthModal(true);
                  }}
                  className="phpbb-admin-btn"
                  title="Login to your account"
                >
                  <LogIn size={14} />
                  Login
                </button>
              </>
            )}
            {userSession.isRegistered && (
              <span className="text-xs text-green-600">✓ Registered</span>
            )}
            <ForumThemeSelector />
            {hasAdminAccess() && (
              <button
                onClick={() => setShowRolePanel(!showRolePanel)}
                className="phpbb-admin-btn"
              >
                <Shield size={14} />
                Admin Panel
              </button>
            )}
          </div>
        )}
      </div>

      {/* Admin Panel */}
      {showRolePanel && hasAdminAccess() && (
        <div className="phpbb-admin-panel">
          <h4 className="font-bold mb-2">Admin Panel - Role Management</h4>
          <p className="text-sm mb-3">For demo purposes - in a real app, this would be a proper admin interface</p>
          <div className="flex gap-2">
            <button onClick={() => updateUserRole('user')} className="phpbb-role-btn">Set as User</button>
            <button onClick={() => updateUserRole('moderator')} className="phpbb-role-btn">Set as Moderator</button>
            <button onClick={() => updateUserRole('admin')} className="phpbb-role-btn">Set as Admin</button>
          </div>
        </div>
      )}

      {/* Forum Boards Table */}
      <div className="phpbb-table-container">
        <table className="phpbb-table">
          <thead>
            <tr className="phpbb-table-header">
              <th className="phpbb-forum-col">Forum</th>
              <th className="phpbb-topics-col">Topics</th>
              <th className="phpbb-posts-col">Posts</th>
              <th className="phpbb-lastpost-col">Last Post</th>
            </tr>
          </thead>
          <tbody>
            {boards.map(board => (
              <tr key={board.id} className="phpbb-table-row">
                <td className="phpbb-forum-cell">
                  <div className="phpbb-forum-info">
                    <div className="phpbb-forum-icon">
                      <span className="text-2xl">{board.icon}</span>
                    </div>
                    <div className="phpbb-forum-details">
                      <button
                        onClick={() => {
                          setSelectedBoardId(board.id);
                          setViewMode('topics');
                        }}
                        className="phpbb-forum-link"
                      >
                        {board.name}
                      </button>
                      <div className="phpbb-forum-desc">{board.description}</div>
                    </div>
                  </div>
                </td>
                <td className="phpbb-count-cell">{board.topicCount}</td>
                <td className="phpbb-count-cell">{board.postCount}</td>
                <td className="phpbb-lastpost-cell">
                  {board.lastPost ? (
                    <div className="phpbb-lastpost-info">
                      <div className="phpbb-lastpost-topic">
                        {board.lastPost.topicTitle.substring(0, 30)}
                        {board.lastPost.topicTitle.length > 30 ? '...' : ''}
                      </div>
                      <div className="phpbb-lastpost-meta">
                        by {board.lastPost.author}<br />
                        {formatTimestamp(board.lastPost.timestamp)}
                      </div>
                    </div>
                  ) : (
                    <span className="phpbb-no-posts">No posts</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTopicsView = () => {
    const currentBoard = boards.find(b => b.id === selectedBoardId);
    const currentTopics = getCurrentTopics();
    
    return (
      <div className="phpbb-container">
        {/* Breadcrumb Navigation */}
        <div className="phpbb-breadcrumb">
          <button onClick={() => setViewMode('boards')} className="phpbb-breadcrumb-link">
            Forum Index
          </button>
          <span className="phpbb-breadcrumb-separator">»</span>
          <span className="phpbb-breadcrumb-current">{currentBoard?.name}</span>
        </div>

        {/* Board Header */}
        <div className="phpbb-board-header">
          <div className="phpbb-board-title">
            <span className="text-2xl mr-2">{currentBoard?.icon}</span>
            <h2>{currentBoard?.name}</h2>
          </div>
          <button
            onClick={() => setShowNewTopicForm(true)}
            className="phpbb-new-topic-btn"
          >
            <Plus size={16} />
            New Topic
          </button>
        </div>

        {/* New Topic Form */}
        {showNewTopicForm && (
          <div className="phpbb-form-container">
            <h3 className="phpbb-form-title">Post new topic</h3>
            <div className="phpbb-form-content">
              <div className="phpbb-form-field">
                <label className="phpbb-form-label">Subject:</label>
                <input
                  type="text"
                  value={newTopic.title}
                  onChange={(e) => setNewTopic({...newTopic, title: e.target.value})}
                  className="phpbb-form-input"
                  placeholder="Enter topic title..."
                />
              </div>
              <div className="phpbb-form-field">
                <label className="phpbb-form-label">Message:</label>
                <textarea
                  value={newTopic.content}
                  onChange={(e) => setNewTopic({...newTopic, content: e.target.value})}
                  className="phpbb-form-textarea"
                  rows={8}
                  placeholder="Enter your message..."
                />
              </div>
              <div className="phpbb-form-buttons">
                <button
                  onClick={handleCreateTopic}
                  disabled={!newTopic.title.trim() || !newTopic.content.trim()}
                  className="phpbb-submit-btn"
                >
                  Submit
                </button>
                <button
                  onClick={() => setShowNewTopicForm(false)}
                  className="phpbb-cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Topics Table */}
        <div className="phpbb-table-container">
          <table className="phpbb-table">
            <thead>
              <tr className="phpbb-table-header">
                <th className="phpbb-topic-col">Topics</th>
                <th className="phpbb-replies-col">Replies</th>
                <th className="phpbb-views-col">Views</th>
                <th className="phpbb-lastpost-col">Last Post</th>
              </tr>
            </thead>
            <tbody>
              {currentTopics.map(topic => {
                const topicPosts = posts.filter(p => p.topicId === topic.id);
                const replyCount = topicPosts.length - 1; // Subtract original post
                
                return (
                  <tr key={topic.id} className="phpbb-table-row">
                    <td className="phpbb-topic-cell">
                      <div className="phpbb-topic-info">
                        <div className="phpbb-topic-icon">
                          {topic.isPinned ? <Pin size={16} className="text-yellow-600" /> : <FileText size={16} className="text-blue-600" />}
                        </div>
                        <div className="phpbb-topic-details">
                          <button
                            onClick={() => {
                              setSelectedTopicId(topic.id);
                              setViewMode('posts');
                            }}
                            className="phpbb-topic-link"
                          >
                            {topic.title}
                          </button>
                          <div className="phpbb-topic-meta">
                            by {topic.author} » {formatTimestamp(topic.timestamp)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="phpbb-count-cell">{replyCount}</td>
                    <td className="phpbb-count-cell">{topic.viewCount}</td>
                    <td className="phpbb-lastpost-cell">
                      <div className="phpbb-lastpost-info">
                        <div className="phpbb-lastpost-meta">
                          by {topic.lastPostAuthor}<br />
                          {formatTimestamp(topic.lastPostTimestamp)}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {currentTopics.length === 0 && (
                <tr>
                  <td colSpan={4} className="phpbb-empty-cell">
                    No topics found in this forum.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderPostsView = () => {
    const currentBoard = boards.find(b => b.id === selectedBoardId);
    const currentTopic = topics.find(t => t.id === selectedTopicId);
    const currentPosts = getCurrentPosts();
    
    return (
      <div className="phpbb-container">
        {/* Breadcrumb Navigation */}
        <div className="phpbb-breadcrumb">
          <button onClick={() => setViewMode('boards')} className="phpbb-breadcrumb-link">
            Forum Index
          </button>
          <span className="phpbb-breadcrumb-separator">»</span>
          <button 
            onClick={() => setViewMode('topics')} 
            className="phpbb-breadcrumb-link"
          >
            {currentBoard?.name}
          </button>
          <span className="phpbb-breadcrumb-separator">»</span>
          <span className="phpbb-breadcrumb-current">{currentTopic?.title}</span>
        </div>

        {/* Topic Header */}
        <div className="phpbb-topic-header">
          <h2 className="phpbb-topic-title">{currentTopic?.title}</h2>
          <button
            onClick={() => setShowNewPostForm(true)}
            className="phpbb-reply-btn"
          >
            <Plus size={16} />
            Reply
          </button>
        </div>

        {/* New Post Form */}
        {showNewPostForm && (
          <div className="phpbb-form-container">
            <h3 className="phpbb-form-title">Post a reply</h3>
            <div className="phpbb-form-content">
              <div className="phpbb-form-field">
                <label className="phpbb-form-label">Message:</label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  className="phpbb-form-textarea"
                  rows={6}
                  placeholder="Enter your reply..."
                />
              </div>
              <div className="phpbb-form-buttons">
                <button
                  onClick={handleCreatePost}
                  disabled={!newPost.content.trim()}
                  className="phpbb-submit-btn"
                >
                  Submit
                </button>
                <button
                  onClick={() => setShowNewPostForm(false)}
                  className="phpbb-cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Posts */}
        <div className="phpbb-posts-container">
          {currentPosts.map((post, index) => (
            <div key={post.id} className="phpbb-post">
              <div className="phpbb-post-header">
                <div className="phpbb-post-number">#{index + 1}</div>
                <div className="phpbb-post-date">{formatTimestamp(post.timestamp)}</div>
              </div>
              <div className="phpbb-post-body">
                <div className="phpbb-post-author-info">
                  <div className="phpbb-author-avatar">
                    <User size={32} className="text-gray-400" />
                  </div>
                  <div className="phpbb-author-details">
                    <div className="phpbb-author-name">{post.author}</div>
                    <div className="phpbb-author-title">Member</div>
                  </div>
                </div>
                <div className="phpbb-post-content">
                  <div className="phpbb-post-text">
                    {post.content}
                  </div>
                  <div className="phpbb-post-reactions">
                    <button
                      onClick={() => handleReaction(post.id, 'hearts')}
                      className={`phpbb-reaction-btn ${post.userReacted?.hearts ? 'active' : ''}`}
                    >
                      <Heart size={14} />
                      {post.reactions.hearts}
                    </button>
                    <button
                      onClick={() => handleReaction(post.id, 'helpful')}
                      className={`phpbb-reaction-btn ${post.userReacted?.helpful ? 'active' : ''}`}
                    >
                      <ThumbsUp size={14} />
                      {post.reactions.helpful}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`phpbb-forum ${className}`}>
      {viewMode === 'boards' && renderBoardsView()}
      {viewMode === 'topics' && renderTopicsView()}
      {viewMode === 'posts' && renderPostsView()}
      
      {/* User Authentication Modal */}
      <UserAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authModalMode}
      />
    </div>
  );
}