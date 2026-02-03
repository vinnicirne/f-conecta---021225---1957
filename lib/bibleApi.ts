// Bible API Service
// Using Bible API (https://bible-api.com) - Free, no auth required

const BIBLE_API_BASE = 'https://bible-api.com';

export interface BibleVerse {
    reference: string;
    text: string;
    translation_id: string;
    translation_name: string;
}

export interface BibleBook {
    name: string;
    abbrev: string;
    chapters: number;
    testament: 'old' | 'new';
}

// Lista de livros da Bíblia em português
export const BIBLE_BOOKS: BibleBook[] = [
    // Antigo Testamento
    { name: 'Gênesis', abbrev: 'gn', chapters: 50, testament: 'old' },
    { name: 'Êxodo', abbrev: 'ex', chapters: 40, testament: 'old' },
    { name: 'Levítico', abbrev: 'lv', chapters: 27, testament: 'old' },
    { name: 'Números', abbrev: 'nm', chapters: 36, testament: 'old' },
    { name: 'Deuteronômio', abbrev: 'dt', chapters: 34, testament: 'old' },
    { name: 'Josué', abbrev: 'js', chapters: 24, testament: 'old' },
    { name: 'Juízes', abbrev: 'jz', chapters: 21, testament: 'old' },
    { name: 'Rute', abbrev: 'rt', chapters: 4, testament: 'old' },
    { name: '1 Samuel', abbrev: '1sm', chapters: 31, testament: 'old' },
    { name: '2 Samuel', abbrev: '2sm', chapters: 24, testament: 'old' },
    { name: '1 Reis', abbrev: '1rs', chapters: 22, testament: 'old' },
    { name: '2 Reis', abbrev: '2rs', chapters: 25, testament: 'old' },
    { name: '1 Crônicas', abbrev: '1cr', chapters: 29, testament: 'old' },
    { name: '2 Crônicas', abbrev: '2cr', chapters: 36, testament: 'old' },
    { name: 'Esdras', abbrev: 'ed', chapters: 10, testament: 'old' },
    { name: 'Neemias', abbrev: 'ne', chapters: 13, testament: 'old' },
    { name: 'Ester', abbrev: 'et', chapters: 10, testament: 'old' },
    { name: 'Jó', abbrev: 'job', chapters: 42, testament: 'old' },
    { name: 'Salmos', abbrev: 'sl', chapters: 150, testament: 'old' },
    { name: 'Provérbios', abbrev: 'pv', chapters: 31, testament: 'old' },
    { name: 'Eclesiastes', abbrev: 'ec', chapters: 12, testament: 'old' },
    { name: 'Cânticos', abbrev: 'ct', chapters: 8, testament: 'old' },
    { name: 'Isaías', abbrev: 'is', chapters: 66, testament: 'old' },
    { name: 'Jeremias', abbrev: 'jr', chapters: 52, testament: 'old' },
    { name: 'Lamentações', abbrev: 'lm', chapters: 5, testament: 'old' },
    { name: 'Ezequiel', abbrev: 'ez', chapters: 48, testament: 'old' },
    { name: 'Daniel', abbrev: 'dn', chapters: 12, testament: 'old' },
    { name: 'Oséias', abbrev: 'os', chapters: 14, testament: 'old' },
    { name: 'Joel', abbrev: 'jl', chapters: 3, testament: 'old' },
    { name: 'Amós', abbrev: 'am', chapters: 9, testament: 'old' },
    { name: 'Obadias', abbrev: 'ob', chapters: 1, testament: 'old' },
    { name: 'Jonas', abbrev: 'jn', chapters: 4, testament: 'old' },
    { name: 'Miquéias', abbrev: 'mq', chapters: 7, testament: 'old' },
    { name: 'Naum', abbrev: 'na', chapters: 3, testament: 'old' },
    { name: 'Habacuque', abbrev: 'hc', chapters: 3, testament: 'old' },
    { name: 'Sofonias', abbrev: 'sf', chapters: 3, testament: 'old' },
    { name: 'Ageu', abbrev: 'ag', chapters: 2, testament: 'old' },
    { name: 'Zacarias', abbrev: 'zc', chapters: 14, testament: 'old' },
    { name: 'Malaquias', abbrev: 'ml', chapters: 4, testament: 'old' },

    // Novo Testamento
    { name: 'Mateus', abbrev: 'mt', chapters: 28, testament: 'new' },
    { name: 'Marcos', abbrev: 'mc', chapters: 16, testament: 'new' },
    { name: 'Lucas', abbrev: 'lc', chapters: 24, testament: 'new' },
    { name: 'João', abbrev: 'jo', chapters: 21, testament: 'new' },
    { name: 'Atos', abbrev: 'at', chapters: 28, testament: 'new' },
    { name: 'Romanos', abbrev: 'rm', chapters: 16, testament: 'new' },
    { name: '1 Coríntios', abbrev: '1co', chapters: 16, testament: 'new' },
    { name: '2 Coríntios', abbrev: '2co', chapters: 13, testament: 'new' },
    { name: 'Gálatas', abbrev: 'gl', chapters: 6, testament: 'new' },
    { name: 'Efésios', abbrev: 'ef', chapters: 6, testament: 'new' },
    { name: 'Filipenses', abbrev: 'fp', chapters: 4, testament: 'new' },
    { name: 'Colossenses', abbrev: 'cl', chapters: 4, testament: 'new' },
    { name: '1 Tessalonicenses', abbrev: '1ts', chapters: 5, testament: 'new' },
    { name: '2 Tessalonicenses', abbrev: '2ts', chapters: 3, testament: 'new' },
    { name: '1 Timóteo', abbrev: '1tm', chapters: 6, testament: 'new' },
    { name: '2 Timóteo', abbrev: '2tm', chapters: 4, testament: 'new' },
    { name: 'Tito', abbrev: 'tt', chapters: 3, testament: 'new' },
    { name: 'Filemom', abbrev: 'fm', chapters: 1, testament: 'new' },
    { name: 'Hebreus', abbrev: 'hb', chapters: 13, testament: 'new' },
    { name: 'Tiago', abbrev: 'tg', chapters: 5, testament: 'new' },
    { name: '1 Pedro', abbrev: '1pe', chapters: 5, testament: 'new' },
    { name: '2 Pedro', abbrev: '2pe', chapters: 3, testament: 'new' },
    { name: '1 João', abbrev: '1jo', chapters: 5, testament: 'new' },
    { name: '2 João', abbrev: '2jo', chapters: 1, testament: 'new' },
    { name: '3 João', abbrev: '3jo', chapters: 1, testament: 'new' },
    { name: 'Judas', abbrev: 'jd', chapters: 1, testament: 'new' },
    { name: 'Apocalipse', abbrev: 'ap', chapters: 22, testament: 'new' },
];

