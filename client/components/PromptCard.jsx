"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  removeSavedPrompt,
  addSavedPrompt,
} from "@redux_store/slices/savedPromptSlice";
import { savePrompt } from "@redux_store/slices/savedPromptSlice";
import { unSavePrompt } from "@redux_store/slices/savedPromptSlice";
import { savedPrompts } from "@redux_store/slices/savedPromptSlice";
import { deletePrompt } from "@redux_store/slices/getPostLoggedUserSlice";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import baseUrl from "@redux_store/baseurl";
import axios from "axios";
import SocialShare from "./SocialShareBox";

const PromptCard = ({ post, handleEdit, handleTagClick, dialougeStyle }) => {
  const { data: session } = useSession();
  const pathName = usePathname();
  const router = useRouter();

  const [copied, setCopied] = useState("");
  const dispatch = useDispatch();
  const savedPrompt = useSelector(savedPrompts);
  const [isSaved, setIsSaved] = useState(false); // Track save/unsave state
  const [isUpVoted, setIsUpVoted] = useState(false); // Track upvote state
  const [voteCount, setVoteCount] = useState(post.votes);

  useEffect(() => {
    // Check if the post is saved by the logged-in user
    if (savedPrompt && savedPrompt[0]?.prompts.length > 0) {
      const isPostSaved =
        savedPrompt &&
        savedPrompt[0]?.prompts.some((savedPost) => savedPost._id === post._id);
      setIsSaved(isPostSaved);
    }
  }, [session, savedPrompt, post]);
  console.log(post.votedVy);
  useEffect(() => {
    const voteStatus = post?.votedBy?.some((vote) => vote === session?.user.id);
    setIsUpVoted(voteStatus);
  }, [session, post]);

  const handleProfileClick = () => {
    if (post?.creator?._id === session?.user.id) return router.push("/profile");

    router.push(`/profile/${post.creator?._id}?name=${post.creator?.username}`);
  };

  const handleCopy = () => {
    setCopied(post.prompt);
    navigator.clipboard.writeText(post.prompt);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleToggleSave = async () => {
    if (!session?.user) {
      return;
    }

    try {
      if (isSaved) {
        await dispatch(
          unSavePrompt({
            sessionId: session?.user.id,
            postId: post._id,
          })
        );
        await dispatch(removeSavedPrompt({ postId: post._id }));
      } else {
        await dispatch(
          savePrompt({ sessionId: session?.user.id, postId: post._id })
        );
        await dispatch(addSavedPrompt({ prompt: post }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    dispatch(deletePrompt({ promptId: post._id }));
    await axios.delete(`${baseUrl}/api/delete-prompt/${post._id}`);
  };

  //console.log(isUpVoted);

  const handleVote = async () => {
    if (isUpVoted) {
      await axios.delete(
        `${baseUrl}/api/user/${session?.user.id}/prompt/${post._id}/downvote`
      );
      setVoteCount((prev) => prev - 1);
    } else {
      await axios.post(
        `${baseUrl}/api/user/${session?.user.id}/prompt/${post._id}/upvote`
      );
      setVoteCount((prev) => prev + 1);
    }

    setIsUpVoted((prev) => !prev);
  };

  const promptUrl = `${window.location.origin}/prompt/${post._id}`;

  return (
    <div className={dialougeStyle ? dialougeStyle : "prompt_card"}>
      <div className="flex justify-between items-start gap-4">
        <div
          className="flex-1 flex justify-start items-center gap-3 cursor-pointer"
          onClick={handleProfileClick}
        >
          <Image
            src={post.creator?.image}
            alt="user_image"
            width={40}
            height={40}
            className="rounded-full object-contain"
          />

          <div className="flex flex-col">
            <h3 className="font-satoshi font-semibold text-gray-900 dark:text-white">
              {post.creator?.username}
            </h3>
          </div>
        </div>
      </div>

      <p className="my-4 font-satoshi text-sm text-gray-700 dark:text-white">
        {post.prompt}
      </p>
      <p
        className="font-inter text-sm blue_gradient cursor-pointer"
        onClick={() => handleTagClick && handleTagClick(post.tag)}
      >
        {post.tag}
      </p>

      <div className="flex justify-between mt-4">
        <div className="copy_btn">
          <div className="flex gap-4">
            <Image
              onClick={handleVote}
              src={
                isUpVoted > 0
                  ? "/assets/icons/thumbsUp.svg"
                  : "/assets/icons/thumbUp.svg"
              }
              alt="thumbsUp_icon"
              width={40}
              height={40}
            />
            <p>{voteCount}</p>
          </div>
        </div>
        <div className="copy_btn">
          <SocialShare url={promptUrl} />
        </div>
        <div className="copy_btn" onClick={handleCopy}>
          <Image
            src={
              copied === post.prompt
                ? "/assets/icons/tick.svg"
                : "/assets/icons/copy.svg"
            }
            alt={copied === post.prompt ? "tick_icon" : "copy_icon"}
            width={20}
            height={20}
          />
        </div>

        {session?.user.id && (
          <div className="copy_btn" onClick={handleToggleSave}>
            <Image
              src={
                isSaved === true
                  ? "/assets/icons/saved.svg"
                  : "/assets/icons/save.svg"
              }
              alt="save_icon"
              width={20}
              height={20}
            />
          </div>
        )}
      </div>

      {session?.user.id === post.creator?._id && pathName === "/profile" && (
        <div className="mt-5 flex-center gap-4 border-t border-gray-100 pt-3">
          <p
            className="font-inter text-sm green_gradient cursor-pointer"
            onClick={handleEdit}
          >
            Edit
          </p>
          <p
            className="font-inter text-sm orange_gradient cursor-pointer"
            onClick={() => handleDelete()}
          >
            Delete
          </p>
        </div>
      )}
    </div>
  );
};

export default PromptCard;
