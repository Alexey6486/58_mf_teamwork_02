import { useNavigate } from "react-router-dom";
import {
  BTN_MENU_CLASS,
  MAIN_CONTAINER_CLASS
} from '../../constants/style-groups'
import { Button } from "../../components/Button";
import { PageInitArgs } from '../../routes'

export const MainPage = () => {
    const navigate = useNavigate();

    return(
        <div className={MAIN_CONTAINER_CLASS}>
            <div className="flex flex-col justify-center items-center bg-main-light h-full rounded-md dark:bg-main-dark">
                <div className="font-bold text-main-blue dark:text-main-white text-5xl mb-3">Flip 7</div>
                <div className="flex bg-[#bae6fd] dark:bg-btn-dark dark:text-white w-fit mx-auto rounded-b-md
                    text-lg cursor-pointer border-t-2 border-main-blue dark:border-white">
                    <div className={`${BTN_MENU_CLASS} hover:rounded-bl-md`}
                        onClick={() => navigate('/forum')}>Форум</div>
                    <div className={BTN_MENU_CLASS}
                        onClick={() => navigate('/leaderboard')}>Таблица лидеров</div>
                    <div className={`${BTN_MENU_CLASS} hover:rounded-br-md`}
                        onClick={() => navigate('/profile')}>Профиль</div>
                </div>
                <div className="bg-white m-7 p-5 text-main-black rounded-md w-3/4 dark:bg-form-dark dark:text-white">
                    <div className="text-2xl font-medium mb-2">Правила игры</div>
                    <hr/>
                    <div className="space-y-2 mt-5 text-lg">
                        <p>🎯 <b>Цель:</b> набрать 200+ очков</p>
                        <p>🃏 <b>Ход:</b> бери карту или выходи с очками</p>
                        <p>🚫 <b>Проигрыш:</b> повтор номинала = 0 очков</p>
                        <p>✨ <b>FLIP 7:</b> 7 уникальных карт = +15 бонусов</p>
                        <p>🏆 <b>Победа:</b> больше очков при 200+</p>
                    </div>
                </div>
                <Button content="Новая игра" onClick={() => navigate('/game') }/>
            </div>
        </div>
    );
};

export const initMainPage = async (_: PageInitArgs) => Promise.resolve();
