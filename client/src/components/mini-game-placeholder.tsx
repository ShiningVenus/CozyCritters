export function MiniGamePlaceholder() {
  return (
    <section aria-labelledby="minigames-heading" className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 rounded-2xl p-6 text-center border-2 border-purple-200 dark:border-purple-700/50 shadow-lg">
      <div className="text-4xl mb-3" role="img" aria-label="video game controller">🎮</div>
      <h3 id="minigames-heading" className="text-xl font-bold text-purple-800 dark:text-purple-200 mb-3">
        Sensory-Friendly Mini-games Coming Soon!
      </h3>
      <p className="text-purple-700 dark:text-purple-300 text-sm mb-4 font-medium">
        We're creating calming, stim-friendly games designed with neurodivergent minds in mind. 
        Think gentle patterns, soothing sounds, and no time pressure! 
        <span role="img" aria-label="sparkles">✨</span>
      </p>
      <button
        disabled
        aria-label="Mini-games feature coming soon"
        className="bg-purple-200 dark:bg-purple-800/50 text-purple-800 dark:text-purple-200 px-6 py-2 rounded-full font-semibold cursor-not-allowed border border-purple-300 dark:border-purple-600 focus:outline-none"
      >
        Coming Soon <span role="img" aria-label="sparkles">✨</span>
      </button>
    </section>
  );
}
