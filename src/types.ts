export interface Role {
    ministerio: string;
    lider: string;
}

export interface Servicio {
    id: string;
    fecha: string;
    tipo: string;
    roles: Role[];
}

export interface AnuncioEspecial {
    id: string;
    titulo: string;
    fecha: string;
    hora: string;
}

export interface AppData {
    lideres: string[];
    funciones: string[];
    cronograma: Servicio[];
    anunciosEspeciales: AnuncioEspecial[];
    mesesGuardados: { [key: string]: boolean };
}

export interface Theme {
    bgMain: string;
    bgCard: string;
    bgBox: string;
    textMain: string;
    textMuted: string;
    border: string;
    primary: string;
    primaryLight: string;
    accent: string;
    accentLight: string;
    success: string;
    successLight: string;
    danger: string;
    warning: string;
    white: string;
}
