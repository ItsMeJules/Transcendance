import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { ChannelMessageData, ChannelType, PunishmentType } from "pages/ChatBox/models/Channel";

interface ChannelDataState {
  activeChannel: {
    type: string | null;
    name: string | null;
    displayname: string | null;
    password: string | null;
    usersId: number[];
    ownerId: number | null;
    adminsId: number[];
    punishments: {
      type: string;
      userId: number;
      expireAt: number | null;
    }[];
    messages: {
      authorId: number;
      text: string;
      userName: string;
      profilePicture: string;
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

export const findChannelByName = (state: ChannelDataState, channelName: string) => {
  return state.visibleChannels.find(channelData => channelData.name === channelName);
};

const findChannelIdndex = (state: ChannelDataState, channelName: string) => {
  return state.visibleChannels.findIndex(channelData => channelData.name === channelName);
};

export const getActiveChannelBans = (state: ChannelDataState): number[] => {
  return state.activeChannel?.punishments
    .filter(punishment => punishment.type === PunishmentType.BAN)
    .map(punishment => punishment.userId) || []
}

const channelSlice = createSlice({
  name: "channel",
  initialState,
  reducers: {
    setActiveChannel: (state, action: PayloadAction<any>) => {
      const payload = action.payload
      const channelType = payload.type === ChannelType.PUBLIC && payload.password !== null && payload.password.length !== 0 ? ChannelType.PROTECTED : payload.type
      let punishments: any = []

      if (payload.bans !== null && payload.bans.length !== 0) {
        punishments = punishments.concat(payload.bans.map((user: any) => {
          return { type: PunishmentType.BAN, userId: user.id, expireAt: null }
        }))
      }

      if (payload.mutes !== null && payload.mutes.length !== 0) {
        punishments = punishments.concat(payload.mutes.map((user: any) => {
          const expireAt = payload.muteUntil.find(
            (duration: any) => duration.id === user.id
          );

          return {
            type: PunishmentType.MUTE,
            userId: user.id,
            expireAt: expireAt
          }
        }))
      }

      const newState = {
        type: channelType,
        name: payload.name,
        displayname: channelType === ChannelType.DIRECT ? payload.displayname : payload.name,
        password: payload.password,
        usersId: payload.users !== undefined ? payload.users.map((user: any) => user.id) : [],
        ownerId: payload.ownerId,
        adminsId: payload.admins !== undefined ? payload.admins.map((user: any) => user.id) : [],
        punishments: punishments,
        messages: payload.messages,
      }

      state.activeChannel = newState
    },
    setActiveChannelMessages: (state, action: PayloadAction<ChannelMessageData[]>) => {
      if (state.activeChannel !== null)
        state.activeChannel.messages = action.payload;
    },
    setType: (state, action: PayloadAction<{ channelName: string; type: ChannelType }>) => {
      const { channelName, type } = action.payload;
      const channelIndex = findChannelIdndex(state, channelName);

      if (channelIndex !== -1)
        state.visibleChannels[channelIndex].type = type;
    },
    activeChannelAddAdmin: (state, action: PayloadAction<number>) => {
      state.activeChannel?.adminsId.push(action.payload)
    },
    activeChannelAddUser: (state, action: PayloadAction<number>) => {
      state.activeChannel?.usersId.push(action.payload)
    },
    activeChannelRemoveUser: (state, action: PayloadAction<number>) => {
      if (state.activeChannel !== null)
        state.activeChannel.usersId = state.activeChannel?.usersId.filter(id => id !== action.payload)
    },
    activeChannelRemoveAdmin: (state, action: PayloadAction<number>) => {
      if (state.activeChannel !== null)
        state.activeChannel.adminsId = state.activeChannel?.adminsId.filter(id => id !== action.payload)
    },
    setPassword: (state, action: PayloadAction<string>) => {
      // state.channelData.password = action.payload;
    },
    activeChannelRemoveUserBanned: (state, action: PayloadAction<number>) => {
      if (state.activeChannel !== null) {
        state.activeChannel.punishments = state.activeChannel.punishments.filter(punishment => {
          return (punishment.type !== PunishmentType.BAN &&
          punishment.userId !== action.payload);
        })
      }
    },
    activeChannelAddUserBanned: (state, action: PayloadAction<number>) => {
      state.activeChannel?.punishments.push({
        type: PunishmentType.BAN,
        userId: action.payload,
        expireAt: null,
      });
    },
    addMessageToActiveChannel: (state, action: PayloadAction<ChannelMessageData>) => {
      state.activeChannel?.messages.push(action.payload);
    },
  },
});

export const { setActiveChannel, setActiveChannelMessages, setType, setPassword,
  addMessageToActiveChannel, activeChannelAddAdmin, activeChannelRemoveAdmin,
  activeChannelRemoveUserBanned, activeChannelAddUserBanned, activeChannelAddUser,
  activeChannelRemoveUser } = channelSlice.actions;
export default channelSlice.reducer;
