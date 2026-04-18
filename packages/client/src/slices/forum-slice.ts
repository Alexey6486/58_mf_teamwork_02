import {
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';
import {
  URL_FORUM_TOPICS,
  URL_FORUM_TOPIC,
  URL_FORUM_TOPIC_COMMENT,
  URL_FORUM_TOPIC_COMMENTS,
} from '../constants/urls';
import { type Message, type Topic } from '../types/forum';

type ApiTopic = {
  id: number;
  title: string;
  comments?: Array<{ id: number; text: string; replyToCommentId?: number | null }>;
};

const mapTopic = (topic: ApiTopic): Topic => ({
  id: Number(topic.id),
  title: String(topic.title ?? ''),
});

const mapMessage = (comment: { id: number; text: string }): Message => ({
  id: Number(comment.id),
  text: String(comment.text ?? ''),
});

export interface ForumState {
  topics: Topic[];
  messagesByTopicId: Record<number, Message[]>;
}

const initialState: ForumState = {
  topics: [],
  messagesByTopicId: {},
};

export const fetchTopicsThunk = createAsyncThunk<Topic[]>(
  'forum/fetchTopics',
  async () => {
    const response = await fetch(URL_FORUM_TOPICS, {
      credentials: 'include',
    });

    if (!response.ok) throw new Error('Failed to fetch topics');

    const json = (await response.json()) as {
      data?: { topics?: ApiTopic[] };
    };

    return (json.data?.topics ?? []).map(mapTopic);
  }
);

type AppStateLike = {
  user?: {
    id?: number;
    user?: { id?: number };
  };
  auth?: {
    user?: { id?: number };
  };
};

const resolveAuthorIdFromState = (state: unknown): number | undefined => {
  const s = state as AppStateLike;
  const candidates = [s?.user?.id, s?.user?.user?.id, s?.auth?.user?.id];
  return candidates.find((id): id is number => Number.isFinite(id));
};

export const createTopicThunk = createAsyncThunk<
  Topic,
  { title: string; text: string },
  { state: unknown }
>('forum/createTopic', async ({ title, text }, { getState, dispatch }) => {
  const authorId = resolveAuthorIdFromState(getState());

  const response = await fetch(URL_FORUM_TOPIC, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title,
      text,
      ...(authorId ? { authorId } : {}),
    }),
  });

  if (!response.ok) throw new Error('Failed to create topic');

  const json = (await response.json()) as {
    data?: { topic?: ApiTopic };
  };

  if (!json.data?.topic) throw new Error('Invalid topic payload');

  await dispatch(fetchTopicsThunk());
  return mapTopic(json.data.topic);
});

export const fetchTopicCommentsThunk = createAsyncThunk<
  { topic: Topic; messages: Message[]; topicId: number },
  number
>('forum/fetchTopicComments', async topicId => {
  const response = await fetch(URL_FORUM_TOPIC_COMMENTS(topicId), {
    credentials: 'include',
  });

  if (!response.ok) throw new Error('Failed to fetch topic comments');

  const json = (await response.json()) as {
    data?: { topic?: ApiTopic };
  };

  const topic = json.data?.topic;
  if (!topic) {
    return {
      topic: { id: topicId, title: 'Топик не найден' },
      messages: [],
      topicId,
    };
  }

  return {
    topic: mapTopic(topic),
    messages: (topic.comments ?? []).map(mapMessage),
    topicId: Number(topic.id),
  };
});

export const createCommentThunk = createAsyncThunk<
  { topicId: number; message: Message },
  { topicId: number; text: string; replyToCommentId?: number | null },
  { state: unknown }
>('forum/createComment', async ({ topicId, text, replyToCommentId = null }, { getState, dispatch }) => {
  const authorId = resolveAuthorIdFromState(getState());

  const response = await fetch(URL_FORUM_TOPIC_COMMENT(topicId), {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      topicId,
      text,
      replyToCommentId,
      ...(authorId ? { authorId } : {}),
    }),
  });

  if (!response.ok) throw new Error('Failed to create comment');

  const json = (await response.json()) as {
    data?: { comment?: { id: number; text: string; topicId?: number } };
  };

  const comment = json.data?.comment;
  if (!comment) throw new Error('Invalid comment payload');

  await dispatch(fetchTopicCommentsThunk(topicId));

  return {
    topicId: Number(comment.topicId ?? topicId),
    message: mapMessage(comment),
  };
});

const upsertTopic = (state: ForumState, topic: Topic) => {
  const index = state.topics.findIndex(t => t.id === topic.id);
  if (index >= 0) {
    state.topics[index] = topic;
  } else {
    state.topics.unshift(topic);
  }
};

const forumSlice = createSlice({
  name: 'forum',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchTopicsThunk.fulfilled, (state, action) => {
        state.topics = action.payload;
      })
      .addCase(fetchTopicCommentsThunk.fulfilled, (state, action) => {
        const { topic, messages, topicId } = action.payload;
        upsertTopic(state, topic);
        state.messagesByTopicId[topicId] = messages;
      });
  },
});

export const forumReducer = forumSlice.reducer;
