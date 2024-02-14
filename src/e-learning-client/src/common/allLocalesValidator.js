import validator from 'validator';

const allLocalesValidator = (value) => {
  const locales = [
    'ar',
    'ar-AE',
    'ar-BH',
    'ar-DZ',
    'ar-EG',
    'ar-IQ',
    'ar-JO',
    'ar-KW',
    'ar-LB',
    'ar-LY',
    'ar-MA',
    'ar-QA',
    'ar-QM',
    'ar-SA',
    'ar-SD',
    'ar-SY',
    'ar-TN',
    'ar-YE',
    'bg-BG',
    'cs-CZ',
    'da-DK',
    'de-DE',
    'el-GR',
    'en-AU',
    'en-GB',
    'en-HK',
    'en-IN',
    'en-NZ',
    'en-US',
    'en-ZA',
    'en-ZM',
    'es-ES',
    'fa-IR',
    'fr-CA',
    'fr-FR',
    'he',
    'hu-HU',
    'it-IT',
    'ku-IQ',
    'nb-NO',
    'nl-NL',
    'nn-NO',
    'pl-PL',
    'pt-BR',
    'pt-PT',
    'ru-RU',
    'sl-SI',
    'sk-SK',
    'sr-RS',
    'sr-RS@latin',
    'sv-SE',
    'tr-TR',
    'uk-UA',
  ];
  return locales.reduce(
    (acc, locale) => validator.isAlpha(value, locale, { ignore: '' }) || acc,
    false
  );
};

export default allLocalesValidator;