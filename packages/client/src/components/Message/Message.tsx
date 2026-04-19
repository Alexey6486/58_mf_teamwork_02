import { type FC } from 'react';
import { type ITopicComment } from '../../types';
import { formatDate } from '../../utils';
import { IconButton } from '../IconButton';
import { EIconButton } from '../../enums';

interface MessageProps {
  message: ITopicComment;
  onResponse: (ITopicComment: ITopicComment) => void;
}

export const Message: FC<MessageProps> = ({ message, onResponse }) => {
  const { createdAt, User, text, repliedToComment, replyToCommentId } = message;

  const handleResponse = () => {
    onResponse(message);
  };

  return (
    <div className="border-2 border-[#F7EED2] rounded-[10px] py-1.5 px-2.5 mb-2 dark:bg-form-dark">
      <div className="flex justify-between border-b">
        <span className="text-sm">автор: {User?.login ?? ''}</span>
        <span className="text-sm">создано: {formatDate(createdAt ?? '')}</span>
      </div>
      {replyToCommentId && repliedToComment && (
        <div className="relative mt-1 mb-2 p-2 bg-input-dark rounded-main-radius dark:bg-main-dark dark:text-main-light truncate">
          <div className="flex justify-between border-b">
            <span className="text-sm">
              автор: {repliedToComment?.User?.login ?? ''}
            </span>
            <span className="text-sm">
              создано: {formatDate(repliedToComment?.createdAt ?? '')}
            </span>
          </div>
          <div className="w-full truncate">{repliedToComment?.text ?? ''}</div>
        </div>
      )}
      <p className="py-2">{text}</p>
      <div className="flex justify-between h-[24px] mt-2">
        <div className="flex">
          <div className="mr-2">
            <IconButton
              iconName={EIconButton.THUMB_UP}
              hoverName="Понравилось"
              onClick={() => null}
              width="18"
            />
          </div>
          <div>
            <IconButton
              iconName={EIconButton.THUMB_DOWN}
              hoverName="Не понравилось"
              onClick={() => null}
              width="18"
            />
          </div>
        </div>
        <div>
          <button onClick={handleResponse}>Ответить</button>
        </div>
      </div>
    </div>
  );
};
