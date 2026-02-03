import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatRelativeTime = (timestamp: number): string => {
    return formatDistanceToNow(timestamp, {
        addSuffix: true,
        locale: ptBR
    });
};

export const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
};

export const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
    });
};
