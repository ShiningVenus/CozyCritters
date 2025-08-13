const React = window.React;

export default function GamesPreview({ entry }) {
  const data = entry.getIn(['data', 'games']);
  const games = data ? data.toJS() : [];

  return React.createElement(
    'div',
    { className: 'space-y-6 p-4' },
    games.map((game, index) =>
      React.createElement(
        'div',
        { key: index, className: 'p-4 border rounded-lg shadow-sm' },
        React.createElement('h2', { className: 'text-lg font-semibold mb-2' }, game.title),
        React.createElement('p', { className: 'mb-2 text-sm text-muted-foreground' }, game.description),
        React.createElement('a', { href: game.url, className: 'text-primary underline' }, game.url)
      )
    )
  );
}
