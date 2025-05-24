import axios from 'axios';

const API_KEY = "AIzaSyA16R6KTJm4WifnWu1HqulvXO_yXXot2ew";
const SUPPORTED_LANGUAGES = ['es', 'fr', 'de'];

export const translateText = async (text, targetLang) => {
    if (!text || typeof text !== 'string' || text.trim() === '') {
        return text;
    }

    try {
        const response = await axios.post(
            'https://translation.googleapis.com/language/translate/v2',
            null,
            {
                params: {
                    q: text,
                    target: targetLang,
                    key: API_KEY,
                },
            }
        );

        return response.data.data.translations[0].translatedText;
    } catch (error) {
        console.error(`Translation error for ${targetLang}:`, error.response?.data || error.message);
        return text; // Return original text if translation fails
    }
};

export const translateObject = async (obj) => {
    const translations = {
        en: obj.en || obj, // Original text is in English
        es: null,
        fr: null,
        de: null
    };

    // Translate to all supported languages
    for (const lang of SUPPORTED_LANGUAGES) {
        translations[lang] = await translateText(translations.en, lang);
    }

    return translations;
};

export const translateArray = async (arr) => {
    if (!Array.isArray(arr)) return arr;
    
    const translatedArray = [];
    for (const item of arr) {
        if (typeof item === 'string') {
            translatedArray.push(await translateObject({ en: item }));
        } else if (typeof item === 'object') {
            translatedArray.push(await translateObject(item));
        }
    }
    return translatedArray;
}; 