import { type FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Logo } from '../../components/Logo/Logo'
import { Topic } from '../../components/Topic/Topic'
import { BTN_CLASS, FORM_PAGE_CONTAINER_CLASS } from '../../constants/style-groups'
import { initialTopics } from './data'
import { type Topic as TopicType } from '../../types/forum'

export const ForumPage: FC = () => {
  const navigate = useNavigate()
  const [isAddingTopic, setIsAddingTopic] = useState(false);
  const [topics, setTopics] = useState<TopicType[]>(initialTopics)
  const [newTopicTitle, setNewTopicTitle] = useState('')

  const handleAddClick = () => setIsAddingTopic(true);
  const handleCancel = () => {
    setIsAddingTopic(false);
    setNewTopicTitle('')
  };
  const handleDone = () => {
    if (newTopicTitle.trim()) {
      const newTopic: TopicType = {
        id: Math.max(...topics.map(t => t.id), 0) + 1,
        title: newTopicTitle
      }
      setTopics([...topics, newTopic])
      setNewTopicTitle('')
      setIsAddingTopic(false)
    }
  };

  const handleTopicClick = (id: number) => {
    navigate(`/forum/${id}`)
  }

  return (
    <div className={`${FORM_PAGE_CONTAINER_CLASS} flex-col items-center justify-start`}>
      <div className="pt-[14px] w-full flex justify-center items-start">
        <Logo />
      </div>

      <div className="mt-[32px] w-[900px]">
        <div className="flex justify-end">
          {!isAddingTopic ? (
            <button className={BTN_CLASS} onClick={handleAddClick}>
              + Добавить Топик
            </button>
          ) : (
            <div className="flex gap-3 items-stretch w-full">
              <input
                type="text"
                className="flex-1 text-main-black p-3 shadow-inset-light dark:bg-input-dark dark:shadow-inset-dark rounded-main-radius"
                placeholder="Введите название топика"
                value={newTopicTitle}
                onChange={(e) => setNewTopicTitle(e.target.value)}
              />
              <button
                className={`${BTN_CLASS} !mb-0 flex items-center justify-center max-w-[100px]`}
                onClick={handleDone}
              >
                Готово
              </button>
              <button
                className={`${BTN_CLASS} !mb-0 flex items-center justify-center max-w-[100px]`}
                onClick={handleCancel}
              >
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
  );
}
