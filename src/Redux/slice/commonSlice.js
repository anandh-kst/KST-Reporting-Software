import { createSlice } from "@reduxjs/toolkit";

export const commonSlice = createSlice({
  name: "common",
  initialState: {
    isModelOpen: false, //default value87
    hasModalShownToday: false,
  },
  reducers: {
    openModel: (state, action) => {
      console.log("action", action.payload);
      state.isModelOpen = action.payload;
    },
    closeModel: (state, action) => {
      state.isModelOpen = false;
    },
    setHasModalShownToday: (state, action) => {
      state.hasModalShownToday = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { closeModel, openModel,setHasModalShownToday  } = commonSlice.actions;

export default commonSlice.reducer;
