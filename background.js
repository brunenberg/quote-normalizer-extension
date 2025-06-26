const browser = chrome || browser;

class QuoteConverter {
  static CURLY_TO_STRAIGHT = {
    '\u201c': '"',
    '\u201d': '"',
    '\u2018': "'",
    '\u2019': "'",
  };
  
  static STRAIGHT_TO_CURLY = {
    '"': '\u201c',
    "'": '\u2018',
  };
  
  static convertToStraight(text) {
    return text.replace(/[\u201c\u201d\u2018\u2019]/g, char => this.CURLY_TO_STRAIGHT[char] || char);
  }
  
  static convertToCurly(text) {
    let inDoubleQuote = false;
    return text.replace(/['"]/g, char => {
      if (char === '"') {
        inDoubleQuote = !inDoubleQuote;
        return inDoubleQuote ? '\u201c' : '\u201d';
      } else if (char === "'") {
        return '\u2018';
      }
      return char;
    });
  }
}

browser.runtime.onInstalled.addListener(() => {
  browser.storage.sync.set({
    enabled: true,
    convertTo: 'straight'
  });
});

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'convertQuotes') {
    browser.storage.sync.get(['convertTo']).then((result) => {
      const convertTo = result.convertTo || 'straight';
      let convertedText;
      
      if (convertTo === 'straight') {
        convertedText = QuoteConverter.convertToStraight(request.text);
      } else {
        convertedText = QuoteConverter.convertToCurly(request.text);
      }
      
      sendResponse({ convertedText });
    }).catch((error) => {
      console.error('Storage error:', error);
      sendResponse({ convertedText: request.text });
    });
    return true;
  }
});