/**
 * Busca um versículo da Bíblia
 * @param reference - Referência no formato "João 3:16" ou "john 3:16"
 * @param translation - Tradução (padrão: 'almeida')
 */
export const getVerse = async (reference: string, translation: string = 'almeida'): Promise<BibleVerse | null> => {
    try {
        const response = await fetch(`${BIBLE_API_BASE}/${encodeURIComponent(reference)}?translation=${translation}`);

        if (!response.ok) {
            throw new Error('Versículo não encontrado');
        }

        const data = await response.json();

        return {
            reference: data.reference,
            text: data.text,
            translation_id: data.translation_id,
            translation_name: data.translation_name
        };
    } catch (error) {
        console.error('Error fetching verse:', error);
        return null;
    }
};

/**
 * Busca um versículo aleatório
 */
export const getRandomVerse = async (): Promise<BibleVerse | null> => {
    try {
        const response = await fetch(`${BIBLE_API_BASE}/?random=verse&translation=almeida`);

        if (!response.ok) {
            throw new Error('Erro ao buscar versículo aleatório');
        }

        const data = await response.json();

        return {
            reference: data.reference,
            text: data.text,
            translation_id: data.translation_id,
            translation_name: data.translation_name
        };
    } catch (error) {
        console.error('Error fetching random verse:', error);
        return null;
    }
};

/**
 * Busca um capítulo completo
 * @param book - Livro (ex: 'João', 'john')
 * @param chapter - Número do capítulo
 */
export const getChapter = async (book: string, chapter: number): Promise<any> => {
    try {
        const response = await fetch(`${BIBLE_API_BASE}/${encodeURIComponent(book)} ${chapter}?translation=almeida`);

        if (!response.ok) {
            throw new Error('Capítulo não encontrado');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching chapter:', error);
        return null;
    }
};

/**
 * Busca múltiplos versículos
 * @param book - Livro
 * @param chapter - Capítulo
 * @param verseStart - Versículo inicial
 * @param verseEnd - Versículo final (opcional)
 */
export const getVerses = async (
    book: string,
    chapter: number,
    verseStart: number,
    verseEnd?: number
): Promise<BibleVerse | null> => {
    const reference = verseEnd
        ? `${book} ${chapter}:${verseStart}-${verseEnd}`
        : `${book} ${chapter}:${verseStart}`;

    return getVerse(reference);
};
