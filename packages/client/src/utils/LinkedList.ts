import { type NodeDoubleRelation } from '../types/node';

export default class LinkedList<T> {
  private _size: number;
  private head: NodeDoubleRelation<T> | null;
  private tail: NodeDoubleRelation<T> | null;
  private _current: NodeDoubleRelation<T> | null;

  constructor() {
    this._size = 0;
    this.head = null;
    this.tail = null;
    this._current = null;
  }

  size(): number {
    return this._size;
  }

  isEmpty(): boolean {
    return this._size === 0;
  }

  add(value: T): void {
    const node: NodeDoubleRelation<T> = { value, next: null, prev: null };

    if (!this.head || !this.tail) {
      node.next = node;
      node.prev = node;
      this.head = node;
      this.tail = node;
      this._current = node;
    } else {
      node.next = this.head;
      node.prev = this.tail;
      this.tail.next = node;
      this.head.prev = node;
      this.tail = node;
    }

    this._size++;
  }

  remove(value: T): void {
    if (!this.head) return;

    let node: NodeDoubleRelation<T> | null = this.head;
    for (let i = 0; i < this._size; i++) {
      if (node && node.value === value) {
        this._removeNode(node);
        return;
      }
      node = node ? node.next : null;
    }
  }

  private _removeNode(node: NodeDoubleRelation<T>): void {
    if (this._size === 1) {
      this.head = null;
      this.tail = null;
      this._current = null;
    } else {
      if (node.prev) node.prev.next = node.next;
      if (node.next) node.next.prev = node.prev;
      if (node === this.head) this.head = node.next;
      if (node === this.tail) this.tail = node.prev;
      if (node === this._current) this._current = node.next;
    }
    this._size--;
  }

  current(): T | null {
    return this._current ? this._current.value : null;
  }

  next(): T | null {
    if (!this._current || !this._current.next) return null;
    this._current = this._current.next;
    return this._current.value;
  }

  prev(): T | null {
    if (!this._current || !this._current.prev) return null;
    this._current = this._current.prev;
    return this._current.value;
  }

  resetToHead(): void {
    this._current = this.head;
  }

  toArray(): T[] {
    const result: T[] = [];
    let node: NodeDoubleRelation<T> | null = this.head;
    for (let i = 0; i < this._size; i++) {
      if (!node) break;
      result.push(node.value);
      node = node.next;
    }
    return result;
  }
}
