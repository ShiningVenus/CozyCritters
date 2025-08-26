import React, { useState, useEffect } from 'react';
import { MessageSquare, Heart, User, Clock, ChevronDown, ChevronUp, Plus, Flag, ThumbsUp, Pin, EyeOff, Edit3, Shield, Folder, Users, FileText, Settings, BarChart3 } from 'lucide-react';
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
  isHidden?: boolean;
}

interface StandaloneForumProps {
  className?: string;
}

type ViewMode = 'boards' | 'topics' | 'posts';

export function StandaloneForum({ className = "" }: StandaloneForumProps) {
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
  
  // Simplified user session - just anonymous names
  const [currentUser, setCurrentUser] = useState<string>('');
  
  // Initialize with default forums and generate anonymous name
  useEffect(() => {
    initializeForums();
    setCurrentUser(generateAnonymousName());
  }, []);

  const generateAnonymousName = () => {
    const animals = ['Fox', 'Owl', 'Rabbit', 'Penguin', 'Deer', 'Cat', 'Bear', 'Wolf', 'Squirrel', 'Hedgehog'];
    const adjectives = ['Gentle', 'Wise', 'Kind', 'Brave', 'Calm', 'Thoughtful', 'Patient', 'Creative', 'Curious', 'Peaceful'];
    const animal = animals[Math.floor(Math.random() * animals.length)];
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    return `${adjective} ${animal}`;
  };

  const initializeForums = () => {
    // Load or create default forum structure
    const savedBoards = localStorage.getItem('standalone-forum-boards');
    const savedTopics = localStorage.getItem('standalone-forum-topics');
    const savedPosts = localStorage.getItem('standalone-forum-posts');

    if (savedBoards && savedTopics && savedPosts) {
      setBoards(JSON.parse(savedBoards));
      setTopics(JSON.parse(savedTopics));
      setPosts(JSON.parse(savedPosts));
    } else {
      // Create default boards
      const defaultBoards: ForumBoard[] = [
        {
          id: 'general',
          name: 'General Discussion',
          description: 'Share thoughts, experiences, and connect with the community',
          icon: '💬',
          topicCount: 0,
          postCount: 0
        },
        {
          id: 'support',
          name: 'Support & Advice',
          description: 'Ask for help, share coping strategies, and support each other',
          icon: '🤝',
          topicCount: 0,
          postCount: 0
        },
        {
          id: 'celebrations',
          name: 'Wins & Celebrations',
          description: 'Share your victories, both big and small',
          icon: '🎉',
          topicCount: 0,
          postCount: 0
        },
        {
          id: 'resources',
          name: 'Resources & Tips',
          description: 'Share useful resources, tools, and life tips',
          icon: '📚',
          topicCount: 0,
          postCount: 0
        }
      ];
      
      setBoards(defaultBoards);
      setTopics([]);
      setPosts([]);
      saveForumData(defaultBoards, [], []);
    }
  };

  const saveForumData = (boardsData: ForumBoard[], topicsData: ForumTopic[], postsData: ForumPost[]) => {
    try {
      localStorage.setItem('standalone-forum-boards', JSON.stringify(boardsData));
      localStorage.setItem('standalone-forum-topics', JSON.stringify(topicsData));
      localStorage.setItem('standalone-forum-posts', JSON.stringify(postsData));
    } catch (error) {
      console.error('Error saving forum data:', error);
    }
  };

  const handleCreateTopic = () => {
    if (!newTopic.title.trim() || !newTopic.content.trim() || !selectedBoardId) return;

    const topicId = crypto.randomUUID();
    const postId = crypto.randomUUID();

    const newTopicData: ForumTopic = {
      id: topicId,
      title: newTopic.title.trim(),
      author: currentUser,
      timestamp: Date.now(),
      boardId: selectedBoardId,
      posts: [],
      viewCount: 0,
      lastPostTimestamp: Date.now(),
      lastPostAuthor: currentUser
    };

    const firstPost: ForumPost = {
      id: postId,
      content: newTopic.content.trim(),
      author: currentUser,
      timestamp: Date.now(),
      topicId: topicId,
      reactions: { hearts: 0, helpful: 0 }
    };

    const updatedTopics = [...topics, newTopicData];
    const updatedPosts = [...posts, firstPost];
    
    // Update board stats
    const updatedBoards = boards.map(board => {
      if (board.id === selectedBoardId) {
        return {
          ...board,
          topicCount: board.topicCount + 1,
          postCount: board.postCount + 1,
          lastPost: {
            topicTitle: newTopic.title.trim(),
            author: currentUser,
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

    const postId = crypto.randomUUID();
    const newPostData: ForumPost = {
      id: postId,
      content: newPost.content.trim(),
      author: currentUser,
      timestamp: Date.now(),
      topicId: selectedTopicId,
      reactions: { hearts: 0, helpful: 0 }
    };

    const updatedPosts = [...posts, newPostData];
    
    // Update topic stats
    const updatedTopics = topics.map(topic => {
      if (topic.id === selectedTopicId) {
        return {
          ...topic,
          lastPostTimestamp: Date.now(),
          lastPostAuthor: currentUser
        };
      }
      return topic;
    });

    // Update board stats
    const currentTopic = topics.find(t => t.id === selectedTopicId);
    const updatedBoards = boards.map(board => {
      if (board.id === currentTopic?.boardId) {
        return {
          ...board,
          postCount: board.postCount + 1,
          lastPost: {
            topicTitle: currentTopic.title,
            author: currentUser,
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

  const handleReaction = (postId: string, reactionType: 'hearts' | 'helpful') => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const isReacted = post.userReacted?.[reactionType] || false;
        return {
          ...post,
          reactions: {
            ...post.reactions,
            [reactionType]: isReacted 
              ? post.reactions[reactionType] - 1 
              : post.reactions[reactionType] + 1
          },
          userReacted: {
            ...post.userReacted,
            [reactionType]: !isReacted
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

  const getCurrentTopics = () => {
    return topics.filter(topic => topic.boardId === selectedBoardId)
      .sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return b.lastPostTimestamp - a.lastPostTimestamp;
      });
  };

  const getCurrentPosts = () => {
    return posts.filter(post => post.topicId === selectedTopicId && !post.isHidden)
      .sort((a, b) => a.timestamp - b.timestamp);
  };

  const renderBoardsView = () => (
    <div className="phpbb-container">
      {/* phpBB2 Style Header */}
      <div className="phpbb-header">
        <div className="phpbb-logo">
          <h1>CozyCritters Forums</h1>
          <p>Anonymous neurodivergent community • Safe space for all</p>
        </div>
        <div className="phpbb-user-info">
          <span className="phpbb-username">Welcome, {currentUser}</span>
          <button 
            onClick={() => setCurrentUser(generateAnonymousName())}
            className="phpbb-btn phpbb-btn-small"
            title="Generate new anonymous name"
          >
            🎭 New Name
          </button>
        </div>
      </div>

      {/* Navigation Breadcrumb */}
      <div className="phpbb-breadcrumb">
        <span className="phpbb-breadcrumb-item active">Forum Index</span>
      </div>

      {/* Main Forum Table */}
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
                  <div className="phpbb-forum-icon">{board.icon}</div>
                  <div className="phpbb-forum-info">
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
                </td>
                <td className="phpbb-topics-cell">{board.topicCount}</td>
                <td className="phpbb-posts-cell">{board.postCount}</td>
                <td className="phpbb-lastpost-cell">
                  {board.lastPost ? (
                    <div className="phpbb-lastpost-info">
                      <div className="phpbb-lastpost-topic">{board.lastPost.topicTitle}</div>
                      <div className="phpbb-lastpost-meta">
                        by {board.lastPost.author}<br />
                        {formatTimestamp(board.lastPost.timestamp)}
                      </div>
                    </div>
                  ) : (
                    <span className="phpbb-no-posts">No posts yet</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Forum Statistics */}
      <div className="phpbb-stats">
        <div className="phpbb-stats-content">
          <strong>Forum Statistics:</strong> {boards.reduce((sum, board) => sum + board.topicCount, 0)} topics, {boards.reduce((sum, board) => sum + board.postCount, 0)} posts
        </div>
      </div>
    </div>
  );

  const renderTopicsView = () => {
    const currentBoard = boards.find(b => b.id === selectedBoardId);
    const currentTopics = getCurrentTopics();

    return (
      <div className="phpbb-container">
        {/* Header */}
        <div className="phpbb-header">
          <div className="phpbb-logo">
            <h1>CozyCritters Forums</h1>
            <p>Anonymous neurodivergent community • Safe space for all</p>
          </div>
          <div className="phpbb-user-info">
            <span className="phpbb-username">Welcome, {currentUser}</span>
            <button 
              onClick={() => setCurrentUser(generateAnonymousName())}
              className="phpbb-btn phpbb-btn-small"
              title="Generate new anonymous name"
            >
              🎭 New Name
            </button>
          </div>
        </div>

        {/* Navigation Breadcrumb */}
        <div className="phpbb-breadcrumb">
          <button
            onClick={() => setViewMode('boards')}
            className="phpbb-breadcrumb-item"
          >
            Forum Index
          </button>
          <span className="phpbb-breadcrumb-separator">»</span>
          <span className="phpbb-breadcrumb-item active">{currentBoard?.name}</span>
        </div>

        {/* Board Header */}
        <div className="phpbb-board-header">
          <div className="phpbb-board-title">
            <span className="phpbb-board-icon">{currentBoard?.icon}</span>
            <div>
              <h2>{currentBoard?.name}</h2>
              <p>{currentBoard?.description}</p>
            </div>
          </div>
          <button
            onClick={() => setShowNewTopicForm(true)}
            className="phpbb-btn phpbb-btn-primary"
          >
            <Plus size={16} />
            New Topic
          </button>
        </div>

        {/* New Topic Form */}
        {showNewTopicForm && (
          <div className="phpbb-form-container">
            <div className="phpbb-form-header">
              <h3>Create New Topic</h3>
              <button
                onClick={() => setShowNewTopicForm(false)}
                className="phpbb-close-btn"
              >
                ×
              </button>
            </div>
            <div className="phpbb-form-content">
              <div className="phpbb-form-group">
                <label htmlFor="topic-title">Topic Title</label>
                <input
                  id="topic-title"
                  type="text"
                  value={newTopic.title}
                  onChange={(e) => setNewTopic(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter topic title..."
                  className="phpbb-input"
                />
              </div>
              <div className="phpbb-form-group">
                <label htmlFor="topic-content">Content</label>
                <textarea
                  id="topic-content"
                  value={newTopic.content}
                  onChange={(e) => setNewTopic(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your post content..."
                  rows={6}
                  className="phpbb-textarea"
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
                const replyCount = posts.filter(p => p.topicId === topic.id).length - 1; // Exclude original post
                return (
                  <tr key={topic.id} className="phpbb-table-row">
                    <td className="phpbb-topic-cell">
                      <div className="phpbb-topic-status">
                        {topic.isPinned && <Pin size={16} className="phpbb-pinned-icon" />}
                        {topic.isLocked && <Shield size={16} className="phpbb-locked-icon" />}
                      </div>
                      <div className="phpbb-topic-info">
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
                          by {topic.author} • {formatTimestamp(topic.timestamp)}
                        </div>
                      </div>
                    </td>
                    <td className="phpbb-replies-cell">{replyCount}</td>
                    <td className="phpbb-views-cell">{topic.viewCount}</td>
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
                  <td colSpan={4} className="phpbb-no-content">
                    No topics yet. Be the first to start a discussion!
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
    const currentTopic = topics.find(t => t.id === selectedTopicId);
    const currentBoard = boards.find(b => b.id === currentTopic?.boardId);
    const currentPosts = getCurrentPosts();

    return (
      <div className="phpbb-container">
        {/* Header */}
        <div className="phpbb-header">
          <div className="phpbb-logo">
            <h1>CozyCritters Forums</h1>
            <p>Anonymous neurodivergent community • Safe space for all</p>
          </div>
          <div className="phpbb-user-info">
            <span className="phpbb-username">Welcome, {currentUser}</span>
            <button 
              onClick={() => setCurrentUser(generateAnonymousName())}
              className="phpbb-btn phpbb-btn-small"
              title="Generate new anonymous name"
            >
              🎭 New Name
            </button>
          </div>
        </div>

        {/* Navigation Breadcrumb */}
        <div className="phpbb-breadcrumb">
          <button
            onClick={() => setViewMode('boards')}
            className="phpbb-breadcrumb-item"
          >
            Forum Index
          </button>
          <span className="phpbb-breadcrumb-separator">»</span>
          <button
            onClick={() => {
              setSelectedBoardId(currentTopic?.boardId || '');
              setViewMode('topics');
            }}
            className="phpbb-breadcrumb-item"
          >
            {currentBoard?.name}
          </button>
          <span className="phpbb-breadcrumb-separator">»</span>
          <span className="phpbb-breadcrumb-item active">{currentTopic?.title}</span>
        </div>

        {/* Topic Header */}
        <div className="phpbb-topic-header">
          <div className="phpbb-topic-title">
            <h2>{currentTopic?.title}</h2>
            <div className="phpbb-topic-meta">
              Started by {currentTopic?.author} • {currentTopic ? formatTimestamp(currentTopic.timestamp) : ''}
            </div>
          </div>
          <button
            onClick={() => setShowNewPostForm(true)}
            className="phpbb-btn phpbb-btn-primary"
            disabled={currentTopic?.isLocked}
          >
            <Plus size={16} />
            Reply
          </button>
        </div>

        {/* New Post Form */}
        {showNewPostForm && (
          <div className="phpbb-form-container">
            <div className="phpbb-form-header">
              <h3>Reply to Topic</h3>
              <button
                onClick={() => setShowNewPostForm(false)}
                className="phpbb-close-btn"
              >
                ×
              </button>
            </div>
            <div className="phpbb-form-content">
              <div className="phpbb-form-group">
                <label htmlFor="post-content">Your Reply</label>
                <textarea
                  id="post-content"
                  value={newPost.content}
                  onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your reply..."
                  rows={6}
                  className="phpbb-textarea"
                />
              </div>
              <div className="phpbb-form-buttons">
                <button
                  onClick={handleCreatePost}
                  disabled={!newPost.content.trim()}
                  className="phpbb-submit-btn"
                >
                  Submit Reply
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
                <div className="phpbb-post-info">
                  <div className="phpbb-post-author">{post.author}</div>
                  <div className="phpbb-post-meta">
                    #{index + 1} • {formatTimestamp(post.timestamp)}
                  </div>
                </div>
              </div>
              <div className="phpbb-post-content">
                <div className="phpbb-post-text">
                  {post.content}
                </div>
                <div className="phpbb-post-actions">
                  <button
                    onClick={() => handleReaction(post.id, 'hearts')}
                    className={`phpbb-reaction-btn ${post.userReacted?.hearts ? 'reacted' : ''}`}
                  >
                    <Heart size={16} fill={post.userReacted?.hearts ? 'currentColor' : 'none'} />
                    {post.reactions.hearts}
                  </button>
                  <button
                    onClick={() => handleReaction(post.id, 'helpful')}
                    className={`phpbb-reaction-btn ${post.userReacted?.helpful ? 'reacted' : ''}`}
                  >
                    <ThumbsUp size={16} fill={post.userReacted?.helpful ? 'currentColor' : 'none'} />
                    {post.reactions.helpful}
                  </button>
                </div>
              </div>
            </div>
          ))}
          {currentPosts.length === 0 && (
            <div className="phpbb-no-content">
              No posts in this topic yet.
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render appropriate view
  const renderCurrentView = () => {
    switch (viewMode) {
      case 'topics':
        return renderTopicsView();
      case 'posts':
        return renderPostsView();
      default:
        return renderBoardsView();
    }
  };

  return (
    <div className={`standalone-forum ${className}`}>
      {renderCurrentView()}
      
      {/* Footer */}
      <div className="phpbb-footer">
        <div className="phpbb-footer-content">
          <div className="phpbb-footer-info">
            <span className="phpbb-powered">
              Powered by <strong>CozyCritters Forum</strong> v2.1.0
            </span>
            <span className="phpbb-copyright">
              © 2025 CozyCritters. All rights reserved.
            </span>
          </div>
          <div className="phpbb-footer-stats">
            <span>
              Neurodivergent-friendly community • Privacy-first design • No personal info stored
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}