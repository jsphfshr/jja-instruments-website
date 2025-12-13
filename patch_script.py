import os

file_path = 'script.js'
with open(file_path, 'r') as f:
    content = f.read()

old_init = """  // Initialize i18n
  init() {
    this.setupLanguageSelector();
    this.applyTranslations();
    this.updateDocumentLang();
  }"""

new_code = """  // Initialize i18n
  init() {
    this.setupLanguageSelector();
    this.applyTranslations();
    this.updateDocumentLang();

    // Auto-detect country if no preference stored
    if (!this.getStoredLanguage()) {
      this.detectCountry().then(lang => {
        if (lang && lang !== this.currentLang && translations[lang]) {
          console.log("Auto-switching to country language:", lang);
          this.changeLanguage(lang);
        }
      });
    }
  }

  async detectCountry() {
    try {
      const cachedGeo = sessionStorage.getItem("geo_language");
      if (cachedGeo) return cachedGeo;

      const response = await fetch("https://ipapi.co/json/");
      if (!response.ok) return null;
      const data = await response.json();
      const country = data.country_code;

      let lang = null;
      if (country === "CN") lang = "zh";
      else if (country === "JP") lang = "ja";
      else if (country === "IN") lang = "hi";

      if (lang) {
        sessionStorage.setItem("geo_language", lang);
        return lang;
      }
    } catch (e) {
      // Fail silently
    }
    return null;
  }"""

if old_init in content:
    new_content = content.replace(old_init, new_code)
    with open(file_path, 'w') as f:
        f.write(new_content)
    print("Successfully patched script.js")
else:
    print("Could not find init method block")
