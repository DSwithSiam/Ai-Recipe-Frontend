

import React, { useState } from 'react';
import { CiFilter } from 'react-icons/ci';
import { IoIosHeartEmpty } from 'react-icons/io';
import { IoSearchOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { PiChefHatFill } from 'react-icons/pi';
import { useGetAllBrandsNameQuery, useGetAllRecipesQuery } from '../../../../Rudux/feature/ApiSlice';

function AllRecipes() {
  const { data: getAllBrandsName, isLoading: brandLoading, isError: brandError } = useGetAllBrandsNameQuery();
  console.log("getAllBrandsName", getAllBrandsName)
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState('');
  const { data: getAllRecipes, isLoading: recipeLoading, isError: recipeError } = useGetAllRecipesQuery();
  console.log("getAllRecipes", getAllRecipes)

  const brandList = getAllBrandsName || []; // Get brands from API
  const recipeList = getAllRecipes?.data || [];

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsFilterOpen(false);
  };

  const handleBrandChange = (e) => {
    setSelectedBrand(e.target.value);
  };

  const toggleFilterDropdown = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const categories = ['All', ...new Set(recipeList.map((item) => item.category).filter(Boolean))];

  const filteredRecipes = recipeList.filter((recipe) => {
    const matchSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === 'All' || recipe.category === selectedCategory;
    const matchBrand = !selectedBrand || recipe.brand_id?.toString() === selectedBrand;
    return matchSearch && matchCategory && matchBrand;
  });

  return (
    <div className="md:px-10 py-6 lora">
      <div className="flex justify-between flex-col md:flex-row gap-6">
        <div className="md:w-1/2">
          <h1 className="text-[#5B21BD] text-[45px] font-semibold">All Recipes</h1>
          <p className="text-[#A2A2A2] text-[20px]">
            Browse and discover recipes from your favorite culinary experts.
          </p>
        </div>

        <div className="md:w-1/2 flex justify-end items-center gap-6">
          {/* Brand Filter */}
          <div className="flex items-center gap-2 text-[#5B21BD] px-4 py-2 border-[#CCBAEB] border rounded-[10px] font-medium">
            <PiChefHatFill className="text-2xl" />
            <select
              name="brand"
              id="brand"
              className="outline-none bg-transparent text-[#5B21BD] font-medium"
              onChange={handleBrandChange}
              value={selectedBrand}
            >
              <option value="">Select a Brand</option>
              {brandList.map((brand) => (
                <option key={brand.brand_id} value={brand.brand_id}>
                  {brand.brand_name}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="flex items-center relative w-[45%]">
            <IoSearchOutline className="text-[#5B21BD] absolute ml-3" />
            <input
              type="search"
              placeholder="Search recipes"
              className="placeholder-[color:#5B21BD] focus:placeholder-transparent w-full py-3 border border-[#CCBAEB] rounded-[10px] pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div className="relative w-[25%]">
            <button
              className="text-[#5B21BD] w-full py-3 border border-[#CCBAEB] rounded-[10px] flex justify-center items-center gap-2 cursor-pointer"
              onClick={toggleFilterDropdown}
            >
              <CiFilter />
              <span>Filter</span>
            </button>
            {isFilterOpen && (
              <div className="absolute top-15 left-0 w-full bg-white border border-[#CCBAEB] rounded-[10px] shadow-lg z-10">
                {categories.map((category) => (
                  <div
                    key={category}
                    className="px-4 py-2 hover:bg-[#CCBAEB] cursor-pointer text-[#5B21BD]"
                    onClick={() => handleCategorySelect(category)}
                  >
                    {category}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Loading/Error States */}
      {(brandLoading || recipeLoading) && (
        <div className="text-center text-[#5B21BD] mt-10 text-lg">Loading recipes...</div>
      )}
      {(brandError || recipeError) && (
        <div className="text-center text-red-500 mt-10 text-lg">Failed to load recipes.</div>
      )}

      {/* Recipes */}
      {!brandLoading && !recipeLoading && (
        <div className="grid 2xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 pt-6">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => (
              <div key={recipe.id} className="w-full bg-white flex flex-col h-full">
                <div className="relative">
                  <img
                    className="w-full h-48 object-cover rounded-t-xl"
                    src={
                      recipe.image?.startsWith('http')
                        ? recipe.image
                        : `https://bmn1212.duckdns.org${recipe.image}`
                    }
                    alt={recipe.title}
                  />
                </div>
                <div className="p-4 border-x-2 border-b-2 rounded-b-xl border-gray-100 space-y-4">
                  <div className="flex justify-between">
                    <h2 className="text-xl font-semibold text-[#5B21BD] lora capitalize">
                      {recipe.title}
                    </h2>
                    <IoIosHeartEmpty className="text-[#5B21BD] w-[16px] h-[16px]" />
                  </div>
                  <p className="mt-1 text-sm text-[#5B21BD] bg-[#CCBAEB] inline-block px-4 py-1 rounded-[29px] capitalize">
                    {recipe.category}
                  </p>
                  <p className="mt-2 text-[#676767] text-[16px] line-clamp-2">
                    {recipe.description || 'No description available.'}
                  </p>
                  <div className="mt-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                      <span className="ml-1 text-gray-600">{recipe.rating || 0}</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Updated:{' '}
                      {new Date(recipe.updated_at).toLocaleString([], {
                        year: 'numeric',
                        month: 'short',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </p>
                  </div>
                  <Link
                    to={`/dashboard/recipes_dettails/${recipe.id}`}
                    className="mt-4 text-white py-2 rounded-[29px] cursor-pointer"
                  >
                    <div className="w-full bg-[#5B21BD] py-2 rounded-[29px] text-center">
                      View Details
                    </div>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-[#5B21BD] text-xl">
                No recipes found matching your filters.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AllRecipes;


