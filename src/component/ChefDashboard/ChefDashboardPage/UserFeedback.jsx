
import { useState, useEffect, useRef } from 'react';
import { CiFilter } from 'react-icons/ci';
import { HiDotsHorizontal, HiStar } from 'react-icons/hi';
import {
  useGetCategoryListQuery,
  useGetUserFeedbackListQuery,
  useUserFeedbackDeleteMutation,
} from '../../../Rudux/feature/ApiSlice';
import toast, { Toaster } from 'react-hot-toast';
 
function UserFeedback() {
  const { data: getUserFeedbackList } = useGetUserFeedbackListQuery();
  const feedbackData = getUserFeedbackList?.data || [];
  console.log(feedbackData,"feedbackData")

 const [userFeedbackDelete] = useUserFeedbackDeleteMutation();
 console.log(userFeedbackDelete,"dsfddsfsdfsdf")
  const { data: categoryList } = useGetCategoryListQuery();
 
  const [selectedRecipe, setSelectedRecipe] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [showRecipeDropdown, setShowRecipeDropdown] = useState(false);
  const [showRatingDropdown, setShowRatingDropdown] = useState(false);
  const [activeDropdownIndex, setActiveDropdownIndex] = useState(null);
 
  const recipeDropdownRef = useRef(null);
  const ratingDropdownRef = useRef(null);
  const dropdownRefs = useRef([]);
 
  // Unique recipe list
  const uniqueRecipes = [...new Set(feedbackData.map((item) => item.recipe_id))];
  const ratingOptions = Array.from({ length: 5 }, (_, i) => i + 1);
 
  // Handle filtering
  const filteredData = feedbackData.filter((item) => {
    const matchesRecipe = selectedRecipe ? item.recipe_id === selectedRecipe : true;
    const matchesRating = selectedRating ? item.rating === parseInt(selectedRating) : true;
    return matchesRecipe && matchesRating;
  });
 
  // Render stars
  const renderStars = (rating) => {
    const totalStars = 5;
    const stars = [];
 
    for (let i = 0; i < rating; i++) {
      stars.push(<HiStar key={`filled-${i}`} className="text-[#FACC15] inline" />);
    }
    for (let i = rating; i < totalStars; i++) {
      stars.push(<HiStar key={`unfilled-${i}`} className="text-[#E4E4E4] inline" />);
    }
    return stars;
  };
 
  const handleRecipeFilter = (recipe) => {
    setSelectedRecipe(recipe);
    setShowRecipeDropdown(false);
  };
 
  const handleRatingFilter = (rating) => {
    setSelectedRating(rating);
    setShowRatingDropdown(false);
  };
 
  const clearRecipeFilter = () => {
    setSelectedRecipe('');
    setShowRecipeDropdown(false);
  };
 
  const clearRatingFilter = () => {
    setSelectedRating('');
    setShowRatingDropdown(false);
  };
 
 
 const handleDelete = async (id) => {
  try {
    await userFeedbackDelete(id).unwrap();
    toast.success('Feedback deleted successfully');
    setActiveDropdownIndex(null);
  } catch (error) {
    console.error('Failed to delete feedback:', error);
    toast.error('Failed to delete feedback. Please try again.');
  }
};

 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        recipeDropdownRef.current &&
        !recipeDropdownRef.current.contains(event.target)
      ) {
        setShowRecipeDropdown(false);
      }
      if (
        ratingDropdownRef.current &&
        !ratingDropdownRef.current.contains(event.target)
      ) {
        setShowRatingDropdown(false);
      }
      if (
        !dropdownRefs.current.some(
          (ref) => ref && ref.contains(event.target)
        )
      ) {
        setActiveDropdownIndex(null);
      }
    };
 
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
 
  return (
    <div className="py-2 px-10 lora">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[#5B21BD] text-[34px] font-semibold">User Feedback</h1>
          <p className="text-[#9E9E9E] mb-6">Manage feedback from users on your recipes</p>
        </div>
        <div className="flex gap-4">
          {/* Filter by Recipe */}
          <div className="relative" ref={recipeDropdownRef}>
            <button
              onClick={() => setShowRecipeDropdown(!showRecipeDropdown)}
              className="text-[#5B21BD] border border-[#5B21BD] py-2 px-6 rounded-full flex items-center gap-2 cursor-pointer"
              aria-label="Filter by recipe"
              aria-expanded={showRecipeDropdown}
            >
              <CiFilter />
              <span>Filter by Recipe</span>
            </button>
            {showRecipeDropdown && (
              <div className="absolute top-12 left-0 text-[#5B21BD] bg-white border border-[#5B21BD] rounded-lg shadow-lg w-48 z-10">
                <button
                  onClick={clearRecipeFilter}
                  className="w-full text-left px-4 py-2 rounded-lg hover:bg-[#5B21BD]/10 cursor-pointer"
                >
                  All
                </button>
                {uniqueRecipes.map((recipe, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecipeFilter(recipe)}
                    className="w-full text-left px-4 py-2 hover:bg-[#5B21BD]/10 cursor-pointer capitalize"
                  >
                    {recipe}
                  </button>
                ))}
              </div>
            )}
          </div>
 
          {/* Filter by Rating */}
          <div className="relative" ref={ratingDropdownRef}>
            <button
              onClick={() => setShowRatingDropdown(!showRatingDropdown)}
              className="text-[#5B21BD] border border-[#5B21BD] py-2 px-6 rounded-full flex items-center gap-2 cursor-pointer"
              aria-label="Filter by rating"
              aria-expanded={showRatingDropdown}
            >
              <CiFilter />
              <span>Filter by Rating</span>
            </button>
            {showRatingDropdown && (
              <div className="absolute top-12 left-0 text-[#5B21BD] bg-white border border-[#5B21BD] rounded-lg shadow-lg w-48 z-10">
                <button
                  onClick={clearRatingFilter}
                  className="w-full text-left px-4 py-2 rounded-lg hover:bg-[#5B21BD]/10 cursor-pointer"
                >
                  All
                </button>
                {ratingOptions.map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleRatingFilter(rating)}
                    className="w-full text-left px-4 py-2 hover:bg-[#5B21BD]/10 cursor-pointer"
                  >
                    {rating} Star{rating > 1 ? 's' : ''}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
 
      {/* Feedback Table */}
      <div>
        <table className="w-full bg-white border border-[#E4E4E4]">
          <thead>
            <tr className="bg-[#5B21BD]/80 text-white">
              <th className="p-2 text-left md:pl-6">User</th>
              <th className="p-2 text-left">Recipe</th>
              <th className="p-2 text-left">Rating</th>
              <th className="p-2 text-left md:pl-20">Comment</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index} className="border-b border-b-[#E4E4E4] h-[76px]">
                <td className="p-2 text-[#939393] md:pl-6 capitalize">
                  {item.user_id || 'Anonymous'}
                </td>
                <td className="p-2 text-[#939393] capitalize">{item.recipe_id}</td>
                <td className="p-2">{renderStars(item.rating)}</td>
                <td className="p-2 text-[#939393] md:pl-20">{item.comment}</td>
                <td className="p-2 text-[#939393]">
                  {new Date(item.created_at).toLocaleDateString()}
                </td>
                <td className="relative p-2 text-[#939393]">
                  <div
                    onClick={() =>
                      setActiveDropdownIndex(activeDropdownIndex === index ? null : index)
                    }
                    className="cursor-pointer"
                  >
                    <HiDotsHorizontal />
                  </div>
 
                  {activeDropdownIndex === index && (
                    <div
                      ref={(el) => (dropdownRefs.current[index] = el)}
                      className="absolute  top-12 z-20 bg-white border border-[#E4E4E4] rounded-md shadow-md w-20"
                    >
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="block  text-left px-4 py-2 text-red-500 rounded-md cursor-pointer hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Toaster position='top-right'/>
    </div>
  );
}
 
export default UserFeedback;

