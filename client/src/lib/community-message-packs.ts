// Community message pack functionality
export interface CommunityMessagePack {
  id: string;
  name: string;
  description: string;
  messageCount: number;
  category: string;
  messages: string[];
}

// Fetch available community message packs
export async function fetchCommunityMessagePacks(): Promise<CommunityMessagePack[]> {
  try {
    const response = await fetch('/content/community-message-packs.json');
    if (!response.ok) {
      throw new Error('Failed to fetch community message packs');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching community message packs:', error);
    return [];
  }
}

// Download and add a message pack to custom messages
export async function downloadMessagePack(packId: string): Promise<boolean> {
  try {
    const packs = await fetchCommunityMessagePacks();
    const pack = packs.find(p => p.id === packId);
    
    if (!pack) {
      console.error('Message pack not found:', packId);
      return false;
    }

    // Get existing custom messages
    const existingMessages = JSON.parse(localStorage.getItem('cozy-critter-custom-messages') || '[]');
    
    // Add new messages from the pack with proper structure
    const newMessages = pack.messages.map(messageText => ({
      id: crypto.randomUUID(),
      text: messageText,
      category: pack.category,
      timestamp: Date.now(),
      source: `Community Pack: ${pack.name}`
    }));

    // Combine and save
    const allMessages = [...existingMessages, ...newMessages];
    localStorage.setItem('cozy-critter-custom-messages', JSON.stringify(allMessages));
    
    // Trigger storage event for other tabs
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'cozy-critter-custom-messages',
      newValue: JSON.stringify(allMessages),
      oldValue: JSON.stringify(existingMessages)
    }));

    console.log(`Successfully downloaded ${pack.messages.length} messages from ${pack.name}`);
    return true;
  } catch (error) {
    console.error('Error downloading message pack:', error);
    return false;
  }
}