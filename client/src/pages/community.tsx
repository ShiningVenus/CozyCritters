import React, { useState, useEffect } from "react";
import { ArrowLeft, ExternalLink, Heart, Users, MessageCircle, Calendar, Download, Globe, CheckCircle } from "lucide-react";
import { fetchCommunityMessagePacks, downloadMessagePack, CommunityMessagePack } from "@/lib/community-message-packs";
import { ShareableMoodTemplates } from "@/components/shareable-mood-templates";
import { CommunityCopingStrategies } from "@/components/community-coping-strategies";
import { CommunityForum } from "@/components/community-forum";
import { CommunityDashboard } from "@/components/community-dashboard";

interface CommunityProps {
  onBack: () => void;
}

export function Community({ onBack }: CommunityProps) {
  const [messagePacks, setMessagePacks] = useState<CommunityMessagePack[]>([]);
  const [downloadingPacks, setDownloadingPacks] = useState<Set<string>>(new Set());
  const [downloadedPacks, setDownloadedPacks] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchCommunityMessagePacks().then(setMessagePacks);
  }, []);

  const handleDownloadMessagePack = async (packId: string) => {
    setDownloadingPacks(prev => new Set(prev).add(packId));
    
    try {
      const success = await downloadMessagePack(packId);
      if (success) {
        setDownloadedPacks(prev => new Set(prev).add(packId));
        // Show success feedback for a few seconds
        setTimeout(() => {
          setDownloadedPacks(prev => {
            const newSet = new Set(prev);
            newSet.delete(packId);
            return newSet;
          });
        }, 3000);
      }
    } catch (error) {
      console.error('Failed to download message pack:', error);
    } finally {
      setDownloadingPacks(prev => {
        const newSet = new Set(prev);
        newSet.delete(packId);
        return newSet;
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-6 rounded-b-3xl shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            aria-label="Go back"
            className="p-2 rounded-lg hover:bg-primary/20 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-foreground/50"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Users size={24} />
              Community
            </h1>
            <p className="text-sm opacity-90">Connect, support, and grow together</p>
          </div>
        </div>
      </header>

      <main className="p-6 space-y-6">
        {/* Community Dashboard - Phase 2 Feature */}
        <CommunityDashboard className="mb-6" />

        {/* Community Resources */}
        <section className="bg-card rounded-lg p-6 border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Globe size={20} />
            Community Resources
          </h2>
          <p className="text-muted-foreground mb-4">
            Helpful resources and organizations for neurodivergent individuals and their supporters.
          </p>
          
          <div className="space-y-3">
            <div className="border border-border rounded-lg p-4">
              <h3 className="font-medium text-foreground mb-2">Autism Self Advocacy Network (ASAN)</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Run by and for autistic people, promoting self-advocacy and community.
              </p>
              <a
                href="https://autisticadvocacy.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:text-primary/80 text-sm"
              >
                Visit Website <ExternalLink size={14} />
              </a>
            </div>

            <div className="border border-border rounded-lg p-4">
              <h3 className="font-medium text-foreground mb-2">ADHD Online Community</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Support and resources for ADHD individuals and families.
              </p>
              <a
                href="https://adhdoline.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:text-primary/80 text-sm"
              >
                Learn More <ExternalLink size={14} />
              </a>
            </div>

            <div className="border border-border rounded-lg p-4">
              <h3 className="font-medium text-foreground mb-2">Crisis Text Line</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Free 24/7 support for those in crisis. Text HOME to 741741.
              </p>
              <p className="text-sm font-medium text-foreground">Text: 741741</p>
            </div>
          </div>
        </section>

        {/* Community Message Packs */}
        <section className="bg-card rounded-lg p-6 border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <MessageCircle size={20} />
            Community Message Packs
          </h2>
          <p className="text-muted-foreground mb-4">
            Curated collections of encouraging messages created by and for the neurodivergent community.
          </p>
          
          <div className="space-y-3">
            {messagePacks.map((pack) => (
              <div key={pack.id} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground mb-2">{pack.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {pack.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {pack.messageCount} messages • Created by ND community
                    </p>
                  </div>
                  <button
                    onClick={() => handleDownloadMessagePack(pack.id)}
                    disabled={downloadingPacks.has(pack.id)}
                    className="ml-4 flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm disabled:opacity-50"
                  >
                    {downloadingPacks.has(pack.id) ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent" />
                        Downloading...
                      </>
                    ) : downloadedPacks.has(pack.id) ? (
                      <>
                        <CheckCircle size={14} />
                        Downloaded!
                      </>
                    ) : (
                      <>
                        <Download size={14} />
                        Download
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
            
            {messagePacks.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
                <p>Loading community message packs...</p>
              </div>
            )}
          </div>
        </section>

        {/* Community Forum - Phase 2 Feature */}
        <CommunityForum className="mb-6" />

        {/* Shareable Mood Templates */}
        <ShareableMoodTemplates className="mb-6" />

        {/* Community Coping Strategies */}
        <CommunityCopingStrategies className="mb-6" />

        {/* Community Challenges */}
        <section className="bg-card rounded-lg p-6 border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Calendar size={20} />
            Gentle Community Challenges
          </h2>
          <p className="text-muted-foreground mb-4">
            Optional, gentle activities to try when you're feeling up for it. No pressure, just suggestions.
          </p>
          
          <div className="space-y-3">
            <div className="border border-border rounded-lg p-4">
              <h3 className="font-medium text-foreground mb-2">🌱 This Week: Tiny Self-Care</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Find one tiny thing that brings you comfort today. It could be a favorite texture, a calming sound, or a few deep breaths.
              </p>
              <p className="text-xs text-muted-foreground">No pressure • Do what feels right for you</p>
            </div>

            <div className="border border-border rounded-lg p-4">
              <h3 className="font-medium text-foreground mb-2">💙 Sensory Check-In</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Notice what your senses are telling you right now. Are you comfortable? What might help you feel more at ease?
              </p>
              <p className="text-xs text-muted-foreground">Self-awareness • No judgment</p>
            </div>

            <div className="border border-border rounded-lg p-4">
              <h3 className="font-medium text-foreground mb-2">🧩 Stim Appreciation</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Take a moment to appreciate your stims and self-regulation strategies. They're part of how you take care of yourself.
              </p>
              <p className="text-xs text-muted-foreground">Self-acceptance • Positive reinforcement</p>
            </div>
          </div>
        </section>

        {/* Support Networks */}
        <section className="bg-card rounded-lg p-6 border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Heart size={20} />
            Finding Your Support Network
          </h2>
          <p className="text-muted-foreground mb-4">
            Building connections with others who understand your experience.
          </p>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-foreground mb-2">Online Communities</h3>
              <ul className="text-sm text-muted-foreground space-y-1 pl-4">
                <li>• Reddit communities (r/autism, r/ADHD, r/neurodiversity)</li>
                <li>• Facebook support groups for your specific needs</li>
                <li>• Discord servers focused on neurodivergent experiences</li>
                <li>• Special interest communities and forums</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-foreground mb-2">Local Resources</h3>
              <ul className="text-sm text-muted-foreground space-y-1 pl-4">
                <li>• Search for local autism/ADHD support groups</li>
                <li>• Check with community centers and libraries</li>
                <li>• Look for sensory-friendly events in your area</li>
                <li>• Connect with disability resource centers</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-foreground mb-2">Professional Support</h3>
              <ul className="text-sm text-muted-foreground space-y-1 pl-4">
                <li>• Neurodivergent-affirming therapists</li>
                <li>• Occupational therapists specializing in sensory needs</li>
                <li>• Support coordinators or case managers</li>
                <li>• Peer support specialists</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Privacy Notice */}
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Heart size={16} className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-medium text-green-800 dark:text-green-200 mb-1">
                Privacy Reminder
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                These community features provide resources and support while maintaining your privacy. 
                No personal data is shared, and all external links open in new tabs.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Community;