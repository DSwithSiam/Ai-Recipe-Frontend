// import React, { useState } from 'react';
// import { IoMdHeart } from 'react-icons/io';
// import { Link } from 'react-router-dom';
// import CommunityPost from './CommunityPost';
// import {
//     useGetSaveCummunityListQuery,
//     useGetSaveRecipeListQuery,
// } from '../../../Rudux/feature/ApiSlice';

// function SaveRecipes() {
//     const [activeButton, setActiveButton] = useState('community');

//     const { data: getSaveRecipeList,  } = useGetSaveRecipeListQuery();
//     const { data: getSaveCummunityList } = useGetSaveCummunityListQuery();
//     console.log("getSaveCummunityList", getSaveCummunityList)

//     const recipes = getSaveRecipeList?.data || [];
//     const communityPosts = getSaveCummunityList?.data || [];

//     const handleButtonClick = (button) => {
//         setActiveButton(button);
//     };

//     const RecipesGrid = () => (
//         <div className="grid 2xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 justify-between gap-6 pt-6 lora">
//             {recipes.map((recipe) => (
//                 <div
//                     key={recipe.id}
//                     className="w-full bg-white rounded-xl h-[451px] overflow-hidden"
//                 >
//                     <div className="relative">
//                         <img
//                             className="w-full h-48 object-cover"
//                             src={`https://bmn1212.duckdns.org${recipe.image}`}
//                             alt={recipe.title}
//                         />
//                     </div>

//                     <div className="p-4 border-x-2 border-b-2 rounded-b-xl border-gray-100 space-y-2">
//                         <div className="flex justify-between">
//                             <h2 className="text-xl font-semibold text-[#5B21BD] lora capitalize">
//                                 {recipe.title}
//                             </h2>
//                             <IoMdHeart className="text-[#5B21BD] w-[16px] h-[16px]" />
//                         </div>

//                         <p className="mt-1 text-sm text-[#5B21BD] bg-[#EFE9F8] inline-block px-4 py-1 rounded-[29px] capitalize">
//                             {recipe.category}
//                         </p>

//                         <p className="mt-2 text-[#676767] text-[16px]">{recipe.description}</p>

//                         <div className="mt-3 flex justify-between items-center">
//                             <div className="flex items-center">
//                                 <svg
//                                     className="w-5 h-5 text-yellow-400"
//                                     fill="currentColor"
//                                     viewBox="0 0 20 20"
//                                     xmlns="http://www.w3.org/2000/svg"
//                                 >
//                                     <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
//                                 </svg>
//                                 <span className="ml-1 text-gray-600">{recipe.rating}</span>
//                             </div>
//                             <p className="text-sm text-gray-500">Updated: {recipe.updated}</p>
//                         </div>

//                             <Link
//                                to={`/dashboard/recipes_dettails/${recipe.id}`}
//                                 className="mt-4   text-white py-2 rounded-[29px] cursor-pointer"
//                             >
//                         <div className="w-full bg-[#5B21BD]  py-2 rounded-[29px] text-center">
//                                 View Details
//                         </div>
//                             </Link>
//                     </div>
//                 </div>
//             ))}
//         </div>
//     );

//     return (
//         <div className="px-10 py-4 lora">
//             <h1 className="text-[#5B21BD] text-[45px] font-semibold">Saved Recipes</h1>
//             <p className="text-[#A2A2A2] text-[20px]">
//                 Your collection of saved recipes and favorites.
//             </p>
//             <div className="bg-[#CCBAEB] rounded-[10px] py-2 flex gap-6 justify-between px-10 mt-4">

//                 <button
//                     className={`w-1/3 py-2 rounded-[10px] ${activeButton === 'recipes'
//                         ? 'bg-[#5B21BD] text-white'
//                         : 'text-[#5B21BD]'
//                         }`}
//                     onClick={() => handleButtonClick('recipes')}
//                 >
//                     Recipes (<span>{recipes.length}</span>)
//                 </button>

//                 <button
//                     className={`w-1/3 py-2 rounded-[10px] ${activeButton === 'community'
//                             ? 'bg-[#5B21BD] text-white'
//                             : 'text-[#5B21BD]'
//                         }`}
//                     onClick={() => handleButtonClick('community')}
//                 >
//                     Community post (<span>{getSaveCummunityList?.data?.length || 0}</span>)
//                 </button>


//             </div>

//             {/* Conditional Rendering */}
//             {activeButton === 'recipes' ? (
               
