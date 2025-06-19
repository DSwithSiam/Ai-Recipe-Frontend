import { useState } from 'react'
import { IoIosHeartEmpty } from 'react-icons/io';
import Subscribsion from './Subscribsion';

function PreviewGallary({ recipeData, chefId }) {
  console.log(recipeData, "adsfsfsdf")

  const [isModalOpen, setIsModalOpen] = useState(false);



  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="grid 2xl:grid-cols-3 py-10 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
  {recipeData.map((recipe) => (
    <div
      key={recipe.id}
      className="bg-white rounded-xl flex flex-col h-full"
    >
      {/* Image */}
      <div className="relative">
        <img
          className="w-full h-48 object-cover rounded-t-2xl"
          src={`https://bmn1212.duckdns.org${recipe.image}`}
          alt={recipe.title}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between flex-grow p-4 border-x-2 border-b-2 rounded-b-xl border-gray-100">
        <div className="space-y-2">
          {/* Title */}
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold text-[#5B21BD] lora capitalize">
              {recipe.title}
            </h2>
            <IoIosHeartEmpty className="text-[#5B21BD] w-[16px] h-[16px]" />
          </div>

          {/* Category */}
          <p className="text-sm text-white bg-[#5B21BD] inline-block px-4 py-1 rounded-[29px] capitalize">
            {recipe.category}
          </p>

          {/* Description */}
          <p className="text-[#676767] text-[16px]">{recipe.description}</p>
        </div>

        {/* Rating and Date */}
        <div className="mt-3 flex justify-between items-center">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c..."></path>
            </svg>
            <span className="ml-1 text-gray-600">{recipe.rating}</span>
          </div>
          <p className="text-[12px] text-gray-500">
            Updated: {new Date("May 23, 2025, 09:08 PM").toLocaleString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </p>
        </div>
      </div>
    </div>
  ))}
</div>


      <div className=''>
        <button
          onClick={openModal}
          className="w-full bg-[#5B21BD] border mt-2 cursor-pointer text-white font-bold py-3 px-4 rounded-[10px] transition-colors duration-200"
        >
          Select This Chef
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#5B21BDCC] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg h-[96%] w-4/6 flex flex-col">

            {/* Header with back button */}
            <div className="p-4 border-b border-gray-200">
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-[#5B21BD] text-white rounded-[10px] hover:bg-[#4c1fb0] transition-colors cursor-pointer duration-200"
              >
                Back
              </button>
            </div>

            {/* Scrollable content area */}
            <div className="overflow-y-auto p-4 flex-1">
              <Subscribsion chefId={chefId} />
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

import PropTypes from 'prop-types';

PreviewGallary.propTypes = {
  recipeData: PropTypes.array.isRequired,
  chefId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default PreviewGallary