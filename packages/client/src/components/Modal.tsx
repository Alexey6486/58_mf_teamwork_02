import { type FC, type ReactNode } from 'react';
import { BTN_CLASS, BTN_GROUP_CLASS, FORM_CONTAINER_CLASS, FORM_TITLE_CLASS } from '../constants/style-groups';

type ModalProps = {
  title: string;
  onClose: () => void;
  children?: ReactNode;
  closeLabel?: string;
};

export const Modal: FC<ModalProps> = ({ title, onClose, children, closeLabel = 'Закрыть' }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
    <div className={`${FORM_CONTAINER_CLASS} max-w-lg`} onClick={e => e.stopPropagation()}>
      <h2 className={FORM_TITLE_CLASS}>{title}</h2>
      {children}
      <div className={BTN_GROUP_CLASS}>
        <button className={BTN_CLASS} onClick={onClose}>
          {closeLabel}
        </button>
      </div>
    </div>
  </div>
);
