import { type FC } from 'react';
import { type ITopicComment } from '../../types';
import { formatDate } from '../../utils/formatDate';

interface MessageProps {
  message: ITopicComment;
}

export const Message: FC<MessageProps> = ({ message }) => {
  const { createdAt, User, text } = message;
  return (
    <div className="border-2 border-[#F7EED2] rounded-[10px] p-1.5 mb-2">
      <p>{text}</p>
      <div className="flex justify-between">
        <span className="text-sm">автор: {User?.login ?? ''}</span>
        <span className="text-sm">создано: {formatDate(createdAt ?? '')}</span>
      </div>
    </div>
  );
};
