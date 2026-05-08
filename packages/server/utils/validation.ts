export interface TextValidationOptions {
  min?: number;
  max?: number;
}

export const normalizeText = (value: unknown): string =>
  typeof value === 'string' ? value.trim() : '';

export const TextValidation = (
  value: unknown,
  options: TextValidationOptions = {}
): boolean => {
  const { min = 1, max = 5000 } = options;

  if (typeof value !== 'string') {
    return false;
  }

  const normalized = value.trim();
  const length = normalized.length;

  return length >= min && length <= max;
};

export const toPositiveInt = (value: unknown): number | undefined => {
  const num = Number(value);

  if (!Number.isInteger(num) || num <= 0) {
    return undefined;
  }

  return num;
};

export const sanitizeSearch = (value: unknown, max = 100): string => {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim().slice(0, max);
};
