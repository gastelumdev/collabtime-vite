import { createSlice } from "@reduxjs/toolkit";

interface Table {
    showDoneRows: boolean;
    checkedRowIds: any[];
}

const initialState: Table = {
    showDoneRows: false,
    checkedRowIds: []
}

const tableSlice = createSlice({
    name: "table",
    initialState,
    reducers: {
        toggleShowDoneRows: (state) => {
            state.showDoneRows = !state.showDoneRows;
        },
        addCheckedRowId: (state: any, payload: any) => {
            state.checkedRowIds.push(payload.payload);
        },
        removeCheckedRowId: (state: any, payload: any) => {
            const rowIds: any = state.checkedRowIds.filter((id: any) => {
                return payload.payload !== id;
            })
            state.checkedRowIds = rowIds;
        },
        clearCheckedRowIds: (state: any) => {
            state.checkedRowIds = []
        },

    }
});

export const { toggleShowDoneRows, addCheckedRowId, removeCheckedRowId, clearCheckedRowIds } = tableSlice.actions;
export default tableSlice.reducer;