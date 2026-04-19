import { type FC } from 'react';

interface TopicProps {
  topic: { id: number; title: string };
  subtitle?: string;
  onClick?: () => void;
}

export const Topic: FC<TopicProps> = ({ topic, subtitle, onClick }) => {
  return (
    <div
      className="bg-[#F7EED2] rounded-[10px] p-2 cursor-pointer"
      onClick={onClick}>
      <p className="font-semibold break-words">{topic.title}</p>
      {subtitle ? (
        <p className="mt-1 text-sm opacity-70 break-words">{subtitle}</p>
      ) : null}
    </div>
  );
};
