import { type FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Logo } from '../../components/Logo/Logo';
import { Topic } from '../../components/Topic/Topic';
import {
  BTN_CLASS,
  FORM_PAGE_CONTAINER_CLASS,
} from '../../constants/style-groups';
import { type PageInitArgs, ROUTES } from '../../routes';
import { useDispatch, useSelector } from '../../store/store';
import { createTopicThunk, fetchTopicsThunk } from '../../slices/forum-slice';
import { IconButton } from '../../components/IconButton';
import { EIconButton } from '../../enums';

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
};

export const ForumPage: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const topics = useSelector(state => state.forum.topics);
  const topicTextByTopicId = useSelector(
    state => state.forum.topicTextByTopicId
  );

  const [isAddingTopic, setIsAddingTopic] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicText, setNewTopicText] = useState('');
  const [isCreatingTopic, setIsCreatingTopic] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    void dispatch(fetchTopicsThunk());
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
      await dispatch(createTopicThunk({ title, text })).unwrap();
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
        <div className="pt-[14px] w-full flex justify-center items-start">
          <Logo />
        </div>
        <div className="mt-[32px] w-[900px]">
          <div className="flex justify-end">
            {!isAddingTopic ? (
              <div className="flex justify-between w-full">
                <IconButton
                  onClick={toMain}
                  iconName={EIconButton.BACK}
                  hoverName={'На главную страницу'}
                />
                <button className={BTN_CLASS} onClick={handleAddClick}>
                  + Добавить Топик
                </button>
              </div>
            ) : (
              <div className="flex gap-3 items-stretch w-full">
                <div className="flex-1 flex flex-col gap-2">
                  <input
                    type="text"
                    className="flex-1 text-main-black p-3 shadow-inset-light dark:bg-input-dark dark:shadow-inset-dark rounded-main-radius"
                    placeholder="Введите название топика"
                    value={newTopicTitle}
                    onChange={e => setNewTopicTitle(e.target.value)}
                    disabled={isCreatingTopic}
                  />
                  <input
                    type="text"
                    className="flex-1 text-main-black p-3 shadow-inset-light dark:bg-input-dark dark:shadow-inset-dark rounded-main-radius"
                    placeholder="Введите текст топика"
                    value={newTopicText}
                    onChange={e => setNewTopicText(e.target.value)}
                    disabled={isCreatingTopic}
                  />
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

          <div className="mt-4 max-h-[650px] overflow-y-auto overflow-x-hidden rounded-[10px] bg-white custom-scroll p-6 flex flex-col gap-[10px]">
            {topics.map(topic => (
              <Topic
                key={topic.id}
                topic={topic}
                subtitle={topicTextByTopicId[topic.id] ?? ''}
                onClick={() => handleTopicClick(topic.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export const initForumPage = async (args: PageInitArgs) => {
  await (
    args as { store?: { dispatch?: (action: unknown) => Promise<unknown> } }
  )?.store?.dispatch?.(fetchTopicsThunk());
};
