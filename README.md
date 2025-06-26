# Quote Normalizer Browser Extension

A browser extension that automatically displays normalized quotes on web pages in real-time.

## Features

- **Visual Normalization**: Optionally displays normalized quotes on web pages in real-time
- **Flexible Conversion**: Convert between straight quotes (`" "` `' '`) and curly quotes (`“ ”` `‘ ’`)
- **Cross-Browser Support**: Works with Chrome, Firefox, and other Chromium-based browsers
- **Real-time Settings**: Changes apply immediately without page refresh
- **Lightweight**: Minimal performance impact

## Installation

### From Browser Store
*Coming soon - extension will be available on Chrome Web Store and Firefox Add-ons*

### Manual Installation (Development)

#### Chrome/Chromium Browsers
1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The Quote Normalizer icon should appear in your toolbar

#### Firefox
1. Clone or download this repository
2. Open Firefox and navigate to `about:debugging`
3. Click "This Firefox" in the left sidebar
4. Click "Load Temporary Add-on"
5. Select the `manifest.json` file from the extension folder

## Usage

### Basic Setup
1. Click the Quote Normalizer icon in your browser toolbar
2. Toggle "Enable Quote Normalization" to activate the extension
3. Choose your preferred quote style:
   - **Straight quotes**: `" "` and `' '`
   - **Curly quotes**: `“ ”` and `‘ ’`

### Visual Normalization
The extension can also display normalized quotes directly on web pages. This is a visual-only change that doesn't affect the actual page content and is reversed when the extension is disabled.

## Settings

Access settings by clicking the extension icon:

- **Enable Quote Normalization**: Master toggle for all features
- **Convert quotes to**: Choose between straight or curly quotes
- **Live Preview**: See how quotes will appear with current settings

## Examples

### Straight Quotes Mode
- `She said "Hello" and 'Hi'`

### Curly Quotes Mode  
- `She said “Hello” and ‘Hi’`

## Technical Details

### Quote Characters Supported
- **Curly Double Quotes**: `“` (U+201C), `”` (U+201D)
- **Curly Single Quotes**: `‘` (U+2018), `’` (U+2019)
- **Straight Double Quotes**: `"` (U+0022)
- **Straight Single Quotes**: `'` (U+0027)

### Browser Compatibility
- Chrome 88+
- Firefox 89+
- Edge 88+
- Other Chromium-based browsers

## Privacy

This extension:
- ✅ Processes text locally in your browser
- ✅ Stores preferences locally using browser storage
- ❌ Does not send any data to external servers
- ❌ Does not track your browsing activity
- ❌ Does not modify website functionality

## Development

### Project Structure
```
quote-normalizer-extension/
├── manifest.json          # Extension configuration
├── background.js          # Service worker for quote conversion
├── content.js            # Page interaction and visual normalization
├── popup.html            # Settings interface
├── popup.js              # Settings logic
├── icons/                # Extension icons
└── README.md            # This file
```

### Building
No build process required - this is a vanilla JavaScript extension.

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test across different browsers
5. Submit a pull request

### Testing
- Verify settings persistence across browser sessions
- Check visual normalization doesn't interfere with page functionality
- Ensure proper cleanup when extension is disabled

## Troubleshooting

### Extension Not Working
- Ensure the extension is enabled in your browser's extension manager
- Check that the main toggle is enabled in the extension popup
- Try refreshing the page after enabling the extension

### Quotes Not Converting
- Verify the text actually contains the quote characters you're trying to convert
- Check the conversion direction in settings matches your needs
- Some websites may interfere with clipboard operations

## License

MIT License - see LICENSE file for details

## Changelog

### v1.0.0
- Initial release
- Visual normalization with real-time updates
- Cross-browser compatibility
- Settings persistence