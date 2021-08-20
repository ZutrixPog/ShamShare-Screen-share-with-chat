import { createSlice } from "@reduxjs/toolkit";
import {io} from 'socket.io-client';

export const socketSlice = createSlice({
    name: 'socket',
    initialState: { value : io.connect('http://127.0.0.1:8000') },
    reducers: {
        setSocket: state => {
            state.value = io.connect('http://127.0.0.1:8000');
        },
        disconnect: state => {
            state.value.disconnect();
        }
    }
});

export const { setSocket, disconnect } = socketSlice.actions;

export default socketSlice.reducer;