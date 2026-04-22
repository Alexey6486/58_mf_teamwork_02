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

  const thumbUpCount =
    Reactions?.filter(r => r.text === EReactions.TU).length ?? 0;
  const thumbDownCount =
    Reactions?.filter(r => r.text === EReactions.TD).length ?? 0;

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

  const activeStyle = '[&_path]:!fill-[#7cbdff]';

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
            {thumbUpCount > 0 && (
              <span
                className={`text-xs ${
                  userReaction?.text === EReactions.TU
                    ? 'text-[#7cbdff]'
                    : 'dark:text-white'
                }`}>
                {thumbUpCount}
              </span>
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
            {thumbDownCount > 0 && (
              <span
                className={`text-xs ${
                  userReaction?.text === EReactions.TD
                    ? 'text-[#7cbdff]'
                    : 'dark:text-white'
                }`}>
                {thumbDownCount}
              </span>
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
