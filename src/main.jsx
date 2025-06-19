import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Roots from './Root/Roots.jsx';
// import ErrorPage from './component/ErrorPage/ErrorPage.jsx';
// import Home from './component/Home/Home.jsx';
import Home from './component/Home/Home.jsx'
import UserDashboardLayout from './component/UsersDashboard/UserDashboardLayout/UserDashboardLayout.jsx';
// import OderManangement from './component/UsersDashboard/UserDashboardPages/OderManangement.jsx';
import AdminDashboardLayout from './component/AdminDashboard/AdminDashboardLayout/AdminDashboardLayout.jsx';
import AdminDashboard from './component/AdminDashboard/AdminDashboardPages/AdminDashboard.jsx';

import AdminDashboardAiChat from './component/AdminDashboard/AdminDashboardPages/AdminDashboardChefs.jsx';




// import ConfirmEmail from './component/Shared/ConfirmEmail/ConfirmEmail.jsx';
import ConfirmPassword from './component/Shared/Admin_ConfirmPassword/Admin_ConfirmPassword.jsx';
import PasswordChangeSuccesfully from './component/Shared/PasswordChangeSuccesfully/PasswordChangeSuccesfully.jsx';


import Admin_login from './component/Shared/Admin_login/Admin_login.jsx';
import Admin_ConfirmPassword from './component/Shared/Admin_ConfirmPassword/Admin_ConfirmPassword.jsx';
import UserSignup from './component/Shared/UserSignup/UserSignup.jsx';
import UserSingin from './component/Shared/UserSignin/UserSignin.jsx';
import AllRecipes from './component/UsersDashboard/UserDashboardPages/AllRecipes/AllRecipes.jsx';
import AiChat from './component/UsersDashboard/UserDashboardPages/AiChat/AiChat.jsx';
import RecipesDettails from './component/UsersDashboard/UserDashboardPages/RecipesDettails/RecipesDettails.jsx';
import Community from './component/UsersDashboard/UserDashboardPages/Community.jsx';
import SaveRecipes from './component/UsersDashboard/UserDashboardPages/SaveRecipes.jsx';
import CommunityPost from './component/UsersDashboard/UserDashboardPages/CommunityPost.jsx';
import ProfileAndSetting from './component/UsersDashboard/UserDashboardPages/ProfileAndSetting.jsx';
import ChefDashboardLayout from './component/ChefDashboard/ChefDashboardLayout/ChefDashboardLayout.jsx';
import ChefDashboardPage from './component/ChefDashboard/ChefDashboardPage/ChefDashboardPage.jsx';
import ChefAllRecipes from './component/ChefDashboard/ChefDashboardPage/ChefAllRecipes.jsx';

// import ChefRecipesEditPage from './component/ChefDashboard/ChefDashboardPage/ChefRecipesAddpage.jsx';
import AiTraining from './component/ChefDashboard/ChefDashboardPage/AiTraining.jsx';
import ChefSettingAndPrivecy from './component/ChefDashboard/ChefDashboardPage/ChefSettingAndPrivecy.jsx';

import Branding from './component/ChefDashboard/ChefDashboardPage/Branding.jsx';
import ChefSubscribtion from './component/ChefDashboard/ChefDashboardPage/ChefSubscribtion.jsx';
import ChefCommunity from './component/ChefDashboard/ChefDashboardPage/ChefCommunity.jsx';
import AdminDashboardChefs from './component/AdminDashboard/AdminDashboardPages/AdminDashboardChefs.jsx';
import AdminDashboardUser from './component/AdminDashboard/AdminDashboardPages/AdminDashboardUser.jsx';
import AdminDashboardSubscription from './component/AdminDashboard/AdminDashboardPages/AdminDashboardSubscription.jsx';
import AdminDashboardSettingPrivecy from './component/AdminDashboard/AdminDashboardPages/AdminDashboardSettingPrivecy.jsx';
import UserInspirationChat from './component/UsersDashboard/UserDashboardPages/UserInspirationChat.jsx';


import ChefAiChat from './component/ChefDashboard/ChefDashboardPage/ChefAiChat.jsx';
import ForgetPassword from './component/Shared/ForgetPassword/ForgetPassword.jsx';
import NewPassword from './component/Shared/NewPassword.jsx';
import { Provider } from 'react-redux';
import store from './Rudux/store.js';
import ForgetPasswordVerification from './component/Shared/Verification/ForgetPasswordVerification.jsx';
import Verification from './component/Shared/Verification/Verification.jsx';
import UserFeedback from './component/ChefDashboard/ChefDashboardPage/UserFeedback.jsx';
import ChefRecipesAddpage from './component/ChefDashboard/ChefDashboardPage/ChefRecipesAddpage.jsx';
import ChefRecipesEditPage from './component/ChefDashboard/ChefDashboardPage/ChefRecipesEditPage.jsx';
import AddNewPlan from './component/ChefDashboard/ChefDashboardPage/AddNewPlan.jsx';
import ChefInspiration from './component/ChefDashboard/ChefDashboardPage/ChefInspiration.jsx';
import PrivateRoute from './component/PrivateRoute/PrivateRoute.jsx';
import Unauthorized from './component/Unauthorized/Unauthorized.jsx';
import PaymentSuccess from './component/Payment/PaymentSuccess.jsx';
import PaymentCancel from './component/Payment/PaymentCancel.jsx';

