import { type FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Logo } from '../../components/Logo/Logo';
import { Topic } from '../../components/Topic/Topic';
import {
  BTN_CLASS,
  FORM_PAGE_CONTAINER_CLASS,
  MAIN_CONTAINER_CLASS,
} from '../../constants/style-groups';
import { type PageInitArgs, ROUTES } from '../../routes';
import { useDispatch, useSelector } from '../../store/store';
import { addTopic } from '../../slices/forum-slice';
import { IconButton } from '../../components/IconButton';
import { EIconButton, ERequestMethods } from '../../enums';

export const ForumPage: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const topics = useSelector(state => state.forum.topics);

  const [isAddingTopic, setIsAddingTopic] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');

  const handleAddClick = () => setIsAddingTopic(true);
  const handleCancel = () => {
    setIsAddingTopic(false);
    setNewTopicTitle('');
  };
  const handleDone = () => {
    if (newTopicTitle.trim()) {
      dispatch(addTopic(newTopicTitle));
      setNewTopicTitle('');
      setIsAddingTopic(false);
    }
  };

  const handleTopicClick = (id: number) => {
    navigate(`/forum/${id}`);
  };

  const toMain = () => {
    navigate(ROUTES.main);
  };

  useEffect(() => {
    const requestOptions = {
      method: ERequestMethods.GET,
      credentials: 'include' as RequestCredentials,
    };

    fetch(
      'http://localhost:3001/api/v1/forum/topics?page=1&size=20',
      requestOptions
    )
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.error(error));
  }, []);

  return (
    <div className={MAIN_CONTAINER_CLASS}>
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
                <input
                  type="text"
                  className="flex-1 text-main-black p-3 shadow-inset-light dark:bg-input-dark dark:shadow-inset-dark rounded-main-radius"
                  placeholder="Введите название топика"
                  value={newTopicTitle}
                  onChange={e => setNewTopicTitle(e.target.value)}
                />
                <button
                  className={`${BTN_CLASS} !mb-0 flex items-center justify-center max-w-[100px]`}
                  onClick={handleDone}>
                  Готово
                </button>
                <button
                  className={`${BTN_CLASS} !mb-0 flex items-center justify-center max-w-[100px]`}
                  onClick={handleCancel}>
                  Отмена
                </button>
              </div>
            )}
          </div>
          <div className="mt-4 max-h-[650px] overflow-y-auto overflow-x-hidden rounded-[10px] bg-white custom-scroll p-6 flex flex-col gap-[10px]">
            {topics.map(topic => (
              <Topic
                key={topic.id}
                topic={topic}
                onClick={() => handleTopicClick(topic.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const initForumPage = async (_: PageInitArgs) => Promise.resolve();
