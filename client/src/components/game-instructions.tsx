import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface GameInstructionsProps {
  open: boolean;
  title: string;
  description: string;
  gameId: string;
  onStart: () => void;
  onClose: () => void;
}

export function GameInstructions({ open, title, description, gameId, onStart, onClose }: GameInstructionsProps) {
  const [skip, setSkip] = useState(false);

  const handleStart = () => {
    if (skip) {
      localStorage.setItem(`skip-instructions-${gameId}`, 'true');
    }
    onStart();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 py-4">
          <Checkbox id="skip" checked={skip} onCheckedChange={(value) => setSkip(!!value)} />
          <Label htmlFor="skip" className="text-sm">Don't show again</Label>
        </div>
        <DialogFooter>
          <Button onClick={handleStart}>Start</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
