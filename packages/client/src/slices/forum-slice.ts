import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  URL_FORUM_TOPICS,
  URL_FORUM_TOPIC,
  URL_FORUM_TOPIC_COMMENT,
  URL_FORUM_TOPIC_COMMENTS,
} from '../constants/urls';
import type { ITopic, ITopicDetails, ITopicComment } from '../types';
import { type RootState } from '../store/store';

export interface ForumState {
  topics: ITopic[];
  topic: ITopicDetails | null;
}

const initialState: ForumState = {
  topics: [],
  topic: null,
};

export const fetchTopicsThunk = createAsyncThunk<ITopic[]>(
  'forum/fetchTopics',
  async () => {
    const response = await fetch(URL_FORUM_TOPICS, {
      credentials: 'include',
    });

    if (!response.ok) throw new Error('Failed to fetch topics');

    const json = (await response.json()) as {
      data?: { topics?: ITopic[] };
    };

    return json.data?.topics ?? [];
  }
);

export const createTopicThunk = createAsyncThunk<
  ITopic,
  { title: string; text: string; authorId: number },
  { state: RootState }
>('forum/createTopic', async ({ title, text, authorId }, { dispatch }) => {
  const response = await fetch(URL_FORUM_TOPIC, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title,
      text,
      authorId,
    }),
  });

  if (!response.ok) throw new Error('Failed to create topic');

  const json = (await response.json()) as {
    data?: { topic?: ITopic };
  };

  if (!json.data?.topic) throw new Error('Invalid topic payload');

  await dispatch(fetchTopicsThunk());
  return json.data.topic;
});

export const fetchTopicCommentsThunk = createAsyncThunk<
  { topic: ITopicDetails | null },
  number
>('forum/fetchTopicComments', async topicId => {
  const response = await fetch(URL_FORUM_TOPIC_COMMENTS(topicId), {
    credentials: 'include',
  });

  if (!response.ok) throw new Error('Failed to fetch topic comments');

  const json = (await response.json()) as {
    data?: { topic?: ITopicDetails };
  };

  const topic = json.data?.topic;
  if (!topic) {
    return {
      topic: null,
    };
  }

  return {
    topic,
  };
});

export const createCommentThunk = createAsyncThunk<
  { topicId: number; message: ITopicComment },
  {
    topicId: number;
    text: string;
    authorId: number;
    replyToCommentId?: number | null;
  },
  { state: unknown }
>(
  'forum/createComment',
  async (
    { topicId, text, authorId, replyToCommentId = null },
    { dispatch }
  ) => {
    const response = await fetch(URL_FORUM_TOPIC_COMMENT(topicId), {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topicId,
        text,
        replyToCommentId,
        authorId,
      }),
    });

    if (!response.ok) throw new Error('Failed to create comment');

    const json = (await response.json()) as {
      data?: { comment?: ITopicComment };
    };

    const comment = json.data?.comment;
    if (!comment) throw new Error('Invalid comment payload');

    await dispatch(fetchTopicCommentsThunk(topicId));

    return {
      topicId: Number(comment.topicId ?? topicId),
      message: comment as ITopicComment,
    };
  }
);

const forumSlice = createSlice({
  name: 'forum',
  initialState,
  reducers: {
    resetTopic: state => {
      state.topic = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTopicsThunk.fulfilled, (state, action) => {
        state.topics = action.payload;
      })
      .addCase(fetchTopicCommentsThunk.fulfilled, (state, action) => {
        state.topic = action.payload.topic;
      });
  },
});

export const selectTopics = (state: RootState) => state.forum.topics;
export const selectTopic = (state: RootState): ITopicDetails | null =>
  state.forum.topic;
export const { resetTopic } = forumSlice.actions;
export const forumReducer = forumSlice.reducer;
