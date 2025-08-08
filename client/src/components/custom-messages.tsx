import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Save, X, Heart } from "lucide-react";
import { moodStorage, CustomMessage } from "@/lib/mood-storage";

interface CustomMessagesProps {
  onBack: () => void;
}

export function CustomMessages({ onBack }: CustomMessagesProps) {
  const [messages, setMessages] = useState<CustomMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [newCategory, setNewCategory] = useState<CustomMessage['category']>("encouragement");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [editingCategory, setEditingCategory] = useState<CustomMessage['category']>("encouragement");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = () => {
    const customMessages = moodStorage.getAllCustomMessages();
    setMessages(customMessages);
  };

  const handleAddMessage = () => {
    if (newMessage.trim()) {
      moodStorage.saveCustomMessage({
        message: newMessage.trim(),
        category: newCategory
      });
      setNewMessage("");
      setIsAdding(false);
      loadMessages();
    }
  };

  const handleEditMessage = (id: string, message: string, category: CustomMessage['category']) => {
    setEditingId(id);
    setEditingText(message);
    setEditingCategory(category);
  };

  const handleSaveEdit = () => {
    if (editingId && editingText.trim()) {
      moodStorage.updateCustomMessage(editingId, {
        message: editingText.trim(),
        category: editingCategory
      });
      setEditingId(null);
      setEditingText("");
      loadMessages();
    }
  };

  const handleDeleteMessage = (id: string) => {
    if (window.confirm("Are you sure you want to delete this custom message? This action cannot be undone.")) {
      moodStorage.deleteCustomMessage(id);
      loadMessages();
    }
  };

  const getCategoryColor = (category: CustomMessage['category']) => {
    switch (category) {
      case 'general': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200';
      case 'nd': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200';
      case 'encouragement': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200';
    }
  };

  const getCategoryLabel = (category: CustomMessage['category']) => {
    switch (category) {
      case 'general': return 'General';
      case 'nd': return 'ND Support';
      case 'encouragement': return 'Encouragement';
    }
  };

  return (
    <main className="p-6 bg-background dark:bg-background">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="mr-3 p-2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
            aria-label="Go back"
          >
            ←
          </button>
          <div>
            <h2 className="text-2xl font-semibold text-brown dark:text-brown mb-2">
              Your Personal Messages
            </h2>
            <p className="text-muted-foreground dark:text-muted-foreground text-sm">
              Create your own encouraging messages that speak to your heart <Heart size={16} className="inline text-red-500" />
            </p>
          </div>
        </div>

        {/* Add New Message */}
        <div className="bg-card dark:bg-card border border-border dark:border-border rounded-xl p-4 mb-6">
          {!isAdding ? (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full flex items-center justify-center gap-2 py-3 text-muted-foreground hover:text-foreground transition-colors border-2 border-dashed border-border dark:border-border rounded-lg hover:border-primary dark:hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <Plus size={20} />
              Add Your Own Message
            </button>
          ) : (
            <div className="space-y-3">
              <div>
                <label htmlFor="category-select" className="block text-sm font-medium text-brown dark:text-brown mb-1">
                  Category
                </label>
                <select
                  id="category-select"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as CustomMessage['category'])}
                  className="w-full p-2 border border-border dark:border-border bg-background dark:bg-background text-foreground dark:text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="encouragement">Encouragement</option>
                  <option value="nd">ND Support</option>
                  <option value="general">General</option>
                </select>
              </div>
              <div>
                <label htmlFor="new-message" className="block text-sm font-medium text-brown dark:text-brown mb-1">
                  Your Message
                </label>
                <textarea
                  id="new-message"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Write something that makes you feel good about yourself..."
                  className="w-full p-3 border border-border dark:border-border bg-background dark:bg-background text-foreground dark:text-foreground rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                  rows={3}
                  maxLength={200}
                />
                <div className="text-xs text-muted-foreground dark:text-muted-foreground mt-1 text-right">
                  {newMessage.length}/200
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAddMessage}
                  disabled={!newMessage.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <Save size={16} />
                  Save Message
                </button>
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setNewMessage("");
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Messages List */}
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">💭</div>
              <h3 className="text-lg font-semibold text-brown dark:text-brown mb-2">
                No custom messages yet
              </h3>
              <p className="text-muted-foreground dark:text-muted-foreground">
                Add your first personal message above to get started!
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className="bg-card dark:bg-card border border-border dark:border-border rounded-xl p-4"
              >
                {editingId === message.id ? (
                  <div className="space-y-3">
                    <div>
                      <select
                        value={editingCategory}
                        onChange={(e) => setEditingCategory(e.target.value as CustomMessage['category'])}
                        className="w-full p-2 border border-border dark:border-border bg-background dark:bg-background text-foreground dark:text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        <option value="encouragement">Encouragement</option>
                        <option value="nd">ND Support</option>
                        <option value="general">General</option>
                      </select>
                    </div>
                    <textarea
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="w-full p-3 border border-border dark:border-border bg-background dark:bg-background text-foreground dark:text-foreground rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                      rows={3}
                      maxLength={200}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveEdit}
                        disabled={!editingText.trim()}
                        className="flex items-center gap-2 px-3 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        <Save size={14} />
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditingText("");
                        }}
                        className="flex items-center gap-2 px-3 py-1 bg-muted text-muted-foreground rounded hover:bg-muted/80 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        <X size={14} />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(message.category)}`}>
                        {getCategoryLabel(message.category)}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEditMessage(message.id, message.message, message.category)}
                          className="p-1 text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
                          aria-label="Edit message"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteMessage(message.id)}
                          className="p-1 text-muted-foreground hover:text-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50 rounded"
                          aria-label="Delete message"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <p className="text-foreground dark:text-foreground">"{message.message}"</p>
                    <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-2">
                      Created {new Date(message.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}