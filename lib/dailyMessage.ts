import { getRandomVerse, BibleVerse } from './bibleApi';

interface DailyMessage {
    title: string;
    message: string;
    verse: BibleVerse;
    date: string; // Data da mensagem
}

/**
 * Generate messages in the style of Paul (theological depth) + Billy Graham (modern application)
 * Short, powerful, and applicable to today's world
 */
const generateModernReflectiveMessage = (verse: BibleVerse): DailyMessage => {
    const verseText = verse.text.toLowerCase();

    // Detect theological themes
    const hasLove = /\b(amor|amar|amado)\b/i.test(verse.text);
    const hasFaith = /\b(fé|crer|confiar)\b/i.test(verse.text);
    const hasGrace = /\b(graça|misericórdia|perdão)\b/i.test(verse.text);
    const hasPeace = /\b(paz|tranquil)\b/i.test(verse.text);
    const hasJoy = /\b(alegria|alegre|gozo)\b/i.test(verse.text);
    const hasHope = /\b(esperança|esperar)\b/i.test(verse.text);
    const hasPrayer = /\b(oração|orar|clamar)\b/i.test(verse.text);
    const hasStrength = /\b(força|forte|poder)\b/i.test(verse.text);
    const hasSalvation = /\b(salvação|salvar|salvo)\b/i.test(verse.text);
    const hasTrust = /\b(confiar|confiança)\b/i.test(verse.text);
    const hasLight = /\b(luz|iluminar|brilhar)\b/i.test(verse.text);
    const hasWisdom = /\b(sábio|sabedoria|entendimento)\b/i.test(verse.text);
    const hasTruth = /\b(verdade|verdadeiro)\b/i.test(verse.text);
    const hasCommand = /\b(amai|sede|fazei|ide|vinde|segui|guardai)\b/i.test(verse.text);
    const hasPromise = /\b(promessa|prometeu|juro|aliança|farei|darei)\b/i.test(verse.text);
    const hasPraise = /\b(louv|ador|glori|exalt|celebr)\b/i.test(verse.text);

    let title = '';
    let message = '';

    // Paul's theology + Billy Graham's modern application
    if (hasLove) {
        title = 'O Amor que Transforma Vidas';
        message = 'Em um mundo marcado por divisões e egoísmo, o amor cristão se destaca como força revolucionária. Não é sentimentalismo, mas decisão radical de buscar o bem do outro, mesmo quando custa.';
    } else if (hasFaith) {
        title = 'Fé para os Dias Difíceis';
        message = 'Vivemos tempos de incerteza, mas a fé nos ancora. Não é otimismo cego, mas confiança inabalável em quem controla o futuro. Sua fé hoje determina sua paz amanhã.';
    } else if (hasGrace) {
        title = 'Graça que Liberta';
        message = 'Nossa geração busca aceitação em likes e aprovação. Mas a graça divina já nos declarou aceitos. Você não precisa provar seu valor - ele já foi estabelecido na cruz.';
    } else if (hasSalvation) {
        title = 'Salvação que Muda Tudo';
        message = 'A salvação não é religião, mas relacionamento. Não é sobre seguir regras, mas sobre ser transformado por dentro. Hoje você pode começar de novo, independente do seu passado.';
    } else if (hasPeace) {
        title = 'Paz em Meio ao Caos';
        message = 'Ansiedade é a epidemia moderna. Mas há uma paz que transcende circunstâncias, que guarda o coração mesmo quando tudo ao redor desmorona. Essa paz está disponível para você hoje.';
    } else if (hasJoy) {
        title = 'Alegria que Resiste';
        message = 'Felicidade depende do que acontece; alegria depende de quem você conhece. Em Cristo, você pode ter alegria mesmo nas lágrimas, porque sabe que a história não termina aqui.';
    } else if (hasHope) {
        title = 'Esperança para o Amanhã';
        message = 'O desespero grita alto em nossa cultura. Mas a esperança cristã não é wishful thinking - é certeza fundamentada em promessas que nunca falharam. O melhor ainda está por vir.';
    } else if (hasPrayer) {
        title = 'O Poder da Oração Hoje';
        message = 'Numa era de autossuficiência, a oração é ato radical de dependência. É admitir que precisamos de ajuda divina. E essa humildade abre portas que nenhuma força humana pode abrir.';
    } else if (hasStrength) {
        title = 'Força para Continuar';
        message = 'Você não precisa ser forte sozinho. Quando suas forças acabam, o poder de Deus começa. Sua fraqueza não é obstáculo - é oportunidade para Deus mostrar Seu poder em você.';
    } else if (hasTrust) {
        title = 'Confiança em Tempos Incertos';
        message = 'Controle é ilusão. Quanto mais tentamos controlar tudo, mais ansiosos ficamos. Confiar é soltar, descansar, crer que há um Deus que cuida mesmo quando não entendemos.';
    } else if (hasLight) {
        title = 'Luz nas Trevas Modernas';
        message = 'Vivemos em tempos sombrios, mas você foi chamado para brilhar. Não esconda sua fé - o mundo precisa ver que há outra forma de viver, outra esperança, outra luz.';
    } else if (hasWisdom) {
        title = 'Sabedoria para Decisões';
        message = 'Informação é abundante, mas sabedoria é rara. A sabedoria divina nos ensina a discernir, a escolher o eterno sobre o temporal, o certo sobre o conveniente.';
    } else if (hasTruth) {
        title = 'Verdade em Tempos Relativistas';
        message = 'Nossa cultura diz "sua verdade, minha verdade". Mas existe A Verdade - absoluta, libertadora, transformadora. E conhecê-la é o que realmente nos liberta das mentiras do mundo.';
    } else if (hasCommand) {
        title = 'Chamado para Agir';
        message = 'Fé sem ação é morta. Você foi chamado não apenas para crer, mas para viver essa crença. Hoje, escolha obedecer não por obrigação, mas porque confia em quem ordena.';
    } else if (hasPromise) {
        title = 'Promessas que Sustentam';
        message = 'Pessoas falham, planos desmoronam, mas as promessas de Deus permanecem firmes. O que Ele prometeu, Ele cumprirá. Sua fidelidade não depende da nossa, mas da natureza dEle.';
    } else if (hasPraise) {
        title = 'Gratidão que Transforma';
        message = 'Reclamação é fácil; gratidão é escolha. Quando louvamos mesmo nas dificuldades, declaramos que Deus é maior que nossos problemas. E essa perspectiva muda tudo.';
    } else {
        title = 'Palavra para Hoje';
        message = 'Deus fala através de Sua Palavra. Hoje, pare, ouça, reflita. Há uma mensagem específica para você neste momento. Não deixe o barulho do mundo abafar a voz do Criador.';
    }

    const today = new Date().toISOString().split('T')[0];

    return {
        title,
        message,
        verse,
        date: today
    };
};

