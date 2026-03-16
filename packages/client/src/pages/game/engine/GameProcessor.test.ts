import GameProcessor from './GameProcessor';
import {
  ComputerPlayerDifficulty,
  type GameConfig,
  PlayerType
} from '../types';

describe('Jest GameProcessor', () => {
  let processor: GameProcessor;

  beforeEach(() => {
    const human = {
      name: 'John',
      type: PlayerType.Human,
    };

    const computer = {
      name: 'Mary',
      type: PlayerType.Computer,
      difficulty: ComputerPlayerDifficulty.EASY,
    };

    const DEFAULT_GAME_CONFIG: GameConfig = {
      players: [human, computer],
      playerCount: 2,
    };

    processor = new GameProcessor(DEFAULT_GAME_CONFIG);
  });

  describe('Game processor config', () => {
    test('players list length', () => {
      expect(processor.getPlayerCount()).toBeGreaterThan(0);
    });

    test('players count', () => {
      expect(processor.getPlayers().length).toBeGreaterThan(0);
    });
  });
});
