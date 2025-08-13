const React = window.React;
const h = React.createElement;

const MoodColorControl = ({ value, onChange }) =>
  h('input', {
    type: 'color',
    value: value || '#000000',
    onChange: e => onChange(e.target.value),
  });

const MoodColorPreview = ({ value }) =>
  h('div', {
    style: {
      display: 'inline-block',
      width: '1.5em',
      height: '1.5em',
      backgroundColor: value,
    },
  });

export default {
  control: MoodColorControl,
  preview: MoodColorPreview,
};
