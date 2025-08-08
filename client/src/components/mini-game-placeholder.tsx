export function MiniGamePlaceholder() {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 rounded-2xl p-6 text-center border-2 border-purple-200 dark:border-purple-700/50 shadow-lg">
      <div className="text-4xl mb-3">🎮</div>
      <h3 className="text-xl font-bold text-purple-800 dark:text-purple-200 mb-3">
        Mini-games Coming Soon!
      </h3>
      <p className="text-purple-700 dark:text-purple-300 text-sm mb-4 font-medium">
        We're working on cozy games to help you relax and have fun. For now, enjoy 
        tracking your moods in your critter garden!
      </p>
      <button
        disabled
        className="bg-purple-200 dark:bg-purple-800/50 text-purple-800 dark:text-purple-200 px-6 py-2 rounded-full font-semibold cursor-not-allowed border border-purple-300 dark:border-purple-600"
      >
        Coming Soon ✨
      </button>
    </div>
  );
}
