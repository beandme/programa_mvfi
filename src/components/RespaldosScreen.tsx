import * as React from 'react';
import { Dialogs } from '@nativescript/core';
import { useApp } from '../store';
import { AppData } from '../types';
import { getTheme } from '../helpers';
import { createStyles } from '../styles';

export function RespaldosScreen() {
    const { data, setData } = useApp();

    const t = getTheme(false);
    const s = createStyles(t);

    function onExportar() {
        const json = JSON.stringify(data, null, 2);
        Dialogs.alert(json, 'Respaldo JSON (copia el texto)');
    }

    function onImportar() {
        Dialogs.prompt('Pega el JSON de respaldo:', '').then(r => {
            if (!r.result || !r.text.trim()) return;
            try {
                const parsed: AppData = JSON.parse(r.text);
                if (parsed.lideres && parsed.cronograma) {
                    setData(() => ({
                        lideres: parsed.lideres || [],
                        funciones: parsed.funciones || [],
                        cronograma: parsed.cronograma || [],
                        anunciosEspeciales: parsed.anunciosEspeciales || [],
                        mesesGuardados: parsed.mesesGuardados || {},
                    }));
                    Dialogs.alert('Respaldo importado con exito.');
                } else {
                    Dialogs.alert('Archivo incompatible.');
                }
            } catch (e) {
                Dialogs.alert('Error al importar el JSON.');
            }
        });
    }

    return (
        <scrollView style={s.pageBg}>
            <stackLayout style={s.card}>
                <label style={s.cardTitle}>Copia de Seguridad</label>
                <label style={s.subtitle}>Exporta o importa todos los datos de la aplicacion.</label>
                <flexboxLayout flexWrap="wrap">
                    <button style={{...s.btn, ...s.btnSm}} onTap={onExportar}>Descargar Respaldo</button>
                    <button style={{...s.btnGhost, ...s.btnSm}} onTap={onImportar}>Restaurar Respaldo</button>
                </flexboxLayout>
            </stackLayout>
        </scrollView>
    );
}
