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
        setShowDoneRows: (state) => {
            console.log("STATE CHANGE")
            console.log(state.showDoneRows)
            state.showDoneRows = !state.showDoneRows;
        }
    }
});

export const { setShowDoneRows } = tableSlice.actions;
export default tableSlice.reducer;