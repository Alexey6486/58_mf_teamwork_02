export interface IQueryString { [key: string]: undefined | string | string[] | IQueryString | IQueryString[] }

class APIFeatures {
  query: unknown
  queryString: IQueryString

  constructor(query: unknown, queryString: IQueryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    console.log('ApiFeatures filter');
    return this;
  }

  sort() {
    console.log('ApiFeatures sort');
    return this;
  }

  pagination() {
    console.log('ApiFeatures pagination');
    return this;
  }

}

export { APIFeatures };
