import * as React from 'react';
import { Dialogs } from '@nativescript/core';
import { useApp, generarServiciosMes } from '../store';
import { AppData, Servicio } from '../types';
import { getTheme, MONTH_NAMES, getMonthName, formatDate, genId, pad2 } from '../helpers';
import { createStyles } from '../styles';

export function CronogramaScreen() {
    const { data, setData } = useApp();
    const [mes, setMes] = React.useState(new Date().getMonth() + 1);
    const [anio, setAnio] = React.useState(new Date().getFullYear());
    const [especialFecha, setEspecialFecha] = React.useState('');
    const [especialNombre, setEspecialNombre] = React.useState('');

    const t = getTheme(false);
    const s = createStyles(t);

    const filtroMes = `${anio}-${pad2(mes)}`;
    const mesLegible = `${getMonthName(pad2(mes))} ${anio}`;

    const filtrados = data.cronograma
        .filter(serv => serv.fecha.startsWith(filtroMes))
        .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    const estaGuardado = !!(data.mesesGuardados && data.mesesGuardados[filtroMes]);

    function onGenerar() {
        setData(prev => generarServiciosMes(prev, mes, anio));
        Dialogs.alert(`Generados servicios para ${mesLegible}`);
    }

    function onGuardarMes() {
        const filtrados = data.cronograma.filter(serv => serv.fecha.startsWith(filtroMes));
        if (filtrados.length === 0) { Dialogs.alert('No hay servicios para guardar.'); return; }
        setData(prev => ({ ...prev, mesesGuardados: { ...prev.mesesGuardados, [filtroMes]: true } }));
        Dialogs.alert(`Cronograma de ${filtroMes} guardado en historial.`);
    }

    function onBorrar() {
        Dialogs.confirm('Remover todos los servicios de este mes?').then(ok => {
            if (ok) {
                setData(prev => ({ ...prev, cronograma: prev.cronograma.filter(s => !s.fecha.startsWith(filtroMes)) }));
            }
        });
    }

    function onCrearEspecial() {
        if (!especialFecha || !especialNombre.trim()) return;
        const nuevoServ: Servicio = {
            id: genId('id_'),
            fecha: especialFecha,
            tipo: especialNombre.toUpperCase(),
            roles: data.funciones.map(f => ({ ministerio: f, lider: '' })),
        };
        setData(prev => ({ ...prev, cronograma: [...prev.cronograma, nuevoServ] }));
        setEspecialFecha(''); setEspecialNombre('');
        const m = parseInt(especialFecha.slice(5, 7));
        const a = parseInt(especialFecha.slice(0, 4));
        setMes(m); setAnio(a);
    }

    function onEliminarDia(id: string) {
        Dialogs.confirm('Eliminar este dia de servicio?').then(ok => {
            if (ok) setData(prev => ({ ...prev, cronograma: prev.cronograma.filter(s => s.id !== id) }));
        });
    }

    function onAsignarLider(servId: string, ministerio: string, lider: string) {
        setData(prev => ({
            ...prev,
            cronograma: prev.cronograma.map(s => {
                if (s.id !== servId) return s;
                return { ...s, roles: s.roles.map(r => r.ministerio === ministerio ? { ...r, lider } : r) };
            }),
        }));
    }

    function onQuitarFuncion(servId: string, ministerio: string) {
        Dialogs.confirm(`Remover ${ministerio} de este dia?`).then(ok => {
            if (ok) setData(prev => ({
                ...prev,
                cronograma: prev.cronograma.map(s => {
                    if (s.id !== servId) return s;
                    return { ...s, roles: s.roles.filter(r => r.ministerio !== ministerio) };
                }),
            }));
        });
    }

    function onCompartir() {
        if (filtrados.length === 0) { Dialogs.alert('No hay servicios para compartir.'); return; }
        let txt = `CRONOGRAMA DE ROLES (${filtroMes})\n\n`;
        filtrados.forEach(s => {
            txt += `${formatDate(s.fecha).toUpperCase()} - ${s.tipo}\n`;
            s.roles.forEach(r => { txt += `  ${r.ministerio}: ${r.lider || 'Sin Asignar'}\n`; });
            txt += '\n';
        });
        Dialogs.alert(txt, 'Cronograma MVFI');
    }

    function onImprimir() {
        Dialogs.alert('Para guardar como PDF, usa la opcion de impresion del navegador.');
    }

    return (
        <scrollView style={s.pageBg}>
            {/* Planificacion */}
            <stackLayout style={s.card}>
                <label style={s.cardTitle}>Planificacion Automatica</label>
                <label style={s.subtitle}>Domingos y Lunes</label>

                <label style={s.label}>Mes</label>
                <listPicker
                    style={s.picker}
                    items={MONTH_NAMES}
                    selectedIndex={mes - 1}
                    onSelectedIndexChanged={(e) => setMes(e.object.selectedIndex + 1)}
                />

                <label style={s.label}>Ano</label>
                <listPicker
                    style={s.picker}
                    items={Array.from({length: 74}, (_, i) => String(2026 + i))}
                    selectedIndex={anio - 2026}
                    onSelectedIndexChanged={(e) => setAnio(2026 + e.object.selectedIndex)}
                />

                <flexboxLayout flexWrap="wrap">
                    <button style={{...s.btn, ...s.btnSm}} onTap={onGenerar}>Auto-Generar</button>
                    <button style={{...s.btnSuccess, ...s.btnSm}} onTap={onGuardarMes}>Guardar Mes</button>
                    <button style={{...s.btnDanger, ...s.btnSm}} onTap={onBorrar}>Vaciar</button>
                </flexboxLayout>
            </stackLayout>

            {/* Servicio especial */}
            <stackLayout style={s.card}>
                <label style={s.cardTitle}>Crear Servicio Especial</label>
                <label style={s.label}>Fecha</label>
                <textField style={s.input} hint="AAAA-MM-DD" text={especialFecha} onTextChange={(e) => setEspecialFecha(e.object.text)} />
                <label style={s.label}>Nombre del Servicio</label>
                <textField style={s.input} hint="Ej. Jueves de Avivamiento" text={especialNombre} onTextChange={(e) => setEspecialNombre(e.object.text)} />
                <button style={{...s.btn, ...s.btnSm}} onTap={onCrearEspecial}>Anadir Servicio</button>
            </stackLayout>

            {/* Compartir / Imprimir */}
            <flexboxLayout flexWrap="wrap" margin="8">
                <button style={{...s.btnSuccess, ...s.btnSm}} onTap={onCompartir}>Compartir Roles</button>
                <button style={{...s.btn, ...s.btnSm}} onTap={onImprimir}>Guardar PDF</button>
            </flexboxLayout>

            {/* Lista de servicios */}
            <stackLayout style={s.card}>
                <flexboxLayout justifyContent="space-between" alignItems="center">
                    <label style={s.cardTitle}>{`Cronograma: ${mesLegible}`}</label>
                    <label style={estaGuardado ? s.badgeSaved : s.badgeDraft}>
                        {estaGuardado ? 'Guardado' : 'Borrador'}
                    </label>
                </flexboxLayout>

                {filtrados.length === 0 ? (
                    <label style={s.emptyText}>No hay servicios en este mes.</label>
                ) : (
                    filtrados.map(serv => (
                        <servicioBlock
                            key={serv.id}
                            serv={serv}
                            lideres={data.lideres}
                            styles={s}
                            onEliminarDia={onEliminarDia}
                            onAsignarLider={onAsignarLider}
                            onQuitarFuncion={onQuitarFuncion}
                        />
                    ))
                )}
            </stackLayout>
        </scrollView>
    );
}

