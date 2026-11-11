export const apiHandler = async (callback) => {
    try {
        const res = await callback();
        return res.data;
    } catch (error) {
        console.error("API Error:", error.response?.data || error.message);
        throw error;
    }
};