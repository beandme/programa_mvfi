import * as React from 'react';
import { Dialogs } from '@nativescript/core';
import { useApp } from '../store';
import { getTheme, getMonthName, formatDate, formatDateShort, formatDateFull, pad2 } from '../helpers';
import { createStyles } from '../styles';

export function HistorialScreen() {
    const { data, setData } = useApp();
    const [vistaMes, setVistaMes] = React.useState<string | null>(null);

    const t = getTheme(false);
    const s = createStyles(t);

    const meses = Object.keys(data.mesesGuardados || {}).sort().reverse();

    function onVerDetalle(codigoMes: string) {
        setVistaMes(codigoMes);
    }

    function onEliminar(codigoMes: string) {
        Dialogs.confirm(`Remover ${codigoMes} del historial?`).then(ok => {
            if (ok) {
                setData(prev => {
                    const mg = { ...prev.mesesGuardados };
                    delete mg[codigoMes];
                    return { ...prev, mesesGuardados: mg };
                });
                if (vistaMes === codigoMes) setVistaMes(null);
            }
        });
    }

    function onCompartir(codigoMes: string) {
        const filtrados = data.cronograma
            .filter(s => s.fecha.startsWith(codigoMes))
            .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
        if (filtrados.length === 0) { Dialogs.alert('Sin datos.'); return; }
        let txt = `CRONOGRAMA DE ROLES (${codigoMes})\n\n`;
        filtrados.forEach(s => {
            txt += `${formatDate(s.fecha).toUpperCase()} - ${s.tipo}\n`;
            s.roles.forEach(r => { txt += `  ${r.ministerio}: ${r.lider || 'Vacio'}\n`; });
            txt += '\n';
        });
        Dialogs.alert(txt, 'Roles Historial');
    }

    const vistaServicios = vistaMes
        ? data.cronograma.filter(s => s.fecha.startsWith(vistaMes)).sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
        : [];

    return (
        <scrollView style={s.pageBg}>
            <stackLayout style={s.card}>
                <label style={s.cardTitle}>Historial de Cronogramas</label>
                <label style={s.subtitle}>Administra y comparte meses guardados.</label>

                {meses.length === 0 ? (
                    <label style={s.emptyText}>No hay meses consolidados en el historial.</label>
                ) : (
                    meses.map(m => {
                        const [a, ms] = m.split('-');
                        const nombre = `${getMonthName(ms)} ${a}`;
                        return (
                            <stackLayout key={m} style={s.historialItem}>
                                <label style={s.historialName}>{nombre}</label>
                                <flexboxLayout flexWrap="wrap">
                                    <button style={{...s.btn, ...s.btnSm}} onTap={() => onVerDetalle(m)}>Ver</button>
                                    <button style={{...s.btnSuccess, ...s.btnSm}} onTap={() => onCompartir(m)}>Compartir</button>
                                    <button style={{...s.btnDanger, ...s.btnSm}} onTap={() => onEliminar(m)}>X</button>
                                </flexboxLayout>
                            </stackLayout>
                        );
                    })
                )}
            </stackLayout>

            {vistaMes && (
                <stackLayout style={s.card}>
                    <flexboxLayout justifyContent="space-between" alignItems="center">
                        <label style={s.cardTitle}>Detalle: {vistaMes}</label>
                        <button style={{...s.btnGhost, ...s.btnSm}} onTap={() => setVistaMes(null)}>Cerrar</button>
                    </flexboxLayout>

                    {vistaServicios.length === 0 ? (
                        <label style={s.emptyText}>No hay dias en este mes.</label>
                    ) : (
                        vistaServicios.map(s => (
                            <stackLayout key={s.id} style={{...s.servicioBlock, marginBottom: 8}}>
                                <label style={s.servicioHeader}>{`${formatDate(s.fecha).toUpperCase()} - ${s.tipo}`}</label>
                                {s.roles.map((r, i) => (
                                    <flexboxLayout key={i} style={{padding: 2}}>
                                        <label style={{fontSize: 12, fontWeight: 'bold', color: t.primary, flex: 1}}>{r.ministerio}:</label>
                                        <label style={{fontSize: 12, color: t.textMain}}>{r.lider || 'Vacio'}</label>
                                    </flexboxLayout>
                                ))}
                            </stackLayout>
                        ))
                    )}
                </stackLayout>
            )}
        </scrollView>
    );
}
