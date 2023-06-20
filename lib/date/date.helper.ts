import dayjs from 'dayjs';

export function isBefore(date: string | Date): boolean {
  return dayjs(date).isBefore(dayjs());
}

export function getNext(value: number, unit: dayjs.ManipulateType): string {
  return dayjs().add(value, unit).format();
}

export function getNow(): string {
  return dayjs().format();
}
