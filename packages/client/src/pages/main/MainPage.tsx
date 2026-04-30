import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import {
  BTN_MENU_CLASS,
  CARD_BORDER_CLASS,
  FORM_CONTAINER_CLASS,
  FORM_PAGE_CONTAINER_CLASS,
} from '../../constants/style-groups';
import { Button } from '../../components/Button';
import { type PageInitArgs } from '../../routes';
import { useUserRating } from '../../hooks/useUserRating';
import { Logo } from '../../components/Logo/Logo';

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
      {/*<div className="flex flex-col justify-center items-center bg-main-light h-full rounded-md dark:bg-main-dark">*/}
      <div className={`${FORM_PAGE_CONTAINER_CLASS}`}>
        <div className={`${FORM_CONTAINER_CLASS}`}>
          <span className={CARD_BORDER_CLASS} />
          <Logo text="FLIP7" bgColor="bg-f7-blue" />

          <div className="z-20 flex dark:text-white w-fit mx-auto text-lg cursor-pointer mx-[11px]">
            <div
              className={`${BTN_MENU_CLASS} bg-f7-beige hover:bg-f7-light-brownish dark:bg-f7-brown dark:hover:bg-f7-light-brownish`}
              onClick={() => navigate('/forum')}>
              Форум
            </div>
            <div
              className={`${BTN_MENU_CLASS} bg-f7-beige hover:bg-f7-light-brownish dark:bg-f7-brown dark:hover:bg-f7-light-brownish`}
              onClick={() => navigate('/leaderboard')}>
              Таблица лидеров
            </div>
            <div
              className={`${BTN_MENU_CLASS} bg-f7-beige hover:bg-f7-light-brownish dark:bg-f7-brown dark:hover:bg-f7-light-brownish`}
              onClick={() => navigate('/profile')}>
              Профиль
            </div>
          </div>

          <div className="z-20 bg-white w-[495px] mx-[20px] my-[100px] p-5 text-main-black rounded-md dark:bg-form-dark dark:text-white">
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

          <div className="z-20 w-full flex justify-center">
            <Button content="Новая игра" onClick={() => navigate('/game')} />
          </div>
        </div>
      </div>
    </>
  );
};

export const initMainPage = async (_: PageInitArgs) => Promise.resolve();
