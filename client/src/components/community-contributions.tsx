import React, { useState } from 'react';
import { Share2, Heart, CheckCircle, AlertCircle, Users, Gift } from 'lucide-react';
import { CustomMessage } from '@/lib/custom-message-store';

interface CommunityContributionsProps {
  messages: CustomMessage[];
  onContributionSuccess: (messageId: string) => void;
}

interface ContributionData {
  message: string;
  category: string;
  tags?: string[];
}

export function CommunityContributions({ messages, onContributionSuccess }: CommunityContributionsProps) {
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set());
  const [isContributing, setIsContributing] = useState(false);
  const [contributionStatus, setContributionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showContributeSection, setShowContributeSection] = useState(false);

  const handleToggleMessage = (messageId: string) => {
    setSelectedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  const handleContribute = async () => {
    if (selectedMessages.size === 0) return;

    setIsContributing(true);
    setContributionStatus('idle');

    try {
      // Get selected messages
      const messagesToContribute = messages.filter(msg => selectedMessages.has(msg.id));
      
      // Prepare contributions (anonymous)
      const contributions: ContributionData[] = messagesToContribute.map(msg => ({
        message: msg.message,
        category: msg.category,
        tags: ['community-contributed']
      }));

      // Simulate API call or local storage of community contributions
      // In a real implementation, this could export to a shareable format
      // or queue for inclusion in future community message packs
      await simulateContribution(contributions);

      // Mark messages as contributed locally
      const contributedMessages = JSON.parse(localStorage.getItem('cozy-critter-contributed-messages') || '[]');
      const newContributions = messagesToContribute.map(msg => ({
        id: msg.id,
        message: msg.message,
        category: msg.category,
        contributedAt: Date.now(),
        anonymized: true
      }));
      
      localStorage.setItem('cozy-critter-contributed-messages', 
        JSON.stringify([...contributedMessages, ...newContributions]));

      setContributionStatus('success');
      setSelectedMessages(new Set());
      
      // Notify parent component
      selectedMessages.forEach(messageId => {
        onContributionSuccess(messageId);
      });

      // Reset after 3 seconds
      setTimeout(() => {
        setContributionStatus('idle');
        setShowContributeSection(false);
      }, 3000);

    } catch (error) {
      console.error('Failed to contribute messages:', error);
      setContributionStatus('error');
      setTimeout(() => setContributionStatus('idle'), 3000);
    } finally {
      setIsContributing(false);
    }
  };

  const simulateContribution = async (contributions: ContributionData[]): Promise<void> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real implementation, this might:
    // - Generate a shareable JSON file
    // - Create a QR code for sharing
    // - Add to a community contribution queue
    // - Export for manual review/inclusion
    
    console.log('Community contributions prepared:', contributions);
  };

  const eligibleMessages = messages.filter(msg => {
    // Only show messages that haven't been contributed yet
    const contributedMessages = JSON.parse(localStorage.getItem('cozy-critter-contributed-messages') || '[]');
    return !contributedMessages.some((contrib: any) => contrib.id === msg.id);
  });

  if (eligibleMessages.length === 0) {
    return (
      <div className="bg-card dark:bg-card border border-border dark:border-border rounded-xl p-6 mb-6">
        <div className="text-center">
          <div className="text-3xl mb-3">🎁</div>
          <h3 className="text-lg font-semibold text-brown dark:text-brown mb-2">
            All Caught Up!
          </h3>
          <p className="text-muted-foreground dark:text-muted-foreground text-sm">
            You've already contributed all your messages to the community. Thank you for sharing your encouragement! 💚
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card dark:bg-card border border-border dark:border-border rounded-xl p-6 mb-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
          <Share2 size={20} className="text-purple-600 dark:text-purple-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-brown dark:text-brown mb-1">
            Share Your Encouragement
          </h3>
          <p className="text-muted-foreground dark:text-muted-foreground text-sm mb-3">
            Help others by anonymously contributing your personal messages to future community packs. 
            Your identity stays private, but your kindness can reach others who need it.
          </p>
        </div>
      </div>

      {!showContributeSection ? (
        <button
          onClick={() => setShowContributeSection(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <Gift size={16} />
          Contribute to Community ({eligibleMessages.length} messages available)
        </button>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users size={16} />
            <span>Select messages to share anonymously with the community</span>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {eligibleMessages.map(message => (
              <div key={message.id} className="flex items-start gap-3 p-3 border border-border dark:border-border rounded-lg">
                <input
                  type="checkbox"
                  checked={selectedMessages.has(message.id)}
                  onChange={() => handleToggleMessage(message.id)}
                  className="mt-1 cursor-pointer"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground dark:text-foreground">"{message.message}"</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full">
                      {message.category === 'nd' ? 'ND Support' : 
                       message.category === 'encouragement' ? 'Encouragement' : 'General'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleContribute}
              disabled={selectedMessages.size === 0 || isContributing}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-green-500/50"
            >
              {isContributing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Contributing...
                </>
              ) : (
                <>
                  <Heart size={16} />
                  Contribute {selectedMessages.size > 0 ? `(${selectedMessages.size})` : ''}
                </>
              )}
            </button>
            <button
              onClick={() => {
                setShowContributeSection(false);
                setSelectedMessages(new Set());
              }}
              className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              Cancel
            </button>
          </div>

          {contributionStatus === 'success' && (
            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <CheckCircle size={16} className="text-green-600 dark:text-green-400" />
              <span className="text-sm text-green-800 dark:text-green-200">
                Thank you! Your messages have been prepared for community sharing. 💚
              </span>
            </div>
          )}

          {contributionStatus === 'error' && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle size={16} className="text-red-600 dark:text-red-400" />
              <span className="text-sm text-red-800 dark:text-red-200">
                Something went wrong. Please try again later.
              </span>
            </div>
          )}

          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
              Privacy & Anonymity
            </h4>
            <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Your personal identity is never shared</li>
              <li>• Only the message text and category are included</li>
              <li>• Contributions help create future community message packs</li>
              <li>• You can still use and edit your original messages</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}