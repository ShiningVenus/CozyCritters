import React from "react";

const EMOJIS = [
  "😀","😁","😂","🤣","😃","😄","😅","😊","😍","😎","😢","😭","😡","😱","🥳","😴","🤒","😇","🤔","🙃"
];

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

export function EmojiPicker({ onSelect }: EmojiPickerProps) {
  return (
    <div className="grid grid-cols-5 gap-2 p-2">
      {EMOJIS.map(e => (
        <button
          key={e}
          type="button"
          className="text-2xl hover:scale-110 transition-transform"
          onClick={() => onSelect(e)}
        >
          {e}
        </button>
      ))}
    </div>
  );
}

export default EmojiPicker;

