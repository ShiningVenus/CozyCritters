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

### `FontSizeSelector`
Allows users to select comfortable font sizes for better readability, especially important for ND users. Options include Small (14px), Medium (16px), Large (18px), and Extra Large (20px).

### `SpacingSelector`
Provides control over visual spacing for better sensory comfort. Options include Compact, Normal, Comfortable, and Spacious settings.

### `ThemePresetSelector`
Quick selection between pre-designed ND-friendly and accessible themes:
- **Default**: Standard light theme
- **Dark Mode**: Easy on sensitive eyes
- **Autism Awareness**: Warm, calming golden tones
- **Sensory-Friendly**: Low contrast, muted colors for sensory comfort

### `ResetButton`
Simple button that reverts theme settings. Helpful when users feel overwhelmed by changes.

Each component accepts `helpText` props which are linked via `aria-describedby` to provide clear guidance, supporting neurodivergent users.

## Importing

All components can be imported from the folder index:

```
import { 
  ColorPicker, 
  FontSelector, 
  FontSizeSelector,
  SpacingSelector,
  ThemePresetSelector,
  ResetButton 
} from "@/components/theme";
```

## Page usage

`ThemeCustomizer` composes these pieces and exposes `labels` and `helpText` props to override default messaging. The interface is organized into sections:

1. **Theme Presets**: Quick selection of optimized themes
2. **Custom Colors**: Fine-tune individual colors
3. **Typography & Layout**: Adjust fonts, sizes, and spacing for comfort

## ND-Friendly Features

The theme system includes several features specifically designed for neurodivergent users:

- **Sensory-friendly color palettes** with reduced contrast and muted tones
- **Font size controls** for users who need larger text for readability
- **Spacing controls** to reduce visual overwhelm
- **Clear, descriptive labels** and help text for all controls
- **Keyboard navigation** support throughout the interface
- **Persistent settings** that save user preferences locally

