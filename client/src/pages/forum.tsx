import React from 'react';
import { CommunityForum } from '@/components/community-forum';

export default function ForumPage() {
  return (
    <div className="min-h-screen bg-background">
      <CommunityForum className="w-full" />
    </div>
  );
}