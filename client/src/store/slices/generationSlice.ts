import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state
interface generationState {
generations: number;
}

// Define the initial state using that type
const initialState: generationState = {
    generations: 0,
};

export const generationSlice = createSlice({
    name: "generation",
    
    initialState,
    reducers: {
        generate: (state, action: PayloadAction<generationState>) => {
                state.generations = action.payload.generations;
        },
        delgenerate: (state) => {
                state.generations = 0;
        },
    },
});

export const { generate,delgenerate } = generationSlice.actions;

export default generationSlice.reducer;
