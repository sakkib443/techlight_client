import { configureStore } from "@reduxjs/toolkit";
import courseReducer from "./CourseSlice";
import categoryReducer from "./categorySlice";
import cartReducer from "./cartSlice";
import orderReducer from "./orderSlice";
import enrollmentReducer from "./enrollmentSlice";
import reviewReducer from "./reviewSlice";
import wishlistReducer from "./wishlistSlice";

export default configureStore({
  reducer: {
    courses: courseReducer,
    categories: categoryReducer,
    cart: cartReducer,
    order: orderReducer,
    enrollment: enrollmentReducer,
    reviews: reviewReducer,
    wishlist: wishlistReducer,
  },
});



