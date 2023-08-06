import { createSlice } from "@reduxjs/toolkit";

//state that will be stored in a global state--data will be accessed through the entire application
const initialState = {
    mode:"light",
    user:null,
    token:null,
    posts:[],
};

export const authSlice = createSlice({
    name:"auth",
    initialState,
    //To read the Global variable 
    reducers : {
        setMode: (state) => {
            state.mode = state.mode === "light" ? "dark" :"light";
        },
        setLogin: (state,action) => {//action argument include all the argument
            state.user = action.payload.user;//sending the user parameter to setLogin function
            state.token = action.payload.token;
        },
        setLogout: (state,action) => {
            state.user = null;
            state.token = null;
        },
        setFriends: (state,action) => {
            if (state.user) { //if the user already exist
                state.user.friends = action.payload.friends
            }else{
                console.error("user friends non-existent :(");
            }
        },
        setPosts: (state,action) => {
            state.posts = action.payload.posts;
        },
        setPost: (state,action) => {
            const updatedPosts = state.posts.map((post) => { //map thrugh each post
                if(post._id === action.payload.post._id) return action.payload.post;
                return post;
            });
            state.posts = updatedPosts;
        }
    }
})

export const { setMode,setLogin,setLogout,setFriends,setPost,setPosts } = authSlice.actions;
export default authSlice.reducer;