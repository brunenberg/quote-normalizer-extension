const browser = chrome || browser;

class PopupController {
  constructor() {
    this.elements = {
      enabled: document.getElementById('enabled'),
      convertTo: document.querySelectorAll('input[name="convertTo"]'),
      mainToggle: document.getElementById('mainToggle'),
      settingsContainer: document.getElementById('settingsContainer'),
      quoteExample: document.getElementById('quoteExample')
    };
    
    this.loadSettings();
    this.bindEvents();
  }
  
  async loadSettings() {
    try {
      const settings = await browser.storage.sync.get(['enabled', 'convertTo']);
      
      this.elements.enabled.checked = settings.enabled ?? true;
      
      const convertTo = settings.convertTo ?? 'straight';
      this.elements.convertTo.forEach(radio => {
        radio.checked = radio.value === convertTo;
      });
      
      this.updateUI();
      this.updateExample();
    } catch (error) {
      console.warn('Failed to load settings:', error);
    }
  }
  
  bindEvents() {
    this.elements.enabled.addEventListener('change', () => {
      this.updateUI();
      this.updateExample();
      this.saveSettings();
    });
    
    this.elements.convertTo.forEach(radio => {
      radio.addEventListener('change', () => {
        this.updateExample();
        this.saveSettings();
      });
    });
  }
  
  updateUI() {
    const isEnabled = this.elements.enabled.checked;
    
    if (isEnabled) {
      this.elements.mainToggle.classList.add('enabled');
      this.elements.settingsContainer.classList.add('enabled');
    } else {
      this.elements.mainToggle.classList.remove('enabled');
      this.elements.settingsContainer.classList.remove('enabled');
    }
  }
  
  updateExample() {
    const isEnabled = this.elements.enabled.checked;
    const convertTo = Array.from(this.elements.convertTo).find(radio => radio.checked)?.value || 'straight';
    
    if (!isEnabled) {
      this.elements.quoteExample.textContent = 'She said \u201cHello\u201d and \u2018Hi\u2019';
    } else if (convertTo === 'straight') {
      this.elements.quoteExample.textContent = 'She said "Hello" and \'Hi\'';
    } else {
      this.elements.quoteExample.textContent = 'She said \u201cHello\u201d and \u2018Hi\u2019';
    }
  }
  
  async saveSettings() {
    const convertTo = Array.from(this.elements.convertTo).find(radio => radio.checked)?.value || 'straight';
    
    const settings = {
      enabled: this.elements.enabled.checked,
      convertTo
    };
    
    try {
      await browser.storage.sync.set(settings);
    } catch (error) {
      console.warn('Failed to save settings:', error);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new PopupController();
});
