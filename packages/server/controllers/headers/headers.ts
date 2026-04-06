// const acao = {"Access-Control-Allow-Origin": "*"};
const acao = { 'Access-Control-Allow-Origin': 'http://localhost' };
const acac = { 'Access-Control-Allow-Credentials': 'true' };
export const getHeaders = {
  ...acao,
  ...acac,
  'Access-Control-Allow-Methods': 'GET',
};
export const postHeaders = {
  ...acao,
  ...acac,
  'Access-Control-Allow-Methods': 'POST',
};
export const patchHeaders = {
  ...acao,
  ...acac,
  'Access-Control-Allow-Methods': 'PATCH',
};
export const deleteHeaders = {
  ...acao,
  ...acac,
  'Access-Control-Allow-Methods': 'DELETE',
};
