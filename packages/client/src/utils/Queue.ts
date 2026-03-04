import { type NodeSingleRelation } from '../types/node';

export default class Queue<T> {
  private _size: number;
  private head: NodeSingleRelation<T> | null;
  private tail: NodeSingleRelation<T> | null;

  constructor() {
    this._size = 0;
    this.head = null;
    this.tail = null;
  }

  size(): number {
    return this._size;
  }

  isEmpty(): boolean {
    return this._size === 0;
  }

  toArray(): T[] {
    const arr: T[] = [];
    let node = this.head;
    while (node) {
      arr.push(node.value);
      node = node.next;
    }
    return arr;
  }

  queue(value: T): void {
    const node: NodeSingleRelation<T> = { value, next: null };

    if (this.tail) {
      this.tail.next = node;
    } else {
      this.head = node;
    }

    this.tail = node;
    this._size++;
  }

  peek(): T | null {
    if (!this.head) {
      return null;
    }

    const value = this.head.value;
    this.head = this.head.next;

    if (!this.head) {
      this.tail = null;
    }

    this._size--;
    return value;
  }
}
