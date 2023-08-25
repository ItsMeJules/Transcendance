import { createAction, createSlice } from "@reduxjs/toolkit";

import User from "../../Services/User";

const userSlice = createSlice({
  name: "users",
  initialState: new User,
  reducers: {

  }
})