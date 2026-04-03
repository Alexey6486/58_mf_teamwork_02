import { type FC, memo, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchLeaderboardThunk,
  selectLeaderboard,
  setLeaderboard,
} from '../../slices/leaderboard-slice';
import { type AppDispatch, useSelector } from '../../store/store';
import { type ILeaderboard, type TSortDirection } from '../../types';
import { bubbleObjectSort, cloneDeep } from '../../utils';
import {
  FORM_CONTAINER_CLASS,
  FORM_PAGE_CONTAINER_CLASS,
  FORM_TITLE_CLASS,
  MAIN_CONTAINER_CLASS,
} from '../../constants/style-groups';
import {
  type PageInitArgs,
  ROUTES
} from '../../routes'
import { IconButton } from '../../components/IconButton';
import { EIconButton } from '../../enums';
import { fromLeaderboardData } from '../../utils/fromLeaderboardData';

type TLeaderboardRow =
  | (ILeaderboard & {
      type: 'row';
      sortCb?: (fieldName: keyof ILeaderboard, dir: TSortDirection | null | undefined) => void;
    })
  | {
      type: 'header';
      id: string;
      name: string;
      flip7_rating: string;
      sortCb?: (fieldName: keyof ILeaderboard, dir: TSortDirection | null | undefined) => void;
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
  ({ id, name, flip7_rating, type, sortCb }) => {
    const [sortDir, setSortDir] = useState<
      Partial<Record<keyof ILeaderboard, TSortDirection | null>>
    >({
      name: null,
      flip7_rating: null,
    });

    const handleClick = (fieldName: keyof ILeaderboard) => () => {
      if (type === 'row' || !sortCb) {
        return;
      }

      const dir = getDir(sortDir[fieldName]);
      sortCb(fieldName, dir);

      setSortDir({
        name: null,
        flip7_rating: null,
        [fieldName]: dir,
      });
    };

    return (
      <div
        key={id}
        className={`flex bg-form-light dark:bg-form-dark${
          type === 'header'
            ? ' sticky top-0 border-b'
            : ' group hover:bg-row-light dark:hover:bg-input-dark'
        }`}>
        <div
          className={`flex items-center w-32 p-4 select-none text-main-black dark:text-main-white dark:group-hover:text-main-black${
            type === 'header' ? ' cursor-pointer' : ''
          }`}
          onClick={handleClick('name')}>
          <span className="mr-2">{name}</span>
          {type === 'header' && <SortDirectionIcon dir={sortDir['name']} />}
        </div>
        <div
          className={`flex items-center w-32 p-4 select-none text-main-black dark:text-main-white dark:group-hover:text-main-black${
            type === 'header' ? ' cursor-pointer' : ''
          }`}
          onClick={handleClick('flip7_rating')}>
          <span className="mr-2">{flip7_rating}</span>
          {type === 'header' && <SortDirectionIcon dir={sortDir['flip7_rating']} />}
        </div>
      </div>
    );
  }
);

export const LeaderboardPage = () => {
  const { data } = useSelector(selectLeaderboard);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const leaderboardItems = useMemo(() => {
    return fromLeaderboardData(data);
  }, [data]);

  const handleSort = (
    fieldName: keyof ILeaderboard,
    dir: TSortDirection | null | undefined
  ) => {

    if (!leaderboardItems.length) return;

    dispatch(
      setLeaderboard(
        bubbleObjectSort<ILeaderboard, keyof ILeaderboard>(
          cloneDeep(leaderboardItems),
          fieldName,
          dir
        )
      )
    );
  };

  const toMain = () => {
    navigate(ROUTES.main);
  };

  useEffect(() => {
    const cursor = 0;
    dispatch(fetchLeaderboardThunk({ cursor }));
  }, []);

  return (
    <div className={MAIN_CONTAINER_CLASS}>
      <div className={FORM_PAGE_CONTAINER_CLASS}>
        <div className={FORM_CONTAINER_CLASS}>
          <div className="w-full flex justify-between absolute pl-8 pr-8 top-12 left-0">
            <IconButton
              onClick={toMain}
              iconName={EIconButton.BACK}
              hoverName={'На главную страницу'}
            />
          </div>
          <div className={FORM_TITLE_CLASS}>Таблица лидеров</div>
          <div className="mt-4 overflow-auto max-h-80 max-w-96 pl-2 pr-2 bg-form-light dark:bg-form-dark border border-form-light rounded-main-radius dark:border-form-dark">
            <LeaderboardRow
              type={'header'}
              id={'header'}
              name={'Имя'}
              flip7_rating= {'Очки'}
              sortCb={handleSort}
            />
            {leaderboardItems.map((el: ILeaderboard) => (
              <LeaderboardRow
                key={el.id}
                type={'row'}
                {...el}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const initLeaderBoardPage = async (_: PageInitArgs) => Promise.resolve();
