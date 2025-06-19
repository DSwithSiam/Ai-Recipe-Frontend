import React, { useState, useRef } from 'react';
import { FaRegCommentDots } from 'react-icons/fa';
import { useGetMainRecipeCommentQuery, useRecipeCommentMutation } from '../../../../Rudux/feature/ApiSlice';
import toast from 'react-hot-toast';

function RecipeComment({ recipeId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');
  const [recipeComment, { isLoading }] = useRecipeCommentMutation();

  const containerRef = useRef(null);
  const { data: getMainRecipeComment} = useGetMainRecipeCommentQuery(recipeId);
  console.log('getMainRecipeComment:', getMainRecipeComment);

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error('Comment cannot be empty.');
      return;
    }

    try {
      const res = await recipeComment({ id: recipeId, content }).unwrap();
      toast.success(res?.message || 'Comment added successfully!');
      setContent('');
      setIsOpen(false);
    } catch (err) {
      console.error('Error submitting comment:', err);
      toast.error('Failed to add comment.');
    }
  };

  return (
    <div className="relative inline-block" ref={containerRef}>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-[#5B21BD] border border-[#5B21BD] rounded p-1 cursor-pointer px-2"
      >
        <span className="mr-2">Chat</span>
        <FaRegCommentDots />
      </button>

      {/* Floating Modal */}
      {isOpen && (
        <div
          className="absolute bottom-full mb-2 right-0 z-50 bg-white border border-gray-300 rounded shadow-lg p-4 w-72"
          onClick={(e) => e.stopPropagation()}
        >
          <textarea
            className="w-full border p-2 rounded"
            placeholder="Write your comment..."
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex justify-end mt-2 gap-2">
            <button
              onClick={() => setIsOpen(false)}
              className="bg-gray-200 px-3 py-1 rounded text-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-[#5B21BD] text-white px-3 py-1 rounded text-sm hover:bg-[#4c1fb3] cursor-pointer"
            >
              {isLoading ? 'Sending...' : 'Submit'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecipeComment;





