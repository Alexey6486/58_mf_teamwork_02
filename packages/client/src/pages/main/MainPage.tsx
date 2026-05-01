import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import {
  FORM_PAGE_CONTAINER_CLASS,
  PAGE_TITLE_SIZE_CLASS,
} from '../../constants/style-groups';
import { Button } from '../../components/Button';
import { type PageInitArgs } from '../../routes';
import { useUserRating } from '../../hooks/useUserRating';
import { CardLayout } from '../../components/CardLayout';

export const MainPage = () => {
  const navigate = useNavigate();
  useUserRating();

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Главная страница</title>
        <meta name="description" content="Главная страница" />
      </Helmet>
      <div className={`${FORM_PAGE_CONTAINER_CLASS}`}>
        <CardLayout
          text="FLIP7"
          textSize={PAGE_TITLE_SIZE_CLASS}
          bgColor="bg-f7-blue">
          <>
            <div className="flex dark:text-white w-[calc(100% + 20px)] text-lg cursor-pointer -mx-[10px]">
              <div
                className={`flex w-1/3 px-0 py-[15px] justify-center bg-f7-beige hover:bg-f7-light-brownish dark:bg-f7-brown dark:hover:bg-f7-light-brownish`}
                onClick={() => navigate('/forum')}>
                Форум
              </div>
              <div
                className={`flex w-1/3 px-0 py-[15px] justify-center bg-f7-beige hover:bg-f7-light-brownish dark:bg-f7-brown dark:hover:bg-f7-light-brownish`}
                onClick={() => navigate('/leaderboard')}>
                Таблица лидеров
              </div>
              <div
                className={`flex w-1/3 px-0 py-[15px] justify-center bg-f7-beige hover:bg-f7-light-brownish dark:bg-f7-brown dark:hover:bg-f7-light-brownish`}
                onClick={() => navigate('/profile')}>
                Профиль
              </div>
            </div>

            <div className="bg-white w-[495px] my-[100px] p-5 text-main-black rounded-md dark:bg-form-dark dark:text-white">
              <div className="text-2xl font-medium mb-2">Правила игры</div>
              <hr />
              <div className="space-y-2 mt-5 text-lg">
                <p>
                  🎯 <b>Цель:</b> набрать 200+ очков
                </p>
                <p>
                  🃏 <b>Ход:</b> бери карту или выходи с очками
                </p>
                <p>
                  🚫 <b>Проигрыш:</b> повтор номинала = 0 очков
                </p>
                <p>
                  ✨ <b>FLIP 7:</b> 7 уникальных карт = +15 бонусов
                </p>
                <p>
                  🏆 <b>Победа:</b> больше очков при 200+
                </p>
              </div>
            </div>

            <div className="w-full flex justify-center">
              <Button content="Новая игра" onClick={() => navigate('/game')} />
            </div>
          </>
        </CardLayout>
      </div>
    </>
  );
};

export const initMainPage = async (_: PageInitArgs) => Promise.resolve();
