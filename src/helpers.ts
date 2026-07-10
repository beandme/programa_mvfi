import { Theme } from './types';

export const lightTheme: Theme = {
    bgMain: '#f8fafc', bgCard: '#ffffff', bgBox: '#f1f5f9',
    textMain: '#1e293b', textMuted: '#64748b', border: '#e2e8f0',
    primary: '#2563eb', primaryLight: '#dbeafe',
    accent: '#d97706', accentLight: '#fef3c7',
    success: '#16a34a', successLight: '#dcfce7',
    danger: '#dc2626', warning: '#d97706', white: '#ffffff',
};

export const darkTheme: Theme = {
    bgMain: '#0f172a', bgCard: '#1e293b', bgBox: '#334155',
    textMain: '#f8fafc', textMuted: '#94a3b8', border: '#334155',
    primary: '#3b82f6', primaryLight: '#1e3a8a',
    accent: '#f59e0b', accentLight: '#78350f',
    success: '#22c55e', successLight: '#14532d',
    danger: '#ef4444', warning: '#f59e0b', white: '#f8fafc',
};

export function getTheme(isDark: boolean): Theme {
    return isDark ? darkTheme : lightTheme;
}

export const MONTH_NAMES = [
    'ENERO','FEBRERO','MARZO','ABRIL','MAYO','JUNIO',
    'JULIO','AGOSTO','SEPTIEMBRE','OCTUBRE','NOVIEMBRE','DICIEMBRE'
];

export const MONTH_NAMES_LOWER = [
    'enero','febrero','marzo','abril','mayo','junio',
    'julio','agosto','septiembre','octubre','noviembre','diciembre'
];

export function getMonthName(mesStr: string): string {
    return MONTH_NAMES_LOWER[parseInt(mesStr) - 1] || '';
}

export function genId(prefix: string): string {
    return (prefix || 'id_') + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

export function pad2(n: number): string {
    return String(n).padStart(2, '0');
}

export function formatDate(fechaStr: string): string {
    const d = new Date(fechaStr + 'T00:00:00');
    const days = ['domingo','lunes','martes','miercoles','jueves','viernes','sabado'];
    return days[d.getDay()] + ' ' + d.getDate();
}

export function formatDateShort(fechaStr: string): string {
    const d = new Date(fechaStr + 'T00:00:00');
    const months = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
    return d.getDate() + ' ' + months[d.getMonth()];
}

export function formatDateFull(fechaStr: string): string {
    const d = new Date(fechaStr + 'T00:00:00');
    const days = ['domingo','lunes','martes','miercoles','jueves','viernes','sabado'];
    const months = MONTH_NAMES_LOWER;
    return days[d.getDay()] + ' ' + d.getDate() + ' de ' + months[d.getMonth()];
}
