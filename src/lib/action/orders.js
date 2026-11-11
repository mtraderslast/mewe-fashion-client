import axios from "axios";
import { apiHandler } from "./apiHandler";

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders`;

export const createOrder = (orderData) => {
    return apiHandler(() =>
        axios.post(API_URL, orderData, { withCredentials: true })
    );
};

export const trackOrder = (trackingId) => {
    return apiHandler(() => axios.get(`${API_URL}/track/${encodeURIComponent(trackingId)}`));
};

export const fetchMyOrders = (params = {}) => {
    return apiHandler(() =>
        axios.get(`${API_URL}/mine`, { params, withCredentials: true })
    );
};

export const fetchAllOrders = (params = {}) => {
    return apiHandler(() =>
        axios.get(API_URL, { params, withCredentials: true })
    );
};

export const fetchOrderById = (orderId) => {
    return apiHandler(() =>
        axios.get(`${API_URL}/${orderId}`, { withCredentials: true })
    );
};

export const updateOrder = (orderId, updateData) => {
    return apiHandler(() =>
        axios.patch(`${API_URL}/${orderId}`, updateData, { withCredentials: true })
    );
};

export const deleteOrder = (orderId) => {
    return apiHandler(() =>
        axios.delete(`${API_URL}/${orderId}`, { withCredentials: true })
    );
};