// import ConfirmEmail from './component/Shared/ConfirmEmail/ConfirmEmail.jsx';
// import UserSingin from './component/Shared/UserSignin/UserSignin.jsx';



const router = createBrowserRouter([
  {
    path: "/",
    element: <Roots />,
    
    children: [
      {
        path: "/",
        element: <Home />,
      },
       {
        path: "/unauthorized",
        element: <Unauthorized />,
      },
       {
        path: "/success",
        element: <PaymentSuccess />,
      },
       {
        path: "/cancel",
        element: <PaymentCancel />,
      },
    ],
  },
  // ----------user dashboard---------
  {
    path: "/dashboard",
    element: (<PrivateRoute allowedRoles={['user']}>
      <UserDashboardLayout />
    </PrivateRoute>),

    children: [
      {
        index: true,
        element: <AllRecipes />
      },
      {
        path: 'ai_chat',
        element: <AiChat />
      },
      {
        path: 'recipes_dettails/:id',
        element: <RecipesDettails />
      },

      {
        path: 'community',
        element: <Community />
      },
      {
        path: 'save_recipes',
        element: <SaveRecipes />
      },

      {
        path: 'community_post',
        element: <CommunityPost />
      },

      {
        path: 'profile_settings',
        element: <ProfileAndSetting />
      },

      {
        path: "inspiration_chat",
        element: <UserInspirationChat />
      },






    ]
  },

  //.................Chef Dashboard.............


  {
    path: "/chef_dashboard",
    element: (

       <PrivateRoute allowedRoles={['chef']}>
      <ChefDashboardLayout />
    </PrivateRoute>
  ),
    children: [

      {
        index: true,
        element: <ChefDashboardPage />
      },

      {
        path: 'chef_all_recipes',
        element: <ChefAllRecipes />
      },
      {
        path: 'chef_recipese_edit_page/:id',
        element: <ChefRecipesEditPage />
      },
      {
        path: 'chef_recipese_addd_page',
        element: <ChefRecipesAddpage />
      },
      {
        path: 'ai_training',
        element: <AiTraining />
      },
      {
        path: 'chef_settings_privecy',
        element: <ChefSettingAndPrivecy />
      },
      {
        path: 'branding',
        element: <Branding />
      },
      {
        path: 'chef_subscribtion',
        element: <ChefSubscribtion />
      },
      {
        path: 'user_feedback',
        element: <UserFeedback />
      },

      {
        path: 'chef_community',
        element: <ChefCommunity />
      },
      {
        path: 'chef_ai_chat',
        element: <ChefAiChat />
      },
      {
        path: 'add_new_plan',
        element: <AddNewPlan />
      },
      {
        path: 'chef_inspiration',
        element: <ChefInspiration />
      },




    ]
  }
  ,


  //--------------admin dashboard----------

  {
    path: "/Admin_Dashboard",
    element:   (<PrivateRoute allowedRoles={['admin']}>
      <AdminDashboardLayout />
    </PrivateRoute>),
    children: [
      {
        index: true,
        element: <AdminDashboard />
      },
      {
        path: "chefs", // Relative path under /Admin_Dashboard
        element: <AdminDashboardChefs />,
        children: [

          {
            path: "chatbot",
            element: <AdminDashboardAiChat />
          }
        ]
      },

      {
        path: "users",
        element: <AdminDashboardUser />
      },
      {
        path: "subscriber",
        element: <AdminDashboardSubscription />
      },
      {
        path: "settings_privecy",
        element: <AdminDashboardSettingPrivecy />
      },

    ]
  },



  // .................user Authentications.................

  {
    path: '/signup',
    element: <UserSignup />
  },
  {
    path: '/signin',
    element: <UserSingin />
  },
  {
    path: '/forget_password',
    element: <ForgetPassword />
  },
  {
    path: '/verification',
    element: <Verification />
  },
  {
    path: '/forget_password_verification',
    element: <ForgetPasswordVerification />
  },
  {
    path: '/new_password',
    element: <NewPassword />
  },


  {
    path: '/password_change_succesfull',
    element: <PasswordChangeSuccesfully />
  },
  // .................Admin Authentications.................


  {
    path: '/Admin_login',
    element: <Admin_login />
  },
  {
    path: '/admin_confirmPassword',
    element: <Admin_ConfirmPassword />
  },

  {
    path: '/confirm_password',
    element: <ConfirmPassword />
  },

  


]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <React.StrictMode>
        {/* Wrap everything */}
        <RouterProvider router={router} />
      </React.StrictMode>
    </Provider>
  </StrictMode>,
)
