import React, { type FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Topic } from '../../components/Topic/Topic';
import {
  BTN_CLASS,
  FORM_PAGE_CONTAINER_CLASS,
  PAGE_TITLE_SIZE_CLASS,
} from '../../constants/style-groups';
import { type PageInitArgs, ROUTES } from '../../routes';
import { useDispatch, useSelector } from '../../store/store';
import {
  createTopicThunk,
  fetchTopicsThunk,
  selectTopics,
} from '../../slices/forum-slice';
import { selectUser } from '../../slices/user-slice';
import { EIconButton } from '../../enums';
import { isArray } from '../../utils';
import { type ITopic } from '../../types';
import { CardLayout } from '../../components/CardLayout';
import {
  TOPIC_CONTENT_MAX_LENGTH,
  TOPIC_TITLE_MAX_LENGTH,
} from '../../constants/forum';

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
};

export const ForumPage: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const topics = useSelector(selectTopics);
  const user = useSelector(selectUser);

  const [isAddingTopic, setIsAddingTopic] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicText, setNewTopicText] = useState('');
  const [isCreatingTopic, setIsCreatingTopic] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchTopicsThunk());
  }, [dispatch]);

  const handleAddClick = () => setIsAddingTopic(true);
  const handleCancel = () => {
    setIsAddingTopic(false);
    setNewTopicTitle('');
    setNewTopicText('');
    setCreateError(null);
  };
  const handleDone = async () => {
    const title = newTopicTitle.trim();
    const text = newTopicText.trim();

    if (!title || !text) {
      setCreateError('Заполните название и текст топика');
      return;
    }

    setCreateError(null);
    setIsCreatingTopic(true);

    try {
      await dispatch(
        createTopicThunk({ title, text, authorId: Number(user?.id) })
      ).unwrap();
      setNewTopicTitle('');
      setNewTopicText('');
      setIsAddingTopic(false);
    } catch (error) {
      setCreateError(getErrorMessage(error, 'Не удалось создать топик'));
    } finally {
      setIsCreatingTopic(false);
    }
  };

  const handleTopicClick = (id: number) => {
    navigate(`/forum/${id}`);
  };

  const toMain = () => {
    navigate(ROUTES.main);
  };

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Страница форума</title>
        <meta name="description" content="Страница форума" />
      </Helmet>
      <div
        className={`${FORM_PAGE_CONTAINER_CLASS} flex-col items-center justify-start`}>
        <CardLayout
          text="ФОРУМ"
          textSize={PAGE_TITLE_SIZE_CLASS}
          bgColor="bg-f7-light-green"
          leftBtnCb={toMain}
          leftBtnIcon={EIconButton.BACK}
          leftBtnText="На главную страницу">
          <div className="mt-[32px] w-[900px]">
            <div className="flex justify-end">
              {!isAddingTopic ? (
                <div className="flex justify-end w-full">
                  <button className={BTN_CLASS} onClick={handleAddClick}>
                    + Добавить Топик
                  </button>
                </div>
              ) : (
                <div className="flex gap-3 items-stretch w-full">
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="flex relative w-full">
                      <input
                        type="text"
                        className="flex-1 text-main-black py-3 pl-3 pr-14 shadow-inset-light dark:bg-input-dark dark:shadow-inset-dark rounded-main-radius"
                        placeholder="Введите название топика"
                        value={newTopicTitle}
                        onChange={e => setNewTopicTitle(e.target.value)}
                        disabled={isCreatingTopic}
                        maxLength={TOPIC_TITLE_MAX_LENGTH}
                      />
                      <span className="flex absolute bottom-0 right-2 text-[10px] text-gray-400">
                        {newTopicTitle.length ?? 0}/{TOPIC_TITLE_MAX_LENGTH}
                      </span>
                    </div>
                    <div className="flex relative w-full">
                      <input
                        type="text"
                        className="flex-1 text-main-black py-3 pl-3 pr-14 shadow-inset-light dark:bg-input-dark dark:shadow-inset-dark rounded-main-radius"
                        placeholder="Введите текст топика"
                        value={newTopicText}
                        onChange={e => setNewTopicText(e.target.value)}
                        disabled={isCreatingTopic}
                        maxLength={TOPIC_CONTENT_MAX_LENGTH}
                      />
                      <span className="flex absolute bottom-0 right-2 text-[10px] text-gray-400">
                        {newTopicText.length ?? 0}/{TOPIC_CONTENT_MAX_LENGTH}
                      </span>
                    </div>
                  </div>
                  <button
                    className={`${BTN_CLASS} !mb-0 flex items-center justify-center max-w-[100px]`}
                    onClick={handleDone}
                    disabled={isCreatingTopic}>
                    {isCreatingTopic ? 'Создание...' : 'Готово'}
                  </button>
                  <button
                    className={`${BTN_CLASS} !mb-0 flex items-center justify-center max-w-[100px]`}
                    onClick={handleCancel}
                    disabled={isCreatingTopic}>
                    Отмена
                  </button>
                </div>
              )}
            </div>

            {createError ? (
              <p className="mt-2 text-sm text-red-600">{createError}</p>
            ) : null}

            <div className="mt-4 max-h-[650px] overflow-y-auto overflow-x-hidden custom-scroll border dark:border-form-dark border-form-dark bg-form-dark px-[10px] py-6 flex flex-col gap-[10px] dark:bg-form-dark">
              {isArray(topics, true) ? (
                topics.map((topic: ITopic) => (
                  <Topic
                    key={topic.id}
                    topic={topic}
                    onClick={() => handleTopicClick(topic.id)}
                  />
                ))
              ) : (
                <p className="text-main-white ">Пока нет созданных тем...</p>
              )}
            </div>
          </div>
        </CardLayout>
      </div>
    </>
  );
};

export const initForumPage = async (args: PageInitArgs) => {
  await (
    args as { store?: { dispatch?: (action: unknown) => Promise<unknown> } }
  )?.store?.dispatch?.(fetchTopicsThunk());
};
