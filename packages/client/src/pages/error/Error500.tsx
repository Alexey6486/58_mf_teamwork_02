import styles from './styles.module.scss';

export const Error500 = () => {
  return (
    <div className={ styles.container }>
      <img className={ styles.img } src={ 'src/assets/images/500.png' } alt="500"/>
    </div>
  );
};
