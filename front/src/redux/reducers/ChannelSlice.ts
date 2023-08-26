import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { ChannelData, ChannelMessageData, ChannelType, transformToChannelData } from "../../Screens/chat/models/Channel";
import { API_ROUTES } from "../../Utils";

interface ChannelDataState {
  channelsData: ChannelData[];
}

const initialState: ChannelDataState = {
  channelsData: []
};

export const fetchActiveChannel = createAsyncThunk(
  "channel/fetchActiveChannel",
  async (_, thunkAPI) => {
    const response = await axios.get(API_ROUTES.COMPLETE_ROOM, { withCredentials: true });
    return response.data;
  }
);

export const findChannelByName = (state: ChannelDataState, channelName: string) => {
  return state.channelsData.find(channelData => channelData.name === channelName);
};

const findChannelIdndex = (state: ChannelDataState, channelName: string) => {
  return state.channelsData.findIndex(channelData => channelData.name === channelName);
};

const channelSlice = createSlice({
  name: "channel",
  initialState,
  reducers: {
    setType: (state, action: PayloadAction<{ channelName: string; type: ChannelType }>) => {
      const { channelName, type } = action.payload;
      const channelIndex = findChannelIdndex(state, channelName);

      if (channelIndex !== -1)
        state.channelsData[channelIndex].type = type;
    },
    setName: (state, action: PayloadAction<string>) => {
      // state.channelData.name = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      // state.channelData.password = action.payload;
    },
    addMessage: (state, action: PayloadAction<{ channelName: string; message: ChannelMessageData }>) => {
      const { channelName, message } = action.payload;
      const channelIndex = findChannelIdndex(state, channelName);

      if (channelIndex !== -1)
        state.channelsData[channelIndex].messages.push(message);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchActiveChannel.fulfilled, (state, action) => {
      state.channelsData.push(transformToChannelData(action.payload));
    });
  },
});

export const { setType, setName, setPassword, addMessage } = channelSlice.actions;
export default channelSlice.reducer;
