

import { useState } from 'react';
import Subscribsion from './Subscribsion';

function Expertice({ expertise, chefId }) {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Placeholder for Subscription component (replace with actual import or component)
  const Subscription = () => (
    <div className="p-4">
      <h3 className="text-lg font-bold">Subscription Details</h3>
      <p>Replace this with your actual Subscription component content.</p>
    </div>
  );

  return (
    <div className="space-y-2 mt-[20px]">
      {/* Expertise Header */}
      <h2 className="text-2xl font-bold text-[#5B21BD] pb-2">Expertise</h2>

      <div className=" flex items-center gap-6">
        {Array.isArray(expertise) && expertise?.map((item, idx) => (
          <div key={idx}>
            <p className="font-medium flex justify-center items-center text-[#5B21BD] rounded-full px-3 py-1  bg-[#EFE9F8]">{item}</p>
          </div>
        ))}
      </div>
      

      <div>
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
  );
}

export default Expertice;