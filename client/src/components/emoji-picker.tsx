import { useEffect, useRef, useState } from "react";

const EMOJIS = [
  "😀","😁","😂","🤣","😃","😄","😅","😊","😍","😎",
  "😢","😭","😡","😱","🥳","😴","🤒","😇","🤔","🙃"
];

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  close: () => void;
}

export function EmojiPicker({ onSelect, close }: EmojiPickerProps) {
  const [active, setActive] = useState(0);
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const cols = 5;

  useEffect(() => {
    buttonsRef.current[active]?.focus();
  }, [active]);

  const handleKey = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    switch (e.key) {
      case "ArrowRight":
        next = (index + 1) % EMOJIS.length;
        break;
      case "ArrowLeft":
        next = (index - 1 + EMOJIS.length) % EMOJIS.length;
        break;
      case "ArrowDown":
        next = (index + cols) % EMOJIS.length;
        break;
      case "ArrowUp":
        next = (index - cols + EMOJIS.length) % EMOJIS.length;
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        onSelect(EMOJIS[index]);
        close();
        return;
      case "Escape":
        close();
        return;
      default:
        return;
    }
    e.preventDefault();
    setActive(next);
  };

  return (
    <div role="grid" aria-label="Emoji picker" className="grid grid-cols-5 gap-2 p-2">
      {EMOJIS.map((e, i) => (
        <button
          key={e}
          ref={el => (buttonsRef.current[i] = el)}
          type="button"
          role="gridcell"
          tabIndex={i === active ? 0 : -1}
          aria-label={e}
          className="text-2xl hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-primary rounded"
          onClick={() => {
            onSelect(e);
            close();
          }}
          onKeyDown={ev => handleKey(ev, i)}
        >
          {e}
        </button>
      ))}
    </div>
  );
}

export default EmojiPicker;

