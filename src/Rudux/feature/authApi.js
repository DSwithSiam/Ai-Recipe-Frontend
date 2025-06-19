

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://bmn1212.duckdns.org/api/auth/v1", //  Update this with your backend URL
    }),
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (data) => ({
                url: "/signup/", //  Your API endpoint
                method: "POST",
                body: data, //  Sending email & password
            }),
        }),

        registerVerification: builder.mutation({
            query: (data) => ({
                url: "/activate/",
                method: "POST",
                body: data,
            })
        }),
        resendOtp: builder.mutation({
            query: (data) => ({
                url: "/resend-otp/",
                method: "POST",
                body: data,
            })
        }),

        login: builder.mutation({
            query: (data) => ({
                url: "/login/",
                method: "POST",
                body: data,
            })
        }),

        forgetPassword: builder.mutation({
            query: (email) => ({
                url: "/password-reset-request/",
                method: "POST",
                body: email,
            })
        }),

        forgetpasswordVerification: builder.mutation({
            query: (data) => ({
                url: "/reset-request-activate/",
                method: "POST",
                body: data,
            })
        }),
     
        NewPassword: builder.mutation({
            query: (data) => ({
                url: "/reset-password/",
                method: "POST",
                body: data,
            })
        }),
       
    }),
});

// ✅ Destructure the auto-generated hook
export const { useRegisterMutation,
     useRegisterVerificationMutation,useResendOtpMutation, useLoginMutation, useForgetPasswordMutation, useForgetpasswordVerificationMutation, useNewPasswordMutation
    //  useForgetPasswordMutation, 
    //   useForgetpasswordVerificationMutation, useConfrimPasswordMutation, useForgetRecentVerificationMutation
     } = authApi;
export default authApi;