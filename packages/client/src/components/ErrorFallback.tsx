import { type FallbackProps } from 'react-error-boundary';
import {
  FORM_PAGE_CONTAINER_CLASS,
  FORM_TITLE_CLASS,
  TITLE_CLASS,
} from '../constants/style-groups';

function typeGuard<T extends object, K extends keyof T>(
  propertyName: K
): (error: unknown) => error is T & Record<K, string> {
  return (error: unknown): error is T & Record<K, string> => {
    return (
      typeof error === 'object' &&
      error !== null &&
      propertyName in error &&
      typeof (error as Record<K, unknown>)[propertyName] === 'string'
    );
  };
}

const isErrorWithMessage = typeGuard<{ message: string }, 'message'>('message');
const isErrorWithStack = typeGuard<{ stack: string }, 'stack'>('stack');

export const ErrorFallback = ({ error }: FallbackProps) => {
  const errorMessage = isErrorWithMessage(error)
    ? error.message
    : 'Unknown error';

  const errorStack = isErrorWithStack(error) ? error.stack : 'undefined';

  return (
    <div className={FORM_PAGE_CONTAINER_CLASS}>
      <div className="flex flex-col items-center">
        <h2 className={FORM_TITLE_CLASS}>{errorMessage}</h2>
        <div className="flex flex-col items-center">
          <h4 className={TITLE_CLASS}>Error stack</h4>
          <div className="mt-6 p-4 max-w-96 max-h-96 overflow-auto bg-main-white dark:bg-form-dark border border-form-light dark:border-form-dark rounded-main-radius text-main-black dark:text-main-white shadow-outer-light dark:shadow-outer-dark">
            {errorStack}
          </div>
        </div>
      </div>
    </div>
  );
};
