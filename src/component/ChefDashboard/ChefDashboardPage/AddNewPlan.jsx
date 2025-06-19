


import React, { useState } from 'react';
import { useChefSubscriptionPlanCreateMutation } from '../../../Rudux/feature/ApiSlice';
import toast, { Toaster } from 'react-hot-toast';

function AddNewPlan() {
    // Initialize state for form data
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        storage_gb: '',
        features: '',
        ai_query_limit: '',
        
    });

    // Get the mutation function
    const [chefSubscriptionPlanCreate, { isLoading, isError, error }] = useChefSubscriptionPlanCreateMutation();
console.log(chefSubscriptionPlanCreate)
    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submission
  

const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
        // Prepare data for the API
        const planData = {
            name: formData.name,
            price: formData.price,
            storage_gb: formData.storage_gb,
            features: formData.features, // Convert features string to array
            ai_query_limit: formData.ai_query_limit,
          
        };

        // Call the mutation
        await chefSubscriptionPlanCreate(planData).unwrap();
        
        // Reset form after successful submission
        setFormData({
            name: '',
            price: '',
            storage_gb: '',
            features: '',
            ai_query_limit: '',
           
        });
        
        // Show success toast
        toast.success('Subscription plan created successfully!', {
            position: 'top-right',
            autoClose: 3000,
        });
    } catch (err) {
        console.error('Failed to create plan:', err);
        // Show error toast
        toast.error('Failed to create subscription plan. Please try again.', {
            position: 'top-right',
            autoClose: 3000,
        });
    }
};

    return (
        <div className='md:py-10 py-6'>
            <div className="p-6 md:w-1/2 w-full mx-auto bg-white rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-[#5B21BD]">Create New Plan</h2>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-[#5B21BD] mb-2 text-xl">Plan Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B21BD]"
                            placeholder="Plan"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-[#5B21BD] mb-2 text-xl">Price ($)</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B21BD]"
                            placeholder="Enter price"
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-[#5B21BD] mb-2 text-xl">Storage (GB)</label>
                        <input
                            type="number"
                            name="storage_gb"
                            value={formData.storage_gb}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B21BD]"
                            placeholder="Storage in GB"
                            min="0"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-[#5B21BD] mb-2 text-xl">Features</label>
                        <input
                            type="text"
                            name="features"
                            value={formData.features}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B21BD]"
                            placeholder="Access to premium recipes, priority support"
                        />
                    </div>
                    <div>
                        <label className="block text-[#5B21BD] mb-2 text-xl">AI Query Limit</label>
                        <input
                            type="number"
                            name="ai_query_limit"
                            value={formData.ai_query_limit}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B21BD]"
                            placeholder="AI query limit"
                            min="0"
                            required
                        />
                    </div>
              
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full bg-[#5B21BD] text-white py-2 rounded-lg font-medium cursor-pointer hover:bg-[#4A1A9C] transition-colors duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? 'Creating...' : 'Create Subscription Plan'}
                    </button>
                    {isError && (
                        <p className="text-red-500 text-sm mt-2">
                            Error: {error?.data?.message || 'Failed to create plan'}
                        </p>
                    )}
                </form>
            </div>
            <Toaster position='top-right'/>
        </div>
    );
}

export default AddNewPlan;