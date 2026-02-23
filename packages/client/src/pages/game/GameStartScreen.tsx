import { type FC, useState } from 'react';
import {
  APP_TITLE_CLASS,
  BTN_CLASS,
  BTN_GROUP_CLASS,
  FORM_CONTAINER_CLASS,
  FORM_PAGE_CONTAINER_CLASS,
  FORM_TITLE_CLASS,
} from '../../constants/style-groups';

type GameStartScreenProps = {
  onStart: () => void;
};

export const GameStartScreen: FC<GameStartScreenProps> = ({ onStart }) => {
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  return (
    <div className={FORM_PAGE_CONTAINER_CLASS}>
      <div className={FORM_CONTAINER_CLASS}>
        <h1 className={APP_TITLE_CLASS}>Flip 7</h1>
        <div className={BTN_GROUP_CLASS}>
          <button className={BTN_CLASS} onClick={onStart}>
            Начать игру
          </button>
          <button className={BTN_CLASS} onClick={() => setIsRulesOpen(true)}>
            Правила
          </button>
        </div>
      </div>

      {isRulesOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setIsRulesOpen(false)}>
          <div
            className={`${FORM_CONTAINER_CLASS} max-w-lg`}
            onClick={e => e.stopPropagation()}>
            <h2 className={FORM_TITLE_CLASS}>Правила игры</h2>
            {/* TODO: Добавить правила */}
            <div className={BTN_GROUP_CLASS}>
              <button
                className={BTN_CLASS}
                onClick={() => setIsRulesOpen(false)}>
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
