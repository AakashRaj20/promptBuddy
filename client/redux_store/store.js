import { configureStore } from "@reduxjs/toolkit";
import savedPromptSlice from "./slices/savedPromptSlice";
import allPromptSliceById from "./slices/allPromptSliceById";
import getPostLoggedUserSlice from "./slices/getPostLoggedUserSlice";

const store = configureStore({
  reducer: {
    savedPrompt: savedPromptSlice,
    allPrompt: allPromptSliceById,
    getPostLoggedUser: getPostLoggedUserSlice,
  },
});

export default store;
