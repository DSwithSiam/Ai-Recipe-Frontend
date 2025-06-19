import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  useGetMainRecipeDettailsQuery,
  useRecipeCommentCreateMutation,
  useGetRecipeCommentListQuery,

} from "../../../../Rudux/feature/ApiSlice";
import toast, { Toaster } from "react-hot-toast";
import { IoShareSocialOutline } from "react-icons/io5";


import RecipeSave from "./RecipeSave";
import RecipeComment from "./RecipeComment";
import RecipeShare from "./RecipeShare";
import { FaRegCommentDots } from "react-icons/fa";

//for  recipe share button or fuction


function RecipesDettails() {
  const { id } = useParams();
  // Get the recipe ID from URL
  const {
    data: getMainRecipeDettails,
    isLoading,
    isError,
  } = useGetMainRecipeDettailsQuery(id); // Fetch recipe

  console.log("Recipe Details Data:", getMainRecipeDettails);

  const {
    data: getRecipeCommentList,
    isLoading: isCommentsLoading,
    isError: isCommentsError,
  } = useGetRecipeCommentListQuery(id);

  const [
    recipeCommentCreate,
    { isLoading: isCommentLoading, error: commentError },
  ] = useRecipeCommentCreateMutation();

  const commentDataInfo = getRecipeCommentList?.data || [];

  console.log(commentDataInfo, "Comment Data Info");
  console.log("Recipe ID from useParams:", id);
  console.log("Comments from API:", getRecipeCommentList);

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    if (rating === 0 || comment.trim() === "") {
      toast.error("Please provide a rating and a comment.");
      return;
    }

    // Ensure id is a number and not undefined
    const recipeId = id ? Number(id) : null;
    if (!recipeId) {
      toast.error("Recipe ID is missing. Please check the URL or routing.");
      console.error("Recipe ID is undefined or invalid:", id);
      return;
    }

    // Prepare the payload for the API
    const commentData = {
      user: 8, // Ideally, get this from auth context
      content: comment, // Comment text from state
      rating: rating, // Rating from state
    };

    try {
      // Send the comment to the API with id and commentData
      const response = await recipeCommentCreate({
        id: recipeId,
        commentData,
      }).unwrap();
      console.log("API Response:", response);

      setComment("");
      setRating(0);
      setHover(0);
      toast.success(response.message); // Show success message from API
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Failed to post comment. Please try again.");
    }
  };

  const [activeTab, setActiveTab] = useState("Ingredients");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    if (!getMainRecipeDettails?.data) return null;

    switch (activeTab) {
      case "Ingredients":
        return (
          <div className="px-6 py-4">
            <h2 className="text-xl font-semibold text-[#5B21BD] mb-4">
              Recipe Ingredients
            </h2>
            <div className="space-y-6">
              {getMainRecipeDettails.data.ingredients.map((ingredient, index) => (
                <div key={index} className="flex text-[#CCBAEB] gap-6">
                  <p className="w-4/10 border border-[#CCBAEB] rounded-[10px] py-3 px-3">
                    {ingredient.name}
                  </p>
                  <p className="w-2/10 border border-[#CCBAEB] rounded-[10px] text-center py-3 px-3">
                    {ingredient.quantity}
                  </p>
                  <p className="w-4/10 border border-[#CCBAEB] rounded-[10px] py-3 px-3">
                    {ingredient.unit || "N/A"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      case "Instructions":
        return (
          <div className="px-6 py-4">
            <h2 className="text-xl font-semibold text-[#5B21BD] mb-4">
              Recipe Instructions
            </h2>
            <div className="space-y-6 text-[#CCBAEB]">
              {getMainRecipeDettails.data.instructions.map((instruction, index) => (
                <p
                  key={index}
                  className="w-full border border-[#CCBAEB] rounded-[10px] py-3 px-3"
                >
                  {`${index + 1}. ${instruction.text}`}
                </p>
              ))}
            </div>
          </div>
        );
      case "Chef's Notes":
        return (
          <div className="px-6 py-4">
            <h2 className="text-xl font-semibold text-[#5B21BD] mb-4">
              Chef's Notes
            </h2>
            <div className="space-y-6 text-[#CCBAEB]">
              {getMainRecipeDettails.data.chef_notes.map((note, index) => (
                <p
                  key={index}
                  className="w-full border border-[#CCBAEB] rounded-[10px] py-3 px-3"
                >
                  {`${index + 1}. ${note.text}`}
                </p>
              ))}
            </div>
          </div>
        );
      case "Comments":
        return (
          <div className="p-6 rounded-[10px]">
            <h2 className="text-xl font-semibold mb-4">Comments & Rating</h2>
            <div className="space-y-4 lora">
              {isCommentsLoading && (
                <p className="text-[#5B21BD]">Loading comments...</p>
              )}
              {isCommentsError && (
                <p className="text-red-500">Error loading comments.</p>
              )}
              {commentDataInfo && commentDataInfo?.length > 0
                ? commentDataInfo?.map((comment, index) => (
                  <div
                    key={comment.id} // Use comment.id for unique key
                    className="flex items-start space-x-4 p-4 border border-[#D9E0DC] rounded-[10px]"
                  >
                    <img
                      src="https://randomuser.me/api/portraits/men/5.jpg" // Replace with comment.user.avatar if available
                      alt={`User ${comment.user}`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div className="flex items-center gap-6">
                          <h3 className="text-[24px] font-medium text-[#5B21BD]">
                            {`User ${comment.user}`}{" "}
                            {/* Fallback to user ID */}
                          </h3>
                          <span className="text-sm text-gray-500">
                            {new Date(comment.created_at).toLocaleString(
                              "en-US",
                              {
                                weekday: "long", // e.g., "Tuesday"
                                year: "numeric", // e.g., "2025"
                                month: "numeric", // e.g., "6"
                                day: "numeric", // e.g., "3"
                                hour: "numeric", // e.g., "7"
                                minute: "2-digit", // e.g., "19"
                                hour12: true, // Use 12-hour format with AM/PM
                              }
                            )}
                          </span>
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-5 h-5 ${i < comment.rating
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                                }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 mt-1">{comment.content}</p>
                    </div>
                  </div>
                ))
                : null}
            </div>
            <div className="mt-6 p-4 bg-white rounded-lg shadow-sm">
              <div className="flex gap-4 mb-4">
                <h3 className="text-lg font-medium text-[#555050]">
                  Your Rating:
                </h3>
                <div className="flex items-center 4">
                  {[...Array(5)].map((_, index) => {
                    const ratingValue = index + 1;
                    return (
                      <label key={index}>
                        <input
                          type="radio"
                          name="rating"
                          value={ratingValue}
                          onClick={() => setRating(ratingValue)}
                          className="hidden"
                        />
                        <svg
                          className={`w-6 h-6 cursor-pointer ${ratingValue <= (hover || rating)
                              ? "text-yellow-400"
                              : "text-gray-300"
                            }`}
                          onMouseEnter={() => setHover(ratingValue)}
                          onMouseLeave={() => setHover(0)}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </label>
                    );
                  })}
                </div>
              </div>
              <textarea
                className="w-full p-2 border rounded-[10px] border-[#D9E0DC]"
                rows="3"
                placeholder="Share your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
              <button
                className="mt-3 px-4 py-2 bg-[#5B21BD] cursor-pointer text-white rounded-lg"
                onClick={handleSubmit}
                disabled={isCommentLoading}
              >
                {isCommentLoading ? "Posting..." : "Post Comment"}
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Handle loading, error, and not found states
  if (isLoading) {
    return (
      <div className="py-6 px-10">
        <p className="text-[#5B21BD] text-xl">Loading recipe...</p>
      </div>
    );
  }

  if (isError || !getMainRecipeDettails?.data) {
    return (
      <div className="py-6 px-10">
        <p className="text-[#5B21BD] text-xl">
          Recipe not found or an error occurred.
        </p>
      </div>
    );
  }

  const recipe = getMainRecipeDettails.data; // Use API data


  return (
    <div className="py-6 px-10">
      <div className="rounded-lg  py-3 px-3">
        {/* Header Section */}
        <div
          className="relative lg:h-[600px] md:h-[500px] flex items-center justify-center bg-cover bg-center rounded-xl"
          style={{
            backgroundImage: `url(https://bmn1212.duckdns.org${recipe.image})`,
          }} // Dynamic background image from API
        >
          <div className="absolute inset-0 bg-[#5B21BD78] bg-opacity-50 rounded-xl"></div>
          <h1 className="relative text-5xl font-bold text-white z-10 capitalize">
            {recipe.title}
          </h1>{" "}
          {/* Dynamic title */}
        </div>

        {/* Metadata Section */}
        <div className="flex justify-between items-center px-2 mt-2 py-4">
          <div>
            <span className="bg-[#CCBAEB] rounded-[29px] px-3 py-1 mr-5 text-[#5B21BD] capitalize">
              {recipe.category_name} {/* Dynamic category from API */}
            </span>
            <span>Updated: {recipe.updated_at.split("T")[0]}</span>{" "}
            {/* Dynamic updated date, formatted */}
          </div>
          <div className="flex gap-6">
            {/* <RecipeSave recipeId={recipe.id} /> */}
            <RecipeSave
              recipeId={recipe.id}
              initiallySaved={recipe.save_recipe}
            />

            <Link

              to={`/dashboard/ai_chat`}            
              className="flex items-center text-[#5B21BD] border border-[#5B21BD] rounded p-1 cursor-pointer px-2"
            >
              <span className="mr-2">Chat</span>
              <FaRegCommentDots />
            </Link>

            <RecipeShare recipeId={recipe.id} />



          </div>
        </div>

        {/* Description */}
        <p className="px-6 py-4 text-[#696969] text-[16px]">
          {recipe.description} {/* Dynamic description from API */}
        </p>

        {/* Tabs */}
        <div className="flex bg-[#EFE9F8] py-2 justify-around text-[20px] rounded-[10px]">
          <button
            className={`px-20 py-2 rounded-[10px] ${activeTab === "Ingredients"
                ? "bg-[#5B21BD] text-white"
                : "text-gray-600"
              }`}
            onClick={() => handleTabClick("Ingredients")}
          >
            Ingredients
          </button>
          <button
            className={`px-20 py-2 rounded-[10px] ${activeTab === "Instructions"
                ? "bg-[#5B21BD] text-white"
                : "text-gray-600"
              }`}
            onClick={() => handleTabClick("Instructions")}
          >
            Instructions
          </button>
          <button
            className={`px-20 py-2 rounded-[10px] ${activeTab === "Chef's Notes"
                ? "bg-[#5B21BD] text-white"
                : "text-gray-600"
              }`}
            onClick={() => handleTabClick("Chef's Notes")}
          >
            Chef's Notes
          </button>
          <button
            className={`px-20 py-2 rounded-[10px] ${activeTab === "Comments"
                ? "bg-[#5B21BD] text-white"
                : "text-gray-600"
              }`}
            onClick={() => handleTabClick("Comments")}
          >
            Comments
          </button>
        </div>

        {/* Tab Content */}
        {renderContent()}
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

export default RecipesDettails;
