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