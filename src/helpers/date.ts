export function getDateToday(): string {
	const now = new Date();
	const day = String(now.getDate()).padStart(2, "0");
	const month = String(now.getMonth() + 1).padStart(2, "0");
	return `${day}/${month}/${now.getFullYear()} 00:00:00`;
}

export function getCurrentSchoolYear(): string {
	const now = new Date();
	const year = now.getFullYear();
	return now.getMonth() >= 7 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
}

export function getFirstSchoolYear(): number {
	const now = new Date();
	return now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1;
}

export function getLastMondayOfAugust(year: number): string {
	const d = new Date(year, 7, 31);
	const day = d.getDay();
	const diff = (day === 0 ? 6 : day - 1);
	d.setDate(d.getDate() - diff);
	const dd = String(d.getDate()).padStart(2, "0");
	const mm = String(d.getMonth() + 1).padStart(2, "0");
	return `${dd}/${mm}/${year}`;
}

export function getFirstWeekdayOfSeptember(year: number): string {
	const d = new Date(year, 8, 1);
	while (d.getDay() === 0 || d.getDay() === 6) {
		d.setDate(d.getDate() + 1);
	}
	const dd = String(d.getDate()).padStart(2, "0");
	const mm = String(d.getMonth() + 1).padStart(2, "0");
	return `${dd}/${mm}/${year}`;
}

export function toPronoteDateFormat(dateStr: string | null | undefined): string {
    if (!dateStr) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        const [year, month, day] = dateStr.split("-");
        return `${day}/${month}/${year}`;
    }
    return dateStr;
}

function parsePronoteDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split("/").map(Number);
    return new Date(year, month - 1, day);
}

export function getCurrentPeriodKey(periodes: Record<string, { from: string; to: string }>, targetDate = new Date()): string {
    const targetTime = targetDate.getTime();

    for (const [key, periode] of Object.entries(periodes)) {
        const from = parsePronoteDate(periode.from).getTime();
        const toDate = parsePronoteDate(periode.to);
        toDate.setHours(23, 59, 59, 999);
        const to = toDate.getTime();

        if (targetTime >= from && targetTime <= to) {
            return key;
        }
    }
	
	return Object.keys(periodes)[0] ?? "p1";
}
export function getStartOfISOWeek(d: Date): Date {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
}

export function getPronoteWeekNumber(d: Date): number {
    const date = new Date(d.getTime());
    date.setHours(0, 0, 0, 0);

    // Get the school year start year for the given date
    const year = date.getMonth() >= 7 ? date.getFullYear() : date.getFullYear() - 1;
    
    // Find Week 1: The week containing September 1st.
    // So we find Sept 1st of 'year', and get the Monday of that week.
    const sept1 = new Date(year, 8, 1);
    const day = sept1.getDay();
    const diff = sept1.getDate() - day + (day === 0 ? -6 : 1);
    const week1Monday = new Date(sept1.setDate(diff));
    week1Monday.setHours(0, 0, 0, 0);

    // Calculate the difference in weeks
    const diffTime = date.getTime() - week1Monday.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return 1 + Math.floor(diffDays / 7);
}

function getEndOfISOWeek(d: Date): Date {
    const start = getStartOfISOWeek(d);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return end;
}

export function generateListeComboPeriodes(metadata: any) {
    const today = new Date();
    const periodes = [];

    function formatPronoteDate(d: Date): { _T: number; V: string } {
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return { _T: 7, V: `${day}/${month}/${year}` };
    }

    // G: 0 - Today
    periodes.push({
        G: 0,
        L: "Aujourd'hui",
        dateDebut: formatPronoteDate(today),
        dateFin: formatPronoteDate(today),
    });

    // G: 1 - Previous week
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

    // G: 2 - Current week
    const thisWeekStart = getStartOfISOWeek(today);
    periodes.push({
        G: 2,
        L: "Semaine en cours",
        dateDebut: formatPronoteDate(thisWeekStart),
        dateFin: formatPronoteDate(today),
    });

    // G: 3 - Current month
    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    periodes.push({
        G: 3,
        L: "Mois en cours",
        dateDebut: formatPronoteDate(thisMonthStart),
        dateFin: formatPronoteDate(today),
    });

    // G: 4 - Full year
    const startYear = today.getMonth() >= 7 ? today.getFullYear() : today.getFullYear() - 1;
    const schoolYearStart = new Date(startYear, 6, 1); // 01/07
    periodes.push({
        G: 4,
        L: "Année complète",
        dateDebut: formatPronoteDate(schoolYearStart),
        dateFin: formatPronoteDate(today),
    });

    // G: 5 - Trimesters
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

    // G: 6 - Semesters
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

    // G: 7 - Continuous year
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

    // G: 8 - Custom period
    periodes.push({
        G: 8,
        L: "Période au choix",
        dateDebut: formatPronoteDate(today),
        dateFin: formatPronoteDate(today),
    });

    // G: 9 - Continuous assessment & Outside period
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

    // G: 10 - Months
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
