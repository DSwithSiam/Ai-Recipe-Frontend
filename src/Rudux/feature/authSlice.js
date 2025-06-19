import { createSlice } from "@reduxjs/toolkit";

// Load accessToken from localStorage when Redux initializes
const storedAccessToken = localStorage.getItem("accessToken");

const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: storedAccessToken || null  // ✅ Reload করলে Redux state reset হলেও, token localStorage থেকে restore হবে
    },
    reducers: {
        setUser: (state, action) => {
            console.log("Setting Token:", action?.payload?.accessToken);
            state.token = action.payload.accessToken;
        },
        logout: (state) => {
            state.token = null;
            localStorage.removeItem("accessToken"); // ✅ Logout করলে localStorage থেকেও remove হবে
        }
    }
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;