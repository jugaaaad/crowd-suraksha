import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { generatePAScript } from '@/data/paTemplates';
import { Copy, Volume2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PAScriptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  alertType: string;
  location: string;
}

const PAScriptModal: React.FC<PAScriptModalProps> = ({ open, onOpenChange, alertType, location }) => {
  const script = generatePAScript(alertType, { Location: location, Ghat: location, T: '15', Direction: 'North-East' });

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard', description: 'PA script ready for broadcast.' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Volume2 className="w-5 h-5 text-cs-gold" /> PA Announcement Script
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="glass-panel rounded-lg p-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">English</p>
            <p className="text-sm text-foreground leading-relaxed">{script.english}</p>
            <Button size="sm" variant="ghost" className="mt-2 text-xs gap-1" onClick={() => copyText(script.english)}>
              <Copy className="w-3 h-3" /> Copy
            </Button>
          </div>
          <div className="glass-panel rounded-lg p-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">हिंदी</p>
            <p className="text-sm text-foreground leading-relaxed">{script.hindi}</p>
            <Button size="sm" variant="ghost" className="mt-2 text-xs gap-1" onClick={() => copyText(script.hindi)}>
              <Copy className="w-3 h-3" /> Copy
            </Button>
          </div>
          <Button className="w-full bg-cs-critical hover:bg-cs-critical/90 text-destructive-foreground gap-2">
            <Volume2 className="w-4 h-4" /> Copy to Loudspeaker System
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PAScriptModal;
