const React = window.React;
const md = window.markdownit();

export default function PagesPreview({ entry }) {
  const data = entry.getIn(['data', 'pages']);
  const pages = data ? data.toJS() : [];

  return React.createElement(
    'div',
    { className: 'space-y-10 p-4' },
    pages.map((page, index) =>
      React.createElement(
        'article',
        { key: index, className: 'prose mx-auto' },
        React.createElement('h1', { className: 'text-2xl font-bold mb-4' }, page.title),
        React.createElement('div', {
          dangerouslySetInnerHTML: { __html: md.render(page.body || '') },
        })
      )
    )
  );
}
