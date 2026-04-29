// ─── Константы цветов ───────────────────────────────────────────────────
import { type PlayerData } from '../types';

const BLUE = '#3B82F6';
const BLUE_DARK = '#2563EB';
const RED = '#EF4444';
const RED_DARK = '#DC2626';
const BG = '#1E293B';
const CARD_BG = '#334155';
const TEXT = '#F8FAFC';
const TEXT_MUTED = '#94A3B8';
const BTN_GREEN = '#22C55E';
const BTN_AMBER = '#F59E0B';
const CURRENT_BG = 'rgba(34,197,94,0.2)';
const SHADOW = 'rgba(0,0,0,0.4)';
const WHITE_10 = 'rgba(255,255,255,0.1)';
const WHITE_20 = 'rgba(255,255,255,0.2)';
const FINISHED_BG = 'rgba(239,68,68,0.1)';
const PANEL_BG = 'rgba(51,65,85,0.6)';
const PANEL_BG_DIM = 'rgba(51,65,85,0.4)';
const OVERLAY = 'rgba(15,23,42,1)';

const COUNT_CARDS = 12;

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export default class CanvasProcessor {
  private ctx: CanvasRenderingContext2D;
  private canvasWidth: number;
  private canvasHeight: number;
  private cardImages: {
    back: HTMLImageElement | null;
    cards: HTMLImageElement[];
  } = {
    back: null,
    cards: [],
  };

  constructor(canvas: HTMLCanvasElement | null) {
    if (!canvas) throw new Error('Canvas must be defined');

    const ctx2d = canvas?.getContext('2d');
    if (!ctx2d) throw new Error('Can not get canvas context');
    this.ctx = ctx2d;

    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;

    const cards = [
      'back',
      ...Array.from({ length: COUNT_CARDS }, (_, i) => i + 1),
    ];

    cards.forEach((name, index) => {
      const img = new Image();

      img.onload = () => {
        if (index === 0) {
          this.cardImages.back = img;
        } else {
          this.cardImages.cards[index - 1] = img;
        }
      };
      img.onerror = () => {
        console.log('Failed to load image');
      };
      img.src = `/images/cards/${name}.svg`;
    });
  }

  getCanvasWidth() {
    return this.canvasWidth;
  }

  getCanvasHeight() {
    return this.canvasHeight;
  }

  // ======= Рисование элементов =======

  roundRect(x: number, y: number, w: number, h: number, r: number) {
    this.ctx.beginPath();
    this.ctx.moveTo(x + r, y);
    this.ctx.lineTo(x + w - r, y);
    this.ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    this.ctx.lineTo(x + w, y + h - r);
    this.ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    this.ctx.lineTo(x + r, y + h);
    this.ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    this.ctx.lineTo(x, y + r);
    this.ctx.quadraticCurveTo(x, y, x + r, y);
    this.ctx.closePath();
  }

  drawCard(
    x: number,
    y: number,
    w: number,
    h: number,
    color: string,
    label?: string
  ) {
    this.ctx.save();
    this.ctx.shadowColor = SHADOW;
    this.ctx.shadowBlur = 4;
    this.ctx.shadowOffsetX = 2;
    this.ctx.shadowOffsetY = 2;

    this.roundRect(x, y, w, h, 6);
    this.ctx.fillStyle = color;
    this.ctx.fill();
    this.ctx.restore();

    this.roundRect(x, y, w, h, 6);
    this.ctx.strokeStyle = WHITE_20;
    this.ctx.lineWidth = 1;
    this.ctx.stroke();

    if (label) {
      this.ctx.fillStyle = TEXT;
      this.ctx.font = `bold ${Math.max(10, Math.floor(h * 0.3))}px sans-serif`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(label, x + w / 2, y + h / 2);
    }
  }

  drawImageCard(x: number, y: number, w: number, h: number, value: number) {
    // const img = this.cardImages[value];
    let img: HTMLImageElement | null = null;
    const isBack = value === 0;
    if (isBack) {
      img = this.cardImages.back;
    } else {
      img = this.cardImages.cards[value - 1];
    }

    if (img?.complete && img.naturalHeight !== 0) {
      this.ctx.save();
      this.ctx.shadowColor = SHADOW;
      this.ctx.shadowBlur = 4;
      this.ctx.shadowOffsetX = 2;
      this.ctx.shadowOffsetY = 2;
      this.ctx.drawImage(img, x, y, w, h);
      this.ctx.restore();
    } else {
      this.drawCard(
        x,
        y,
        w,
        h,
        !isBack ? CARD_BG : BLUE,
        `${!isBack ? value : ''}`
      );
    }
  }

  drawDeck(
    cx: number,
    cy: number,
    cardW: number,
    cardH: number,
    color: string,
    colorDark: string,
    count?: number
  ) {
    const offsetX = 1.2;
    const offsetY = 1.2;
    const stackCards =
      count !== undefined ? Math.min(9, Math.floor(count / 10)) : 9;

    if (count === 0) {
      this.roundRect(cx - cardW / 2, cy - cardH / 2, cardW, cardH, 6);
      this.ctx.strokeStyle = WHITE_10;
      this.ctx.lineWidth = 1.5;
      this.ctx.setLineDash([6, 4]);
      this.ctx.stroke();
      this.ctx.setLineDash([]);

      this.ctx.fillStyle = TEXT_MUTED;
      this.ctx.font = 'bold 14px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'top';
      this.ctx.fillText('0 карт', cx, cy + cardH / 2 + 8);
      return;
    }

    for (let i = 0; i < stackCards; i++) {
      const sx = cx - cardW / 2 + i * offsetX;
      const sy = cy - cardH / 2 - (stackCards - i) * offsetY;
      this.drawCard(sx, sy, cardW, cardH, colorDark);
    }

    const tx = cx - cardW / 2 + stackCards * offsetX;
    const ty = cy - cardH / 2;
    this.drawImageCard(tx, ty, cardW, cardH, 0);

    if (count !== undefined) {
      this.ctx.fillStyle = TEXT_MUTED;
      this.ctx.font = 'bold 14px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'top';
      this.ctx.fillText(
        `${count} карт`,
        cx + (stackCards * offsetX) / 2,
        cy + cardH / 2 + 8
      );
    }
  }

  drawButton(
    x: number,
    y: number,
    w: number,
    h: number,
    label: string,
    color: string
  ) {
    this.roundRect(x, y, w, h, 8);
    this.ctx.fillStyle = color;
    this.ctx.fill();

    this.roundRect(x, y, w, h, 8);
    this.ctx.strokeStyle = WHITE_20;
    this.ctx.lineWidth = 1;
    this.ctx.stroke();

    this.ctx.fillStyle = TEXT;
    this.ctx.font = `bold ${Math.max(11, Math.floor(h * 0.35))}px sans-serif`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(label, x + w / 2, y + h / 2);
  }

  drawPlayerWorkspace(
    x: number,
    y: number,
    w: number,
    h: number,
    name: string,
    totalScore: number,
    roundScore: number,
    cards: number[],
    isCurrent: boolean,
    isFinished: boolean
  ) {
    const bgColor = isCurrent
      ? CURRENT_BG
      : isFinished
      ? FINISHED_BG
      : PANEL_BG;
    const borderColor = isCurrent ? BTN_GREEN : isFinished ? RED : WHITE_10;
    const lineW = isCurrent || isFinished ? 2 : 1;

    this.roundRect(x, y, w, h, 8);
    this.ctx.fillStyle = bgColor;
    this.ctx.fill();

    this.roundRect(x, y, w, h, 8);
    this.ctx.strokeStyle = borderColor;
    this.ctx.lineWidth = lineW;
    this.ctx.stroke();

    const pad = 6;
    const headerH = 20;
    const headerY = y + pad + headerH / 2;

    this.ctx.textBaseline = 'middle';

    this.ctx.fillStyle = TEXT;
    this.ctx.font = 'bold 13px sans-serif';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(name, x + pad, headerY);

    this.ctx.fillStyle = BLUE;
    this.ctx.font = '12px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(`Раунд: ${roundScore}`, x + w / 2, headerY);

    this.ctx.fillStyle = TEXT_MUTED;
    this.ctx.font = '12px sans-serif';
    this.ctx.textAlign = 'right';
    this.ctx.fillText(`Всего: ${totalScore}`, x + w - pad, headerY);

    const cardAreaTop = y + pad + headerH + pad;
    const cardAreaH = h - pad - headerH - pad * 2;
    const availW = w - 2 * pad;
    const cardGap = 4;

    if (cardAreaH > 8) {
      const maxCardWByWidth = Math.floor((availW - cardGap * 6) / 7);
      const cardH = Math.min(
        Math.floor(maxCardWByWidth * 1.5),
        Math.floor(cardAreaH)
      );
      const cardW = Math.floor(cardH / 1.5);

      const totalCardW = 7 * cardW + 6 * cardGap;
      const cardsStartX = x + pad + Math.floor((availW - totalCardW) / 2);
      const cardsStartY = cardAreaTop + Math.floor((cardAreaH - cardH) / 2);

      for (let i = 0; i < 7; i++) {
        const cx = cardsStartX + i * (cardW + cardGap);
        if (i < cards.length) {
          this.drawImageCard(cx, cardsStartY, cardW, cardH, cards[i]);
        } else {
          this.roundRect(cx, cardsStartY, cardW, cardH, 4);
          this.ctx.strokeStyle = WHITE_10;
          this.ctx.lineWidth = 1;
          this.ctx.setLineDash([3, 3]);
          this.ctx.stroke();
          this.ctx.setLineDash([]);
        }
      }
    }
  }

  // ======= Основной рендер =======

  render(
    W: number,
    H: number,
    players: PlayerData[],
    deckCount: number,
    discardCount: number,
    roundEnded: boolean,
    roundNumber: number,
    currentPlayerName: string,
    buttons: { draw: Rect; end: Rect; confirm: Rect }
  ) {
    this.ctx.fillStyle = BG;
    this.ctx.fillRect(0, 0, W, H);

    this.ctx.save();
    this.ctx.translate(0, H);
    this.ctx.rotate(Math.PI / 4);
    this.ctx.font = 'bold 90px sans-serif';
    this.ctx.fillStyle = 'rgba(59,130,246,0.06)';
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'bottom';

    for (let offsetY = 0; offsetY < H; offsetY += 80) {
      this.ctx.save();
      this.ctx.translate(-offsetY * 3, H * 0.7);
      this.ctx.rotate(-Math.PI / 3);

      for (let x = 0; x < W * 1.7; x += 300) {
        this.ctx.fillText('Flip 7', x, 0);
      }
      this.ctx.restore();
    }
    this.ctx.restore();

    const panelH = 160;
    const panelY = H - panelH;
    const titleY = 36;

    // ========== 0. Рабочие столы всех игроков ==========
    const SIDE_PAD = 20;
    const CENTER_PAD = 80;

    const workAreaTop = titleY + 28;
    const workAreaBottom = panelY - 60;
    const workAreaH = workAreaBottom - workAreaTop;
    const workZoneW = W / 2 - SIDE_PAD - CENTER_PAD;

    const leftCount = Math.ceil(players.length / 2);
    const rightCount = players.length - leftCount;
    const maxPerSide = leftCount;
    const workPanelGap = 6;

    const oppH = Math.min(
      180,
      Math.floor((workAreaH - workPanelGap * (maxPerSide - 1)) / maxPerSide)
    );

    // Левая колонка
    const totalLeftH =
      leftCount * oppH + Math.max(0, leftCount - 1) * workPanelGap;
    const leftStartY = workAreaTop + Math.floor((workAreaH - totalLeftH) / 2);
    for (let i = 0; i < leftCount; i++) {
      const oy = leftStartY + i * (oppH + workPanelGap);
      const p = players[i];
      this.drawPlayerWorkspace(
        SIDE_PAD,
        oy,
        workZoneW,
        oppH,
        p.name,
        p.totalScore,
        p.roundScore,
        p.cards,
        roundEnded ? false : p.isCurrent,
        roundEnded ? false : !p.isInGame
      );
    }

    // Правая колонка
    if (rightCount > 0) {
      const totalRightH =
        rightCount * oppH + Math.max(0, rightCount - 1) * workPanelGap;
      const rightStartY =
        workAreaTop + Math.floor((workAreaH - totalRightH) / 2);
      for (let i = 0; i < rightCount; i++) {
        const oy = rightStartY + i * (oppH + workPanelGap);
        const p = players[leftCount + i];
        this.drawPlayerWorkspace(
          W / 2 + CENTER_PAD,
          oy,
          workZoneW,
          oppH,
          p.name,
          p.totalScore,
          p.roundScore,
          p.cards,
          roundEnded ? false : p.isCurrent,
          roundEnded ? false : !p.isInGame
        );
      }
    }

    // ========== Заголовок ==========
    this.ctx.fillStyle = BLUE;
    this.ctx.font = 'bold 36px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('Flip 7', W / 2, titleY);

    // ========== Колода по центру ==========
    this.drawDeck(W / 2, H / 2 - 80, 80, 120, BLUE, BLUE_DARK, deckCount);

    // ========== Раунд и активный игрок ==========
    const infoY = H - 200;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillStyle = TEXT_MUTED;
    this.ctx.font = '13px sans-serif';
    this.ctx.fillText(`Раунд №${roundNumber}`, W / 2, infoY);
    this.ctx.fillStyle = TEXT;
    this.ctx.font = 'bold 14px sans-serif';
    this.ctx.fillText(`Играет: ${currentPlayerName}`, W / 2, infoY + 22);

    // ========== Нижняя панель и Диалог конца раунда ==========
    if (roundEnded) {
      this.ctx.fillStyle = OVERLAY;
      this.ctx.fillRect(0, panelY, W, panelH);

      const dlgW = 580;
      const dlgH = 120;
      const dlgX = (W - dlgW) / 2;
      const dlgY = panelY + (panelH - dlgH) / 2;

      this.roundRect(dlgX, dlgY, dlgW, dlgH, 12);
      this.ctx.fillStyle = BG;
      this.ctx.fill();

      this.roundRect(dlgX, dlgY, dlgW, dlgH, 12);
      this.ctx.strokeStyle = BLUE;
      this.ctx.lineWidth = 2;
      this.ctx.stroke();

      this.ctx.fillStyle = TEXT;
      this.ctx.font = 'bold 18px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(
        'Раунд завершён, начать следующий раунд?',
        W / 2,
        dlgY + 38
      );

      const btnW = 120;
      const btnH = 40;
      const btnX = (W - btnW) / 2;
      const btnY = dlgY + dlgH - btnH - 12;

      buttons.confirm = { x: btnX, y: btnY, w: btnW, h: btnH };
      buttons.draw = { x: -1, y: -1, w: 0, h: 0 };
      buttons.end = { x: -1, y: -1, w: 0, h: 0 };

      this.drawButton(btnX, btnY, btnW, btnH, 'Да', BTN_GREEN);
      return;
    }

    const currentPlayer = players.find(p => p.isCurrent);
    const roundCards = currentPlayer?.cards ?? [];

    const playerW = W * 0.85;
    const discardW = W * 0.15;

    this.ctx.fillStyle = PANEL_BG;
    this.ctx.fillRect(0, panelY, playerW, panelH);

    this.ctx.strokeStyle = WHITE_10;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(playerW, panelY);
    this.ctx.lineTo(playerW, H);
    this.ctx.stroke();

    this.ctx.fillStyle = PANEL_BG_DIM;
    this.ctx.fillRect(playerW, panelY, discardW, panelH);

    // ========== Очки раунда активного игрока ==========
    const scoreBlockX = 15;
    const scoreBlockY = panelY + 20;

    this.ctx.fillStyle = TEXT_MUTED;
    this.ctx.font = '13px sans-serif';
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'top';
    this.ctx.fillText('Всего очков', scoreBlockX, scoreBlockY);

    this.ctx.fillStyle = TEXT;
    this.ctx.font = 'bold 28px sans-serif';
    this.ctx.fillText(
      `${currentPlayer?.totalScore ?? 0}`,
      scoreBlockX,
      scoreBlockY + 18
    );

    this.ctx.fillStyle = TEXT_MUTED;
    this.ctx.font = '13px sans-serif';
    this.ctx.fillText('Очки раунда', scoreBlockX, scoreBlockY + 58);

    this.ctx.fillStyle = BLUE;
    this.ctx.font = 'bold 24px sans-serif';
    this.ctx.fillText(
      `${currentPlayer?.roundScore ?? 0}`,
      scoreBlockX,
      scoreBlockY + 76
    );

    // ========== Отрисовка карт раунда ==========
    const cardsAreaX = 120;
    const cardsAreaW = playerW - cardsAreaX - 190;
    const cardW = 60;
    const cardH = 90;
    const maxCards = 7;
    const gap = Math.min(12, (cardsAreaW - maxCards * cardW) / (maxCards - 1));
    const totalCardsW = maxCards * cardW + (maxCards - 1) * gap;
    const cardsStartX = cardsAreaX + (cardsAreaW - totalCardsW) / 2;
    const cardsY = panelY + (panelH - cardH) / 2;

    this.ctx.fillStyle = TEXT_MUTED;
    this.ctx.font = '12px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'top';
    this.ctx.fillText(
      `Карты раунда (${roundCards.length}/${maxCards})`,
      cardsAreaX + cardsAreaW / 2,
      panelY + 8
    );

    roundCards.forEach((val, i) => {
      const cx = cardsStartX + i * (cardW + gap);
      this.drawImageCard(cx, cardsY, cardW, cardH, val);
    });

    for (let i = roundCards.length; i < maxCards; i++) {
      const cx = cardsStartX + i * (cardW + gap);
      this.roundRect(cx, cardsY, cardW, cardH, 6);
      this.ctx.strokeStyle = WHITE_10;
      this.ctx.lineWidth = 1;
      this.ctx.setLineDash([4, 4]);
      this.ctx.stroke();
      this.ctx.setLineDash([]);
    }

    // ========== Отрисовка кнопок действий ==========
    const btnW = 140;
    const btnH = 44;
    const btnX = playerW - btnW - 15;
    const btnDrawY = panelY + panelH / 2 - btnH - 8;
    const btnEndY = panelY + panelH / 2 + 8;

    buttons.draw = { x: btnX, y: btnDrawY, w: btnW, h: btnH };
    buttons.end = { x: btnX, y: btnEndY, w: btnW, h: btnH };

    this.drawButton(btnX, btnDrawY, btnW, btnH, 'Взять карту', BTN_GREEN);
    this.drawButton(btnX, btnEndY, btnW, btnH, 'Закончить раунд', BTN_AMBER);

    // ========== Отрисовка сброшенной колоды карт ==========
    const discardCx = playerW + discardW / 2;
    const discardCy = panelY + panelH / 2;
    const dCardW = Math.round(46 * 0.8 * 0.8);
    const dCardH = Math.round(66 * 0.8 * 0.9);

    this.drawDeck(
      discardCx,
      discardCy,
      dCardW,
      dCardH,
      RED,
      RED_DARK,
      discardCount
    );

    this.ctx.fillStyle = TEXT_MUTED;
    this.ctx.font = '12px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'top';
    this.ctx.fillText('Сброс', discardCx, panelY + 8);
  }
}
