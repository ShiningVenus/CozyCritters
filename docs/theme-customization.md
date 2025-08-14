# Theme customization components

The theme customization UI has been modularized into reusable pieces under `client/src/components/theme/`.

## Components

### `ColorPicker`
An accessible color input that announces optional help text for screen readers. Use it to select primary, secondary, or accent colors.

```
<ColorPicker
  id="primary"
  label="Primary Color"
  value={color}
  onChange={setColor}
  helpText="Pick a color. Hex values are accepted."
/>
```

### `FontSelector`
Dropdown selector for fonts with ARIA labels and descriptions. Options are provided as `{ label, value }` pairs.

### `ResetButton`
Simple button that reverts theme settings. Helpful when users feel overwhelmed by changes.

Each component accepts `helpText` props which are linked via `aria-describedby` to provide clear guidance, supporting neurodivergent users.

## Importing

All components can be imported from the folder index:

```
import { ColorPicker, FontSelector, ResetButton } from "@/components/theme";
```

## Page usage

`ThemeCustomizer` composes these pieces and exposes `labels` and `helpText` props to override default messaging.

