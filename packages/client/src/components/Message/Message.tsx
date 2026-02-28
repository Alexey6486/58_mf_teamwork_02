import { type FC } from 'react';

interface MessageProps {
  message?: { id: number; text: string }
}

export const Message: FC<MessageProps> = ({ message }) => {
  return (
    <div className="border-2 border-[#F7EED2] rounded-[10px] p-1.5">
      <p>{message?.text || 'Text'}</p>
    </div>
  );
}
