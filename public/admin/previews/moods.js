const React = window.React;

export default function MoodsPreview({ entry }) {
  const data = entry.getIn(['data', 'moods']);
  const moods = data ? data.toJS() : [];

  return React.createElement(
    'div',
    { className: 'grid grid-cols-2 gap-4 p-4' },
    moods.map((mood, index) =>
      React.createElement(
        'div',
        {
          key: index,
          className: `p-6 rounded-2xl shadow-md text-center ${mood.color}`,
        },
        React.createElement('div', { className: 'text-4xl mb-3' }, mood.emoji),
        React.createElement(
          'div',
          { className: 'text-brown dark:text-brown font-medium' },
          mood.mood
        )
      )
    )
  );
}
