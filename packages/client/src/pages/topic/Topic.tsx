import React, { type FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Message } from '../../components/Message/Message';
import {
  FORM_PAGE_CONTAINER_CLASS,
  PAGE_TITLE_SIZE_CLASS,
} from '../../constants/style-groups';
import { useDispatch, useSelector } from '../../store/store';
import {
  createCommentThunk,
  fetchTopicCommentsThunk,
  resetTopic,
  selectTopic,
} from '../../slices/forum-slice';
import { selectUser } from '../../slices/user-slice';
import { type PageInitArgs, ROUTES } from '../../routes';
import { IconButton } from '../../components/IconButton';
import { EIconButton } from '../../enums';
import { formatDate, isArray } from '../../utils';
import { type ITopicComment } from '../../types';
import { CardLayout } from '../../components/CardLayout';
import { TOPIC_COMMENT_MAX_LENGTH } from '../../constants/forum';

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
};

export const TopicPage: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const topicId = Number(id);
  const topic = useSelector(selectTopic);
  const user = useSelector(selectUser);

  const [response, setResponse] = useState<ITopicComment | null>(null);
  const [text, setText] = useState('');
  const [isLoadingTopic, setIsLoadingTopic] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!Number.isFinite(topicId) || isSending) return;

    const authorId = Number(user?.id);
    if (!Number.isInteger(authorId) || authorId <= 0) {
      setSendError('Пользователь не авторизован');
      return;
    }

    const normalized = text.trim();
    if (!normalized) return;

    if (normalized.length > TOPIC_COMMENT_MAX_LENGTH) {
      setSendError(
        `Комментарий слишком длинный (макс. ${TOPIC_COMMENT_MAX_LENGTH})`
      );
      return;
    }

    setSendError(null);
    setIsSending(true);

    try {
      await dispatch(
        createCommentThunk({
          topicId,
          text: normalized,
          authorId,
          ...(response && { replyToCommentId: response.id }),
        })
      ).unwrap();
      if (response) {
        setResponse(null);
      }
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

  const onCommentResponse = (comment: ITopicComment) => {
    setResponse(comment);
  };

  const onCancelResponse = () => {
    setResponse(null);
  };

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
        <CardLayout
          text="СТРАНИЦА ТОПИКА"
          textSize={PAGE_TITLE_SIZE_CLASS}
          bgColor="bg-f7-light-blue"
          leftBtnCb={toForum}
          leftBtnIcon={EIconButton.BACK}
          leftBtnText="На страницу форума">
          <div className="mt-[32px] w-[900px]">
            <div className="mt-4 h-[700px] rounded-[10px] p-6 flex flex-col gap-[10px] bg-f7-beige dark:bg-form-dark">
              {topic && (
                <>
                  <div className="flex justify-between -mt-4 border-b dark:text-white">
                    <span className="text-sm">
                      автор: {topic?.User?.login ?? ''}
                    </span>
                    <span className="text-sm">
                      создано: {formatDate(topic?.createdAt ?? '')}
                    </span>
                  </div>
                  <div className="dark:text-white">
                    <p>Тема:</p>
                    <h3 className="text-2xl font-semibold">
                      {topic?.title || 'Топик не найден'}
                    </h3>
                  </div>
                  <div className="dark:text-white">
                    <p>Сообщение:</p>
                    <span className="font-medium">{topic?.text ?? ''}</span>
                  </div>
                  <div className="dark:text-white">
                    <p className="mb-2">Комментарии:</p>
                    <div className="overflow-y-auto custom-scroll h-[480px]">
                      {isArray(topic?.comments, true)
                        ? topic?.comments?.map?.((comment: ITopicComment) => (
                            <Message
                              key={comment.id}
                              message={comment}
                              onResponse={onCommentResponse}
                            />
                          ))
                        : 'Пока никто не ответил...'}
                    </div>
                  </div>
                </>
              )}

              {isLoadingTopic ? (
                <p className="text-center text-sm opacity-70">Загрузка...</p>
              ) : null}

              {loadError ? (
                <p className="text-center text-sm text-red-600">{loadError}</p>
              ) : null}
            </div>

            <div className="mt-4 flex gap-3 w-full">
              <div className="w-full flex flex-col p-2 text-main-black bg-white dark:bg-input-dark shadow-inset-light dark:shadow-inset-dark rounded-main-radius overflow-hidden">
                {response && (
                  <div className="relative mb-2 p-2 bg-input-dark rounded-main-radius dark:bg-main-dark dark:text-main-light truncate">
                    <div>
                      <div className="absolute top-1 right-1">
                        <IconButton
                          iconName={EIconButton.CROSS}
                          hoverName="Отмена ответа"
                          onClick={onCancelResponse}
                        />
                      </div>
                      <div className="border-b mb-2 text-sm border-f7-dark dark:border-main-white">
                        Ответ на комментарий:
                      </div>
                      <div className="w-full truncate">
                        {String(response.text ?? '')}
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex align-end">
                  <div className="flex relative w-full">
                    <input
                      type="text"
                      className="flex-1 text-main-black p-3 dark:bg-input-dark"
                      placeholder="Введите сообщение"
                      value={text}
                      onChange={e =>
                        setText(
                          e.target.value.slice(0, TOPIC_COMMENT_MAX_LENGTH)
                        )
                      }
                      maxLength={TOPIC_COMMENT_MAX_LENGTH}
                      disabled={isSending}
                    />
                    <span className="flex absolute bottom-0 right-2 text-[10px] text-gray-400">
                      {text.length ?? 0}/{TOPIC_COMMENT_MAX_LENGTH}
                    </span>
                  </div>

                  <div className="mx-2 h-[48px] flex align-center">
                    <IconButton
                      iconName={EIconButton.SEND}
                      onClick={handleSend}
                      hoverName="Отправить"
                    />
                  </div>
                </div>
              </div>
            </div>

            {sendError ? (
              <p className="mt-2 text-sm text-red-600">{sendError}</p>
            ) : null}
          </div>
        </CardLayout>
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
