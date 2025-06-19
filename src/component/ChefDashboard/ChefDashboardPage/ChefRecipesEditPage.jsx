



import { useState, useEffect } from 'react';
import { LuUpload } from 'react-icons/lu';
import { useParams } from 'react-router-dom';
import { useGetRecipeDettailsQuery } from '../../../Rudux/feature/ApiSlice';
import toast, { Toaster } from 'react-hot-toast';
import Ingredients from './Ingredients';
import Instructions from './Instructions';
import ChefNote from './ChefNote';


function ChefRecipesEditPage() {
  const { id } = useParams();


  const { data: getRecipeDettails, isLoading: isFetching, isError, error } = useGetRecipeDettailsQuery(id);
  console.log('getRecipeDettails:', getRecipeDettails);
  

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    image: '',
    imagePreview: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBasicInfoEditable, setIsBasicInfoEditable] = useState(false);

  const token = localStorage.getItem('access_token');

  // Log getRecipeDettails to debug its structure
  useEffect(() => {
    console.log('getRecipeDettails:', getRecipeDettails);
  }, [getRecipeDettails]);

  // Populate formData when getRecipeDettails is available
  useEffect(() => {
    if (getRecipeDettails) {
      setFormData({
        title: getRecipeDettails.data?.title || '',
        category: getRecipeDettails.data?.category_name || '',
        description: getRecipeDettails.data?.description || '',
        image: getRecipeDettails.data?.image || '',
        imagePreview: getRecipeDettails.data?.image
          ? `https://bmn1212.duckdns.org${getRecipeDettails.data?.image}`
          : '',
      });
    }
  }, [getRecipeDettails]);

  // Clean up imagePreview URL on component unmount
  useEffect(() => {
    return () => {
      if (formData.imagePreview && formData.imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(formData.imagePreview);
      }
    };
  }, [formData.imagePreview]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Revoke the previous object URL to prevent memory leaks
      if (formData.imagePreview && formData.imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(formData.imagePreview);
      }
      // Create a new object URL for the selected file
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: imageUrl,
      }));
    }
  };

  const handleBasicInfoSave = async () => {
    try {
      setIsSubmitting(true);
      const form = new FormData();
      console.log('formData before submission:', formData);
      form.append('title', formData.title);
      
      form.append('description', formData.description);
      if (formData.image instanceof File) {
        form.append('image', formData.image);
      }

      const response = await fetch(`https://bmn1212.duckdns.org/api/recipe/v1/update/${id}/`, {
        method: 'PUT',
        body: form,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to update recipe: ${response.statusText}`);
      }

      const res = await response.json();
      console.log('Update response:', res);

      toast.success('Recipe updated successfully!');
      setIsBasicInfoEditable(false);
    } catch (error) {
      console.error('Error updating recipe:', error);
      toast.error('Failed to update recipe.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isFetching) {
    return <div className="text-center py-10">Loading recipe...</div>;
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-red-500">
        Error fetching recipe: {error?.message || 'Something went wrong'}
      </div>
    );
  }

  return (
    <div>
      <div className="px-12 lora">
        <h1 className="text-[34px] font-semibold text-[#5B21BD] my-2">Recipes Details View</h1>
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border border-gray-200 p-4 rounded-2xl">
            <div>
              <label className="block text-xl font-medium text-[#5B21BD] mb-2">Recipe Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Classic Chocolate Soufflé"
                className={`w-full p-2 border bg-[#FFFFFF] border-[#CCBAEB] rounded-md focus:outline-none ${
                  !isBasicInfoEditable ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={!isBasicInfoEditable}
              />
            </div>

            <div>
              <label className="block text-xl font-medium text-[#5B21BD] mb-2">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                disabled
                placeholder="Type here category"
                className={`w-full p-2 border bg-[#FFFFFF] border-[#CCBAEB] rounded-md focus:outline-none ${
                  !isBasicInfoEditable ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                // disabled={!isBasicInfoEditable}
              />
            </div>

            <div>
              <label className="block text-xl font-medium text-[#5B21BD] mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="A light and airy dessert with a molten center"
                className={`w-full p-2 border bg-[#FFFFFF] border-[#CCBAEB] rounded-md focus:outline-none h-24 resize-none ${
                  !isBasicInfoEditable ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={!isBasicInfoEditable}
              />
            </div>

            <div>
              <label className="block text-xl font-medium text-[#5B21BD] mb-2">Upload Image</label>
              <div className="w-full h-24 border bg-[#FFFFFF] border-[#CCBAEB] rounded-md flex items-center justify-center">
                {formData.imagePreview ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img
                      src={formData.imagePreview}
                      className="max-h-full p-1 max-w-full object-contain"
                      alt="Recipe Preview"
                    />
                    {isBasicInfoEditable && (
                      <label className="absolute inset-0 flex items-center justify-center cursor-pointer">
                        <LuUpload className="text-[20px] text-[#5B21BD] opacity-70" />
                        <span className="text-[#5B21BD] opacity-70 ml-2">Change Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                          disabled={!isBasicInfoEditable}
                        />
                      </label>
                    )}
                  </div>
                ) : (
                  <label
                    className={`cursor-pointer relative ${
                      !isBasicInfoEditable ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <LuUpload className="text-[20px] text-[#5B21BD] absolute bottom-5 left-11" />
                    <span className="text-[#5B21BD]">Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={!isBasicInfoEditable}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="col-span-2 flex justify-end gap-4 mt-4">
              <button
                type="button"
                onClick={() => setIsBasicInfoEditable(true)}
                className="text-xl text-white bg-[#5B21BD] py-2 px-6 rounded-[10px] cursor-pointer"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={handleBasicInfoSave}
                disabled={isSubmitting}
                className={`text-xl text-white bg-[#5B21BD] py-2 px-6 rounded-[10px] cursor-pointer ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
          <Ingredients />
          <Instructions />
          <ChefNote />
        </form>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

export default ChefRecipesEditPage;
