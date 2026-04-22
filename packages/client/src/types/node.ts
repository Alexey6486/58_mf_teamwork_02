export interface NodeSingleRelation<T> {
  value: T;
  next: NodeSingleRelation<T> | null;
}

export interface NodeDoubleRelation<T> {
  value: T;
  next: NodeDoubleRelation<T> | null;
  prev: NodeDoubleRelation<T> | null;
}
