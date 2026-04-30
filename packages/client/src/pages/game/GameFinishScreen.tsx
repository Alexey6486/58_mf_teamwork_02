import React, { type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { type GameResult } from './types';
import {
  BTN_GROUP_CLASS,
  CARD_BORDER_CLASS,
  FORM_CONTAINER_CLASS,
  FORM_PAGE_CONTAINER_CLASS,
  FORM_TITLE_CLASS,
} from '../../constants/style-groups';
import { Button } from '../../components/Button';
import { useDispatch, useSelector } from '../../store/store';
import { selectUser, selectUserRating } from '../../slices/user-slice';
import { updateLeaderboardScore } from '../../slices/leaderboard-slice';
import { ROUTES } from '../../routes';
import { Logo } from '../../components/Logo/Logo';

interface GameFinishScreenProps {
  result: GameResult;
  onRestart: () => void;
}

export const GameFinishScreen: FC<GameFinishScreenProps> = ({
  result,
  onRestart,
}) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  if (user && result.winnerName === user?.login) {
    const userRating = useSelector(selectUserRating);
    const newScore = userRating + result.pointGame;

    const handleRecordRating = () => {
      dispatch(
        updateLeaderboardScore({
          data: {
            id: user.id ?? '',
            name: result.winnerName,
            flip7_rating: newScore,
          },
        })
      );
    };

    handleRecordRating();
  }

  return (
    <div className={FORM_PAGE_CONTAINER_CLASS}>
      <div className={FORM_CONTAINER_CLASS}>
        <span className={CARD_BORDER_CLASS} />
        <Logo
          text="РЕЗУЛЬТАТЫ"
          textSize="text-3xl"
          bgColor="bg-f7-light-green"
        />
        <span className={FORM_TITLE_CLASS}>
          Победитель:&nbsp;<b>{result.winnerName}</b>
        </span>
        <ul>
          {result.players.map((p, i) => (
            <li
              key={p.name}
              className={'mb-2 dark:text-main-black text-main-white'}>
              {i + 1}. {p.name} — {p.totalScore} очков
            </li>
          ))}
        </ul>
        <div className={`${BTN_GROUP_CLASS} w-full`}>
          <Button onClick={onRestart} content="Играть снова" />
          <Button onClick={() => navigate(ROUTES.main)} content="Выйти" />
        </div>
      </div>
    </div>
  );
};
