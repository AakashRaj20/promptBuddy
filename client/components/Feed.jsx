"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPromptsById } from "@redux_store/slices/allPromptSliceById";
import { allPrompts } from "@redux_store/slices/allPromptSliceById";
import { fetchSavedData } from "@redux_store/slices/savedPromptSlice";
import { allPromptsLoading } from "@redux_store/slices/allPromptSliceById";
import PromptCard from "./PromptCard";
import Loading from "./Loading";

const PromptCardList = ({ data, handleTagClick }) => {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const isPromptLoading = useSelector(allPromptsLoading);

  useEffect(() => {
    session?.user && dispatch(fetchSavedData({ userId: session?.user.id }));
  }, [session]);

  return isPromptLoading ? (
    <Loading />
  ) : (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const dispatch = useDispatch();
  const allPrompt = useSelector(allPrompts);

  // Search states
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);

  useEffect(() => {
    dispatch(fetchAllPromptsById());
  }, []);

  const filterPrompts = (searchtext) => {
    const regex = new RegExp(searchtext, "i"); // 'i' flag for case-insensitive search
    return allPrompt.filter(
      (item) =>
        regex.test(item.creator.username) ||
        regex.test(item.tag) ||
        regex.test(item.prompt)
    );
  };

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    // debounce method
    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filterPrompts(e.target.value);
        setSearchedResults(searchResult);
      }, 500)
    );
  };

  const handleTagClick = (tagName) => {
    setSearchText(tagName);

    const searchResult = filterPrompts(tagName);
    setSearchedResults(searchResult);
  };

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>

      {/* All Prompts */}
      {searchText ? (
        <PromptCardList
          data={searchedResults}
          handleTagClick={handleTagClick}
        />
      ) : (
        <PromptCardList data={allPrompt} handleTagClick={handleTagClick} />
      )}
    </section>
  );
};

export default Feed;
