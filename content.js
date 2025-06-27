const browser = chrome || browser;

class ClipboardHandler {
  constructor() {
    this.settings = {};
    this.initialized = false;
    this.observer = null;
    this.originalTexts = new WeakMap();
    this.init();
  }
  
  async init() {
    await this.loadSettings();
    this.bindEvents();
    this.startVisualNormalization();
    this.initialized = true;
    console.log('Quote Normalizer initialized with settings:', this.settings);
  }
  
  async loadSettings() {
    try {
      const result = await browser.storage.sync.get(['enabled', 'convertTo']);
      this.settings = {
        enabled: result.enabled ?? true,
        convertTo: result.convertTo ?? 'straight'
      };
    } catch (error) {
      console.warn('Failed to load settings:', error);
      this.settings = { enabled: true, convertTo: 'straight' };
    }
  }
  
  bindEvents() {
    document.addEventListener('copy', this.handleCopy.bind(this));
    browser.storage.onChanged.addListener((changes) => {
      this.loadSettings().then(() => {
        if (changes.enabled || changes.convertTo) {
          this.updateVisualNormalization();
        }
      });
    });
  }
  
  startVisualNormalization() {
    if (this.settings.enabled) {
      this.normalizePageQuotes();
      this.startMutationObserver();
    }
  }
  
  updateVisualNormalization() {
    if (this.settings.enabled) {
      this.restoreOriginalQuotes();
      this.normalizePageQuotes();
      if (!this.observer) {
        this.startMutationObserver();
      }
    } else {
      this.restoreOriginalQuotes();
      this.stopMutationObserver();
    }
  }
  
  normalizePageQuotes() {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
      if (this.hasQuotes(node.textContent)) {
        textNodes.push(node);
      }
    }

    textNodes.forEach(textNode => {
      if (!this.originalTexts.has(textNode)) {
        this.originalTexts.set(textNode, textNode.textContent);
      }
      
      const originalText = this.originalTexts.get(textNode);
      const convertedText = this.convertQuotesForDisplay(originalText);
      
      if (originalText !== convertedText) {
        textNode.textContent = convertedText;
      }
    });
  }
  
  convertQuotesForDisplay(text) {
    if (this.settings.convertTo === 'straight') {
      return text.replace(/[\u201c\u201d]/g, '"').replace(/[\u2018\u2019]/g, "'");
    } else {
      let inDoubleQuote = false;
      let inSingleQuote = false;
      return text.replace(/['"]/g, char => {
        if (char === '"') {
          inDoubleQuote = !inDoubleQuote;
          return inDoubleQuote ? '\u201c' : '\u201d';
        } else if (char === "'") {
          inSingleQuote = !inSingleQuote;
          return inSingleQuote ? '\u2018' : '\u2019';
        }
        return char;
      });
    }
  }
  
  restoreOriginalQuotes() {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    let node;
    while (node = walker.nextNode()) {
      if (this.originalTexts.has(node)) {
        node.textContent = this.originalTexts.get(node);
      }
    }
  }
  
  startMutationObserver() {
    if (this.observer) return;

    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE && this.hasQuotes(node.textContent)) {
            this.originalTexts.set(node, node.textContent);
            const convertedText = this.convertQuotesForDisplay(node.textContent);
            if (node.textContent !== convertedText) {
              node.textContent = convertedText;
            }
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            const walker = document.createTreeWalker(
              node,
              NodeFilter.SHOW_TEXT,
              null,
              false
            );
            let textNode;
            while (textNode = walker.nextNode()) {
              if (this.hasQuotes(textNode.textContent)) {
                this.originalTexts.set(textNode, textNode.textContent);
                const convertedText = this.convertQuotesForDisplay(textNode.textContent);
                if (textNode.textContent !== convertedText) {
                  textNode.textContent = convertedText;
                }
              }
            }
          }
        });
      });
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  stopMutationObserver() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
  
  async handleCopy(event) {
    if (!this.initialized || !this.settings.enabled) return;
    
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    
    const originalText = this.getOriginalSelectedText(selection);
    if (!this.hasQuotes(originalText)) return;
    
    console.log('Processing text with quotes:', originalText);
    
    try {
      const response = await browser.runtime.sendMessage({
        action: 'convertQuotes',
        text: originalText
      });
      
      if (response?.convertedText && response.convertedText !== originalText) {
        console.log('Converting:', originalText, '→', response.convertedText);
        
        event.clipboardData.setData('text/plain', response.convertedText);
        event.preventDefault();
      }
    } catch (error) {
      console.warn('Quote conversion failed:', error);
    }
  }
  
  getOriginalSelectedText(selection) {
    let originalText = '';
    
    for (let i = 0; i < selection.rangeCount; i++) {
      const range = selection.getRangeAt(i);
      const walker = document.createTreeWalker(
        range.commonAncestorContainer,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            return range.intersectsNode(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
          }
        },
        false
      );
      
      let node;
      while (node = walker.nextNode()) {
        if (range.intersectsNode(node)) {
          const nodeText = this.originalTexts.get(node) || node.textContent;
          const startOffset = node === range.startContainer ? range.startOffset : 0;
          const endOffset = node === range.endContainer ? range.endOffset : nodeText.length;
          originalText += nodeText.substring(startOffset, endOffset);
        }
      }
    }
    
    return originalText || selection.toString();
  }
  
  hasQuotes(text) {
    return /[\u201c\u201d\u2018\u2019"']/.test(text);
  }
}

new ClipboardHandler();
