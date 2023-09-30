import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import PromptCard from "./PromptCard";
import { useSession } from "next-auth/react";
import { fetchSavedData } from "@redux_store/slices/savedPromptSlice";
import { savedPrompts } from "@redux_store/slices/savedPromptSlice";
import { prompts } from "@redux_store/slices/getPostLoggedUserSlice";
import { savedPromptIsLoading } from "@redux_store/slices/savedPromptSlice";
import { loggedUserIsLoading } from "@redux_store/slices/getPostLoggedUserSlice";
import Loading from "./Loading";
import { useDispatch, useSelector } from "react-redux";

const Profile = ({ name, desc, handleEdit }) => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const savedPrompt = useSelector(savedPrompts);
  const loggedPrompts = useSelector(prompts);
  const isLoggedUserLoading = useSelector(loggedUserIsLoading);
  const savedPromptLoading = useSelector(savedPromptIsLoading);
  const [savedData, setSavedData] = useState([]);
  const [activeBtn, setActiveBtn] = useState("myposts");

  const handleMypost = async () => {
    loggedPrompts.length > 0 ? setSavedData(loggedPrompts) : setSavedData([]);
    setActiveBtn("myposts");
  };

  const handleSavedPost = async () => {
    savedPrompt && setSavedData(savedPrompt[0]?.prompts);
    setActiveBtn("savedposts");
  };

  useEffect(() => {
    session?.user && dispatch(fetchSavedData({ userId: session?.user.id }));
  }, [session]);

  useEffect(() => {
    setSavedData(loggedPrompts);
  }, [isLoggedUserLoading, loggedPrompts]);

  useEffect(() => {
    savedPrompt && setSavedData(savedPrompt[0]?.prompts);
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
            className={activeBtn === "myposts" ? "black_btn" : "outline_btn"}
            onClick={handleMypost}
          >
            My Posts
          </button>
          <button
            className={activeBtn === "savedposts" ? "black_btn" : "outline_btn"}
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
          {savedData.length > 0 &&
            savedData.map((post) => (
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
            <p className="text-2xl">
              No prompts created yet. Create some awesome prompts and share with
              the community.
            </p>
          </div>
        )}
      {!savedPromptIsLoading && savedPrompt === undefined && activeBtn === "savedposts" && (
        <div className="flex justify-center mt-10">
          <p className="text-2xl">
            No saved prompts yet. Explore and save amazing prompts
          </p>
        </div>
      )}
    </section>
  );
};

export default Profile;
