import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import baseUrl from "@redux_store/baseurl";

export const fetchPromptsLoggedUser = createAsyncThunk("content/fetchPromptsLoggedUser", async (id) => {
    const response = await axios.get(`${baseUrl}/api/user/${id}/posts`);
    const data = await response.data;
    return data;
});

const initialState = {
    prompts: [],
    isLoading: false,
    error: null,
};

const getPostLoggedUserSlice = createSlice({
  name: "getPostLoggedUser",
  initialState,
  reducers: {
    deletePrompt: (state, action) => {
      const {promptId} = action.payload;
      state.prompts = state.prompts.filter((prompt) => prompt._id !== promptId);
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPromptsLoggedUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchPromptsLoggedUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.prompts = action.payload;
    });
    builder.addCase(fetchPromptsLoggedUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
  },
});

export default getPostLoggedUserSlice.reducer;
export const { deletePrompt } = getPostLoggedUserSlice.actions;
export const prompts = (state) => state.getPostLoggedUser.prompts;
export const loggedUserIsLoading = (state) => state.getPostLoggedUser.isLoading;
export const error = (state) => state.getPostLoggedUser.error;