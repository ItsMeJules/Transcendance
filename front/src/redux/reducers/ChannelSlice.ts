import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { ChannelMessageData, ChannelType } from "../../Screens/chat/models/Channel";
import { API_ROUTES } from "../../Utils";

interface ChannelDataState {
  activeChannel: {
    type: string | null;
    name: string | null;
    password: string | null;
    usersId: number[];
    ownerId: number | null;
    adminsId: number[];
    punishments: {
      type: string;
      userId: number;
      expireAt: number;
    }[];
    messages: {
      authorId: number;
      text: string;
    }[];
  } | null,
  visibleChannels: {
    name: string;
    type: ChannelType;
    userCount: number;
  }[];
}

const initialState: ChannelDataState = {
  activeChannel: null,
  visibleChannels: []
};

export const fetchActiveChannel = createAsyncThunk(
  "channel/fetchActiveChannel",
  async (_, thunkAPI) => {
    const response = await axios.get(API_ROUTES.COMPLETE_ROOM, { withCredentials: true });
    console.log(response.data)
    return response.data;
  }
);

// export const fetchVisibleChannels = createAsyncThunk(
//   "channel/fetchVisibleChannels",
//   async (_, thunkAPI) => {
//     const response = await axios.get(API_ROUTES.VISIBLE_CHANNELS, { withCredentials: true });
//     return response.data;
//   }
// );

export const findChannelByName = (state: ChannelDataState, channelName: string) => {
  return state.visibleChannels.find(channelData => channelData.name === channelName);
};

const findChannelIdndex = (state: ChannelDataState, channelName: string) => {
  return state.visibleChannels.findIndex(channelData => channelData.name === channelName);
};

const channelSlice = createSlice({
  name: "channel",
  initialState,
  reducers: {
    setType: (state, action: PayloadAction<{ channelName: string; type: ChannelType }>) => {
      const { channelName, type } = action.payload;
      const channelIndex = findChannelIdndex(state, channelName);

      if (channelIndex !== -1)
        state.visibleChannels[channelIndex].type = type;
    },
    setName: (state, action: PayloadAction<string>) => {
      // state.channelData.name = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      // state.channelData.password = action.payload;
    },
    addMessageToActiveChannel: (state, action: PayloadAction<ChannelMessageData>) => {
      state.activeChannel?.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveChannel.fulfilled, (state, action) => {
      // state.activeChannel = ;
    })
    // .addCase(fetchVisibleChannels.fulfilled, (state, action) => {
    //   state.visibleChannels = action.payload.reduce(
    //     (visibleChannels: ChannelData[], roomInfo: any) => {

    //     return visibleChannels;
    //   }, [])
    // });
  },
});

export const { setType, setName, setPassword, addMessageToActiveChannel } = channelSlice.actions;
export default channelSlice.reducer;
