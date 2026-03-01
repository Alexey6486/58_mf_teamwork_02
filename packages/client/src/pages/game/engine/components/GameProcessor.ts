import LinkedList from '../../../../utils/LinkedList';
import type APlayerProcessor from './APlayerProcessor';
import HumanPlayerProcessor from './HumanPlayerProcessor';
import ComputerPlayerProcessor from './ComputerPlayerProcessor';
import { CardType, type GameConfig, type ICard, PlayerType } from '../../types';

export default class GameProcessor {
  private players;
  private playerCount;
  private roundNumber;
  private winner: APlayerProcessor | null;

  constructor(config: GameConfig) {
    if (config.playerCount < 2)
      throw new Error(
        'Invalid player count, player count must be greater or equals than 2'
      );

    this.playerCount = config.playerCount;
    this.players = new LinkedList<APlayerProcessor>();
    this.roundNumber = 0;
    this.winner = null;

    for (const player of config.players) {
      if (player.type === PlayerType.Human) {
        this.players.add(new HumanPlayerProcessor(player.name));
      } else if (player.type === PlayerType.Computer) {
        this.players.add(
          new ComputerPlayerProcessor(player.name, player.difficulty)
        );
      } else throw new Error(`Unknown player type ${player.type}`);
    }
  }

  getCurrentPlayer() {
    return this.players.current();
  }

  getPlayers() {
    return this.players.toArray();
  }

  getRoundNumber() {
    return this.roundNumber;
  }

  commitRoundScores() {
    this.players
      .toArray()
      .forEach((player: APlayerProcessor) => player.commitRoundScore());
  }

  getNextRound() {
    this.players
      .toArray()
      .forEach((player: APlayerProcessor) => player.newRoundInit());
    this.players.resetToHead();
    this.roundNumber++;
  }

  getNextInRoundPlayer() {
    let counter = 0;
    this.players.next();
    while (counter < this.playerCount) {
      const current = this.players.current();
      if (current?.isInGame()) return current;
      this.players.next();
      counter++;
    }
    return null;
  }

  _cardAlreadyExists(card: ICard) {
    if (card.type === CardType.SIMPLE) {
      return (
        // @ts-ignore
        this.players
          .current()
          .getCards()
          .filter(myCard => card.value === myCard.value).length > 0
      );
    }
    return false;
  }

  requestCard(card: ICard) {
    if (this.players.current() != null) {
      const isDuplicate = this._cardAlreadyExists(card);
      this.players.current()?.requestNewCard(card);

      if (isDuplicate) {
        this.players.current()?.invalidateRoundResults();
        this.players.current()?.requestFinishRound();
      } else {
        // @ts-ignore
        if (this.players.current()?.getSimpleCardsNumber() > 7) {
          this.players.current()?.roundSuccessed();
          this.players.current()?.requestFinishRound();
        }

        if (
          // @ts-ignore
          this.players.current().getRoundScore() +
            // @ts-ignore
            this.players.current().getTotalScore() >=
          20
        ) {
          this.commitRoundScores();
          this.winner = this.players.current();
        }
      }
    }
  }

  requestFinishRound() {
    this.players.current()?.requestFinishRound();
  }

  getWinner() {
    return this.winner;
  }

  hasWinner() {
    return this.winner !== null;
  }
}
