import { type TSortDirection } from '../types';

function canConvertToNumberStrict(str: string): boolean {
  if (!str || typeof str !== 'string') return false;

  const trimmed = str.trim();
  if (trimmed === '') return false;

  const parsed = parseFloat(trimmed);
  return !isNaN(parsed) && parsed.toString() === trimmed;
}

export function swap(arr: unknown[], i: number, j: number) {
  const tmp = arr[i];

  arr[i] = arr[j];
  arr[j] = tmp;
}

export function bubbleObjectSort<T extends object, K extends keyof T>(
  arr: T[],
  key: K,
  direction: TSortDirection | null | undefined = 'asc'
) {
  let s = true;
  while (s) {
    if (s) {
      s = false;
    }

    for (let i = 0; i < arr.length - 1; i++) {
      // проверяем можно ли привести к числу, чтобы корректно сортировать числа
      const isLeftNumber = canConvertToNumberStrict(arr[i][key] as string);
      const isRightNumber = canConvertToNumberStrict(arr[i + 1][key] as string);

      const left = isLeftNumber ? Number(arr[i][key]) : arr[i][key];
      const right = isRightNumber ? Number(arr[i + 1][key]) : arr[i + 1][key];

      // выставляем направление сортировки
      const check = direction === 'asc' ? left > right : left < right;

      if (check) {
        swap(arr, i, i + 1);
        s = true;
      }
    }
  }

  return arr;
}
