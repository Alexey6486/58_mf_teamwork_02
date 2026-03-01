import { CardType, type ICard } from '../../types';

export const getCardDeckConfig = () => {
  const cards: ICard[] = [];

  for (let i = 1; i < 13; i++) {
    for (let j = 0; j < i; j++) {
      cards.push({ value: i, type: CardType.SIMPLE });
    }
  }
  console.log(cards);

  return cards;
};
