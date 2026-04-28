import { type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { type GameResult } from './types';
import {
  APP_TITLE_CLASS,
  BTN_GROUP_CLASS,
  FORM_CONTAINER_CLASS,
  FORM_PAGE_CONTAINER_CLASS,
  FORM_TITLE_CLASS,
} from '../../constants/style-groups';
import { Button } from '../../components/Button';
import { useDispatch, useSelector } from '../../store/store';
import { selectUser, selectUserRating } from '../../slices/user-slice';
import { updateLeaderboardScore } from '../../slices/leaderboard-slice';
import { ROUTES } from '../../routes';

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
        <h1 className={APP_TITLE_CLASS}>Flip 7</h1>
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
        <div className={BTN_GROUP_CLASS}>
          <Button onClick={onRestart} content="Играть снова" />
          <Button onClick={() => navigate(ROUTES.main)} content="Выйти" />
        </div>
      </div>
    </div>
  );
};
