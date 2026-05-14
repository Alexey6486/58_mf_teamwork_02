import { type FC, useState } from 'react';
import { type ITopicComment } from '../../types';
import { formatDate } from '../../utils';
import { IconButton } from '../IconButton';
import { EIconButton, EReactions } from '../../enums';
import { useDispatch, useSelector } from '../../store/store';
import { selectUser } from '../../slices/user-slice';
import {
  createReactionThunk,
  deleteReactionThunk,
} from '../../slices/forum-slice';

interface MessageProps {
  message: ITopicComment;
  onResponse: (ITopicComment: ITopicComment) => void;
}

export const Message: FC<MessageProps> = ({ message, onResponse }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const {
    id,
    topicId,
    createdAt,
    User,
    text,
    repliedToComment,
    replyToCommentId,
    Reactions,
  } = message;

  const [isReacting, setIsReacting] = useState(false);

  const userReaction = Reactions?.find(
    r => String(r.User?.userId) === String(user?.id)
  );

  const thumbUpCount = Reactions?.filter(r => r.text === EReactions.TU);
  const thumbDownCount = Reactions?.filter(r => r.text === EReactions.TD);

  const handleReaction = async (reactionType: string) => {
    if (!user?.id || isReacting) return;

    setIsReacting(true);

    try {
      if (userReaction) {
        if (userReaction.text === reactionType) {
          await dispatch(
            deleteReactionThunk({
              topicId,
              commentId: id,
              reactionId: userReaction.id,
            })
          ).unwrap();
        } else {
          await dispatch(
            createReactionThunk({
              topicId,
              commentId: id,
              authorId: Number(user.id),
              text: reactionType,
              id: userReaction.id,
            })
          ).unwrap();
        }
      } else {
        await dispatch(
          createReactionThunk({
            topicId,
            commentId: id,
            authorId: Number(user.id),
            text: reactionType,
          })
        ).unwrap();
      }
    } finally {
      setIsReacting(false);
    }
  };

  const handleResponse = () => {
    onResponse(message);
  };

  const activeStyle = '[&_path]:!fill-f7-light-blue';

  const safeAuthorLogin = String(User?.login ?? '');
  const safeText = String(text ?? '');
  const safeReplyAuthorLogin = String(repliedToComment?.User?.login ?? '');
  const safeReplyText = String(repliedToComment?.text ?? '');

  return (
    <div className="border-2 border-f7-beige rounded-[10px] py-1.5 px-2.5 mb-2 bg-form-dark dark:bg-f7-beige text-main-light dark:text-main-black ">
      <div className="flex justify-between border-b dark:border-f7-dark border-main-white">
        <span className="text-sm">автор: {safeAuthorLogin}</span>
        <span className="text-sm">создано: {formatDate(createdAt ?? '')}</span>
      </div>
      {replyToCommentId && repliedToComment && (
        <div className="relative mt-1 mb-2 p-2 bg-input-dark rounded-main-radius text-f7-dark dark:bg-main-dark dark:text-main-light truncate">
          <div className="flex justify-between border-b border-f7-dark dark:border-main-white">
            <span className="text-sm">автор: {safeReplyAuthorLogin}</span>
            <span className="text-sm">
              создано: {formatDate(repliedToComment?.createdAt ?? '')}
            </span>
          </div>
          <div className="w-full truncate">{safeReplyText}</div>
        </div>
      )}
      <p className="py-2">{safeText}</p>
      <div className="flex justify-between items-center mt-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <IconButton
              iconName={EIconButton.THUMB_UP}
              hoverName="Понравилось"
              onClick={() => handleReaction(EReactions.TU)}
              width="18"
              styles={userReaction?.text === EReactions.TU ? activeStyle : ''}
            />
            {thumbUpCount.length > 0 && (
              <div
                className={`relative group text-xs cursor-pointer ${
                  userReaction?.text === EReactions.TU
                    ? 'text-f7-light-blue'
                    : 'text-white dark:text-f7-dark'
                }`}>
                {thumbUpCount.length}
                <span className="z-10 custom-scroll overflow-y-auto max-h-100 group-hover:block hidden hover:block absolute top-[calc(100%-2px)] left-0 bg-gray-400 rounded-main-radius p-2 text-f7-beige">
                  {thumbUpCount.map(reaction => (
                    <p key={reaction?.User?.login}>
                      {reaction?.User?.login ?? ''}
                    </p>
                  ))}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            <IconButton
              iconName={EIconButton.THUMB_DOWN}
              hoverName="Не понравилось"
              onClick={() => handleReaction(EReactions.TD)}
              width="18"
              styles={userReaction?.text === EReactions.TD ? activeStyle : ''}
            />
            {thumbDownCount.length > 0 && (
              <div
                className={`relative group text-xs cursor-pointer ${
                  userReaction?.text === EReactions.TD
                    ? 'text-f7-light-blue'
                    : 'text-white dark:text-f7-dark'
                }`}>
                {thumbDownCount.length}
                <span className="z-10 custom-scroll overflow-y-auto max-h-100 group-hover:block hidden hover:block absolute top-[calc(100%-2px)] left-0 bg-gray-400 rounded-main-radius p-2 text-f7-beige">
                  {thumbDownCount.map(reaction => (
                    <p key={reaction?.User?.login}>
                      {reaction?.User?.login ?? ''}
                    </p>
                  ))}
                </span>
              </div>
            )}
          </div>
        </div>
        <div>
          <button onClick={handleResponse}>Ответить</button>
        </div>
      </div>
    </div>
  );
};
