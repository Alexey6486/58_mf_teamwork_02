import { type FC } from 'react';
import { type ITopic } from '../../types';
import { formatDate } from '../../utils/format-date';

interface TopicProps {
  topic: ITopic;
  onClick?: () => void;
}

export const Topic: FC<TopicProps> = ({ topic, onClick }) => {
  return (
    <div
      className="bg-[#F7EED2] rounded-[10px] p-2 cursor-pointer"
      onClick={onClick}>
      <div className="flex justify-between mb-2">
        <p className="font-bold text-lg">{topic.title}</p>
        <span>
          {topic.commentCount > 0
            ? `Комментариев: ${topic.commentCount}`
            : 'Комментариев нет'}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm">автор: {topic.User.login}</span>
        <span className="text-sm">создано: {formatDate(topic.createdAt)}</span>
      </div>
    </div>
  );
};
