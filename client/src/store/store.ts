import { configureStore } from '@reduxjs/toolkit'
// ...
import userReducer from "./slices/userSlice"
import generationReducer from "./slices/generationSlice"
const store = configureStore({
    reducer: {
        // add your reducers here
        user: userReducer,
        generation: generationReducer
    },
})


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export default store;