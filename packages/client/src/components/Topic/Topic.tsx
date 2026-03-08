import { type FC } from 'react';

interface TopicProps {
  topic: { id: number; title: string };
  onClick?: () => void;
}

export const Topic: FC<TopicProps> = ({ topic, onClick }) => {
  return (
    <div className="bg-[#F7EED2] rounded-[10px] p-2 cursor-pointer" onClick={ onClick }>
      <p>{ topic.title }</p>
    </div>
  );
};
