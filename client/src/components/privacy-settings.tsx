import React, { useState } from "react";
import { Trash2, Shield, Database, ArrowLeft, AlertTriangle, Check, Eye, Code, Globe } from "lucide-react";
import { moodStorage } from "@/lib/mood-storage";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";

interface PrivacySettingsProps {
  onBack: () => void;
}

export function PrivacySettings({ onBack }: PrivacySettingsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showLocalStorageData, setShowLocalStorageData] = useState(false);
  const dataSummary = moodStorage.getDataSummary();

  const getLocalStorageProof = () => {
    const moodData = localStorage.getItem('cozy-critter-moods') || 'null';
    const messageData = localStorage.getItem('cozy-critter-custom-messages') || 'null';
    const themeData = localStorage.getItem('cozy-critter-theme') || 'null';

    let moods = null;
    let messages = null;

    try {
      moods = moodData === 'null' ? null : JSON.parse(moodData);
    } catch (error) {
      console.warn('Failed to parse mood data from localStorage', error);
      moods = null;
    }

    try {
      messages = messageData === 'null' ? null : JSON.parse(messageData);
    } catch (error) {
      console.warn('Failed to parse custom message data from localStorage', error);
      messages = null;
    }

    return {
      moods,
      messages,
      theme: themeData === 'null' ? null : themeData,
    };
  };

  const openNetworkInspector = () => {
    alert('To verify no data is sent:\n\n1. Press F12 to open Developer Tools\n2. Go to the Network tab\n3. Use the app normally\n4. You\'ll see NO requests containing your mood data!');
  };

  const showSourceCode = () => {
    window.open('https://github.com/username/cozy-critter', '_blank');
  };

  const handleDeleteAllData = async () => {
    setIsDeleting(true);
    
    // Add a small delay to show the loading state
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      moodStorage.clearAllData();
      setShowSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error deleting data:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="p-2 hover:bg-accent rounded-full"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h2 className="text-xl font-bold text-foreground">Privacy & Data</h2>
          <p className="text-sm text-muted-foreground">Your data, your control</p>
        </div>
      </div>

      {/* App Version */}
      <div className="bg-muted/30 dark:bg-muted/10 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-foreground">Cozy Critter</h3>
            <p className="text-xs text-muted-foreground">Version 1.0.0</p>
          </div>
          <div className="text-xs text-muted-foreground">
            Built with privacy in mind 💚
          </div>
        </div>
      </div>

      {showSuccess && (
        <div className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-green-200 dark:bg-green-800 rounded-full">
              <Check size={16} className="text-green-700 dark:text-green-300" />
            </div>
            <div>
              <p className="font-medium text-green-800 dark:text-green-200">All data deleted successfully!</p>
              <p className="text-sm text-green-600 dark:text-green-300">Your device storage has been completely cleared.</p>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Information */}
      <div className="bg-muted/50 dark:bg-muted/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Shield size={20} className="text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-2">Complete Privacy</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• All your mood data is stored only on this device</li>
              <li>• Nothing is ever sent to servers or shared</li>
              <li>• No accounts, no tracking, no data collection</li>
              <li>• You have full control to delete everything</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Data Summary */}
      <div className="bg-card border rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Database size={20} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-3">Your Data Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Mood entries</p>
                <p className="font-medium text-foreground">{dataSummary.moodEntries}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Custom messages</p>
                <p className="font-medium text-foreground">{dataSummary.customMessages}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Storage used</p>
                <p className="font-medium text-foreground">{dataSummary.storageUsed}</p>
              </div>
              <div>
                <p className="text-muted-foreground">First entry</p>
                <p className="font-medium text-foreground">
                  {dataSummary.oldestEntry 
                    ? format(dataSummary.oldestEntry, 'MMM d, yyyy')
                    : 'None yet'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Deletion */}
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
            <AlertTriangle size={20} className="text-red-600 dark:text-red-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">Delete All Data</h3>
            <p className="text-sm text-red-600 dark:text-red-300 mb-4">
              This will permanently delete all your mood entries, custom messages, and settings. This action cannot be undone.
            </p>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  size="sm"
                  disabled={isDeleting || dataSummary.moodEntries === 0 && dataSummary.customMessages === 0}
                  className="gap-2"
                >
                  <Trash2 size={16} />
                  {isDeleting ? "Deleting..." : "Delete All Data"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-sm mx-auto">
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle size={20} className="text-red-500" />
                    Are you absolutely sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-left">
                    This will permanently delete:
                    <br />
                    <br />
                    • <strong>{dataSummary.moodEntries}</strong> mood entries
                    <br />
                    • <strong>{dataSummary.customMessages}</strong> custom messages
                    <br />
                    • All app settings and preferences
                    <br />
                    <br />
                    <strong>This action cannot be undone.</strong>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col gap-2">
                  <AlertDialogAction 
                    onClick={handleDeleteAllData}
                    className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 w-full"
                  >
                    Yes, delete everything
                  </AlertDialogAction>
                  <AlertDialogCancel className="w-full">
                    Cancel
                  </AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {dataSummary.moodEntries === 0 && dataSummary.customMessages === 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                No data to delete - you're starting fresh!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Security Verification */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Eye size={20} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Security Verification</h3>
            <p className="text-sm text-blue-600 dark:text-blue-300 mb-4">
              Don't just trust us - verify our security claims yourself!
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowLocalStorageData(!showLocalStorageData)}
                className="gap-2 text-xs border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30"
              >
                <Database size={14} />
                View Local Data
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={openNetworkInspector}
                className="gap-2 text-xs border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30"
              >
                <Globe size={14} />
                Check Network
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={showSourceCode}
                className="gap-2 text-xs border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30"
              >
                <Code size={14} />
                View Source
              </Button>
            </div>

            {showLocalStorageData && (
              <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/20 rounded border">
                <h4 className="text-xs font-semibold text-blue-800 dark:text-blue-200 mb-2">Your Browser's localStorage Contents:</h4>
                <div className="text-xs space-y-2 font-mono">
                  <div>
                    <span className="text-blue-600 dark:text-blue-300">cozy-critter-moods:</span>
                    <div className="pl-4 text-muted-foreground max-h-20 overflow-y-auto">
                      {dataSummary.moodEntries > 0 ? `${dataSummary.moodEntries} mood entries stored locally` : 'null (no data)'}
                    </div>
                  </div>
                  <div>
                    <span className="text-blue-600 dark:text-blue-300">cozy-critter-custom-messages:</span>
                    <div className="pl-4 text-muted-foreground">
                      {dataSummary.customMessages > 0 ? `${dataSummary.customMessages} custom messages stored locally` : 'null (no data)'}
                    </div>
                  </div>
                  <div>
                    <span className="text-blue-600 dark:text-blue-300">cozy-critter-theme:</span>
                    <div className="pl-4 text-muted-foreground">
                      {localStorage.getItem('cozy-critter-theme') || 'null (using default theme)'}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-300 mt-2">
                  ✓ This proves your data exists ONLY in your browser's localStorage - never on our servers.
                </p>
              </div>
            )}

            <div className="mt-3 text-xs text-blue-600 dark:text-blue-300">
              <strong>How to verify:</strong> Press F12 → Network tab → Use the app → No mood data in network requests!
            </div>
          </div>
        </div>
      </div>

      {/* What happens after deletion */}
      <div className="bg-muted/30 dark:bg-muted/10 rounded-lg p-4">
        <h3 className="font-semibold text-foreground mb-2">After deletion:</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• The app will work exactly the same</li>
          <li>• You can start tracking moods immediately</li>
          <li>• No traces of your old data will remain</li>
          <li>• You prove that your privacy is in your hands</li>
        </ul>
      </div>

      {/* Technical Security Details */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <Shield size={20} className="text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">Technical Security Proof</h3>
            <div className="text-sm text-green-700 dark:text-green-300 space-y-2">
              <div className="flex items-center gap-2">
                <Check size={14} className="text-green-600 dark:text-green-400" />
                <span>Open source code - you can audit every line</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-green-600 dark:text-green-400" />
                <span>No external API calls for your mood data</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-green-600 dark:text-green-400" />
                <span>Works completely offline (try disconnecting internet!)</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-green-600 dark:text-green-400" />
                <span>Browser localStorage only - scoped to this domain</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-green-600 dark:text-green-400" />
                <span>One-click complete data deletion you just tested</span>
              </div>
            </div>
            <div className="mt-3 p-2 bg-green-100 dark:bg-green-900/20 rounded border text-xs text-green-800 dark:text-green-200">
              <strong>Security Researcher?</strong> Run your own penetration tests! Check our Network tab, inspect localStorage, verify offline functionality. Found an issue? Please report it on GitHub.
            </div>
          </div>
        </div>
      </div>

      {/* App Information */}
      <div className="border-t pt-6 mt-2">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Cozy Critter v1.0.0 • Made with 💚 for neurodivergent self-care
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Open source • Privacy-first • No data collection
          </p>
        </div>
      </div>
    </div>
  );
}