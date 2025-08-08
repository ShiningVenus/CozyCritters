export function MiniGamePlaceholder() {
  return (
    <div className="bg-accent bg-opacity-10 rounded-2xl p-6 text-center border border-accent border-opacity-20">
      <div className="text-3xl mb-3">🎮</div>
      <h3 className="text-lg font-semibold text-brown-custom mb-2">
        Mini-games Coming Soon!
      </h3>
      <p className="text-gray-600 text-sm mb-4">
        We're working on cozy games to help you relax and have fun. For now, enjoy 
        tracking your moods in your critter garden!
      </p>
      <button
        disabled
        className="bg-gray-300 text-gray-500 px-6 py-2 rounded-full font-medium cursor-not-allowed"
      >
        Coming Soon
      </button>
    </div>
  );
}
