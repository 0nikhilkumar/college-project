import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    isAuth: false,
    user: null,
    otp: {
        phone: '',
        hash: '',
    }
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state, action)=> {
            const {user} = action.payload;
            state.user = user;
            if(user===null){
                state.isAuth = false;
            }
            else state.isAuth = true;
        },

        setOtp: (state, action)=> {
            const { phone, hash, otp } = action.payload;
            state.otp.phone = phone;
            state.otp.hash = hash;
            state.otp.otp = otp;
        }
    }
});

export const { setAuth, setOtp } = authSlice.actions;
export default authSlice.reducer;