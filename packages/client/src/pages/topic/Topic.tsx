import { type FC, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Logo } from '../../components/Logo/Logo';
import { Message } from '../../components/Message/Message';
import {
  BTN_CLASS,
  FORM_PAGE_CONTAINER_CLASS,
  MAIN_CONTAINER_CLASS,
} from '../../constants/style-groups';
import { useDispatch, useSelector } from '../../store/store';
import { addMessage } from '../../slices/forum-slice';
import {
  PageInitArgs,
  ROUTES
} from '../../routes'
import { IconButton } from '../../components/IconButton';
import { EIconButton } from '../../enums';

export const TopicPage: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const topicId = Number(id);
  const topic = useSelector(state =>
    state.forum.topics.find(t => t.id === topicId)
  );
  const messages = useSelector(
    state => state.forum.messagesByTopicId[topicId] ?? []
  );

  const [text, setText] = useState('');

  const title = useMemo(() => {
    if (!Number.isFinite(topicId)) return 'Топик не найден';
    return topic?.title ?? 'Топик не найден';
  }, [topic?.title, topicId]);

  const handleSend = () => {
    if (!Number.isFinite(topicId)) return;
    if (!text.trim()) return;

    dispatch(addMessage({ topicId, text }));
    setText('');
  };

  const toForum = () => {
    navigate(ROUTES.forum);
  };

  return (
    <div className={MAIN_CONTAINER_CLASS}>
      <div
        className={`${FORM_PAGE_CONTAINER_CLASS} flex-col items-center justify-start`}>
        <div className="pt-[14px] w-full flex justify-center items-start">
          <Logo />
        </div>
        <div className="mt-[32px] w-[900px]">
          <div className="flex items-center gap-3">
            <IconButton
              onClick={toForum}
              iconName={EIconButton.BACK}
              hoverName={'На страницу форума'}
            />
          </div>
          <div className="mt-4 h-[500px] overflow-y-auto rounded-[10px] bg-white custom-scroll p-6 flex flex-col gap-[10px]">
            <h1 className="text-2xl font-bold text-center">
              {title || 'Топик не найден'}
            </h1>
            {messages.map(message => (
              <Message key={message.id} message={message} />
            ))}
          </div>
          <div className="mt-4 flex gap-3">
            <input
              type="text"
              className="flex-1 text-main-black p-3 shadow-inset-light dark:bg-input-dark dark:shadow-inset-dark rounded-main-radius"
              placeholder="Введите сообщение"
              value={text}
              onChange={e => setText(e.target.value)}
            />
            <button className={`${BTN_CLASS} !mb-0`} onClick={handleSend}>
              Отправить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const initTopicPage = async (_: PageInitArgs) => Promise.resolve();
