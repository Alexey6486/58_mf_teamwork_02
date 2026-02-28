import { type FC, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Logo } from '../../components/Logo/Logo'
import { Message } from '../../components/Message/Message'
import {
  BTN_CLASS,
  FORM_PAGE_CONTAINER_CLASS
} from '../../constants/style-groups'
import { initialMessages } from './data'
import { type Message as MessageType } from '../../types/forum'
import { initialTopics } from '../forum/data'

export const TopicPage: FC = () => {
  const { id } = useParams<{ id: string }>()
  const topicId = Number(id)
  const topic = initialTopics.find(t => t.id === topicId)
  const [messages, setMessages] = useState<MessageType[]>(initialMessages[topicId] || [])
  const [newMessage, setNewMessage] = useState('')

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: MessageType = {
        id: Math.max(...messages.map(m => m.id), 0) + 1,
        text: newMessage
      }
      setMessages([...messages, message])
      setNewMessage('')
    }
  }

  return (
    <div className={`${FORM_PAGE_CONTAINER_CLASS} flex-col`}>
      <Logo/>
      <div className="w-[900px]">
        <div className="mt-4 h-[650px] w-full overflow-y-auto overflow-x-hidden rounded-[10px] bg-white custom-scroll p-6 flex flex-col gap-[10px]">
          <h1 className="text-black text-center">{topic?.title || 'Топик не найден'}</h1>
          {messages.map(message => (
            <Message key={message.id} message={message} />
          ))}
        </div>
        <div className="flex mt-[16px] gap-[10px]">
          <input
            type="text"
            className="flex-1 text-main-black p-3 shadow-inset-light dark:bg-input-dark dark:shadow-inset-dark rounded-main-radius"
            placeholder="Напишите сообщение..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button
            className={`${BTN_CLASS} mb-0 flex items-center justify-center max-w-[100px]`}
            onClick={handleSendMessage}
          >
            Отправить
          </button>
        </div>
      </div>
    </div>
  )
}
