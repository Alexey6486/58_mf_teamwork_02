export const cookiesToString = (cookies: { [key: string]: string }) => {
  return Object.keys(cookies)
    .map(cookie => `${cookie}=${cookies?.[cookie] ?? ''}`)
    .join('; ');
};
