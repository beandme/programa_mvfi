import * as React from 'react';
import { useApp } from '../store';
import { getTheme, formatDateShort } from '../helpers';
import { createStyles } from '../styles';

export function MetricasScreen() {
    const { data } = useApp();

    const t = getTheme(false);
    const s = createStyles(t);

    const stats = data.lideres.map(lider => {
        let total = 0;
        let ultima = 'Sin registros';
        const mapaAsig: { [key: string]: number } = {};

        data.cronograma.forEach(serv => {
            serv.roles.forEach(r => {
                if (r.lider === lider) {
                    total++;
                    if (ultima === 'Sin registros' || serv.fecha > ultima) ultima = serv.fecha;
                    mapaAsig[r.ministerio] = (mapaAsig[r.ministerio] || 0) + 1;
                }
            });
        });

        let pref = '-';
        let max = 0;
        for (const [k, v] of Object.entries(mapaAsig)) {
            if (v > max) { max = v; pref = k; }
        }

        const ultimaFmt = ultima === 'Sin registros' ? ultima : formatDateShort(ultima);
        return { lider, total, ultimaFmt, pref };
    });

    return (
        <scrollView style={s.pageBg}>
            <stackLayout style={s.card}>
                <label style={s.cardTitle}>Frecuencia de Participacion</label>

                {/* Header row */}
                <flexboxLayout style={s.statRow}>
                    <label style={s.statHeader}>Lider</label>
                    <label style={s.statHeader}>Total</label>
                    <label style={s.statHeader}>Ultima</label>
                    <label style={s.statHeader}>Funcion</label>
                </flexboxLayout>

                {stats.map((st, i) => (
                    <flexboxLayout key={i} style={s.statRow}>
                        <label style={s.statCell}>{st.lider}</label>
                        <label style={s.statCell}>{st.total}</label>
                        <label style={{...s.statCell, fontSize: 11}}>{st.ultimaFmt}</label>
                        <label style={{...s.statCell, color: t.primary, fontWeight: 'bold'}}>{st.pref}</label>
                    </flexboxLayout>
                ))}
            </stackLayout>
        </scrollView>
    );
}
