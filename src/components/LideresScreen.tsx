import * as React from 'react';
import { Dialogs } from '@nativescript/core';
import { useApp } from '../store';
import { getTheme } from '../helpers';
import { createStyles } from '../styles';

export function LideresScreen() {
    const { data, setData } = useApp();
    const [nuevoNombre, setNuevoNombre] = React.useState('');

    const t = getTheme(false);
    const s = createStyles(t);

    const lideresOrdenados = [...data.lideres].sort();

    function onAgregar() {
        const n = nuevoNombre.trim();
        if (!n) return;
        if (data.lideres.includes(n)) { Dialogs.alert('Ese lider ya existe.'); return; }
        setData(prev => ({ ...prev, lideres: [...prev.lideres, n] }));
        setNuevoNombre('');
    }

    function onEditar(nombreActual: string) {
        Dialogs.prompt('Editar nombre del lider:', nombreActual).then(r => {
            if (!r.result) return;
            const nuevo = r.text.trim();
            if (!nuevo) { Dialogs.alert('El nombre no puede estar vacio.'); return; }
            if (nuevo !== nombreActual && data.lideres.includes(nuevo)) { Dialogs.alert('Ya existe un lider con ese nombre.'); return; }
            setData(prev => ({
                ...prev,
                lideres: prev.lideres.map(l => l === nombreActual ? nuevo : l),
                cronograma: prev.cronograma.map(serv => ({
                    ...serv,
                    roles: serv.roles.map(r => r.lider === nombreActual ? { ...r, lider: nuevo } : r),
                })),
            }));
        });
    }

    function onEliminar(n: string) {
        Dialogs.confirm(`Remover a ${n}?`).then(ok => {
            if (ok) setData(prev => ({ ...prev, lideres: prev.lideres.filter(l => l !== n) }));
        });
    }

    return (
        <scrollView style={s.pageBg}>
            <stackLayout style={s.card}>
                <label style={s.cardTitle}>Registrar Lider de Servicio</label>
                <flexboxLayout>
                    <textField
                        style={{...s.input, flex: 1}}
                        hint="Nombre del lider..."
                        text={nuevoNombre}
                        onTextChange={(e) => setNuevoNombre(e.object.text)}
                    />
                    <button style={{...s.btn, ...s.btnSm}} onTap={onAgregar}>Agregar</button>
                </flexboxLayout>
            </stackLayout>

            <stackLayout style={s.card}>
                <label style={s.sectionTitle}>Lideres Registrados</label>
                {lideresOrdenados.length === 0 ? (
                    <label style={s.emptyText}>No hay lideres registrados.</label>
                ) : (
                    lideresOrdenados.map((l, i) => (
                        <flexboxLayout key={i} style={s.listItem}>
                            <label style={{fontSize: 14, fontWeight: 'bold', color: t.textMain}}>{l}</label>
                            <flexboxLayout>
                                <button style={{...s.btn, ...s.btnSm, fontSize: 11, padding: 6}} onTap={() => onEditar(l)}>Editar</button>
                                <button style={{...s.btnDanger, ...s.btnSm, fontSize: 11, padding: 6}} onTap={() => onEliminar(l)}>X</button>
                            </flexboxLayout>
                        </flexboxLayout>
                    ))
                )}
            </stackLayout>
        </scrollView>
    );
}
