export const TextValidation = (str?: string): boolean => {
  if (!str || typeof str !== 'string') {
    return false;
  }

  return true;
};
