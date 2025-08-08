import { useState } from "react";
import { Trash2, Shield, Database, ArrowLeft, AlertTriangle, Check } from "lucide-react";
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
  const dataSummary = moodStorage.getDataSummary();

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
    </div>
  );
}