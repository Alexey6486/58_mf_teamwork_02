export function formatDate(isoString: string) {
  if (!isoString || !isoString.length) return '';

  const date = new Date(isoString);

  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');

  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();

  return `${hours}:${minutes} ${day}.${month}.${year}`;
}