//                 <RecipesGrid />
//             ) : (
//                  <CommunityPost posts={communityPosts} />
//             )}
//         </div>
//     );
// }

// export default SaveRecipes;



import  { useState } from 'react';
import { IoMdHeart } from 'react-icons/io';
import { Link } from 'react-router-dom';
import CommunityPost from './CommunityPost';
import {
    useGetSaveCummunityListQuery,
    useGetSaveRecipeListQuery,
} from '../../../Rudux/feature/ApiSlice';

function SaveRecipes() {
    const [activeButton, setActiveButton] = useState('recipes'); 

    const {
        data: getSaveRecipeList,
        refetch: refetchRecipes,
    } = useGetSaveRecipeListQuery(undefined, {
        refetchOnMountOrArgChange: true,
        pollingInterval: 30000, // optional: poll every 30 seconds
    });
    console.log("getSaveRecipeList", getSaveRecipeList)

    const {
        data: getSaveCummunityList,
        refetch: refetchCommunity,
    } = useGetSaveCummunityListQuery(undefined, {
        refetchOnMountOrArgChange: true,
        pollingInterval: 30000, // optional: poll every 30 seconds
    });
console.log("getSaveCummunityList", getSaveCummunityList)
    const recipes = getSaveRecipeList?.data || [];
    const communityPosts = getSaveCummunityList?.data || [];

    const handleButtonClick = (button) => {
        setActiveButton(button);
        if (button === 'recipes') {
            refetchRecipes();
        } else {
            refetchCommunity();
        }
    };

    const RecipesGrid = () => (
        <div className="grid 2xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 justify-between gap-6 pt-6 lora">
            {recipes.map((recipe) => (
                <div
                    key={recipe.id}
                    className="w-full bg-white rounded-xl h-[451px] overflow-hidden"
                >
                    <div className="relative">
                        <img
                            className="w-full h-48 object-cover"
                            src={`https://bmn1212.duckdns.org${recipe.image}`}
                            alt={recipe.title}
                        />
                    </div>

                    <div className="p-4 border-x-2 border-b-2 rounded-b-xl border-gray-100 space-y-2">
                        <div className="flex justify-between">
                            <h2 className="text-xl font-semibold text-[#5B21BD] lora capitalize">
                                {recipe.title}
                            </h2>
                            <IoMdHeart className="text-[#5B21BD] w-[16px] h-[16px]" />
                        </div>

                        <p className="mt-1 text-sm text-[#5B21BD] bg-[#EFE9F8] inline-block px-4 py-1 rounded-[29px] capitalize">
                            {recipe.category}
                        </p>

                        <p className="mt-2 text-[#676767] text-[16px]">{recipe.description}</p>

                        <div className="mt-3 flex justify-between items-center">
                            <div className="flex items-center">
                                <svg
                                    className="w-5 h-5 text-yellow-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                </svg>
                                <span className="ml-1 text-gray-600">{recipe.rating}</span>
                            </div>
                            <p className="text-sm text-gray-500">Updated: {recipe.updated_at
}</p>
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
            ))}
        </div>
    );

    return (
        <div className="px-10 py-4 lora">
            <h1 className="text-[#5B21BD] text-[45px] font-semibold">Saved Recipes</h1>
            <p className="text-[#A2A2A2] text-[20px]">
                Your collection of saved recipes and favorites.
            </p>
            <div className="bg-[#CCBAEB] rounded-[10px] py-2 flex gap-6 justify-between px-10 mt-4">
                <button
                    className={`w-1/3 py-2 rounded-[10px] cursor-pointer ${activeButton === 'recipes'
                        ? 'bg-[#5B21BD] text-white'
                        : 'text-[#5B21BD]'
                        }`}
                    onClick={() => handleButtonClick('recipes')}
                >
                    Recipes (<span>{recipes.length}</span>)
                </button>

                <button
                    className={`w-1/3 py-2 rounded-[10px] cursor-pointer ${activeButton === 'community'
                        ? 'bg-[#5B21BD] text-white'
                        : 'text-[#5B21BD]'
                        }`}
                    onClick={() => handleButtonClick('community')}
                >
                    Community post (<span>{communityPosts.length}</span>)
                </button>
            </div>

            {activeButton === 'recipes' ? (
                <RecipesGrid />
            ) : (
                <CommunityPost posts={communityPosts} />
            )}
        </div>
    );
}

export default SaveRecipes;
