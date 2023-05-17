import { createSlice } from "@reduxjs/toolkit";
export const productSlice = createSlice({
  name: "product",
  initialState: {
    data: [],
  },
  reducers: {
    create: (state, action) => {
      state.data.slice(0, state.data.length);
      const data = action.payload;

      if (data) {
        data.map((item) => {
          //console.log(item);
          state.data.push(item);
        });

        //
      }
    },
  },
});

export const { create } = productSlice.actions;

export default productSlice.reducer;
