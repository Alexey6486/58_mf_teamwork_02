import { type FC, memo, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { cloneDeep } from 'lodash-es';
import {
  fetchLeaderboardThunk,
  selectLeaderboard,
  setLeaderboard,
} from '../../slices/leaderboard-slice';
import { type AppDispatch, useSelector } from '../../store/store';
import { type ILeaderboard, type TSortDirection } from '../../types';
import { bubbleObjectSort, isArray } from '../../utils';

type TRow = 'row' | 'header';
type TLeaderboardRow = ILeaderboard & {
  type: TRow;
  sortCb?: (
    fieldName: keyof ILeaderboard,
    dir: TSortDirection | null | undefined
  ) => void;
};

const getDir = (dir: TSortDirection | null | undefined) => {
  switch (dir) {
    case 'asc': {
      return 'desc';
    }
    case 'desc': {
      return null;
    }
    default: {
      return 'asc';
    }
  }
};

const SortDirectionIcon: FC<{ dir: TSortDirection | null | undefined }> = ({
  dir,
}) => {
  if (dir === 'asc') {
    return (
      <span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16">
          <title>ascending</title>
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M2.22 13.28a.75.75 0 0 0 1.06 0l2-2a.75.75 0 1 0-1.06-1.06l-.72.72V3.25a.75.75 0 0 0-1.5 0v7.69l-.72-.72a.75.75 0 1 0-1.06 1.06zM7.75 12a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5zm0-3.25a.75.75 0 0 1 0-1.5h5.5a.75.75 0 0 1 0 1.5zm0-4.75a.75.75 0 0 1 0-1.5h2.5a.75.75 0 0 1 0 1.5z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    );
  }

  if (dir === 'desc') {
    return (
      <span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16">
          <title>descending</title>
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M2.22 13.28a.75.75 0 0 0 1.06 0l2-2a.75.75 0 1 0-1.06-1.06l-.72.72V3.25a.75.75 0 0 0-1.5 0v7.69l-.72-.72a.75.75 0 1 0-1.06 1.06zM7 3.25a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7 3.25m.75 4a.75.75 0 0 0 0 1.5h5.5a.75.75 0 0 0 0-1.5zm0 4.75a.75.75 0 0 0 0 1.5h2.5a.75.75 0 0 0 0-1.5z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    );
  }

  return <span></span>;
};

const LeaderboardRow: FC<TLeaderboardRow> = memo(
  ({ id, name, games, wins, type, sortCb }) => {
    const [sortDir, setSortDir] = useState<
      Partial<Record<keyof ILeaderboard, TSortDirection | null>>
    >({
      name: null,
      games: null,
      wins: null,
    });

    const handleClick = (fieldName: keyof ILeaderboard) => () => {
      if (type === 'row' || !sortCb) {
        return;
      }

      const dir = getDir(sortDir[fieldName]);
      sortCb(fieldName, dir);

      setSortDir({
        name: null,
        games: null,
        wins: null,
        [fieldName]: dir,
      });
    };

    return (
      <div
        key={id}
        className={`flex${
          type === 'header' ? ' sticky top-0 bg-main-white border-b' : ''
        }`}>
        <div
          className={`flex items-center w-32 p-4 select-none${
            type === 'header' ? ' cursor-pointer' : ''
          }`}
          onClick={handleClick('name')}>
          <span className="mr-2">{name}</span>
          {type === 'header' && <SortDirectionIcon dir={sortDir['name']} />}
        </div>
        <div
          className={`flex items-center w-32 p-4 select-none${
            type === 'header' ? ' cursor-pointer' : ''
          }`}
          onClick={handleClick('games')}>
          <span className="mr-2">{games}</span>
          {type === 'header' && <SortDirectionIcon dir={sortDir['games']} />}
        </div>
        <div
          className={`flex items-center w-32 p-4 select-none${
            type === 'header' ? ' cursor-pointer' : ''
          }`}
          onClick={handleClick('wins')}>
          <span className="mr-2">{wins}</span>
          {type === 'header' && <SortDirectionIcon dir={sortDir['wins']} />}
        </div>
      </div>
    );
  }
);

export const LeaderboardPage = () => {
  const { data } = useSelector(selectLeaderboard);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleSort = (
    fieldName: keyof ILeaderboard,
    dir: TSortDirection | null | undefined
  ) => {
    dispatch(
      setLeaderboard(
        bubbleObjectSort<ILeaderboard, keyof ILeaderboard>(
          cloneDeep(data),
          fieldName,
          dir
        )
      )
    );
  };

  useEffect(() => {
    dispatch(fetchLeaderboardThunk());
  }, []);

  return (
    <div className="p-2">
      <div>LeaderboardPage</div>
      <div className="mt-4 overflow-auto max-h-80 max-w-96 pl-2 pr-2 shadow-outer-light dark:shadow-outer-dark">
        <LeaderboardRow
          type={'header'}
          id={'header'}
          name={'Имя'}
          games={'Игр'}
          wins={'Побед'}
          sortCb={handleSort}
        />
        {isArray(data, true) &&
          data.map((el: ILeaderboard) => (
            <LeaderboardRow key={el.id} type={'row'} {...el} />
          ))}
      </div>
    </div>
  );
};
