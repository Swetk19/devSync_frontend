// src/utils/requestSlice.js  — replace the whole file
import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
  name: "requests",
  initialState: [],           // ← change null to []
  reducers: {
    addRequests: (state, action) => action.payload,
    removeRequest: (state, action) =>
      state.filter((req) => req._id !== action.payload),
  },
});

export const { addRequests, removeRequest } = requestSlice.actions;
export default requestSlice.reducer;