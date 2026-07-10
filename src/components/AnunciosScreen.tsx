import * as React from 'react';
import { Dialogs } from '@nativescript/core';
import { useApp } from '../store';
import { getTheme, getMonthName, formatDate, formatDateShort, genId, pad2 } from '../helpers';
import { createStyles } from '../styles';

export function AnunciosScreen() {
    const { data, setData } = useApp();
    const [mes, setMes] = React.useState(new Date().getMonth() + 1);
    const [anio, setAnio] = React.useState(new Date().getFullYear());
    const [titulo, setTitulo] = React.useState('');
    const [fecha, setFecha] = React.useState('');
    const [hora, setHora] = React.useState('');

    const t = getTheme(false);
    const s = createStyles(t);

    const filtroMes = `${anio}-${pad2(mes)}`;
    const mesLegible = `${getMonthName(pad2(mes))} ${anio}`;

    const especiales = data.anunciosEspeciales
        .filter(a => a.fecha.startsWith(filtroMes))
        .sort((a, b) => new Date(a.fecha + 'T' + a.hora) - new Date(b.fecha + 'T' + b.hora));

    const anunciosGenerales = [
        'Lunes: Aposento Alto (7:30pm)',
        'Miercoles: EVC (7:30pm)',
        'Viernes: Vision Youth',
        'Sabados: Evangelismo Sobrenatural',
        'Domingos: Celebracion al Rey',
    ];

    function onAgregar() {
        if (!titulo.trim() || !fecha || !hora) { Dialogs.alert('Completa todos los campos.'); return; }
        setData(prev => ({
            ...prev,
            anunciosEspeciales: [...prev.anunciosEspeciales, { id: genId('an_'), titulo: titulo.trim(), fecha, hora }],
        }));
        setTitulo(''); setFecha(''); setHora('');
        const m = parseInt(fecha.slice(5, 7)); const a = parseInt(fecha.slice(0, 4));
        setMes(m); setAnio(a);
        Dialogs.alert('Anuncio especial registrado.');
    }

    function onEliminar(id: string) {
        Dialogs.confirm('Remover este anuncio?').then(ok => {
            if (ok) setData(prev => ({ ...prev, anunciosEspeciales: prev.anunciosEspeciales.filter(a => a.id !== id) }));
        });
    }

    function onVaciar() {
        Dialogs.confirm('Eliminar todos los anuncios especiales de este mes?').then(ok => {
            if (ok) setData(prev => ({ ...prev, anunciosEspeciales: prev.anunciosEspeciales.filter(a => !a.fecha.startsWith(filtroMes)) }));
        });
    }

    function onCompartir() {
        let txt = `ANUNCIOS Y ACTIVIDADES - ${mesLegible.toUpperCase()}\n\nACTIVIDADES GENERALES:\n`;
        anunciosGenerales.forEach(a => { txt += `- ${a}\n`; });
        if (especiales.length > 0) {
            txt += '\nEVENTOS ESPECIALES:\n';
            especiales.forEach(an => { txt += `- ${an.titulo} -> ${formatDateShort(an.fecha)} | ${an.hora}\n`; });
        }
        Dialogs.alert(txt, 'Anuncios');
    }

    return (
        <scrollView style={s.pageBg}>
            <stackLayout style={s.card}>
                <label style={s.cardTitle}>Anuncios Generales y Especiales</label>
                <label style={s.subtitle}>{`Lista Base + eventos especiales - ${mesLegible}`}</label>

                {/* Anuncios generales */}
                <stackLayout style={s.roleBox} marginBottom="12">
                    <label style={{...s.cardTitle, fontSize: 14, color: t.primary}}>Anuncios Generales Basicos</label>
                    {anunciosGenerales.map((a, i) => (
                        <label key={i} style={{fontSize: 13, color: t.textMain, padding: 4}}>{a}</label>
                    ))}
                </stackLayout>

                {/* Formulario anuncio especial */}
                <stackLayout style={s.roleBox} marginBottom="12">
                    <label style={{...s.cardTitle, fontSize: 14, color: t.accent}}>Agregar Anuncio Especial</label>
                    <label style={s.label}>Titulo</label>
                    <textField style={s.input} hint="Ej: Retiro, Vigilia..." text={titulo} onTextChange={(e) => setTitulo(e.object.text)} />
                    <flexboxLayout>
                        <stackLayout flex="1">
                            <label style={s.label}>Fecha</label>
                            <textField style={s.input} hint="AAAA-MM-DD" text={fecha} onTextChange={(e) => setFecha(e.object.text)} />
                        </stackLayout>
                        <stackLayout flex="1">
                            <label style={s.label}>Hora</label>
                            <textField style={s.input} hint="HH:MM" text={hora} onTextChange={(e) => setHora(e.object.text)} />
                        </stackLayout>
                    </flexboxLayout>
                    <button style={{...s.btn, ...s.btnSm, backgroundColor: t.accent}} onTap={onAgregar}>Guardar Anuncio</button>
                </stackLayout>

                <flexboxLayout flexWrap="wrap">
                    <button style={{...s.btnSuccess, ...s.btnSm}} onTap={onCompartir}>Compartir Anuncios</button>
                    <button style={{...s.btnDanger, ...s.btnSm}} onTap={onVaciar}>Vaciar Especiales</button>
                </flexboxLayout>
            </stackLayout>

            {/* Lista anuncios del mes */}
            <stackLayout style={s.card}>
                <label style={s.sectionTitle}>Anuncios Planificados del Mes</label>
                {especiales.length === 0 ? (
                    <label style={s.emptyText}>No hay anuncios especiales para este mes.</label>
                ) : (
                    especiales.map(an => (
                        <stackLayout key={an.id} style={s.anuncioBlock}>
                            <flexboxLayout justifyContent="space-between" alignItems="center">
                                <stackLayout flex="1">
                                    <label style={s.anuncioTitle}>{an.titulo}</label>
                                    <label style={s.anuncioDate}>{`${formatDate(an.fecha)} - ${an.hora} hrs`}</label>
                                </stackLayout>
                                <button style={{...s.btnDanger, ...s.btnSm, fontSize: 10, padding: 6}} onTap={() => onEliminar(an.id)}>X</button>
                            </flexboxLayout>
                        </stackLayout>
                    ))
                )}
            </stackLayout>
        </scrollView>
    );
}
