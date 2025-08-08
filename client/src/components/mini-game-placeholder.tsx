export function MiniGamePlaceholder() {
  return (
    <div className="bg-accent/10 dark:bg-accent/20 rounded-2xl p-6 text-center border border-accent/20 dark:border-accent/30">
      <div className="text-3xl mb-3">🎮</div>
      <h3 className="text-lg font-semibold text-brown dark:text-brown mb-2">
        Mini-games Coming Soon!
      </h3>
      <p className="text-muted-foreground dark:text-muted-foreground text-sm mb-4">
        We're working on cozy games to help you relax and have fun. For now, enjoy 
        tracking your moods in your critter garden!
      </p>
      <button
        disabled
        className="bg-muted dark:bg-muted text-muted-foreground dark:text-muted-foreground px-6 py-2 rounded-full font-medium cursor-not-allowed"
      >
        Coming Soon
      </button>
    </div>
  );
}
