import * as React from 'react';
import { StyleSheet } from 'react-nativescript';
import { Theme } from './types';

export function createStyles(t: Theme) {
    return StyleSheet.create({
        // Page
        pageBg: { backgroundColor: t.bgMain },
        // Header
        headerBar: {
            backgroundColor: t.primary,
            color: t.white,
            fontSize: 18,
            fontWeight: 'bold',
        },
        // Cards
        card: {
            backgroundColor: t.bgCard,
            borderRadius: 12,
            margin: 8,
            padding: 16,
        },
        cardTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: t.textMain,
            marginBottom: 8,
        },
        subtitle: {
            fontSize: 13,
            color: t.textMuted,
            marginBottom: 12,
        },
        // Buttons
        btn: {
            backgroundColor: t.primary,
            color: t.white,
            borderRadius: 8,
            padding: 12,
            fontSize: 14,
            fontWeight: '600',
            textAlignment: 'center',
            margin: 4,
        },
        btnSuccess: { backgroundColor: t.success, color: t.white, borderRadius: 8, padding: 12, fontSize: 14, fontWeight: '600', textAlignment: 'center', margin: 4 },
        btnDanger: { backgroundColor: t.danger, color: t.white, borderRadius: 8, padding: 12, fontSize: 14, fontWeight: '600', textAlignment: 'center', margin: 4 },
        btnWarning: { backgroundColor: t.warning, color: t.white, borderRadius: 8, padding: 12, fontSize: 14, fontWeight: '600', textAlignment: 'center', margin: 4 },
        btnGhost: { backgroundColor: 'transparent', color: t.textMain, borderRadius: 8, padding: 12, fontSize: 14, fontWeight: '600', textAlignment: 'center', margin: 4, borderWidth: 1, borderColor: t.border },
        btnSm: { borderRadius: 6, padding: 8, fontSize: 12, fontWeight: '600', textAlignment: 'center', margin: 2 },
        // Inputs
        input: {
            backgroundColor: t.bgMain,
            color: t.textMain,
            borderWidth: 1,
            borderColor: t.border,
            borderRadius: 8,
            padding: 10,
            fontSize: 14,
            margin: 4,
        },
        label: {
            fontSize: 13,
            fontWeight: '600',
            color: t.textMuted,
            marginBottom: 4,
            marginLeft: 4,
        },
        // Service block
        servicioBlock: {
            backgroundColor: t.bgCard,
            borderRadius: 10,
            margin: 8,
            padding: 12,
            borderLeftWidth: 4,
            borderLeftColor: t.primary,
        },
        servicioHeader: {
            fontSize: 16,
            fontWeight: 'bold',
            color: t.textMain,
            marginBottom: 8,
        },
        // Role box
        roleBox: {
            backgroundColor: t.bgBox,
            borderRadius: 8,
            padding: 10,
            margin: 4,
        },
        roleTag: {
            fontSize: 12,
            fontWeight: 'bold',
            color: t.primary,
            marginBottom: 4,
        },
        // List items
        listItem: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 10,
            borderBottomWidth: 1,
            borderBottomColor: t.border,
        },
        // Badge
        badgeDraft: {
            backgroundColor: t.bgBox,
            color: t.textMuted,
            borderRadius: 12,
            padding: 4,
            paddingLeft: 10,
            paddingRight: 10,
            fontSize: 12,
            fontWeight: 'bold',
        },
        badgeSaved: {
            backgroundColor: t.successLight,
            color: t.success,
            borderRadius: 12,
            padding: 4,
            paddingLeft: 10,
            paddingRight: 10,
            fontSize: 12,
            fontWeight: 'bold',
        },
        // Banner
        banner: {
            backgroundColor: t.accentLight,
            borderRadius: 10,
            margin: 8,
            padding: 12,
        },
        bannerText: {
            fontSize: 13,
            color: t.accent,
            fontWeight: '600',
        },
        // Empty
        emptyText: {
            fontSize: 14,
            color: t.textMuted,
            textAlignment: 'center',
            padding: 24,
        },
        // Stats
        statRow: {
            flexDirection: 'row',
            padding: 10,
            borderBottomWidth: 1,
            borderBottomColor: t.border,
        },
        statCell: {
            flex: 1,
            fontSize: 13,
            color: t.textMain,
        },
        statHeader: {
            flex: 1,
            fontSize: 12,
            fontWeight: 'bold',
            color: t.textMuted,
            textTransform: 'uppercase',
        },
        // Anuncio
        anuncioBlock: {
            backgroundColor: t.bgBox,
            borderRadius: 8,
            padding: 12,
            margin: 4,
            borderLeftWidth: 4,
            borderLeftColor: t.accent,
        },
        anuncioTitle: {
            fontSize: 14,
            fontWeight: 'bold',
            color: t.accent,
            marginBottom: 4,
        },
        anuncioDate: {
            fontSize: 12,
            color: t.textMuted,
        },
        // Picker
        picker: {
            backgroundColor: t.bgMain,
            color: t.textMain,
            borderWidth: 1,
            borderColor: t.border,
            borderRadius: 8,
            padding: 8,
            fontSize: 13,
            margin: 2,
        },
        // Section title
        sectionTitle: {
            fontSize: 15,
            fontWeight: 'bold',
            color: t.textMain,
            margin: 8,
            marginTop: 16,
        },
        // Historial item
        historialItem: {
            backgroundColor: t.bgBox,
            borderRadius: 8,
            padding: 12,
            margin: 4,
        },
        historialName: {
            fontSize: 15,
            fontWeight: 'bold',
            color: t.textMain,
            marginBottom: 8,
        },
    });
}

export type AppStyles = ReturnType<typeof createStyles>;
