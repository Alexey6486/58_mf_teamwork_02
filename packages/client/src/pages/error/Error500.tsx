export const Error500 = () => {
  return (
    <div className="bg-main-light dark:bg-main-dark flex flex-col items-center min-h-screen p-5 box-border">
      <img
        className="max-w-full max-h-[70vh] w-auto h-auto object-contain"
        src={'src/assets/images/500.png'}
        alt="500"
      />
    </div>
  );
};
