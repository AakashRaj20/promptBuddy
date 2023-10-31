import express from "express";
import { isAuthenticated } from "../middleware/middleware.js";
import {
  createPost,
  getPostLoggedUser,
  editPrompt,
  getAllPrompts,
  getPostByID,
  deletePrompt,
  savePrompt,
  unsavePrompt,
  getSavedPrompts,
  upvotePrompt,
  deleteUpvotePrompt,
} from "../controller/prompt.controller.js";

const router = express.Router();

router.get("/prompts", getAllPrompts);
router.post("/user/:userId/prompt/:promptId/save", savePrompt);
router.post("/create-prompt", createPost);
router.get("/user/:id/posts", getPostLoggedUser);
router.get("/prompt/:id", getPostByID);
router.patch("/edit-prompt/:id", editPrompt);
router.delete("/delete-prompt/:id", deletePrompt);
router.delete("/user/:userId/prompt/:promptId/unsave", unsavePrompt);
router.get("/user/:userId/savedPrompts", getSavedPrompts);
router.post("/user/:userId/prompt/:promptId/upvote", upvotePrompt);
router.delete("/user/:userId/prompt/:promptId/downvote", deleteUpvotePrompt);



export default router;
