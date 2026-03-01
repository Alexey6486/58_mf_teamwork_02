import { type FC } from 'react';
import { type GameResult } from './types';
import {
  FORM_CONTAINER_CLASS,
  FORM_PAGE_CONTAINER_CLASS,
  FORM_TITLE_CLASS,
  TITLE_CLASS,
} from '../../constants/style-groups';

interface GameFinishScreenProps {
  result: GameResult;
}

export const GameFinishScreen: FC<GameFinishScreenProps> = ({ result }) => {
  return (
    <div className={FORM_PAGE_CONTAINER_CLASS}>
      <div className={FORM_CONTAINER_CLASS}>
        <span className={FORM_TITLE_CLASS}>
          Победитель: <b>{result.winnerName}</b>
        </span>
        <ul>
          {result.players.map((p, i) => (
            <li
              key={p.name}
              className={'mb-2 text-main-black dark:text-main-white'}>
              {i + 1}. {p.name} — {p.totalScore} очков
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
