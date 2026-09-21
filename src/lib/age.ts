const birthDate = { year: 2001, month: 11, day: 7 };
const osloDate = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Oslo",
  year: "numeric",
  month: "numeric",
  day: "numeric",
});

export function getAge(now: Date = new Date()): number {
  const parts = osloDate.formatToParts(now);
  const part = (name: Intl.DateTimeFormatPartTypes) => Number(parts.find(({ type }) => type === name)!.value);
  const year = part("year");
  const month = part("month");
  const day = part("day");
  const beforeBirthday = month < birthDate.month || (month === birthDate.month && day < birthDate.day);

  return year - birthDate.year - Number(beforeBirthday);
}
