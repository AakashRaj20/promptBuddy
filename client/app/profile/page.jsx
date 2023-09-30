"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchPromptsLoggedUser } from "@redux_store/slices/getPostLoggedUserSlice";
import { prompts } from "@redux_store/slices/getPostLoggedUserSlice";
import Profile from "@components/Profile";

const MyProfile = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const loggedPrompts = useSelector(prompts);
  const [myPosts, setMyPosts] = useState([]);

  if(!session?.user){
    router.push('/');
  }

  useEffect(() => {
    if (session?.user.id) {
      dispatch(fetchPromptsLoggedUser(session?.user.id));
      setMyPosts(loggedPrompts);
    }
  }, [session?.user.id]);

  const handleEdit = (post) => {
    router.push(`/update-prompt?id=${post._id}`);
  };

  return (
    <Profile
      name="My"
      desc="Welcome to your personalized profile page. Share your exceptional prompts and inspire others with the power of your imagination"
      data={myPosts}
      handleEdit={handleEdit}
    />
  );
};

export default MyProfile;
