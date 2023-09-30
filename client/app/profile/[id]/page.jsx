"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchPromptsLoggedUser } from "@redux_store/slices/getPostLoggedUserSlice";
import { prompts } from "@redux_store/slices/getPostLoggedUserSlice";
import { useDispatch, useSelector } from "react-redux";

import Profile from "@components/Profile";

const UserProfile = ({ params }) => {
  const searchParams = useSearchParams();
  const userName = searchParams.get("name");
  const dispatch = useDispatch();
  const data = useSelector(prompts);

  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    if (params?.id) {
      dispatch(fetchPromptsLoggedUser(params.id));
      setUserPosts(data);
    }
  }, [params.id]);

  return (
    <Profile
      name={userName}
      desc={`Welcome to ${userName}'s personalized profile page. Explore ${userName}'s exceptional prompts and be inspired by the power of their imagination`}
      data={userPosts}
    />
  );
};

export default UserProfile;
