import axios from "axios";
import { apiHandler } from "./apiHandler";

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reviews`;

export const fetchProductReviews = (productId) => {
    return apiHandler(() => axios.get(`${API_URL}/product-review/${productId}`));
};

export const createReview = (reviewData) => {
    return apiHandler(() =>
        axios.post(`${API_URL}/create-review`, reviewData, { withCredentials: true })
    );
};

export const updateReview = (reviewId, reviewData) => {
    return apiHandler(() =>
        axios.patch(`${API_URL}/${reviewId}`, reviewData, { withCredentials: true })
    );
};

export const deleteReview = (reviewId) => {
    return apiHandler(() =>
        axios.delete(`${API_URL}/${reviewId}`, { withCredentials: true })
    );
};
