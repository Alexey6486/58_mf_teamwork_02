import { type FC, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Logo } from '../../components/Logo/Logo';
import { Message } from '../../components/Message/Message';
import {
  BTN_CLASS,
  FORM_PAGE_CONTAINER_CLASS,
} from '../../constants/style-groups';
import { useDispatch, useSelector } from '../../store/store';
import {
  createCommentThunk,
  fetchTopicCommentsThunk,
} from '../../slices/forum-slice';
import { type PageInitArgs, ROUTES } from '../../routes';
import { IconButton } from '../../components/IconButton';
import { EIconButton } from '../../enums';

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
};

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
  const subtitle = useSelector(
    state => state.forum.topicTextByTopicId[topicId] ?? ''
  );

  const [text, setText] = useState('');
  const [isLoadingTopic, setIsLoadingTopic] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);

  const title = useMemo(() => {
    if (!Number.isFinite(topicId)) return 'Топик не найден';
    return topic?.title ?? 'Топик не найден';
  }, [topic?.title, topicId]);

  useEffect(() => {
    if (!Number.isFinite(topicId)) return;

    const run = async () => {
      setIsLoadingTopic(true);
      setLoadError(null);

      try {
        await dispatch(fetchTopicCommentsThunk(topicId)).unwrap();
      } catch (error) {
        setLoadError(
          getErrorMessage(error, 'Не удалось загрузить топик и комментарии')
        );
      } finally {
        setIsLoadingTopic(false);
      }
    };

    void run();
  }, [dispatch, topicId]);

  const handleSend = async () => {
    if (!Number.isFinite(topicId) || isSending) return;

    const normalized = text.trim();
    if (!normalized) return;

    setSendError(null);
    setIsSending(true);

    try {
      await dispatch(
        createCommentThunk({ topicId, text: normalized })
      ).unwrap();
      setText('');
    } catch (error) {
      setSendError(getErrorMessage(error, 'Не удалось отправить комментарий'));
    } finally {
      setIsSending(false);
    }
  };

  const toForum = () => {
    navigate(ROUTES.forum);
  };

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Страница топика</title>
        <meta name="description" content="Страница топика" />
      </Helmet>
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
            <h2 className="text-center text-sm opacity-70 break-words">
              {subtitle}
            </h2>

            {isLoadingTopic ? (
              <p className="text-center text-sm opacity-70">Загрузка...</p>
            ) : null}

            {loadError ? (
              <p className="text-center text-sm text-red-600">{loadError}</p>
            ) : null}

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
              disabled={isSending}
            />
            <button
              className={`${BTN_CLASS} !mb-0`}
              onClick={handleSend}
              disabled={isSending}>
              {isSending ? 'Отправка...' : 'Отправить'}
            </button>
          </div>
          {sendError ? (
            <p className="mt-2 text-sm text-red-600">{sendError}</p>
          ) : null}
        </div>
      </div>
    </>
  );
};

export const initTopicPage = async (args: PageInitArgs) => {
  const rawId =
    (args as { params?: Record<string, string> })?.params?.id ??
    (args as { match?: { params?: Record<string, string> } })?.match?.params
      ?.id;
  const topicId = Number(rawId);

  if (!Number.isFinite(topicId)) return;
  await (
    args as { store?: { dispatch?: (action: unknown) => Promise<unknown> } }
  )?.store?.dispatch?.(fetchTopicCommentsThunk(topicId));
};
