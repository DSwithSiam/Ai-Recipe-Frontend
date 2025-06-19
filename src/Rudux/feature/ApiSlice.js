
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "https://bmn1212.duckdns.org/api",

  prepareHeaders: (headers, { getState, endpoint }) => {
    const accessToken = localStorage.getItem("access_token");
    const token = getState().auth.token || accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    // Only set Content-Type to application/json for non-file uploads
    if
      (
      !["recipeCreate", "updateProfile", "aiTraining"].includes(endpoint)
    ) {
      headers.set("Content-Type", "application/json");
    }
    return headers;
  },
});




export const ApiSlice = createApi({
  reducerPath: "ApiSlice",
  baseQuery,
  tagTypes: ["Profile", "ChefDashboard", "usUserDashboard", "Project", "Employees", "updateRecipes", "ChefCommunity"], // Add 'updateRecipes' to tagTypes
  endpoints: (builder) => ({

    // Other endpoints remain unchanged
    getProfile: builder.query({
      query: () => "/auth/v1/profile/",
      providesTags: ["Profile"],
    }),
    updateProfile: builder.mutation({
      query: (formDataToSend) => ({
        url: "/auth/v1/update-profile/",
        method: "PUT",
        body: formDataToSend,
      }),
      invalidatesTags: ["Profile"],
    }),
   getAllRecipes: builder.query({
  query: () => '/main/v1/recipes/',
  providesTags: ["UserDashboard"],
}),

// getAllRecipes: builder.query({
//   query: (brandId) => brandId ? `/main/v1/recipes/${brandId}/` : '/main/v1/recipes/',
//   providesTags: ["UserDashboard"],
// })
// ,


    getAllBrandsName: builder.query({
      query: () => "/main/v1/user/subscribed/brands/",
      providesTags: ["UserDashboard"],
    }),
    getAllBrands: builder.query({
      query: () => "/main/v1/chef/brands/",
      providesTags: ["UserDashboard"],
    }),

    // chef dashboard

    recipeCreate: builder.mutation({
      query: (formattedData) => ({
        url: "/recipe/v1/create/",
        method: "POST",
        body: formattedData, // do not stringify!
      }),
      invalidatesTags: ["ChefDashboard"],
    }),



    getCategoryList: builder.query({
      query: () => "/recipe/v1/categories/",

    }),


    getCreateRecipe: builder.query({
      query: () => "/recipe/v1/all/",
      providesTags: ["ChefDashboard"],
    }),

    getRecipeDettails: builder.query({
      query: (id) => `/recipe/v1/details/${id}/`,

    }),
    deleteChefRecipe: builder.mutation({
      query: (id) => ({
        url: `/recipe/v1/delete/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["ChefDashboard"],
    }),
  getMonthlyRevenue: builder.query({
  query: (month) => `/chef_dashboard/v1/dash/monthly-revenue/${month}/`,
}),



  

    aiTraining: builder.mutation({
      query: ({ formDataToSend, id }) => ({
        url: `/recipe/v1/ai-train/create/${id}/`,
        method: 'POST',
        body: formDataToSend, // Use FormData directly
      }),
    }),

    recipeUpdate: builder.mutation({
      query: ({ recipeId, form }) => ({
        url: `/recipe/v1/update/${recipeId}/`,
        method: 'PUT',
        body: JSON.stringify(form)// Use the form data directly
      }),
      invalidatesTags: ['ChefDashboard'], // Invalidate cache to refresh recipe list
    }),


    ChefDashboardFirstPart: builder.query({
      query: () => "/chef_dashboard/v1/dash/first-part/",

    }),
    RecentFeedback: builder.query({
      query: () => "/chef_dashboard/v1/dash/recent-feedback/",

    }),
    ChefTopRecipe: builder.query({
      query: () => "/chef_dashboard/v1/dash/top-queried-recipes/",

    }),

    // user feedback
    getUserFeedbackList: builder.query({
      query: () => "/chef_dashboard/v1/feedback/list/",
      providesTags: ["ChefDashboard"],
    }),
    userFeedbackDelete: builder.mutation({
      query: (id) => ({
        url: `/chef_dashboard/v1/feedback/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ChefDashboard"],
    }),

    // ingradients instruction and chaf note part
    getIngradientsData: builder.query({
      query: (id) => `/recipe/v1/ingredient/get/${id}/`,

    }),
    getInstructionData: builder.query({
      query: (id) => `/recipe/v1/instruction/get/${id}/`,

    }),
    getChefNoteData: builder.query({
      query: (id) => `/recipe/v1/chef-note/add/get/${id}/`,

    }),

    PutIngradientsData: builder.mutation({
      query: ({ id, form }) => ({
        url: `/recipe/v1/ingredient/${id}/update/`,
        method: 'PUT',
        body: JSON.stringify(form)// Use the form data directly
      }),

    }),

    PutInstructionData: builder.mutation({
      query: ({ id, form }) => ({
        url: `/recipe/v1/instruction/${id}/update/`,
        method: 'PUT',
        body: JSON.stringify(form)// Use the form data directly
      }),

    }),

    putChefNoteData: builder.mutation({
      query: ({ id, form }) => ({
        url: `/recipe/v1/chef-note/${id}/update/`,
        method: 'PUT',
        body: JSON.stringify(form)// Use the form data directly
      }),

    }),
    DeletIngradientsData: builder.mutation({
      query: (id) => ({
        url: `/recipe/v1/ingredient/${id}/delete/`,
        method: "DELETE",
      }),
      invalidatesTags: ["ChefDashboard"],
    }),
    DeletInstructionsData: builder.mutation({
      query: (id) => ({
        url: `/recipe/v1/instruction/${id}/delete/`,
        method: "DELETE",
      }),
      invalidatesTags: ["ChefDashboard"],
    }),
    DeletChefNoteData: builder.mutation({
      query: (id) => ({
        url: `/recipe/v1/chef-note/${id}/delete/`,
        method: "DELETE",
      }),
      invalidatesTags: ["ChefDashboard"],
    }),


    PustIngradientsData: builder.mutation({
      query: ({ formattedData, id }) => ({
        url: `/recipe/v1/ingredient/add/${id}/`,
        method: "POST",
        body: formattedData,
      }),
      invalidatesTags: ["ChefDashboard"],
    }),
    PustInstructionsData: builder.mutation({
      query: ({ formattedData, id }) => ({
        url: `/recipe/v1/instruction/add/${id}/`,
        method: "POST",
        body: formattedData,
      }),
      invalidatesTags: ["ChefDashboard"],
    }),
    PustChefNoteData: builder.mutation({
      query: ({ formattedData, id }) => ({
        url: `/recipe/v1/chef-note/add/${id}/`,
        method: "POST",
        body: formattedData,
      }),
      invalidatesTags: ["ChefDashboard"],
    }),

    // chef branding create	

    chefBrandingCreate: builder.mutation({
      query: (formData) => ({
        url: "/chef_dashboard/v1/branding/create/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["ChefDashboard"],
    }),

    getChefBrandingList: builder.query({
      query: () => "/chef_dashboard/v1/branding/get/",
      providesTags: ["ChefDashboard"]
    }),

    // chef subscription plan create

    chefSubscriptionPlanCreate: builder.mutation({
      query: (formData) => ({
        url: "/subscriptions/v1/chef-plans/create/",
        method: "POST",
        body: formData
      }),
      invalidatesTags: ["ChefDashboard"],
    }),


    getSubscriptionPlanList: builder.query({
      query: () => "/subscriptions/v1/chef-plans/list/admin/",
      providesTags: ["ChefDashboard"],
    }),

    subscribtionDiscount: builder.mutation({
      query: ({ plan_id, discount }) => ({
        url: "/subscriptions/v1/chef-plans/discount/",
        method: "POST",
        body: JSON.stringify({ plan_id, discount }),
      }),
      invalidatesTags: ["ChefDashboard"],
    }),
    subscribtionPayment: builder.mutation({
      query: ({ plan_id, plan_type }) => ({
        url: "/subscriptions/v1/create-checkout-session/",
        method: "POST",
        body: JSON.stringify({ plan_id, plan_type }),
      }),
      invalidatesTags: ["ChefDashboard"],
    }),

    // landing page / main page
    getManiChefBrandList: builder.query({
      query: () => "/main/v1/chef/brands/",
      providesTags: ["ChefDashboard"]
    }),
    getManiChefBrandListById: builder.query({
      query: (id) => `/main/v1/chef/brand/${id}/`,
      providesTags: ["ChefDashboard"]
    }),

    getMainSubscription: builder.query({
      query: (id) => `/subscriptions/v1/chef-plans/list/${id}/`,
      providesTags: ["ChefDashboard"]
    }),

    recipeCommentCreate: builder.mutation({
      query: ({ id, commentData }) => ({
        url: `/main/v1/recipe/comment/create/${id}/`,
        method: "POST",
        body: commentData,
        headers: {
          'Content-Type': 'application/json', // Ensure JSON content type
        },
      }),
      invalidatesTags: ["RecipesDettails"]
    }),

    getRecipeCommentList: builder.query({
      query: (id) => `/main/v1/recipe/comments/${id}/`,
      providesTags: ["RecipesDettails"]
    }),




    // chef community section
    chefCommunityPostCreate: builder.mutation({
      query: (formData) => ({
        url: "/community/v1/post/create/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["ChefDashboard"],
    }),

    updateCommunityPost: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/community/v1/post/update/${id}/`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ["ChefDashboard"],
    }),


    getCommunityPostList: builder.query({
      query: (args) => `/community/v1/posts/?page=${args.page}`,
      providesTags: ['CommunityPost'],
    }),
    DeletCommunityPostList: builder.mutation({
      query: (id) => ({
        url: `/community/v1/post/delete/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["CommunityPosts"], // Use the correct tag that `useGetCommunityPostListQuery` provides
    }),
    chefCommentPost: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/community/v1/post/${id}/comment/`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["ChefDashboard"],
    }),
    PostBookmark: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/community/v1/post/${id}/bookmark-unbookmark/`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["ChefDashboard"],
    }),

    PostLikeUnlike: builder.mutation({
      query: ({ id }) => ({
        url: `/community/v1/post/${id}/like-unlike/`,
        method: "POST",

      }),
      invalidatesTags: ["ChefDashboard"],
    }),
    ShareChefPost: builder.mutation({
      query: ({ id }) => ({
        url: `/community/v1/post/${id}/share/`,
        method: "POST",

      }),
      invalidatesTags: ["ChefDashboard"],
    }),


    //user dashboard recipe dettails page
    getMainRecipeDettails: builder.query({
      query: (id) => `/main/v1/recipe/details/${id}/`,

    }),

    RecipeSave: builder.mutation({
      query: ({ id }) => ({
        url: `/main/v1/recipe/save/${id}/`,
        method: "POST",

      }),
      invalidatesTags: ["RecipesDettails"],
    }),

    recipeComment: builder.mutation({
      query: ({ id, content }) => ({
        url: `/main/v1/recipe/comment/create/${id}/`,
        method: 'POST',
        body: { content }, // Send only content
      }),
      invalidatesTags: ['RecipesDettails'],
    }),

    getMainRecipeComment: builder.query({
      query: (id) => `/main/v1/recipe/comments/${id}/`,
      providesTags: ["RecipesDettails"]

    }),
    MainRecipeShare: builder.query({
      query: (id) => ({
        url: `/main/v1/recipe/share/${id}/`,
        method: 'GET',
      }),
    }),


    // user dashboard save recipe and community
    getSaveRecipeList: builder.query({
      query: () => "/main/v1/recipe/save/list/",
      providesTags: ["UserDashboard"],
    }),
    getSaveCummunityList: builder.query({
      query: () => "/community/v1/post/bookmark/list/",
      providesTags: ["UserDashboard"],
    }),


    // chef Ai chat bot
    AiMassageCreate: builder.mutation({
      query: (formData) => ({
        url: "/chatbot/v1/chat/message/",
        method: "POST",
        body: formData,

      }),
      invalidatesTags: ["ChefDashboard"],
    }),
    AiMassageReactCreate: builder.mutation({
      query: (formData) => ({
        url: "/chatbot/v1/chat/message/react/",
        method: "POST",
        body: formData,

      }),
      invalidatesTags: ["ChefDashboard"],
    }),
    getChatMessageList: builder.query({
      query: (selectedRecipe) => `/chatbot/v1/chat/history/${selectedRecipe}/`,

      providesTags: ["ChefDashboard"],
    }),

    inspirationChat: builder.mutation({
      query: (formData) => ({
        url: "/chatbot/v1/inspire/message/",
        method: "POST",
        body: formData, // Send only content
      }),
      invalidatesTags: ["ChefDashboard"],
    }),

    getInspirationChatList: builder.query({
      query: (chatId) => `/chatbot/v1/inspire/history/${chatId}/`,

      providesTags: ["ChefDashboard"],
    }),
    getAiRecipeList: builder.query({
      query: () => `/chatbot/v1/chat/recipe/list/`,

      providesTags: ["ChefDashboard"],
    }),

  }),
});

// Export hooks for usage in components
export const {
  useRecipeCreateMutation,

  useGetCategoryListQuery, useGetSaveCummunityListQuery, useGetSaveRecipeListQuery, useGetCreateRecipeQuery, useDeleteChefRecipeMutation, useAiTrainingMutation, useRecipeUpdateMutation, useGetRecipeDettailsQuery, useChefPlanCreateMutation, useGetIngradientsDataQuery, useGetInstructionDataQuery, useGetChefNoteDataQuery, usePutIngradientsDataMutation, usePutInstructionDataMutation, usePutChefNoteDataMutation, useDeletIngradientsDataMutation, useDeletInstructionsDataMutation, usePustIngradientsDataMutation, usePustInstructionsDataMutation, usePustChefNoteDataMutation, useDeletChefNoteDataMutation, useChefBrandingCreateMutation, useGetChefBrandingListQuery, useChefSubscriptionPlanCreateMutation, useGetSubscriptionPlanListQuery, useGetManiChefBrandListQuery, useGetManiChefBrandListByIdQuery, useGetProfileQuery, useUpdateProfileMutation, useGetAllRecipesQuery, useGetAllBrandsQuery, useChefCommunityPostCreateMutation, useGetCommunityPostListQuery, useDeletCommunityPostListMutation, useChefCommentPostMutation, usePostBookmarkMutation,
  usePostLikeUnlikeMutation, useShareChefPostMutation, useAiMassageCreateMutation, useGetMainSubscriptionQuery, useRecipeCommentCreateMutation, useGetRecipeCommentListQuery, useRecipeSaveMutation, useGetMainRecipeDettailsQuery,
  useRecipeCommentMutation, useGetMainRecipeCommentQuery, useMainRecipeShareQuery, useGetUserFeedbackListQuery, useUserFeedbackDeleteMutation, useChefDashboardFirstPartQuery, useRecentFeedbackQuery, useChefTopRecipeQuery, useAiMassageReactCreateMutation, useGetChatMessageListQuery, useInspirationChatMutation, useGetInspirationChatListQuery, useUpdateCommunityPostMutation, useSubscribtionDiscountMutation, useSubscribtionPaymentMutation, useGetMonthlyRevenueQuery, useGetAllBrandsNameQuery, useGetAiRecipeListQuery
} = ApiSlice;

export default ApiSlice;