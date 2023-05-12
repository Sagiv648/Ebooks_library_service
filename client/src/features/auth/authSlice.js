import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'

import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

import axios from 'axios'

export const authenticateThunk = createAsyncThunk("auth", async (data) => {
    try {
        console.log("in thunk data is:");
        console.log(data);

        const a = await axios.post(`${BASE_URL}/user/signup`, data)
        console.log("response from server is");
        console.log(a.data);
        console.log("----");
        // const r_res = await fetch(`${BASE_URL}/user/signup`, {method: 'POST', 
        //     body: JSON.stringify(data)
                
        // })
        // const res = await r_res.json();
        return {token: a.data.token, email: data.email};
    } 
    catch (error) {
        
    }
})

const initialState = {
    token: "",
    profile: {
        
    }
}

const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        populate: (state,payload) => {
            state.token = payload.payload.token;
            state.profile = payload.payload.profile
        }
    },
    extraReducers: builder => {
        builder.addCase(authenticateThunk.fulfilled, (state, action) => {
            console.log(action);
            state.token = action.payload.token;
            state.profile = {email: action.payload.email}

        }).addCase(authenticateThunk.rejected, (state, payload) => {
            console.log("for the moment print, it's failed");
        })
        .addCase(authenticateThunk.pending, (state,payload) => {
            console.log("for the moment print, it's pending");
        })
        
    }

    
    
})

const BASE_URL = "http://localhost:80/api"



export const {populate} = authSlice.actions;

export default authSlice.reducer;