import * as React from 'react';
import { Dialogs } from '@nativescript/core';
import { useApp } from '../store';
import { getTheme } from '../helpers';
import { createStyles } from '../styles';

export function FuncionesScreen() {
    const { data, setData } = useApp();
    const [nuevaFuncion, setNuevaFuncion] = React.useState('');

    const t = getTheme(false);
    const s = createStyles(t);

    function onAgregar() {
        const f = nuevaFuncion.trim();
        if (!f) return;
        if (data.funciones.includes(f)) { Dialogs.alert('Esa funcion ya existe.'); return; }
        setData(prev => ({ ...prev, funciones: [...prev.funciones, f] }));
        setNuevaFuncion('');
    }

    function onEliminar(f: string) {
        Dialogs.confirm(`Eliminar la funcion "${f}"?`).then(ok => {
            if (ok) setData(prev => ({ ...prev, funciones: prev.funciones.filter(x => x !== f) }));
        });
    }

    return (
        <scrollView style={s.pageBg}>
            <stackLayout style={s.card}>
                <label style={s.cardTitle}>Crear Nuevas Funciones</label>
                <label style={s.subtitle}>Las funciones se integraran en la plantilla base.</label>
                <flexboxLayout>
                    <textField
                        style={{...s.input, flex: 1}}
                        hint="Nombre de la funcion..."
                        text={nuevaFuncion}
                        onTextChange={(e) => setNuevaFuncion(e.object.text)}
                    />
                    <button style={{...s.btn, ...s.btnSm}} onTap={onAgregar}>Crear</button>
                </flexboxLayout>
            </stackLayout>

            <stackLayout style={s.card}>
                <label style={s.sectionTitle}>Funciones Activas</label>
                {data.funciones.length === 0 ? (
                    <label style={s.emptyText}>No hay funciones registradas.</label>
                ) : (
                    data.funciones.map((f, i) => (
                        <flexboxLayout key={i} style={s.listItem}>
                            <label style={{fontSize: 14, fontWeight: 'bold', color: t.textMain}}>{f}</label>
                            <button style={{...s.btnDanger, ...s.btnSm, fontSize: 11, padding: 6}} onTap={() => onEliminar(f)}>X</button>
                        </flexboxLayout>
                    ))
                )}
            </stackLayout>
        </scrollView>
    );
}
