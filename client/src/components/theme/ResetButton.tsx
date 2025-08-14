import { Button } from "@/components/ui/button";

interface ResetButtonProps {
  label: string;
  onReset: () => void;
  helpText?: string;
}

/**
 * ResetButton resets theme selections. Clear messaging helps users
 * understand the action before they commit to it.
 */
export function ResetButton({ label, onReset, helpText }: ResetButtonProps) {
  const helpId = helpText ? `reset-help` : undefined;
  return (
    <div className="pt-2 space-y-2">
      <Button
        type="button"
        variant="outline"
        onClick={onReset}
        aria-label={label}
        aria-describedby={helpId}
      >
        {label}
      </Button>
      {helpText && (
        <p id={helpId} className="text-sm text-muted-foreground">
          {helpText}
        </p>
      )}
    </div>
  );
}

