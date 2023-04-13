import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


const getData = createAsyncThunk(
  'channels/setInitialState',
  async (authHeader, { rejectWithValue }) => {
    try {
      const response = await axios.get('api/v1/data', { headers: authHeader });
      return response.data;
    } catch (error) {
      return rejectWithValue({ message: error.message });
    }
  },
);

const initialState = { loading: false, channels: [], currentChannelId: null };

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getData.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.channels = payload.channels;
        state.currentChannelId = payload.currentChannelId;
      })
      .addCase(getData.rejected, (state, { payload }) => {
        state.loading = false;
      });
  },
});

const actions = {
  ...channelsSlice.actions,
  getData,
};

export { actions };
export default channelsSlice.reducer;