import { createSlice } from '@reduxjs/toolkit';

import { actions as channelsActions } from './sliceChannel';

const initialState = { messages: [] };

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state, { payload }) => {
      state.messages.push(payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(channelsActions.getData.fulfilled, (state, { payload }) => {
        state.messages = payload.messages;
      })
      .addCase(channelsActions.removeChannel, (state, { payload }) => {
        state.messages = state.messages
        .filter((message) => message.channelId !== payload.id);
      })
  },
});

export const { actions } = messagesSlice;
export default messagesSlice.reducer;