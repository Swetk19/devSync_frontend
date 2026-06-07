import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: {
    users: null,           // the feed array
    selectedSkills: [],    // active skill filters
  },
  reducers: {
    addFeed: (state, action) => {
      state.users = action.payload;
    },
    removeUserFromFeed: (state, action) => {
      state.users = state.users.filter((user) => user._id !== action.payload);
    },
    setSelectedSkills: (state, action) => {
      state.selectedSkills = action.payload;
    },
    clearSkillFilter: (state) => {
      state.selectedSkills = [];
    },
  },
});

export const { addFeed, removeUserFromFeed, setSelectedSkills, clearSkillFilter } = feedSlice.actions;
export default feedSlice.reducer;