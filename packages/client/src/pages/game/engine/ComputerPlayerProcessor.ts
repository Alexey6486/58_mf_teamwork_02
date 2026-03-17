import APlayerProcessor from './APlayerProcessor';
import { CardType, ComputerPlayerDifficulty, type ICard } from '../types';

export default class ComputerPlayerProcessor extends APlayerProcessor {
  private difficulty: ComputerPlayerDifficulty;

  constructor(
    playerName: string,
    difficulty: ComputerPlayerDifficulty = ComputerPlayerDifficulty.NORMAL
  ) {
    super(playerName);
    this.difficulty = difficulty;
  }

  public wantsToPlay(cardDeck: ICard[], cardDrop: ICard[]): boolean {
    const cardSize = this.roundCards.size();
    if (cardSize < 3) return true;

    const random = Math.random();
    if (this.difficulty === ComputerPlayerDifficulty.EASY) {
      return random > 0.06 * cardSize || random < 1 - 0.06 * cardSize;
    } else if (this.difficulty === ComputerPlayerDifficulty.NORMAL) {
      let chance = 1;
      this.roundCards.toArray().forEach(card => {
        if (card.type !== CardType.SIMPLE) {
          const cardValue = card.value as number;
          if (cardValue > 3 && cardValue < 6)
            chance *= 1 - (cardValue * 3) / 100;
          else if (cardValue >= 6 && cardValue < 10)
            chance *= 1 - (cardValue * 4) / 100;
          else chance *= 1 - (cardValue * 7) / 100;
        }
      });
      const randomChance = random * chance;
      return randomChance > 0.3 || randomChance < 0.7;
    } else {
      const alivedCardsNumber = cardDeck.length;
      const alivedCards = this.countAlivedCards(cardDeck, cardDrop);
      let dangerousCardsNumber = 0;

      this.roundCards.toArray().forEach(card => {
        if (card.type !== CardType.SIMPLE) {
          const cardValue = card.value as number;
          dangerousCardsNumber += alivedCards[cardValue];
        }
      });
      const chance = 1 - dangerousCardsNumber / alivedCardsNumber;
      return random < chance;
    }

    if (super.getCards().length > 4) {
      const random = Math.random();
      return (random >= 0.2 && random <= 0.4) || random > 0.7;
    }
    return true;
  }

  private countAlivedCards(cardDeck: ICard[], cardDrop: ICard[]) {
    const arr = [];
    for (let i = 1; i <= 12; i++) {
      arr[i] = 0;
    }
    for (const card of cardDeck) {
      if (card.type === CardType.SIMPLE) {
        const val = card.value as number;
        arr[val]++;
      }
    }
    return arr;
  }
}
