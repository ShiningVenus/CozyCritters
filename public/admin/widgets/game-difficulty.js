const React = window.React;
const h = React.createElement;

const GameDifficultyControl = ({ value, onChange }) =>
  h(
    'select',
    { value: value || 'easy', onChange: e => onChange(e.target.value) },
    [
      h('option', { value: 'easy' }, 'Easy'),
      h('option', { value: 'medium' }, 'Medium'),
      h('option', { value: 'hard' }, 'Hard'),
    ]
  );

const GameDifficultyPreview = ({ value }) =>
  h('span', null, value);

export default {
  control: GameDifficultyControl,
  preview: GameDifficultyPreview,
};
