import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { initialTopics } from '../pages/forum/data';
import { initialMessages } from '../pages/topic/data';
import { type Message, type Topic } from '../types/forum';

const FORUM_LS_KEY = 'forum_state_v1';

interface ForumState {
  topics: Topic[];
  messagesByTopicId: Record<number, Message[]>;
}

const getInitialState = (): ForumState => {
  if (typeof window === 'undefined') {
    return { topics: initialTopics, messagesByTopicId: initialMessages };
  }

  try {
    const raw = localStorage.getItem(FORUM_LS_KEY);
    if (!raw) {
      return { topics: initialTopics, messagesByTopicId: initialMessages };
    }

    const parsed = JSON.parse(raw) as ForumState;
    return {
      topics: parsed.topics ?? initialTopics,
      messagesByTopicId: parsed.messagesByTopicId ?? initialMessages,
    };
  } catch {
    return { topics: initialTopics, messagesByTopicId: initialMessages };
  }
};

const initialState: ForumState = getInitialState();

const forumSlice = createSlice({
  name: 'forum',
  initialState,
  reducers: {
    addTopic: (state, action: PayloadAction<string>) => {
      const title = action.payload.trim();
      if (!title) return;

      const nextId = Math.max(0, ...state.topics.map(t => t.id)) + 1;
      state.topics.push({ id: nextId, title });
      if (!state.messagesByTopicId[nextId]) {
        state.messagesByTopicId[nextId] = [];
      }
    },
    addMessage: (
      state,
      action: PayloadAction<{ topicId: number; text: string }>
    ) => {
      const { topicId, text } = action.payload;
      const normalized = text.trim();
      if (!normalized) return;

      const list = state.messagesByTopicId[topicId] ?? [];
      const nextId = Math.max(0, ...list.map(m => m.id)) + 1;
      const newMessage: Message = { id: nextId, text: normalized };

      state.messagesByTopicId[topicId] = [...list, newMessage];
    },
  },
});

export const { addTopic, addMessage } = forumSlice.actions;
export const forumReducer = forumSlice.reducer;
export { FORUM_LS_KEY };

