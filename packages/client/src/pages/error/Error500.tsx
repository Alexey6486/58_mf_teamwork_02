import { useNavigate } from 'react-router-dom';
import {
  FORM_PAGE_CONTAINER_CLASS,
  MAIN_CONTAINER_CLASS,
} from '../../constants/style-groups';
import { IconButton } from '../../components/IconButton';
import { EIconButton } from '../../enums';

export const Error500 = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className={MAIN_CONTAINER_CLASS}>
      <div className={FORM_PAGE_CONTAINER_CLASS}>
        <div className="absolute top-6 left-6">
          <IconButton
            onClick={goBack}
            iconName={EIconButton.BACK}
            hoverName={'Назад'}
          />
        </div>
        <img
          className="max-w-full max-h-[70vh] w-auto h-auto object-contain"
          src={'src/assets/images/500.png'}
          alt="500"
        />
      </div>
    </div>
  );
};
