

import { useState } from 'react';
import img from '../../../assets/image/cercalImg.png';
import { IoEyeOutline } from 'react-icons/io5';
import Select from 'react-select';
import { SiVerizon } from 'react-icons/si';
import { useAiTrainingMutation, useGetCreateRecipeQuery } from '../../../Rudux/feature/ApiSlice';
// import { useAiTrainingMutation, useGetCreateRecipeQuery } from '../../../Redux/feature/ApiSlice';

const AiTraining = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [maxStepReached, setMaxStepReached] = useState(1);
  const [selectedOption, setSelectedOption] = useState('');
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    fileTitle: '',
    Recipe: '',
    tags: '',
    recipeId: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);

  const [aiTraining, { isLoading, isSuccess }] = useAiTrainingMutation();
  const { data: recipesData, isLoading: isRecipesLoading, isError: isRecipesError } = useGetCreateRecipeQuery();

  const totalSteps = 4;

  const sanitizeString = (str) => {
    if (str === undefined || str === null || (typeof str !== 'string' && typeof str !== 'number')) {
      return '';
    }
    return String(str).replace(/[^\x00-\x7F]/g, '');
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      setMaxStepReached(Math.max(maxStepReached, currentStep + 1));
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setMaxStepReached(Math.max(1, maxStepReached - 1));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 50 * 1024 * 1024) {
        alert('File size exceeds 50MB');
        return;
      }
      if (
        ![
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'image/jpeg',
          'image/png',
        ].includes(file.type)
      ) {
        alert('Invalid file type');
        return;
      }
      console.log('Selected file:', file.name, file.type, file.size);
      setFiles([file]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange({ target: { files: e.dataTransfer.files } });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target || e;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const submitForm = async () => {
    if (!selectedOption || !formData.fileTitle || !formData.recipeId) {
      alert('Please complete all required fields.');
      return;
    }

    if (!['recipe', 'calculation', 'other'].includes(selectedOption)) {
      alert('Invalid content type selected.');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('type', sanitizeString(selectedOption));
    formDataToSend.append('file_title', sanitizeString(formData.fileTitle));
    formDataToSend.append('category', selectedOption === 'recipe' ? String(formData.recipeId) : sanitizeString(formData.Recipe));
    if (files.length > 0 && files[0] instanceof File) {
      formDataToSend.append('file', files[0]);
    }
    if (formData.tags) {
      formDataToSend.append('tags', sanitizeString(formData.tags));
    }

    console.log('FormData entries before sending:');
    for (let [key, value] of formDataToSend.entries()) {
      console.log(`${key}: ${value instanceof File ? value.name : value}`);
    }

    try {
      const response = await aiTraining({ formDataToSend, id: String(formData.recipeId) });
      const data = await response.unwrap();
      setApiResponse(data);
      setIsModalOpen(true);
    } catch (err) {
      console.error('Failed to submit:', err);
      console.error('Error details:', err.data, err.status);
      setApiResponse({ error: err.data?.error || err.message || 'Failed to submit' });
      setIsModalOpen(true);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setMaxStepReached(1);
    setSelectedOption('');
    setFiles([]);
    setFormData({
      fileTitle: '',
      Recipe: '',
      tags: '',
      recipeId: '',
    });
    setIsModalOpen(false);
    setApiResponse(null);
  };

  const getStepImage = () => img;

  const handleOptionClick = (option) => {
    if (!option) {
      console.error('No option provided');
      return;
    }
    setSelectedOption(option);
    nextStep();
  };

  return (
    <div className="">
      <div className="rounded-lg p-6 px-14 lora">
        <h1 className="text-[34px] text-[#5B21BD]">AI Training</h1>
        <p className="text-[#9E9E9E] text-xl mb-4">Upload and manage your culinary content</p>

        <div className="relative mb-8 px-6">
          <div className="flex justify-between relative">
            <div className="absolute bottom-13 left-0 right-0 h-1 bg-gray-200 transform -translate-y-1/2"></div>
            <div
              className="absolute bottom-13 left-0 h-1 bg-[#5B21BD] z-10 transition-all duration-300"
              style={{
                width: `${((maxStepReached - 1) / (totalSteps - 1)) * 100}%`,
                transform: 'translateY(-50%)',
              }}
            ></div>

            {[
              { step: 1, label: 'Select content type', image: '/path/to/step1-image.png' },
              { step: 2, label: 'Upload files', image: '/path/to/step2-image.png' },
              { step: 3, label: 'Add metadata', image: '/path/to/step3-image.png' },
              { step: 4, label: 'Review & confirm', image: '/path/to/step4-image.png' },
            ].map(({ step, label, image }) => (
              <div key={step} className="relative z-10 flex flex-col items-center">
                <div
                  className={`relative w-14 h-14 mx-auto mb-2 rounded-full ${maxStepReached >= step ? 'bg-[#5B21BD]' : 'bg-gray-200'}`}
                >
                  <img
                    src={img}
                    alt={`Step ${step}`}
                    className={`w-14 h-14 object-cover rounded-full ${maxStepReached >= step ? 'opacity-100' : 'opacity-50'}`}
                  />
                  <span
                    className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold ${maxStepReached >= step ? 'text-white' : 'text-gray-500'}`}
                  >
                    {step}
                  </span>
                </div>
                <p
                  className={`text-sm font-medium ${maxStepReached >= step ? 'text-[#5B21BD]' : 'text-gray-500'}`}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {currentStep === 1 && (
          <div className="border rounded-xl p-10 bg-[#FFFFFF] border-[#EFE9F8]">
            <h2 className="text-xl text-[#5B21BD] font-bold mb-4">Select Content Type</h2>
            <p className="mb-6 text-[#9E9E9E]">
              Choose the type of content key. Write to update it in form for a vendor.
            </p>
            <div className="space-y-3 mb-6 flex justify-between text-center text-[20px] font-semibold text-[#5B21BD]">
              {['recipe', 'calculation', 'other'].map((option) => (
                <div
                  key={option}
                  className={`p-4 border rounded cursor-pointer transition-all w-full ml-10 h-full
                    ${selectedOption === option ? 'border-[#5B21BD] bg-blue-50' : 'border-gray-200'}`}
                  onClick={() => handleOptionClick(option)}
                >
                  <h3 className="font-medium">{option}</h3>
                  <p className="text-sm text-gray-600 mt-1 text-center">
                    {option === 'recipe' && 'Upload PDF or Word documents with your detailed recipes.'}
                    {option === 'calculation' && 'Upload Excel spreadsheets with ingredient ratios and formulas.'}
                    {option === 'other' && 'Upload any other training materials for your AI model.'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="border border-[#5B21BD] p-10 rounded-xl bg-[#FFFFFF]">
            <h2 className="text-xl text-[#5B21BD] font-bold mb-4">Upload Files</h2>
            <p className="mb-6 text-[#9E9E9E]">
              Drag and drop your file or click to browse. We accept PDF, DOC, DOCX, XLS, XLSX, JPEG, and PNG files up to 50MB.
            </p>
            <div
              className={`border-2 border-dashed rounded-lg p-8 h-[250px] text-center mb-6 transition-all
                ${isDragging ? 'border-[#5B21BD] bg-blue-50' : 'border-[#5B21BD]'}`}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="file-upload"
                className="hidden"
                multiple={false}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                onChange={handleFileChange}
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center justify-center h-full"
              >
                <p className="mb-4 text-gray-600">
                  {isDragging ? 'Drop File Here' : 'Drag & Drop File Here or Click to Browse'}
                </p>
                <button
                  type="button"
                  className="px-4 py-2 bg-[#5B21BD] text-white rounded"
                  onClick={() => document.getElementById('file-upload').click()}
                >
                  Browse File
                </button>
              </label>
            </div>
            {files.length > 0 && (
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">Selected file:</p>
                <ul className="text-sm text-gray-600">
                  {files.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex justify-between mt-8">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 cursor-pointer"
                onClick={prevStep}
              >
                Previous
              </button>
              <button
                className="px-4 py-2 bg-[#5B21BD] text-white rounded disabled:opacity-50 cursor-pointer"
                onClick={nextStep}
                disabled={files.length === 0}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="p-6 bg-white rounded-lg border border-gray-200">
            <h2 className="text-4xl font-bold text-[#5B21BD] mb-2">Add Metadata & Recipe</h2>
            <p className="text-sm text-gray-500 mb-6">
              Add details to your uploaded file to help the AI understand and organize your content.
            </p>
            <div className="flex w-full gap-6">
              <div className="mb-4 md:w-1/2">
                <label className="block text-xl font-medium text-[#5B21BD] mb-1">File Title</label>
                <input
                  type="text"
                  name="fileTitle"
                  value={formData.fileTitle}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-[#CCBAEB] rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter file title"
                />
              </div>
              <div className="mb-4 md:w-1/2 relative">
                <label className="block text-xl font-medium text-[#5B21BD] mb-1">Recipe</label>
                <Select
                  name="Recipe"
                  value={
                    formData.recipeId && recipesData?.data
                      ? {
                          value: String(formData.recipeId),
                          label: recipesData.data.find((recipe) => String(recipe.id) === String(formData.recipeId))?.title || 'Select a recipe',
                        }
                      : null
                  }
                  onChange={(selectedOption) => {
                    setFormData({
                      ...formData,
                      recipeId: selectedOption ? String(selectedOption.value) : '',
                      Recipe: selectedOption ? selectedOption.label : '',
                    });
                  }}
                  options={
                    isRecipesLoading
                      ? [{ value: '', label: 'Loading...', isDisabled: true }]
                      : isRecipesError || !recipesData?.data
                      ? [{ value: '', label: 'No categories available', isDisabled: true }]
                      : recipesData.data.map((recipe) => ({
                          value: String(recipe.id),
                          label: recipe.title,
                        }))
                  }
                  isDisabled={isRecipesLoading}
                  menuPlacement="bottom"
                  placeholder="Select a recipe"
                  className="w-full text-[#999999]"
                  classNames={{
                    control: ({ isFocused }) =>
                      `h-[45px] border border-[#5B21BD] rounded-md ${isFocused ? 'ring-2 ring-[#5B21BD] shadow-[0_0_0_2px_rgba(91,33,189,0.2)]' : ''} p-2`,
                    menu: () =>
                      'max-h-[20vh] overflow-y-auto absolute top-full left-0 right-0 bg-white border border-[#5B21BD] rounded-b-md shadow-md z-20',
                    option: ({ isSelected, isFocused }) =>
                      `text-[#999999] p-2 ${isSelected
                        ? 'bg-[#5B21BD] text-white'
                        : isFocused
                        ? 'bg-[#5B21BD]/10 text-[#5B21BD]'
                        : 'hover:bg-[#5B21BD]/10'
                      }`,
                  }}
                />
                {isRecipesLoading && <p className="text-sm text-gray-500 mt-1">Loading categories...</p>}
                {isRecipesError && <p className="text-sm text-red-500 mt-1">Failed to load categories</p>}
                {!isRecipesLoading && !isRecipesError && (!recipesData?.data || recipesData.data.length === 0) && (
                  <p className="text-sm text-red-500 mt-1">No categories available</p>
                )}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-xl font-medium text-[#5B21BD] mb-1">Tags (optional)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full p-2 border border-[#CCBAEB] rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter tags (comma separated)"
              />
            </div>
            <div className="flex justify-between mt-8">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 cursor-pointer"
                onClick={prevStep}
              >
                Previous
              </button>
              <button
                className="px-4 py-2 bg-[#5B21BD] text-white rounded disabled:opacity-50 cursor-pointer"
                onClick={nextStep}
                disabled={!formData.fileTitle || !formData.recipeId}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="mt-8 bg-white rounded-xl border border-[#EFE9F8] lora p-10">
            <h2 className="text-lg font-bold text-gray-800">Review & Confirm</h2>
            <p className="text-sm text-gray-500 mt-1">
              Review your uploaded file and metadata before submitting for AI training.
            </p>
            <hr className="text-[#EFE9F8] mt-2" />
            <div className="mt-4">
              <div className="grid grid-cols-6 gap-4 p-3 bg-[#EFE9F8] text-[#5B21BD] text-sm font-semibold">
                <div>File name</div>
                <div>Title</div>
                <div>Recipe</div>
                <div>Tags</div>
                <div>Status</div>
                <div>Preview</div>
              </div>
              <div className="grid grid-cols-6 gap-4 p-3 border border-[#E4E4E4] text-sm">
                <div>{files[0]?.name || 'No file'}</div>
                <div>{formData.fileTitle || 'No title'}</div>
                <div>
                  {recipesData?.data?.find((r) => String(r.id) === String(formData.recipeId))?.title || 'No recipe'}
                </div>
                <div className="flex gap-1">
                  {formData.tags ? (
                    formData.tags.split(',').map((tag, index) => (
                      <span
                        key={index}
                        className="bg-[#e6f0fa] text-[#4a90e2] rounded-full px-2 py-1 text-xs"
                      >
                        {tag.trim()}
                      </span>
                    ))
                  ) : (
                    <span>No tags</span>
                  )}
                </div>
                <div>
                  <span className="bg-[#28a745] text-white rounded-full px-2 py-1 text-xs">
                    READY
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 text-[25px] cursor-pointer">
                    <IoEyeOutline />
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-6 bg-[#e6f0fa] border border-[#d1e0ee] rounded-lg p-4 flex items-center gap-2 py-10 my-6">
              <span className="text-[#f5a623] text-2xl">⚠️</span>
              <p className="text-sm text-gray-700">
                <span className="font-bold">
                  READY TO TRAIN YOUR AI: Please review and submit your file.
                </span>
                <br />
                ONCE YOU SUBMIT, YOUR FILE WILL BE PROCESSED AND USED TO TRAIN YOUR CUSTOM AI MODEL.
              </p>
            </div>
            <div className="flex justify-between mt-8">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 cursor-pointer"
                onClick={prevStep}
              >
                Previous
              </button>
              <button
                className="px-4 py-2 bg-[#5B21BD] text-white rounded cursor-pointer cursor-pointer"
                onClick={submitForm}
                disabled={isLoading || files.length === 0 || !formData.recipeId || !formData.fileTitle}
              >
                {isLoading ? 'Submitting...' : 'Confirm & Submit for Training'}
              </button>
            </div>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-[#5B21BDCC] flex justify-center items-center z-100">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg">
              <h2 className="text-xl font-bold mb-4 text-[#5B21BD]">
                {isSuccess ? 'Training Started Successfully!' : 'Submission Failed'}
              </h2>
              <p className="mb-6 text-gray-600">
                {isSuccess
                  ? apiResponse?.message || 'Your AI model is now being trained with your content.'
                  : apiResponse?.error || 'There was an issue submitting your file. Please try again.'}
              </p>
              {isSuccess && apiResponse?.data && (
                <div className="mb-6 text-sm text-gray-600">
                  <p><strong>Training ID:</strong> {apiResponse.data.id || 'N/A'}</p>
                  <p><strong>File Title:</strong> {apiResponse.data.file_title || 'N/A'}</p>
                  <p><strong>Category:</strong> {apiResponse.data.category || formData.Recipe || 'N/A'}</p>
                  <p><strong>Status:</strong> {apiResponse.data.status || 'N/A'}</p>
                  {apiResponse.data.recipe && (
                    <p><strong>Recipe ID:</strong> {apiResponse.data.recipe}</p>
                  )}
                </div>
              )}
              <div className="flex justify-center">
                <div className="bg-[#DCFCE7] p-10 rounded-full flex justify-center">
                  <SiVerizon className="text-[#00B23D]" />
                </div>
              </div>
              <p className="text-[20px] text-center text-[#5B21BD]">
                {isSuccess ? 'Training progress' : 'Error'}
              </p>
              <p className="text-gray-600 text-center">
                {isSuccess
                  ? 'Your AI model is now being trained with your culinary content. This process typically takes 2 minutes.'
                  : 'An error occurred while submitting your file.'}
              </p>
              <div className="flex justify-center mt-8">
                <button
                  className="px-8 py-2 bg-[#5B21BD] text-white rounded cursor-pointer"
                  onClick={resetForm}
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiTraining;