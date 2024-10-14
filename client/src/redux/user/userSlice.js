import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    error: null,
    loading: null
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
            state.error = null
        },
        signInSuccess: (state, action) => {
            console.log("this is user slice", action.payload);
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null
        },
        signInFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload
        },
        updateStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        updateSuccess: (state, action) => {
            state.currentUser = {
                ...state.currentUser,
                user: action.payload
            };
            state.loading = false;
            state.error = null;
        },
        updateFailure: (state, action) => {
            state.loading = false,
                state.error = action.payload
        },
        deleteUserStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        deleteUserSuccess: (state, action) => {
            state.currentUser = null,
                state.loading = false,
                state.error = null
        },
        deleteUserFailure: (state, action) => {
            state.loading = false,
                state.error = action.payload
        },
        signOutSuccess: (state) => {
            state.currentUser = null,
                state.loading = false,
                state.error = null
        }
    }
})

export const {
    signInStart,
    signInSuccess,
    signInFailure,
    updateStart,
    updateSuccess,
    updateFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    signOutSuccess
} = userSlice.actions

export default userSlice.reducer