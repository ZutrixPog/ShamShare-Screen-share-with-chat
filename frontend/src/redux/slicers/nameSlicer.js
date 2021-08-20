import { createSlice } from "@reduxjs/toolkit";

export const nameSlice = createSlice({
    name: 'name',
    initialState: { value : '' },
    reducers: {
        setName: (state, action) => {
            state.value = action.payload;
        }
    }
});

export const { setName } = nameSlice.actions;

export default nameSlice.reducer;