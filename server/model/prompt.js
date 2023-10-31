import { Schema, model } from "mongoose";

const PromptSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  prompt: {
    type: String,
    required: [true, "Prompt is required."],
  },
  tag: {
    type: String,
    required: [true, "Tag is required."],
  },
  votes: {
    type: Number,
    default: 0,
  },
  votedBy: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Prompt = model("Prompt", PromptSchema);

export default Prompt;
