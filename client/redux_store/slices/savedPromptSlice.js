import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  savedPrompts: [{prompts: []}],
  isloading: false,
  error: null,
};

export const fetchSavedData = createAsyncThunk(
  "content/fetchSavedData",
  async ({userId}) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/user/${userId}/savedPrompts`
      );
      const data = await response.data;
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const savePrompt = createAsyncThunk(
  "content/savePrompt",
  async ({ sessionId, postId }) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/user/${sessionId}/prompt/${postId}/save`
      );
      console.log(response.data);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }
);

export const unSavePrompt = createAsyncThunk(
  "content/unSavePrompt",
  async ({ sessionId, postId }) => {
    try {
      await axios.delete(
        `http://localhost:8000/api/user/${sessionId}/prompt/${postId}/unsave`
      );
    } catch (error) {
      console.error(error);
    }
  }
);

export const savedPromptSlice = createSlice({
  name: "savedPrompt",
  initialState,
  reducers: {
    removeSavedPrompt: (state, action) => {
      const { postId } = action.payload;
      state.savedPrompts[0].prompts = state.savedPrompts[0].prompts.filter(
        (prompt) => prompt._id !== postId
      );
    },
    addSavedPrompt: (state, action) => {
      const { prompt } = action.payload;
      if(state.savedPrompts && state.savedPrompts[0] && state.savedPrompts[0]?.prompts.length >= 0){
        state.savedPrompts[0].prompts = [
          ...state.savedPrompts[0].prompts,
          prompt,
        ];

      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSavedData.pending, (state) => {
      state.isloading = true;
    });
    builder.addCase(fetchSavedData.fulfilled, (state, action) => {
      state.isloading = false;
      state.savedPrompts = action.payload;
    });
    builder.addCase(fetchSavedData.rejected, (state, action) => {
      state.isloading = false;
      state.error = action.error.message;
    });
  },
});

export default savedPromptSlice.reducer;
export const { removeSavedPrompt, addSavedPrompt } = savedPromptSlice.actions;
export const savedPrompts = (state) => state.savedPrompt.savedPrompts;
export const savedPromptIsLoading = (state) => state.savedPrompt.isloading;
export const error = (state) => state.savedPrompt.error;
