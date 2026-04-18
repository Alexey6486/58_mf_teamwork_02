import { type FC, useEffect, useState } from 'react';
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
  resetTopic,
  selectTopic,
} from '../../slices/forum-slice';
import { type PageInitArgs, ROUTES } from '../../routes';
import { IconButton } from '../../components/IconButton';
import { EIconButton } from '../../enums';
import { formatDate } from '../../utils/formatDate';

export const TopicPage: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const topicId = Number(id);
  const topic = useSelector(selectTopic);
  console.log({ topic });

  const [text, setText] = useState('');

  const handleSend = async () => {
    if (!Number.isFinite(topicId)) return;
    const normalized = text.trim();
    if (!normalized) return;

    try {
      await dispatch(
        createCommentThunk({ topicId, text: normalized })
      ).unwrap();
      setText('');
    } catch {
      // ...optional ui error handling...
    }
  };

  const toForum = () => {
    navigate(ROUTES.forum);
  };

  useEffect(() => {
    if (!Number.isFinite(topicId)) return;
    dispatch(fetchTopicCommentsThunk(topicId));

    return () => {
      dispatch(resetTopic());
    };
  }, [dispatch, topicId]);

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
            {topic && (
              <>
                <div className="flex justify-between -mt-4">
                  <span className="text-sm">
                    автор: {topic?.User?.login ?? ''}
                  </span>
                  <span className="text-sm">
                    создано: {formatDate(topic?.createdAt ?? '')}
                  </span>
                </div>
                <div>
                  <p className="mb-2">Тема:</p>
                  <h3 className="text-2xl font-bold">
                    {topic?.title || 'Топик не найден'}
                  </h3>
                </div>
                <div>
                  <p className="mb-2">Сообщение:</p>
                  <span>{topic?.text ?? ''}</span>
                </div>
                <div>
                  <p className="mb-2">Комментарии:</p>
                  <div>
                    {Array.isArray(topic?.comments)
                      ? topic?.comments?.map?.(comment => (
                          <Message key={comment.id} message={comment} />
                        ))
                      : ''}
                  </div>
                </div>
              </>
            )}
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
