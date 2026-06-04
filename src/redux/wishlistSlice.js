import { createSlice } from '@reduxjs/toolkit';

// SSR-safe: always initialize with empty state
const initialState = {
    items: [],
    isHydrated: false,
};

const persist = (items) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('wishlistItems', JSON.stringify(items));
    }
};

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        // Hydrate wishlist from localStorage on client-side mount
        hydrateWishlist: (state) => {
            if (typeof window !== 'undefined' && !state.isHydrated) {
                try {
                    const saved = localStorage.getItem('wishlistItems');
                    state.items = saved ? JSON.parse(saved) : [];
                } catch (error) {
                    state.items = [];
                }
                state.isHydrated = true;
            }
        },
        toggleWishlist: (state, action) => {
            const item = action.payload;
            const exists = state.items.find((i) => i.id === item.id);
            if (exists) {
                state.items = state.items.filter((i) => i.id !== item.id);
            } else {
                state.items.push(item);
            }
            persist(state.items);
        },
        removeFromWishlist: (state, action) => {
            state.items = state.items.filter((i) => i.id !== action.payload);
            persist(state.items);
        },
        clearWishlist: (state) => {
            state.items = [];
            persist(state.items);
        },
    },
});

export const { hydrateWishlist, toggleWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
