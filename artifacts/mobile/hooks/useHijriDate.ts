export interface HijriDate {
  day: number;
  month: number;
  year: number;
  monthNameAr: string;
  monthNameEn: string;
}

const MONTHS_AR = [
  'محرم','صفر','ربيع الأول','ربيع الثاني',
  'جمادى الأولى','جمادى الآخرة','رجب','شعبان',
  'رمضان','شوال','ذو القعدة','ذو الحجة',
];
const MONTHS_EN = [
  'Muharram','Safar',"Rabi' al-Awwal","Rabi' al-Thani",
  'Jumada al-Ula','Jumada al-Akhirah','Rajab',"Sha'ban",
  'Ramadan','Shawwal',"Dhu al-Qi'dah",'Dhu al-Hijjah',
];

export function toHijri(date: Date = new Date()): HijriDate {
  const JD = Math.floor(date.getTime() / 86400000) + 2440587.5;
  const l = JD - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const lx = l - 10631 * n + 354;
  const j =
    Math.floor((10985 - lx) / 5316) * Math.floor((50 * lx) / 17719) +
    Math.floor(lx / 5670) * Math.floor((43 * lx) / 15238);
  const l2 =
    lx -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29;
  const month = Math.floor((24 * l2) / 709);
  const day = Math.floor(l2 - Math.floor((709 * month) / 24));
  const year = 30 * n + j - 30;
  return {
    day: Math.max(1, day),
    month: Math.max(1, Math.min(12, month)),
    year,
    monthNameAr: MONTHS_AR[month - 1] ?? '',
    monthNameEn: MONTHS_EN[month - 1] ?? '',
  };
}

export function isRamadan(date: Date = new Date()): boolean {
  return toHijri(date).month === 9;
}

export function daysUntilRamadan(date: Date = new Date()): number {
  const hijri = toHijri(date);
  if (hijri.month === 9) return 0;
  const monthsUntil = hijri.month < 9 ? 9 - hijri.month : 12 - hijri.month + 9;
  return Math.max(0, monthsUntil * 29 - hijri.day + 15);
}

export function hijriCalendarMonth(year: number, month: number): { day: number; date: Date }[] {
  const result: { day: number; date: Date }[] = [];
  for (let d = 1; d <= 30; d++) {
    const approxDate = new Date();
    approxDate.setFullYear(approxDate.getFullYear(), approxDate.getMonth(), approxDate.getDate() + d);
    const h = toHijri(approxDate);
    if (h.year === year && h.month === month) {
      result.push({ day: h.day, date: approxDate });
    }
  }
  return result;
}
