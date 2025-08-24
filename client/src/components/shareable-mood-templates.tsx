import React, { useState } from 'react';
import { Download, Upload, Share2, FileText, QrCode, CheckCircle, AlertCircle } from 'lucide-react';

interface MoodTemplate {
  id: string;
  name: string;
  description: string;
  createdAt: number;
  version: string;
  data: {
    customMessages: Array<{
      message: string;
      category: string;
    }>;
    preferences: {
      theme?: string;
      favoriteAnimals?: string[];
      checkInReminders?: boolean;
    };
    metadata: {
      totalMoods?: number;
      dateRange?: {
        start: number;
        end: number;
      };
    };
  };
}

interface ShareableMoodTemplatesProps {
  className?: string;
}

export function ShareableMoodTemplates({ className = "" }: ShareableMoodTemplatesProps) {
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [importFile, setImportFile] = useState<File | null>(null);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');

  const generateMoodTemplate = (): MoodTemplate => {
    // Get custom messages
    const customMessages = JSON.parse(localStorage.getItem('cozy-critter-custom-messages') || '[]');
    
    // Get basic preferences from localStorage
    const theme = localStorage.getItem('theme') || 'system';
    
    // Get mood data for metadata
    const moodData = JSON.parse(localStorage.getItem('cozy-critter-moods') || '[]');
    
    const template: MoodTemplate = {
      id: crypto.randomUUID(),
      name: templateName || 'My Mood Tracking Setup',
      description: templateDescription || 'A personalized mood tracking configuration',
      createdAt: Date.now(),
      version: '1.0.0',
      data: {
        customMessages: customMessages.map((msg: any) => ({
          message: msg.message,
          category: msg.category
        })),
        preferences: {
          theme: theme,
          checkInReminders: false // Could be expanded based on user settings
        },
        metadata: {
          totalMoods: moodData.length,
          dateRange: moodData.length > 0 ? {
            start: Math.min(...moodData.map((m: any) => m.timestamp)),
            end: Math.max(...moodData.map((m: any) => m.timestamp))
          } : undefined
        }
      }
    };

    return template;
  };

  const handleExportTemplate = async () => {
    try {
      setExportStatus('idle');
      
      if (!templateName.trim()) {
        setExportStatus('error');
        return;
      }

      const template = generateMoodTemplate();
      
      // Create downloadable file
      const dataStr = JSON.stringify(template, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      // Create download link
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `cozy-critter-template-${template.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Store in shared templates for future reference
      const sharedTemplates = JSON.parse(localStorage.getItem('cozy-critter-shared-templates') || '[]');
      sharedTemplates.push({
        id: template.id,
        name: template.name,
        description: template.description,
        exportedAt: Date.now(),
        type: 'exported'
      });
      localStorage.setItem('cozy-critter-shared-templates', JSON.stringify(sharedTemplates));

      setExportStatus('success');
      setTimeout(() => {
        setExportStatus('idle');
        setShowExportDialog(false);
        setTemplateName('');
        setTemplateDescription('');
      }, 2000);

    } catch (error) {
      console.error('Failed to export template:', error);
      setExportStatus('error');
      setTimeout(() => setExportStatus('idle'), 3000);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/json') {
      setImportFile(file);
    }
  };

  const handleImportTemplate = async () => {
    if (!importFile) return;

    try {
      setImportStatus('idle');
      
      const fileContent = await importFile.text();
      const template: MoodTemplate = JSON.parse(fileContent);
      
      // Validate template structure
      if (!template.id || !template.name || !template.data) {
        throw new Error('Invalid template format');
      }

      // Confirm with user before importing
      const confirmMessage = `Import "${template.name}"?\n\nThis will add:\n• ${template.data.customMessages.length} custom messages\n• Template preferences\n\nYour existing data will not be overwritten.`;
      
      if (!window.confirm(confirmMessage)) {
        return;
      }

      // Import custom messages
      if (template.data.customMessages.length > 0) {
        const existingMessages = JSON.parse(localStorage.getItem('cozy-critter-custom-messages') || '[]');
        const newMessages = template.data.customMessages.map(msg => ({
          id: crypto.randomUUID(),
          message: msg.message,
          category: msg.category,
          createdAt: Date.now(),
          source: `Imported from: ${template.name}`
        }));
        
        const allMessages = [...existingMessages, ...newMessages];
        localStorage.setItem('cozy-critter-custom-messages', JSON.stringify(allMessages));
      }

      // Store import record
      const sharedTemplates = JSON.parse(localStorage.getItem('cozy-critter-shared-templates') || '[]');
      sharedTemplates.push({
        id: template.id,
        name: template.name,
        description: template.description,
        importedAt: Date.now(),
        type: 'imported',
        source: 'file-import'
      });
      localStorage.setItem('cozy-critter-shared-templates', JSON.stringify(sharedTemplates));

      setImportStatus('success');
      setTimeout(() => {
        setImportStatus('idle');
        setShowImportDialog(false);
        setImportFile(null);
      }, 2000);

    } catch (error) {
      console.error('Failed to import template:', error);
      setImportStatus('error');
      setTimeout(() => setImportStatus('idle'), 3000);
    }
  };

  return (
    <div className={`bg-card dark:bg-card border border-border dark:border-border rounded-xl p-6 ${className}`}>
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <Share2 size={20} className="text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-brown dark:text-brown mb-1">
            Shareable Mood Templates
          </h3>
          <p className="text-muted-foreground dark:text-muted-foreground text-sm">
            Share your mood tracking setup with others or import configurations from the community. 
            Templates include your custom messages and preferences (but never your personal mood data).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <button
          onClick={() => setShowExportDialog(true)}
          className="flex items-center gap-3 p-4 border border-border dark:border-border rounded-lg hover:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <Download size={20} className="text-green-600 dark:text-green-400" />
          <div className="text-left">
            <div className="font-medium text-foreground dark:text-foreground">Export Template</div>
            <div className="text-sm text-muted-foreground">Share your setup with others</div>
          </div>
        </button>

        <button
          onClick={() => setShowImportDialog(true)}
          className="flex items-center gap-3 p-4 border border-border dark:border-border rounded-lg hover:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <Upload size={20} className="text-blue-600 dark:text-blue-400" />
          <div className="text-left">
            <div className="font-medium text-foreground dark:text-foreground">Import Template</div>
            <div className="text-sm text-muted-foreground">Use someone's shared setup</div>
          </div>
        </button>
      </div>

      {/* Export Dialog */}
      {showExportDialog && (
        <div className="mt-4 p-4 border border-border dark:border-border rounded-lg bg-muted/30">
          <h4 className="font-medium text-foreground dark:text-foreground mb-3">Export Your Template</h4>
          
          <div className="space-y-3">
            <div>
              <label htmlFor="template-name" className="block text-sm font-medium text-foreground dark:text-foreground mb-1">
                Template Name *
              </label>
              <input
                id="template-name"
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="My Mood Tracking Setup"
                className="w-full p-2 border border-border dark:border-border bg-background dark:bg-background text-foreground dark:text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                maxLength={50}
              />
            </div>
            
            <div>
              <label htmlFor="template-description" className="block text-sm font-medium text-foreground dark:text-foreground mb-1">
                Description (Optional)
              </label>
              <textarea
                id="template-description"
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                placeholder="A brief description of your setup..."
                className="w-full p-2 border border-border dark:border-border bg-background dark:bg-background text-foreground dark:text-foreground rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                rows={2}
                maxLength={200}
              />
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h5 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">What's Included</h5>
              <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Your custom encouragement messages</li>
                <li>• Theme and preference settings</li>
                <li>• Basic usage statistics (no personal mood data)</li>
              </ul>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleExportTemplate}
                disabled={!templateName.trim() || exportStatus === 'success'}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-green-500/50"
              >
                {exportStatus === 'success' ? (
                  <>
                    <CheckCircle size={16} />
                    Exported!
                  </>
                ) : (
                  <>
                    <FileText size={16} />
                    Create Template
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setShowExportDialog(false);
                  setTemplateName('');
                  setTemplateDescription('');
                  setExportStatus('idle');
                }}
                className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                Cancel
              </button>
            </div>

            {exportStatus === 'error' && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <AlertCircle size={16} className="text-red-600 dark:text-red-400" />
                <span className="text-sm text-red-800 dark:text-red-200">
                  Please enter a template name to continue.
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Import Dialog */}
      {showImportDialog && (
        <div className="mt-4 p-4 border border-border dark:border-border rounded-lg bg-muted/30">
          <h4 className="font-medium text-foreground dark:text-foreground mb-3">Import Template</h4>
          
          <div className="space-y-3">
            <div>
              <label htmlFor="template-file" className="block text-sm font-medium text-foreground dark:text-foreground mb-1">
                Select Template File
              </label>
              <input
                id="template-file"
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="w-full p-2 border border-border dark:border-border bg-background dark:bg-background text-foreground dark:text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Only .json template files are supported
              </p>
            </div>

            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <h5 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">Import Safety</h5>
              <ul className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
                <li>• Your existing data will not be overwritten</li>
                <li>• Custom messages will be added to your collection</li>
                <li>• You can review and edit imported content</li>
                <li>• Only import templates from trusted sources</li>
              </ul>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleImportTemplate}
                disabled={!importFile || importStatus === 'success'}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                {importStatus === 'success' ? (
                  <>
                    <CheckCircle size={16} />
                    Imported!
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    Import Template
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setShowImportDialog(false);
                  setImportFile(null);
                  setImportStatus('idle');
                }}
                className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                Cancel
              </button>
            </div>

            {importStatus === 'error' && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <AlertCircle size={16} className="text-red-600 dark:text-red-400" />
                <span className="text-sm text-red-800 dark:text-red-200">
                  Failed to import template. Please check the file format.
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}