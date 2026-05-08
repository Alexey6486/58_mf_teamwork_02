import { type FC } from 'react';
import { type ITopic } from '../../types';
import { formatDate } from '../../utils';

interface TopicProps {
  topic: ITopic;
  onClick?: () => void;
}

export const Topic: FC<TopicProps> = ({ topic, onClick }) => {
  const safeTitle = String(topic?.title ?? '');
  const safeAuthorLogin = String(topic?.User?.login ?? '');

  return (
    <div
      className="bg-[#F7EED2] rounded-[10px] p-2 cursor-pointer"
      onClick={onClick}>
      <div className="flex justify-between mb-2">
        <p className="font-bold text-lg">{safeTitle}</p>
        <span>
          {topic.commentCount > 0
            ? `Комментариев: ${topic.commentCount}`
            : 'Комментариев нет'}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm">автор: {safeAuthorLogin}</span>
        <span className="text-sm">создано: {formatDate(topic.createdAt)}</span>
      </div>
    </div>
  );
};
