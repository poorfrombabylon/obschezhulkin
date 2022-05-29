import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const loadCountries = createAsyncThunk(
  '@@profile/load-countries',
  (_, {
    extra: {api},
  }) => {

  }
);

const initialState = {
  status: 'idle',
  error: null,
}

const profileSlice = createSlice({
  name: '@@countries',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadCountries.pending, (state) => {

      })
      .addCase(loadCountries.rejected, (state, action) => {

      })
      .addCase(loadCountries.fulfilled, (state, action) => {

      })
  }
})

export const profileReducer = profileSlice.reducer;

// selectors
