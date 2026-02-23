import { createAsyncThunk } from '@reduxjs/toolkit';

export const thunkCreator = <T, P = void>(
  typePrefix: string,
  cb: (args: P, signal?: AbortSignal) => Promise<Response>
) => {
  return createAsyncThunk<T, P>(
    typePrefix,
    async (args, { rejectWithValue, signal }) => {
      try {
        const response = await cb(args, signal);

        if (!response.ok) {
          let errorData = null;
          try {
            errorData = await response.json();
          } catch (e: unknown) {
            errorData = { message: response.statusText };
          }

          return rejectWithValue({
            status: response.status,
            data: errorData,
            message:
              errorData?.message ||
              `HTTP error: ${response.status} ${response.statusText}`,
          });
        }

        return await response.json();
      } catch (error: unknown) {
        let errorMessage = 'Network error.';

        if (error instanceof Error) {
          errorMessage = error.message;

          return rejectWithValue({
            status: null,
            message: errorMessage,
            data: null,
          });
        }

        return rejectWithValue({
          status: null,
          message: errorMessage,
        });
      }
    }
  );
};
