import { createAction, createReducer } from "@reduxjs/toolkit";

import { ChannelData, ChannelType } from "../../Screens/chat/models/Channel";

interface ChannelDataState {
  channelsData: ChannelData[]
}

const initialState = {
  channelsData: []
} as ChannelDataState;

// any used because WritableDraft isn't exported
const findChannelIndex = (channelsData: any[], channelName: string) => {
  return channelsData.findIndex(channelData => channelData.name === channelName);
};

export const addChannel = createAction<ChannelData>("channel/addChannel")

export const setType = createAction<{ channelName: string; type: ChannelType }>("channel/setType");
export const setName = createAction<string>("channel/setName");
export const setPassword = createAction<string>("channel/setPassword");

export const channelReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(addChannel, (state, action) => {
      if (state.channelsData.find(data => data.name === action.payload.name) === undefined)
        state.channelsData.push(action.payload)
    })
    .addCase(setType, (state, action) => {
      const { channelName, type } = action.payload;
      const channelIndex = findChannelIndex(state.channelsData, channelName);

      if (channelIndex != -1)
        state.channelsData[channelIndex].type = type;
    })
    .addCase(setName, (state, action) => {
      // state.channelData.name = action.payload;
    })
    .addCase(setPassword, (state, action) => {
      // state.channelData.password = action.payload;
    });
});
