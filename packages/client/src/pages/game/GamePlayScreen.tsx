import {
  type FC,
  type MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import GameProcessor from './engine/GameProcessor';
import CardDeckProcessor from './engine/CardDeckProcessor';
import {
  CardType,
  type GameConfig,
  type GameResult,
  type PlayerData,
} from './types';
import ComputerPlayerProcessor from './engine/ComputerPlayerProcessor';
import {
  FORM_PAGE_CONTAINER_CLASS,
  GAME_CANVAS_CONTAINER_CLASS,
  GAME_MAIN_CONTAINER_CLASS,
} from '../../constants/style-groups';
import CanvasProcessor, { type Rect } from './engine/CanvasProcessor';
import { GAME_HEIGHT, GAME_WIDTH } from '../../constants/game';

interface GamePlayScreenProps {
  config: GameConfig;
  onFinish: (result: GameResult) => void;
}

export const GamePlayScreen: FC<GamePlayScreenProps> = ({
  config,
  onFinish,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasProcessorRef = useRef<CanvasProcessor | null>(null);
  const buttonsRef = useRef<{ draw: Rect; end: Rect; confirm: Rect }>({
    draw: { x: 0, y: 0, w: 0, h: 0 },
    end: { x: 0, y: 0, w: 0, h: 0 },
    confirm: { x: -1, y: -1, w: 0, h: 0 },
  });

  const [gameProcessor] = useState(() => {
    const gp = new GameProcessor(config);
    gp.getNextRound();
    return gp;
  });

  const [cardDeckProcessor] = useState(() => {
    const cdp = new CardDeckProcessor();
    cdp.generateCardDeck();
    return cdp;
  });

  const [tick, setTick] = useState(0);
  const forceUpdate = useCallback(() => setTick(t => t + 1), []);

  const [roundEnded, setRoundEnded] = useState(false);
  const discardCountRef = useRef(0);

  const advanceTurn = useCallback(() => {
    const next = gameProcessor.getNextInRoundPlayer();
    if (next === null) {
      gameProcessor.commitRoundScores();
      setRoundEnded(true);

      if (gameProcessor.hasWinner()) {
        const winner = gameProcessor.getWinner();
        onFinish({
          winnerName: winner!.getName(),
          players: gameProcessor
            .getPlayers()
            .map(p => ({ name: p.getName(), totalScore: p.getTotalScore() }))
            .sort((a, b) => b.totalScore - a.totalScore),
        });
        return;
      }
    } else {
      if (next instanceof ComputerPlayerProcessor) {
        if (
          next.wantsToPlay(
            cardDeckProcessor.getCardDeckArray(),
            cardDeckProcessor.getCardDropArray()
          )
        ) {
          let card = cardDeckProcessor.getNextCard();
          if (!card) {
            cardDeckProcessor.generateCardDeck();
            card = cardDeckProcessor.getNextCard();
          }
          if (card) gameProcessor.requestCard(card);
        } else gameProcessor.requestFinishRound();

        advanceTurn();
        forceUpdate();
      }
    }
  }, [gameProcessor, setRoundEnded, onFinish]);

  const draw = useCallback(() => {
    if (!canvasRef.current) return;
    if (!canvasProcessorRef.current) {
      canvasProcessorRef.current = new CanvasProcessor(canvasRef.current);
    }
    const canvasProcessor = canvasProcessorRef.current;

    const W = canvasProcessor.getCanvasWidth();
    const H = canvasProcessor.getCanvasHeight();

    const currentPlayer = gameProcessor.getCurrentPlayer();
    const players: PlayerData[] = gameProcessor.getPlayers().map(player => ({
      name: player.getName(),
      totalScore: player.getTotalScore(),
      roundScore: player.getRoundScore(),
      cards: player
        .getCards()
        .filter(c => c.type === CardType.SIMPLE)
        .map(c => c.value as number),
      isCurrent: player === currentPlayer,
      isInGame: player.isInGame(),
    }));

    const deckCount = cardDeckProcessor.getNumberOfCardDeck();
    const discardCount = discardCountRef.current;
    const roundNumber = gameProcessor.getRoundNumber();
    const currentPlayerName = gameProcessor.getCurrentPlayer()?.getName() ?? '';

    canvasProcessor.render(
      W,
      H,
      players,
      deckCount,
      discardCount,
      roundEnded,
      roundNumber,
      currentPlayerName,
      buttonsRef.current
    );
  }, [gameProcessor, cardDeckProcessor, roundEnded]);

  useEffect(() => {
    draw();
  }, [draw, tick]);

  const handleCanvasClick = useCallback(
    (e: MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;

      // Начать новый раунд
      if (roundEnded) {
        const confirmBtn = buttonsRef.current.confirm;
        if (
          x >= confirmBtn.x &&
          x <= confirmBtn.x + confirmBtn.w &&
          y >= confirmBtn.y &&
          y <= confirmBtn.y + confirmBtn.h
        ) {
          discardCountRef.current = cardDeckProcessor.getNumberOfCardsDrop();
          gameProcessor.getNextRound();
          setRoundEnded(false);
        }
        return;
      }

      const drawBtn = buttonsRef.current.draw;
      const endBtn = buttonsRef.current.end;

      // Взять карту
      if (
        x >= drawBtn.x &&
        x <= drawBtn.x + drawBtn.w &&
        y >= drawBtn.y &&
        y <= drawBtn.y + drawBtn.h
      ) {
        let card = cardDeckProcessor.getNextCard();
        if (!card) {
          cardDeckProcessor.generateCardDeck();
          card = cardDeckProcessor.getNextCard();
        }
        if (card) {
          gameProcessor.requestCard(card);
          advanceTurn();
          forceUpdate();
        }
      }

      // Закончить раунд
      if (
        x >= endBtn.x &&
        x <= endBtn.x + endBtn.w &&
        y >= endBtn.y &&
        y <= endBtn.y + endBtn.h
      ) {
        gameProcessor.requestFinishRound();
        advanceTurn();
        forceUpdate();
      }
    },
    [
      gameProcessor,
      cardDeckProcessor,
      advanceTurn,
      forceUpdate,
      roundEnded,
      setRoundEnded,
    ]
  );

  return (
    <div className={FORM_PAGE_CONTAINER_CLASS}>
      <div className={GAME_MAIN_CONTAINER_CLASS}>
        <div className={GAME_CANVAS_CONTAINER_CLASS}>
          <canvas
            ref={canvasRef}
            width={GAME_WIDTH}
            height={GAME_HEIGHT}
            onClick={handleCanvasClick}
          />
        </div>
      </div>
    </div>
  );
};
