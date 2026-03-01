import APlayerProcessor from './APlayerProcessor';
import { ComputerPlayerDifficulty, type ICard } from '../../types';

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
    if (super.getCards().length > 4) {
      const random = Math.random();
      return (random >= 0.2 && random <= 0.4) || random > 0.7;
    }
    return true;
  }
}
