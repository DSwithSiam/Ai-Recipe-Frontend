


import React, { useState } from 'react';
import { useRecipeSaveMutation } from '../../../../Rudux/feature/ApiSlice';
import { IoIosHeart, IoIosHeartEmpty } from 'react-icons/io';
import toast from 'react-hot-toast';

const RecipeSave = ({ recipeId, initiallySaved }) => {
  const [isSaved, setIsSaved] = useState(initiallySaved);
  const [toggleSave, { isLoading }] = useRecipeSaveMutation(); // assume it toggles

  const handleToggleSave = async () => {
    try {
      const response = await toggleSave({ id: recipeId }).unwrap();
      setIsSaved(prev => !prev); // Toggle saved state
      toast.success(response?.message || (isSaved ? 'Recipe unsaved!' : 'Recipe saved!'));
    } catch (error) {
      console.error('Toggle failed:', error);
      toast.error('Failed to update save status.');
    }
  };

  return (
    <button
      onClick={handleToggleSave}
      className={`flex items-center ${
        isSaved ? 'bg-[#5B21BD] text-white' : 'text-[#5B21BD] border border-[#5B21BD]'
      } rounded p-1 cursor-pointer px-2`}
      disabled={isLoading}
    >
      <span className="mr-2">
        {isLoading ? (isSaved ? 'Unsaving...' : 'Saving...') : isSaved ? 'Saved' : 'Save'}
      </span>
      {isSaved ? <IoIosHeart /> : <IoIosHeartEmpty />}
    </button>
  );
};

export default RecipeSave;
