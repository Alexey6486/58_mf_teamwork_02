import { type FC, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Logo } from '../../components/Logo/Logo';
import { Message } from '../../components/Message/Message';
import {
  BTN_CLASS,
  FORM_PAGE_CONTAINER_CLASS,
  MAIN_CONTAINER_CLASS
} from '../../constants/style-groups';
import { useDispatch, useSelector } from '../../store/store';
import { addMessage } from '../../store/forum-slice';
import { ROUTES } from '../../routes';

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
    <div className={ MAIN_CONTAINER_CLASS }>
      <div className={ `${ FORM_PAGE_CONTAINER_CLASS } flex-col items-center justify-start` }>
        <div className="pt-[14px] w-full flex justify-center items-start">
          <Logo/>
        </div>
        <div className="mt-[32px] w-[900px]">
          <div className="flex items-center gap-3">
            <button onClick={ toForum }>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24">
                <title>To forum page</title>
                <path
                  className="fill-path-light dark:fill-path-dark"
                  d="M21 11H6.414l5.293-5.293l-1.414-1.414L2.586 12l7.707 7.707l1.414-1.414L6.414 13H21z"
                />
              </svg>
            </button>
          </div>
          <div
            className="mt-4 h-[500px] overflow-y-auto rounded-[10px] bg-white custom-scroll p-6 flex flex-col gap-[10px]">
            <h1 className="text-2xl font-bold text-center">{ title || 'Топик не найден' }</h1>
            { messages.map(message => (
              <Message key={ message.id } message={ message }/>
            )) }
          </div>
          <div className="mt-4 flex gap-3">
            <input
              type="text"
              className="flex-1 text-main-black p-3 shadow-inset-light dark:bg-input-dark dark:shadow-inset-dark rounded-main-radius"
              placeholder="Введите сообщение"
              value={ text }
              onChange={ e => setText(e.target.value) }
            />
            <button className={ `${ BTN_CLASS } !mb-0` } onClick={ handleSend }>
              Отправить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
