import { createSlice } from "@reduxjs/toolkit";

interface Table {
    showDoneRows: boolean;
}

const initialState: Table = {
    showDoneRows: false,
}

const tableSlice = createSlice({
    name: "table",
    initialState,
    reducers: {
        toggleShowDoneRows: (state) => {
            state.showDoneRows = !state.showDoneRows;
        }
    }
});

export const { toggleShowDoneRows } = tableSlice.actions;
export default tableSlice.reducer;