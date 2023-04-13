import { createSlice } from '@reduxjs/toolkit';

import { actions as channelsActions } from './sliceChannel';

const initialState = { messages: [] };

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(channelsActions.getData.fulfilled, (state, { payload }) => {
        state.messages = payload.messages;
      });
  },
});

export const { actions } = messagesSlice;
export default messagesSlice.reducer;