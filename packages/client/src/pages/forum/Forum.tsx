import { type FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../../components/Logo/Logo';
import { Topic } from '../../components/Topic/Topic';
import {
  BTN_CLASS,
  FORM_PAGE_CONTAINER_CLASS,
  MAIN_CONTAINER_CLASS
} from '../../constants/style-groups';
import { ROUTES } from '../../routes';
import { useDispatch, useSelector } from '../../store/store';
import { addTopic } from '../../slices/forum-slice';

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
    navigate(`/forum/${ id }`);
  };

  const toMain = () => {
    navigate(ROUTES.main);
  };

  return (
    <div className={ MAIN_CONTAINER_CLASS }>
      <div className={ `${ FORM_PAGE_CONTAINER_CLASS } flex-col items-center justify-start` }>
        <div className="pt-[14px] w-full flex justify-center items-start">
          <Logo/>
        </div>
        <div className="mt-[32px] w-[900px]">
          <div className="flex justify-end">
            { !isAddingTopic ? (
              <div className="flex justify-between w-full">
                <button onClick={ toMain }>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24">
                    <title>To main page</title>
                    <path
                      className="fill-path-light dark:fill-path-dark"
                      d="M21 11H6.414l5.293-5.293l-1.414-1.414L2.586 12l7.707 7.707l1.414-1.414L6.414 13H21z"
                    />
                  </svg>
                </button>
                <button className={ BTN_CLASS } onClick={ handleAddClick }>
                  + Добавить Топик
                </button>
              </div>
            ) : (
              <div className="flex gap-3 items-stretch w-full">
                <input
                  type="text"
                  className="flex-1 text-main-black p-3 shadow-inset-light dark:bg-input-dark dark:shadow-inset-dark rounded-main-radius"
                  placeholder="Введите название топика"
                  value={ newTopicTitle }
                  onChange={ (e) => setNewTopicTitle(e.target.value) }
                />
                <button
                  className={ `${ BTN_CLASS } !mb-0 flex items-center justify-center max-w-[100px]` }
                  onClick={ handleDone }
                >
                  Готово
                </button>
                <button
                  className={ `${ BTN_CLASS } !mb-0 flex items-center justify-center max-w-[100px]` }
                  onClick={ handleCancel }
                >
                  Отмена
                </button>
              </div>
            ) }
          </div>
          <div
            className="mt-4 max-h-[650px] overflow-y-auto overflow-x-hidden rounded-[10px] bg-white custom-scroll p-6 flex flex-col gap-[10px]">
            { topics.map(topic => (
              <Topic
                key={ topic.id }
                topic={ topic }
                onClick={ () => handleTopicClick(topic.id) }
              />
            )) }
          </div>
        </div>
      </div>
    </div>
  );
};
