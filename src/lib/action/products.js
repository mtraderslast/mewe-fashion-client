import axios from "axios";
import { apiHandler } from "./apiHandler";

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/product`;

export const createProduct = (productData) => {
    return apiHandler(() =>
        axios.post(API_URL, productData, { withCredentials: true })
    );
};

export const fetchAllProducts = (params = {}) => {
    return apiHandler(() => axios.get(API_URL, { params }));
};

export const fetchCategorySummary = () => {
    return apiHandler(() => axios.get(`${API_URL}/category-summary`));
};

export const fetchProductDetails = (slug) => {
    return apiHandler(() => axios.get(`${API_URL}/${slug}`));
};

export const fetchProductById = (id) => {
    return apiHandler(() =>
        axios.get(`${API_URL}/admin/${id}`, { withCredentials: true })
    );
};

export const updateProduct = (productId, updateData) => {
    return apiHandler(() =>
        axios.patch(`${API_URL}/${productId}`, updateData, {
            withCredentials: true,
        })
    );
};

export const deleteProduct = (productId) => {
    return apiHandler(() =>
        axios.delete(`${API_URL}/${productId}`, {
            withCredentials: true,
        })
    );
};