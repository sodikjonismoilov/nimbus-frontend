import { configureStore, createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
    name: "ui",
    initialState: { theme: "light" as "light" | "dark" },
    reducers: { setTheme: (s, a: { payload: "light" | "dark" }) => { s.theme = a.payload; } },
});
export const { setTheme } = uiSlice.actions;

export const store = configureStore({
    reducer: { ui: uiSlice.reducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
