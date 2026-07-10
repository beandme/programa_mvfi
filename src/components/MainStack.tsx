import * as React from 'react';
import { TabView, TabViewItem } from '@nativescript/core';
import { useApp } from '../store';
import { getTheme } from '../helpers';
import { createStyles } from '../styles';
import { CronogramaScreen } from './CronogramaScreen';
import { AnunciosScreen } from './AnunciosScreen';
import { HistorialScreen } from './HistorialScreen';
import { LideresScreen } from './LideresScreen';
import { FuncionesScreen } from './FuncionesScreen';
import { MetricasScreen } from './MetricasScreen';
import { RespaldosScreen } from './RespaldosScreen';

export function MainStack() {
    const { data } = useApp();
    const t = getTheme(false);
    const s = createStyles(t);

    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const tabs = [
        { title: 'Cronograma', component: <CronogramaScreen /> },
        { title: 'Anuncios', component: <AnunciosScreen /> },
        { title: 'Historial', component: <HistorialScreen /> },
        { title: 'Lideres', component: <LideresScreen /> },
        { title: 'Funciones', component: <FuncionesScreen /> },
        { title: 'Metricas', component: <MetricasScreen /> },
        { title: 'Respaldo', component: <RespaldosScreen /> },
    ];

    return (
        <tabView
            selectedIndex={selectedIndex}
            onSelectedIndexChanged={(e) => setSelectedIndex(e.object.selectedIndex)}
            tabBackgroundColor={t.bgCard}
            selectedTabTextColor={t.primary}
            tabTextColor={t.textMuted}
            style={s.pageBg}
        >
            {tabs.map((tab, i) => (
                <tabViewItem key={i} title={tab.title}>
                    <page>
                        {tab.component}
                    </page>
                </tabViewItem>
            ))}
        </tabView>
    );
}
