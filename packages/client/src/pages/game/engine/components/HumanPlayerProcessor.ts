import { type ICard } from '../../types';
import APlayerProcessor from './APlayerProcessor';

export default class HumanPlayerProcessor extends APlayerProcessor {
  public wantsToPlay(cardDeck: ICard[], cardDrop: ICard[]): boolean {
    return true;
  }
}