/**
 * Get or generate daily message (cached by date in localStorage)
 */
export const getDailyMessage = async (): Promise<DailyMessage | null> => {
    try {
        const today = new Date().toISOString().split('T')[0];

        // Check localStorage for today's message
        const cachedMessage = localStorage.getItem('dailyMessage');
        if (cachedMessage) {
            const parsed = JSON.parse(cachedMessage);
            if (parsed.date === today) {
                return parsed;
            }
        }

        // Generate new message for today
        const verse = await getRandomVerse();
        if (!verse) return null;

        const message = generateModernReflectiveMessage(verse);

        // Cache in localStorage
        localStorage.setItem('dailyMessage', JSON.stringify(message));

        return message;
    } catch (error) {
        console.error('Error generating daily message:', error);
        return null;
    }
};

/**
 * Force refresh daily message (for manual refresh button)
 */
export const refreshDailyMessage = async (): Promise<DailyMessage | null> => {
    try {
        const verse = await getRandomVerse();
        if (!verse) return null;

        const message = generateModernReflectiveMessage(verse);

        // Update cache
        localStorage.setItem('dailyMessage', JSON.stringify(message));

        return message;
    } catch (error) {
        console.error('Error refreshing daily message:', error);
        return null;
    }
};

export const getMessageForVerse = async (reference: string): Promise<DailyMessage | null> => {
    try {
        const { getVerse } = await import('./bibleApi');
        const verse = await getVerse(reference);
        if (!verse) return null;

        return generateModernReflectiveMessage(verse);
    } catch (error) {
        console.error('Error generating message for verse:', error);
        return null;
    }
};
