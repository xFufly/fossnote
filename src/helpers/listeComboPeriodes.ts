import metadata from "../../config/metadata.json";

function formatPronoteDate(d: Date): { _T: number; V: string } {
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return { _T: 7, V: `${day}/${month}/${year}` };
}

function getStartOfISOWeek(d: Date): Date {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
}

function getEndOfISOWeek(d: Date): Date {
    const start = getStartOfISOWeek(d);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return end;
}

function parsePronoteDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split("/");
    return new Date(Number(year), Number(month) - 1, Number(day));
}

export function generateListeComboPeriodes() {
    const today = new Date();
    const periodes = [];

    // G: 0 - Aujourd'hui
    periodes.push({
        G: 0,
        L: "Aujourd'hui",
        dateDebut: formatPronoteDate(today),
        dateFin: formatPronoteDate(today),
    });

    // G: 1 - Semaine précédente
    const lastWeekDate = new Date(today);
    lastWeekDate.setDate(today.getDate() - 7);
    const lastWeekStart = getStartOfISOWeek(lastWeekDate);
    const lastWeekEnd = getEndOfISOWeek(lastWeekDate);
    periodes.push({
        G: 1,
        L: "Semaine précédente",
        dateDebut: formatPronoteDate(lastWeekStart),
        dateFin: formatPronoteDate(lastWeekEnd.getTime() > today.getTime() ? today : lastWeekEnd),
    });

    // G: 2 - Semaine en cours
    const thisWeekStart = getStartOfISOWeek(today);
    periodes.push({
        G: 2,
        L: "Semaine en cours",
        dateDebut: formatPronoteDate(thisWeekStart),
        dateFin: formatPronoteDate(today),
    });

    // G: 3 - Mois en cours
    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    periodes.push({
        G: 3,
        L: "Mois en cours",
        dateDebut: formatPronoteDate(thisMonthStart),
        dateFin: formatPronoteDate(today),
    });

    // G: 4 - Année complète
    const startYear = today.getMonth() >= 7 ? today.getFullYear() : today.getFullYear() - 1;
    const schoolYearStart = new Date(startYear, 6, 1); // 01/07
    periodes.push({
        G: 4,
        L: "Année complète",
        dateDebut: formatPronoteDate(schoolYearStart),
        dateFin: formatPronoteDate(today),
    });

    // G: 5 - Trimestres
    const nIds = [
        "105#NjcMl8MZqR-b_aY1rKMsiZQ_Pd6LvaiT7Oeg80dYzmE",
        "105#WsiAnIZWi9b9q-Xi9KEp6-4WvqrgP2kWWeA3BCu3SXM",
        "105#51iDZJhxeQi51vYoORnBgq-9I8-o--FYxARX4UntKyc"
    ];
    let idx = 0;
    for (const key in metadata.Periodes) {
        const p = (metadata.Periodes as any)[key];
        const pStart = parsePronoteDate(p.from);
        const pEnd = parsePronoteDate(p.to);
        periodes.push({
            G: 5,
            L: p.name,
            periodeNotation: {
                _T: 24,
                V: { L: p.name, N: nIds[idx] || "unknown" }
            },
            dateDebut: formatPronoteDate(pStart),
            dateFin: formatPronoteDate(pEnd.getTime() > today.getTime() ? today : pEnd),
        });
        idx++;
    }

    // Semestres can be skipped if not explicitly in metadata (or we can just hardcode semester 1 & 2 logic if needed, but PRONOTE uses trimesters for this demo)
    // Wait, the user example has Semestres! So let's generate them based on the year.
    const s1Start = new Date(startYear, 6, 1);
    const s1End = new Date(startYear, 10, 17);
    periodes.push({
        G: 6,
        L: "Semestre 1",
        periodeNotation: {
            _T: 24,
            V: { L: "Semestre 1", N: "105#TC34qH55RHRfJvip6LVwYd-daJsw5sa7PMy1GyjisPk" }
        },
        dateDebut: formatPronoteDate(s1Start),
        dateFin: formatPronoteDate(s1End.getTime() > today.getTime() ? today : s1End),
    });

    const s2Start = new Date(startYear, 10, 18);
    const s2End = new Date(startYear + 1, 5, 29); // 29/06
    periodes.push({
        G: 6,
        L: "Semestre 2",
        periodeNotation: {
            _T: 24,
            V: { L: "Semestre 2", N: "105#DrMMnF6_sXHzoGgr3GSSlROi4B2FnpHtPfWZZMUfBDQ" }
        },
        dateDebut: formatPronoteDate(s2Start),
        dateFin: formatPronoteDate(s2End.getTime() > today.getTime() ? today : s2End),
    });

    // G: 7 - Année continue
    periodes.push({
        G: 7,
        L: "Année continue",
        periodeNotation: {
            _T: 24,
            V: { L: "Année continue", N: "105#3goOridUwnms8Tkk5RCRIfjMDp9YL5Lyf9t0jkVfnHs" }
        },
        dateDebut: formatPronoteDate(schoolYearStart),
        dateFin: formatPronoteDate(today),
    });

    // G: 8 - Période au choix
    periodes.push({
        G: 8,
        L: "Période au choix",
        dateDebut: formatPronoteDate(today),
        dateFin: formatPronoteDate(today),
    });

    // G: 9 - Contrôle en cours de formation & Hors période
    periodes.push({
        G: 9,
        L: "Contrôle en cours de formation",
        periodeNotation: {
            _T: 24,
            V: { L: "Contrôle en cours de formation", N: "105#KIWDzPr6npr3ozGmsDbLqmXHqsmvKHMsBSSsVABFEPk" }
        },
        dateDebut: formatPronoteDate(schoolYearStart),
        dateFin: formatPronoteDate(today),
    });

    periodes.push({
        G: 9,
        L: "Hors période",
        periodeNotation: {
            _T: 24,
            V: { L: "Hors période", N: "105#or9Dr6O6p8SryxTZE_sIOlN3CSQ7PvpkUjhEkHycPHs" }
        },
        dateDebut: formatPronoteDate(schoolYearStart),
        dateFin: formatPronoteDate(today),
    });

    // G: 10 - Mois
    const months = [
        "juillet", "août", "septembre", "octobre", "novembre", "décembre",
        "janvier", "février", "mars", "avril", "mai", "juin"
    ];
    for (let i = 0; i < 12; i++) {
        const mStart = new Date(startYear, 6 + i, 1);
        const mEnd = new Date(startYear, 6 + i + 1, 0); // Last day of month
        periodes.push({
            G: 10,
            L: `${months[i]} ${mStart.getFullYear()}`,
            dateDebut: formatPronoteDate(mStart),
            dateFin: formatPronoteDate(mEnd),
        });
    }

    return {
        _T: 24,
        V: periodes
    };
}
