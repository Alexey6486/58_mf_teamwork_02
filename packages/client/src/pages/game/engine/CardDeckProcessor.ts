import Queue from '../../../utils/Queue';
import { getCardDeckConfig } from './CardDeckConfig';
import { type ICard } from '../types';

export default class CardDeckProcessor {
  private cardDeck = new Queue<ICard>();
  private cardDrop = new Queue<ICard>();

  private _generateCardIndex(max: number) {
    const attemps = Math.floor(Math.random() * 10) + 1;
    let index = 0;
    for (let i = 0; i < attemps; i++) index += Math.random() * max;
    index = Math.floor(index / attemps);
    return index;
  }

  public generateCardDeck() {
    this.cardDeck = new Queue<ICard>();
    this.cardDrop = new Queue<ICard>();

    const cardsToProceed = getCardDeckConfig();
    let step = cardsToProceed.length;
    while (step > 0) {
      let cardIndex = this._generateCardIndex(step);
      while (cardIndex >= step) cardIndex--;
      this.cardDeck.queue(cardsToProceed[cardIndex]);
      cardsToProceed.splice(cardIndex, 1);
      step = cardsToProceed.length;
    }
  }

  public getNextCard() {
    const card = this.cardDeck.peek();
    if (card) this.cardDrop.queue(card);
    return card;
  }

  public getNumberOfCardDeck() {
    return this.cardDeck.size();
  }

  public getCardDeckArray() {
    return this.cardDeck.toArray();
  }

  public getNumberOfCardsDrop() {
    return this.cardDrop.size();
  }

  public getCardDropArray() {
    return this.cardDrop.toArray();
  }
}
