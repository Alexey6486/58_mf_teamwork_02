import React, { type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { type GameResult } from './types';
import {
  BTN_GROUP_CLASS,
  FORM_PAGE_CONTAINER_CLASS,
  PAGE_TITLE_SIZE_CLASS,
} from '../../constants/style-groups';
import { Button } from '../../components/Button';
import { useDispatch, useSelector } from '../../store/store';
import { selectUser, selectUserRating } from '../../slices/user-slice';
import { updateLeaderboardScore } from '../../slices/leaderboard-slice';
import { ROUTES } from '../../routes';
import { CardLayout } from '../../components/CardLayout';

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
      <CardLayout
        text="РЕЗУЛЬТАТЫ"
        textSize={PAGE_TITLE_SIZE_CLASS}
        bgColor="bg-main-red-dark">
        <>
          <span className="relative font-bold text-main-white dark:text-main-black w-full mb-12 h-[64px] z-10 flex justify-center items-center">
            Победитель:&nbsp;<b>{result.winnerName}</b>
          </span>
          <ul className="flex flex-col justify-center items-center">
            {result.players.map((p, i) => (
              <li
                key={p.name}
                className={'mb-2 dark:text-main-black text-main-white'}>
                {i + 1}. {p.name} — {p.totalScore} очков
              </li>
            ))}
          </ul>
          <div className={BTN_GROUP_CLASS}>
            <Button onClick={onRestart} content="Играть снова" />
            <Button onClick={() => navigate(ROUTES.main)} content="Выйти" />
          </div>
        </>
      </CardLayout>
    </div>
  );
};
