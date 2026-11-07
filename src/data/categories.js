export const CATEGORY_TREE = {
    Mens: ["Shirt", "Pant", "Shoes", "Watch", "Perfume"],
    Womens: ["Dress", "Burqa", "Hijab", "Facial Wash", "Moisturizer"],
    Kids: ["kids-shirt", "kids-pant", "kids-shoes", "Baby Cream"],
};

export const CATEGORY_VALUES = Object.keys(CATEGORY_TREE);

export const VARIANT_FIELDS = {
    Shirt: ["size", "color"],
    Pant: ["size", "color"],
    Shoes: ["size", "color"],
    Dress: ["size", "color"],
    Burqa: ["size", "color"],
    Hijab: ["color"],
    Watch: ["color"],
    Perfume: ["volume", "scent"],
    "Facial Wash": ["volume"],
    Moisturizer: ["volume"],
    "Baby Cream": ["volume"],
    "kids-shirt": ["size", "color"],
    "kids-pant": ["size", "color"],
    "kids-shoes": ["size", "color"],
};

export const SUB_CATEGORY_LABELS = {
    "kids-shirt": "Kids Shirt",
    "kids-pant": "Kids Pant",
    "kids-shoes": "Kids Shoes",
};

export const SIZE_SUGGESTIONS = {
    Shirt: ["S", "M", "L", "XL", "XXL"],
    Dress: ["S", "M", "L", "XL", "XXL"],
    Burqa: ["52", "54", "56", "58", "60"],
    Pant: ["28", "30", "32", "34", "36", "38"],
    Shoes: ["39", "40", "41", "42", "43", "44"],
    "kids-shirt": ["2-3Y", "4-5Y", "6-7Y", "8-9Y"],
    "kids-pant": ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y"],
    "kids-shoes": ["21", "22", "23", "24", "25", "26", "27", "28"],
};

export const formatSubCategory = (value) =>
    SUB_CATEGORY_LABELS[value] || value;

export const getVariantFields = (subCategory) =>
    VARIANT_FIELDS[subCategory] || [];
