import { Schema, model } from "mongoose";

const SavedPromptSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Creator ID is required."],
  },
  prompts: [{ 
    type: Schema.Types.ObjectId, 
    ref: "Prompt" 
  }], 
});

const SavedPrompt = model("Saved_Prompt", SavedPromptSchema);

export default SavedPrompt;
