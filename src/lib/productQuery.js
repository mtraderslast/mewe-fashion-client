export const PRODUCT_LIST_PATH = "/product";

const FILTER_KEYS = ["search", "category", "subCategory", "brand", "showInDiscount"];

const getParam = (value) => {
    if (Array.isArray(value)) return (value[0] || "").trim();
    return String(value || "").trim();
};

export function buildProductHref(filters = {}) {
    const params = new URLSearchParams();

    FILTER_KEYS.forEach((key) => {
        const value = filters[key];
        if (value === undefined || value === null || value === "") return;
        params.set(key, String(value).trim());
    });

    const query = params.toString();
    return query ? `${PRODUCT_LIST_PATH}?${query}` : PRODUCT_LIST_PATH;
}

export function readProductFilters(searchParams = {}) {
    return {
        search: getParam(searchParams.search),
        category: getParam(searchParams.category),
        subCategory: getParam(searchParams.subCategory),
        brand: getParam(searchParams.brand),
        showInDiscount: getParam(searchParams.showInDiscount),
    };
}

export function filterProducts(products = [], filters = {}) {
    const search = filters.search?.trim().toLowerCase() || "";
    const category = filters.category || "";
    const subCategory = filters.subCategory || "";
    const brand = filters.brand?.toLowerCase() || "";
    const showInDiscount = filters.showInDiscount;

    return products.filter((product) => {
        if (category && product.category !== category) return false;
        if (subCategory && product.subCategory !== subCategory) return false;
        if (brand && product.brand?.toLowerCase() !== brand) return false;

        if (showInDiscount === "true" && !product.showInDiscount) return false;
        if (showInDiscount === "false" && product.showInDiscount) return false;

        if (search) {
            const haystack = [
                product.title,
                product.description,
                product.brand,
                product.category,
                product.subCategory,
                product.slug,
                ...(product.tags || []),
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            if (!haystack.includes(search)) return false;
        }

        return true;
    });
}

const formatSubCategory = (value) =>
    value
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");

export function getProductListHeading(filters = {}) {
    const { search, category, subCategory } = filters;

    if (search) return `Search results for "${search}"`;
    if (category && subCategory) return `${category} · ${formatSubCategory(subCategory)}`;
    if (category) return `${category} Fashion`;
    if (subCategory) return formatSubCategory(subCategory);
    return "All Products";
}
