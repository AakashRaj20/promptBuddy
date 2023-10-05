"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import PromptCard from "./PromptCard";
import { useSession } from "next-auth/react";
import { fetchSavedData } from "@redux_store/slices/savedPromptSlice";
import { savedPrompts } from "@redux_store/slices/savedPromptSlice";
import { prompts } from "@redux_store/slices/getPostLoggedUserSlice";
import { savedPromptIsLoading } from "@redux_store/slices/savedPromptSlice";
import { loggedUserIsLoading } from "@redux_store/slices/getPostLoggedUserSlice";
import Loading from "@components/Loading";
import { useDispatch, useSelector } from "react-redux";

const Profile = ({ name, desc, handleEdit }) => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const savedPrompt = useSelector(savedPrompts);
  const loggedPrompts = useSelector(prompts);
  const isLoggedUserLoading = useSelector(loggedUserIsLoading);
  const savedPromptLoading = useSelector(savedPromptIsLoading);
  const [data, setData] = useState([]);
  const [activeBtn, setActiveBtn] = useState("myposts");

  const handleMypost = async () => {
    loggedPrompts.length > 0 ? setData(loggedPrompts) : setData([]);
    setActiveBtn("myposts");
  };

  const handleSavedPost = async () => {
    savedPrompt ? setData(savedPrompt[0]?.prompts) : setData([]);
    setActiveBtn("savedposts");
  };

  useEffect(() => {
    session?.user && dispatch(fetchSavedData({ userId: session?.user.id }));
  }, [session]);

  useEffect(() => {
    setData(loggedPrompts);
  }, [isLoggedUserLoading, loggedPrompts]);

  useEffect(() => {
    activeBtn === "savedposts" &&
      savedPrompt &&
      setData(savedPrompt[0]?.prompts);
  }, [savedPromptLoading, savedPrompt]);

  return (
    <section className="w-full">
      <h1 className="head_text text-left">
        <span className="blue_gradient">{name} Profile</span>
      </h1>
      <p className="desc text-left">{desc}</p>
      {pathname === "/profile" && (
        <div className="flex justify-evenly mt-9">
          <button
            className={activeBtn === "myposts" ? "mobile_black_btn" : "mobile_outline_btn"}
            onClick={handleMypost}
          >
            My Posts
          </button>
          <button
            className={activeBtn === "savedposts" ? "mobile_black_btn" : "mobile_outline_btn"}
            onClick={handleSavedPost}
          >
            Saved Posts
          </button>
        </div>
      )}
      {isLoggedUserLoading || savedPromptLoading ? (
        <Loading />
      ) : (
        <div className="mt-10 prompt_layout">
          {data.length > 0 &&
            data.map((post) => (
              <PromptCard
                key={post._id}
                post={post}
                handleEdit={() => handleEdit && handleEdit(post)}
              />
            ))}
        </div>
      )}
      {!isLoggedUserLoading && loggedPrompts &&
        loggedPrompts.length === 0 &&
        activeBtn === "myposts" && (
          <div className="flex justify-center mt-10">
            <p className="text-2xl text-center">
              No prompts created yet. Create some awesome prompts and share with
              the community.
            </p>
          </div>
        )}
      {(!savedPromptIsLoading || savedPrompt === undefined || savedPrompt[0]?.prompts.length === 0) && activeBtn === "savedposts" && (
        <div className="flex justify-center mt-10">
          <p className="text-2xl text-center">
            No saved prompts yet. Explore and save amazing prompts
          </p>
        </div>
      )}
    </section>
  );
};

export default Profile;
