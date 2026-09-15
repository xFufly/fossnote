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