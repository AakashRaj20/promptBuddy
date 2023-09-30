import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAllPromptsById = createAsyncThunk(
  "content/fetchAllPrompts",
  async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/prompts`);
      const data = await response.data;
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

const initialState = {
  allPrompts: [],
  allPromptsLoading: false,
  error: null,
};

const allPromptSliceById = createSlice({
  name: "allPrompt",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllPromptsById.pending, (state) => {
      state.allPromptsLoading = true;
    });
    builder.addCase(fetchAllPromptsById.fulfilled, (state, action) => {
      state.allPromptsLoading = false;
      state.allPrompts = action.payload;
    });
    builder.addCase(fetchAllPromptsById.rejected, (state, action) => {
      state.allPromptsLoading = false;
      state.error = action.error.message;
    });
  },
});

export default allPromptSliceById.reducer;
export const allPrompts = (state) => state.allPrompt.allPrompts;
export const allPromptsLoading = (state) => state.allPrompt.allPromptsLoading;
export const error = (state) => state.allPrompt.error;
