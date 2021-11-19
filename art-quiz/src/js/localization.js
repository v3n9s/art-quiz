class Localization {
  constructor() {
    this.supportedLocales = ['be', 'en'];
    this.locale = 'en';
  }

  setLocale(locale) {
    if (!this.supportedLocales.includes(locale)) throw new Error('Unsupported language tag passed');
    this.locale = locale;
    document.dispatchEvent(new CustomEvent('localechange'));
  }

  getLocale() {
    return this.locale;
  }
}

export const localization = new Localization();
