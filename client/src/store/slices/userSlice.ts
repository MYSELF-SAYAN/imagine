import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state
interface userState {
  id: string;
  email: string;
  username: string;
  password: string;
  plan: string;
  isLogged: boolean;
}

// Define the initial state using that type
const initialState: userState = {
    id: "",
    email: "",
    username: "",
    password: "",
    plan: "",
    isLogged: false,
};

export const userSlice = createSlice({
  name: "user",
  
  initialState,
  reducers: {
    signIn: (state, action: PayloadAction<userState>) => {
        state.id = action.payload.id;
        state.email = action.payload.email;
        state.username = action.payload.username;
        state.password = action.payload.password;
        state.plan = action.payload.plan;
        state.isLogged = true;
    },
    logOut: (state) => {
        state.id = "";
        state.email = "";
        state.username = "";
        state.password = "";
        state.plan = "";
        state.isLogged = false;
    }
  },
});

export const { signIn,logOut } = userSlice.actions;

export default userSlice.reducer;
