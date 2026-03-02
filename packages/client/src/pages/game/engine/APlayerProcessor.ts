import Queue from '../../../utils/Queue';
import { CardType, type ICard } from '../types';
import { BONUS_SCORE_VALUE } from '../../../constants/game';

export default abstract class APlayerProcessor {
  protected playerName: string;
  protected inGame: boolean;
  protected roundCards: Queue<ICard>;
  protected roundScore: number;
  protected totalScore: number;
  protected roundScoreFailure: boolean;
  protected roundScoreSuccess: boolean;

  constructor(playerName: string) {
    this.playerName = playerName;
    this.inGame = false;
    this.roundCards = new Queue<ICard>();
    this.roundScore = 0;
    this.totalScore = 0;
    this.roundScoreFailure = false;
    this.roundScoreSuccess = false;
  }

  public newRoundInit() {
    this.inGame = true;
    this.roundCards = new Queue<ICard>();
    this.roundScore = 0;
    this.roundScoreFailure = false;
  }

  public invalidateRoundResults() {
    this.roundScoreFailure = true;
  }

  public roundSuccessed() {
    this.roundScoreSuccess = true;
  }

  private _countScores() {
    let score = 0;
    if (!this.roundScoreFailure) {
      this.roundCards.toArray().forEach(card => {
        if (card.type == CardType.SIMPLE) score += card.value as number;
      });
      if (this.roundScoreSuccess) score += BONUS_SCORE_VALUE;
    }
    this.roundScore = score;
    return score;
  }

  public commitRoundScore() {
    if (!this.roundScoreFailure) {
      this._countScores();
      this.totalScore += this.roundScore;
    }
  }

  public finishRound() {
    this.commitRoundScore();
    this.newRoundInit();
  }

  public requestFinishRound() {
    this.inGame = false;
    this._countScores();
  }

  public requestNewCard(card: ICard): void {
    this.roundCards.queue(card);
    this._countScores();
  }

  public getName(): string {
    return this.playerName;
  }

  public isInGame(): boolean {
    return this.inGame;
  }

  public getCards() {
    return this.roundCards.toArray();
  }

  public getRoundScore() {
    return this.roundScore;
  }

  public getTotalScore() {
    return this.totalScore;
  }

  public getSimpleCardsNumber() {
    return this.roundCards
      .toArray()
      .filter(card => card.type == CardType.SIMPLE).length;
  }

  public abstract wantsToPlay(cardDeck: ICard[], cardDrop: ICard[]): boolean;
}
