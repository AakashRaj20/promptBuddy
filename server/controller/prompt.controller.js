import Prompt from "../model/prompt.js";
import User from "../model/user.js";
import SavedPrompt from "../model/savedPrompt.js";
import VotedPrompt from "../model/voted.js";
import mongoose from "mongoose";
import { isAuthenticated } from "../middleware/middleware.js";

// GET all prompts
export const getAllPrompts = async (req, res) => {
  try {
    const prompts = await Prompt.find({}).populate("creator");
    return res.status(200).json(prompts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// POST
export const createPost = async (req, res) => {
  const { userId, prompt, tag } = req.body;

  try {
    const newPrompt = new Prompt({ creator: userId, prompt, tag });

    await newPrompt.save();
    return res.status(201).json(newPrompt);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET post by ID for logged in user
export const getPostLoggedUser = async (req, res) => {
  try {
    const { id } = req.params;
    const prompts = await Prompt.find({ creator: id }).populate("creator");

    return res.status(200).json(prompts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET post by ID to edit
export const getPostByID = async (req, res) => {
  try {
    const { id } = req.params;
    const prompt = await Prompt.findById(id).populate("creator");
    if (!prompt) return res.status(404).json({ message: "Prompt Not Found" });

    return res.status(200).json(prompt);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Edit prompt
export const editPrompt = async (req, res) => {
  try {
    const { prompt, tag } = req.body;
    const { id } = req.params;

    // Find the existing prompt by ID
    const existingPrompt = await Prompt.findById(id);

    if (!existingPrompt) {
      res.status(404).json({ message: "Prompt not found" });
    }

    // Update the prompt with new data
    existingPrompt.prompt = prompt;
    existingPrompt.tag = tag;

    await existingPrompt.save();

    return res
      .status(200)
      .json({ message: "Successfully updated the Prompts" });
  } catch (error) {
    return res.status(500).json({ message: "Error Updating Prompt" });
  }
};

// DELTE Prompt
export const deletePrompt = async (req, res) => {
  try {
    // Find the prompt by ID and remove it
    const { id } = req.params;
    await Prompt.findByIdAndRemove(id);

    return res.status(200).json({ message: "Prompt deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting prompt" });
  }
};

// Post to save prompt
export const savePrompt = async (req, res) => {
  try {
    const { userId, promptId } = req.params;

    // Find the user's saved prompts document by user ID
    let savedPrompt = await SavedPrompt.findOne({ creator: userId });

    if (!savedPrompt) {
      // If the user's saved prompts document doesn't exist, create it
      savedPrompt = new SavedPrompt({
        creator: userId,
        prompts: [], // Initialize an empty array for prompts
      });

      await savedPrompt.save();
    }

    //Check if the prompt ID is already in the user's saved prompts
    if (savedPrompt.prompts.includes(promptId)) {
      return res
        .status(400)
        .json({ message: "Prompt already saved by the user" });
    }

    // Add the prompt ID to the user's saved prompts
    savedPrompt.prompts.push(promptId);

    // Save the updated user's saved prompts
    await savedPrompt.save();

    return res.status(200).json({ message: "Prompt saved successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Unsave prompt
export const unsavePrompt = async (req, res) => {
  try {
    const { userId, promptId } = req.params;

    // Find the user's saved prompts document by user ID
    let savedPrompt = await SavedPrompt.findOne({ creator: userId });

    if (!savedPrompt) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the prompt ID is in the user's saved prompts
    if (!savedPrompt.prompts.includes(promptId)) {
      // Update to 'prompts' field
      return res
        .status(400)
        .json({ message: "Prompt is not saved by the user" });
    }

    // Remove the prompt ID from the user's saved prompts
    savedPrompt.prompts = savedPrompt.prompts.filter(
      (savedPromptId) => savedPromptId.toString() !== promptId
    );

    // Save the updated user's saved prompts
    await savedPrompt.save();

    return res.status(200).json({ message: "Prompt unsaved successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET saved prompts
export const getSavedPrompts = async (req, res) => {
  try {
    const { userId } = req.params;

    const savedPrompts = await SavedPrompt.aggregate([
      {
        $match: {
          creator: new mongoose.Types.ObjectId(userId), // Convert userId to ObjectId
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "creator",
          foreignField: "_id",
          as: "creator",
        },
      },
      {
        $lookup: {
          from: "prompts",
          localField: "prompts",
          foreignField: "_id",
          as: "prompts",
        },
      },
      {
        $unwind: "$creator",
      },
      {
        $unwind: "$prompts",
      },
      {
        $lookup: {
          from: "users",
          localField: "prompts.creator",
          foreignField: "_id",
          as: "prompts.creator",
        },
      },
      {
        $unwind: "$prompts.creator",
      },
      {
        $group: {
          _id: "$_id",
          creator: { $first: "$creator" },
          prompts: {
            $push: {
              _id: "$prompts._id",
              creator: "$prompts.creator", // Replace with creatorData if you want an object
              prompt: "$prompts.prompt",
              tag: "$prompts.tag",
              votes: "$prompts.votes",
              votedBy: "$prompts.votedBy",
            },
          },
        },
      },
    ]);

    // if (!savedPrompts || savedPrompts.length === 0) {
    //   return res
    //     .status(404)
    //     .json({ message: "No saved prompts found for this user" });
    // }

    return res.status(200).json(savedPrompts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// Post Upvote prompt by ID
export const upvotePrompt = async (req, res) => {
  try {
    const { promptId, userId } = req.params;
    //const { userId } = req.body; Assuming you have userId in the request body

    // Find the prompt by ID
    const prompt = await Prompt.findById(promptId);

    if (!prompt) {
      return res.status(404).json({ message: "Prompt not found" });
    }

    // Check if the user has already voted on this prompt (prevent multiple votes)
    if (prompt.votedBy.includes(userId)) {
      return res
        .status(400)
        .json({ message: "User has already voted on this prompt" });
    }

    // Increment the vote count by 1 and add the user to the votedBy array
    prompt.votes = prompt.votes + 1;
    prompt.votedBy.push(userId);

    // Save the updated prompt
    await prompt.save();

    return res.status(200).json({ message: "Prompt upvoted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// Delete Upvote prompt by ID
export const deleteUpvotePrompt = async (req, res) => {
  try {
    const { promptId, userId } = req.params;

    // Find the prompt by ID
    const prompt = await Prompt.findById(promptId);

    if (!prompt) {
      return res.status(404).json({ message: "Prompt not found" });
    }

    // Update the prompt's votes
    prompt.votes = prompt.votes - 1;
    prompt.votedBy = prompt.votedBy.filter(
      (votedById) => votedById.toString() !== userId
    );

    // Save the updated prompt
    await prompt.save();

    return res
      .status(200)
      .json({ message: "Prompt upvote deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
