const acao = {"Access-Control-Allow-Origin": "*"};
export const getHeaders = {...acao, "Access-Control-Allow-Methods" : "GET"};
export const postHeaders = {...acao, "Access-Control-Allow-Methods" : "POST"};
export const patchHeaders = {...acao, "Access-Control-Allow-Methods" : "PATCH"};
export const deleteHeaders = {...acao, "Access-Control-Allow-Methods" : "DELETE"};
