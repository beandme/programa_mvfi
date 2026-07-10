import * as React from 'react';
import { AppData } from './types';
import { genId, pad2 } from './helpers';

const STORAGE_KEY = 'iglesia_v13_db';

const defaultData: AppData = {
    lideres: ['Pastor Juan', 'Maria Cantora', 'Andres Diacono', 'Elena Ujier', 'Carlos Lider'],
    funciones: ['Alabanza', 'Predica', 'Ofrendas', 'Anuncios y Cierre'],
    cronograma: [],
    anunciosEspeciales: [],
    mesesGuardados: {},
};

function loadData(): AppData {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            return {
                lideres: parsed.lideres || defaultData.lideres,
                funciones: parsed.funciones || defaultData.funciones,
                cronograma: parsed.cronograma || [],
                anunciosEspeciales: parsed.anunciosEspeciales || [],
                mesesGuardados: parsed.mesesGuardados || {},
            };
        }
    } catch (e) { /* ignore */ }
    return { ...defaultData };
}

interface AppContextValue {
    data: AppData;
    setData: (updater: (prev: AppData) => AppData) => void;
    save: () => void;
}

const AppContext = React.createContext<AppContextValue | null>(null);

export function useApp(): AppContextValue {
    const ctx = React.useContext(AppContext);
    if (!ctx) throw new Error('useApp must be used within AppProvider');
    return ctx;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [data, setDataState] = React.useState<AppData>(loadData);

    const setData = React.useCallback((updater: (prev: AppData) => AppData) => {
        setDataState(prev => {
            const next = updater(prev);
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch (e) { /* ignore */ }
            return next;
        });
    }, []);

    const save = React.useCallback(() => {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) { /* ignore */ }
    }, [data]);

    const value = React.useMemo(() => ({ data, setData, save }), [data, setData, save]);

    return React.createElement(AppContext.Provider, { value }, children);
}

// Helper functions for data operations
export function generarServiciosMes(data: AppData, mes: number, anio: number): AppData {
    const numDias = new Date(anio, mes, 0).getDate();
    const nuevosServicios: AppData['cronograma'] = [];

    for (let dia = 1; dia <= numDias; dia++) {
        const fechaObj = new Date(anio, mes - 1, dia);
        const diaSemana = fechaObj.getDay();
        if (diaSemana === 0 || diaSemana === 1) {
            const stringFecha = `${anio}-${pad2(mes)}-${pad2(dia)}`;
            if (!data.cronograma.some(s => s.fecha === stringFecha)) {
                const tipoServicio = diaSemana === 0 ? 'CELEBRACION AL REY' : 'APOSENTO ALTO';
                const rolesDia = data.funciones.map(f => ({ ministerio: f, lider: '' }));
                nuevosServicios.push({ id: genId('id_'), fecha: stringFecha, tipo: tipoServicio, roles: rolesDia });
            }
        }
    }

    return {
        ...data,
        cronograma: [...data.cronograma, ...nuevosServicios],
    };
}