function servicioBlock(props: {
    serv: Servicio;
    lideres: string[];
    styles: ReturnType<typeof createStyles>;
    onEliminarDia: (id: string) => void;
    onAsignarLider: (servId: string, ministerio: string, lider: string) => void;
    onQuitarFuncion: (servId: string, ministerio: string) => void;
}) {
    const { serv, lideres, styles: s, onEliminarDia, onAsignarLider, onQuitarFuncion } = props;
    const diaLegible = formatDate(serv.fecha);

    return (
        <stackLayout style={s.servicioBlock}>
            <flexboxLayout justifyContent="space-between" alignItems="center">
                <label style={s.servicioHeader}>{`${diaLegible} - ${serv.tipo}`}</label>
                <button style={{...s.btnDanger, ...s.btnSm}} onTap={() => onEliminarDia(serv.id)}>X</button>
            </flexboxLayout>

            {serv.roles.map((r, i) => {
                const ocupados = serv.roles.filter(o => o.lider === r.lider && o.ministerio !== r.ministerio);
                return (
                    <stackLayout key={i} style={s.roleBox}>
                        <flexboxLayout justifyContent="space-between" alignItems="center">
                            <label style={s.roleTag}>{r.ministerio}</label>
                            <button
                                style={{...s.btnDanger, ...s.btnSm, fontSize: 10, padding: 4}}
                                onTap={() => onQuitarFuncion(serv.id, r.ministerio)}
                            >X</button>
                        </flexboxLayout>
                        <listPicker
                            style={s.picker}
                            items={['-- Sin Asignar --', ...lideres]}
                            selectedIndex={r.lider ? lideres.indexOf(r.lider) + 1 : 0}
                            onSelectedIndexChanged={(e) => {
                                const idx = e.object.selectedIndex;
                                onAsignarLider(serv.id, r.ministerio, idx === 0 ? '' : lideres[idx - 1]);
                            }}
                        />
                    </stackLayout>
                );
            })}
        </stackLayout>
    );
}
