import React, { useEffect, useRef, useState } from 'react';
import { IoShareSocialOutline } from 'react-icons/io5';

import { FaFacebook, FaTwitter, FaWhatsapp, FaLinkedin, FaTelegram } from 'react-icons/fa';
import { MdContentCopy } from 'react-icons/md';
import toast, { Toaster } from 'react-hot-toast';
import { useMainRecipeShareQuery } from '../../../../Rudux/feature/ApiSlice';

function RecipeShare({ recipeId }) {
  const { data, isLoading, isError } = useMainRecipeShareQuery(recipeId);
  const [showLinks, setShowLinks] = useState(false);
  const dropdownRef = useRef(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(data?.data?.copy_link);
    toast.success('Link copied!');
  };

  // Close dropdown if clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowLinks(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isLoading) return <button className="text-sm text-gray-500">Loading...</button>;
  if (isError) return <button className="text-sm text-red-500">Error!</button>;

  const links = data?.data;

  return (
    <div className="relative" ref={dropdownRef}>
      <Toaster position="top-right" reverseOrder={false} />
      <button
        onClick={() => setShowLinks(!showLinks)}
        className="flex items-center text-[#5B21BD] border border-[#5B21BD] rounded p-1 cursor-pointer px-2"
      >
        <span className="mr-2">Share</span>
        <IoShareSocialOutline />
      </button>

      {showLinks && (
        <div className="absolute bg-white shadow-md rounded p-2 mt-2 space-y-2 z-10 w-52">
          <a href={links.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600">
            <FaFacebook /> Facebook
          </a>
          <a href={links.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-400">
            <FaTwitter /> Twitter
          </a>
          <a href={links.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-green-500">
            <FaWhatsapp /> WhatsApp
          </a>
          <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-700">
            <FaLinkedin /> LinkedIn
          </a>
          <a href={links.telegram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-500">
            <FaTelegram /> Telegram
          </a>
          <button onClick={handleCopy} className="flex items-center gap-2 text-gray-700 hover:text-black cursor-pointer">
            <MdContentCopy /> Copy Link
          </button>
        </div>
      )}
    </div>
  );
}

export default RecipeShare;
