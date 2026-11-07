"use client";

import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { createProduct } from "@/lib/action/products";
import { slugify } from "@/lib/slugify";
import {
    CATEGORY_TREE,
    CATEGORY_VALUES,
    SIZE_SUGGESTIONS,
    formatSubCategory,
    getVariantFields,
} from "@/data/categories";

const THEME = {
    grid: "grid grid-cols-1 xl:grid-cols-12 gap-6",
    card: "rounded-2xl border border-[#E4DED4] bg-white p-5 sm:p-6 shadow-[0_8px_30px_rgba(18,32,29,0.04)]",
    cardTitle: "text-sm font-semibold tracking-wide text-[#1B2A26]",
    cardHint: "mt-1 text-xs text-[#6B7873]",
    label: "block text-[11px] font-bold uppercase tracking-wider text-[#5C6560] mb-1.5",
    input: "w-full rounded-xl border border-[#E4DED4] bg-[#FBF9F6] px-3.5 py-2.5 text-sm text-[#1B2A26] outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15",
    inputError: "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20",
    textarea: "w-full min-h-[120px] rounded-xl border border-[#E4DED4] bg-[#FBF9F6] px-3.5 py-2.5 text-sm text-[#1B2A26] outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15 resize-y",
    error: "mt-1 text-[11px] font-medium text-rose-500",
    row: "grid grid-cols-1 sm:grid-cols-2 gap-4",
    check: "h-4 w-4 rounded border-[#C9D3CE] text-teal-600 focus:ring-teal-600",
    ghostBtn: "inline-flex items-center gap-1.5 rounded-xl border border-[#E4DED4] px-3 py-2 text-xs font-semibold text-[#3F4A46] hover:bg-[#F4F1EC] transition-colors",
    dangerBtn: "p-2 rounded-lg text-[#8A9590] hover:bg-rose-50 hover:text-rose-600 transition-colors",
    submitBtn: "w-full rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 text-sm shadow-md shadow-teal-900/10 disabled:opacity-50",
    draftBtn: "w-full rounded-xl border border-[#E4DED4] bg-white hover:bg-[#F4F1EC] text-[#1B2A26] font-semibold py-3 text-sm",
    preview: "h-16 w-16 rounded-lg object-cover border border-[#E4DED4] bg-[#F4F1EC]",
    variantBox: "rounded-xl border border-[#E4DED4] bg-[#FBF9F6] p-4 space-y-3",
};

const TEXT = {
    basicsTitle: "Product details",
    basicsHint: "Name, slug and description shown on the storefront.",
    title: "Title",
    titlePlaceholder: "Men's Regular Fit Cotton Panjabi",
    titleRequired: "Title is required",
    titleMin: "Title must be at least 3 characters",
    slug: "Slug",
    slugRequired: "Slug is required",
    slugInvalid: "Use lowercase letters, numbers and hyphens only",
    description: "Description",
    descriptionPlaceholder: "Write a short product story for customers...",
    descriptionRequired: "Description is required",
    descriptionMin: "Description must be at least 10 characters",
    organizationTitle: "Organization",
    organizationHint: "Category mapping must match the server catalog tree.",
    category: "Category",
    categoryRequired: "Category is required",
    subCategory: "Sub category",
    subCategoryRequired: "Sub category is required",
    brand: "Brand",
    brandPlaceholder: "MEWE",
    tags: "Tags",
    tagsPlaceholder: "cotton, festive, panjabi",
    tagsHint: "Comma separated. Max 20 tags.",
    pricingTitle: "Pricing & stock",
    pricingHint: "Discount must stay below the regular price.",
    price: "Price (৳)",
    priceRequired: "Price is required",
    priceInvalid: "Price must be greater than 0",
    discountPrice: "Discount price (৳)",
    discountInvalid: "Discount must be less than price",
    stock: "Stock",
    stockInvalid: "Stock cannot be negative",
    mediaTitle: "Images",
    mediaHint: "Paste image URLs. Maximum 10.",
    imagePlaceholder: "https://...",
    imageInvalid: "Enter a valid image URL",
    addImage: "Add image",
    variantsTitle: "Variants",
    variantsHint: "Add size, color, volume or scent combinations.",
    addVariant: "Add variant",
    variantPrice: "Variant price",
    variantDiscount: "Variant discount",
    variantStock: "Variant stock",
    sku: "SKU",
    visibilityTitle: "Visibility",
    featured: "Featured product",
    discountFlag: "Show in discount section",
    similarFlag: "Show similar products",
    status: "Status",
    active: "Active",
    draft: "Draft",
    publish: "Publish product",
    saveDraft: "Save as draft",
    publishing: "Saving...",
    successTitle: "Product created",
    successText: "The listing is now available in the catalog.",
    errorTitle: "Could not create product",
    errorDefault: "Please check the form and try again.",
};

const URL_PATTERN = /^https?:\/\/.+/i;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const emptyVariant = (price = "") => ({
    size: "",
    color: "",
    volume: "",
    scent: "",
    price,
    discountPrice: "",
    stock: 0,
    sku: "",
});

const toNumber = (value) => {
    if (value === "" || value === null || value === undefined) return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : NaN;
};

const getApiMessage = (error) =>
    error?.response?.data?.message || error?.message || TEXT.errorDefault;

export default function AddProductForm() {
    const router = useRouter();
    const [slugLocked, setSlugLocked] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        control,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            title: "",
            slug: "",
            description: "",
            category: "",
            subCategory: "",
            brand: "",
            tags: "",
            price: "",
            discountPrice: "",
            stock: 0,
            images: [{ url: "" }],
            variants: [],
            isFeatured: false,
            showInDiscount: false,
            showSimilar: true,
            status: "active",
        },
    });

    const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
        control,
        name: "images",
    });

    const { fields: variantFields, append: appendVariant, remove: removeVariant, replace: replaceVariants } = useFieldArray({
        control,
        name: "variants",
    });

    const title = watch("title");
    const category = watch("category");
    const subCategory = watch("subCategory");
    const price = watch("price");
    const images = watch("images");
    const variantFieldsForSub = getVariantFields(subCategory);
    const subCategories = CATEGORY_TREE[category] || [];
    const sizeSuggestions = SIZE_SUGGESTIONS[subCategory] || [];

    useEffect(() => {
        if (!slugLocked) {
            setValue("slug", slugify(title));
        }
    }, [title, slugLocked, setValue]);

    useEffect(() => {
        setValue("subCategory", "");
        replaceVariants([]);
    }, [category, setValue]);

    const onSubmit = async (values, statusOverride) => {
        const parsedPrice = toNumber(values.price);
        const parsedDiscount = toNumber(values.discountPrice);
        const parsedStock = toNumber(values.stock) ?? 0;

        const payload = {
            title: values.title.trim(),
            slug: values.slug.trim(),
            description: values.description.trim(),
            category: values.category,
            subCategory: values.subCategory,
            brand: values.brand.trim() || undefined,
            price: parsedPrice,
            discountPrice: parsedDiscount,
            stock: parsedStock,
            images: (values.images || []).map((item) => (item.url || "").trim()).filter(Boolean),
            variants: (values.variants || []).map((variant) => ({
                size: variant.size?.trim() || undefined,
                color: variant.color?.trim() || undefined,
                volume: variant.volume?.trim() || undefined,
                scent: variant.scent?.trim() || undefined,
                price: toNumber(variant.price) ?? parsedPrice,
                discountPrice: toNumber(variant.discountPrice),
                stock: toNumber(variant.stock) ?? 0,
                sku: variant.sku?.trim() || undefined,
            })),
            isFeatured: Boolean(values.isFeatured),
            showInDiscount: Boolean(values.showInDiscount),
            showSimilar: Boolean(values.showSimilar),
            status: statusOverride || values.status,
            tags: values.tags
                .split(",")
                .map((tag) => tag.trim().toLowerCase())
                .filter(Boolean)
                .slice(0, 20),
        };

        try {
            await createProduct(payload);
            await Swal.fire({
                icon: "success",
                title: TEXT.successTitle,
                text: TEXT.successText,
                confirmButtonColor: "#0d9488",
            });
            router.push("/dashboard/products");
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: TEXT.errorTitle,
                text: getApiMessage(error),
                confirmButtonColor: "#0d9488",
            });
        }
    };

    const fieldClass = (hasError) => `${THEME.input} ${hasError ? THEME.inputError : ""}`;

    return (
        <form className={THEME.grid} onSubmit={handleSubmit((values) => onSubmit(values))}>
            <div className="xl:col-span-8 space-y-6">
                <section className={THEME.card}>
                    <h2 className={THEME.cardTitle}>{TEXT.basicsTitle}</h2>
                    <p className={THEME.cardHint}>{TEXT.basicsHint}</p>

                    <div className="mt-5 space-y-4">
                        <div>
                            <label className={THEME.label}>{TEXT.title}</label>
                            <input
                                className={fieldClass(errors.title)}
                                placeholder={TEXT.titlePlaceholder}
                                {...register("title", {
                                    required: TEXT.titleRequired,
                                    minLength: { value: 3, message: TEXT.titleMin },
                                })}
                            />
                            {errors.title && <p className={THEME.error}>{errors.title.message}</p>}
                        </div>

                        <div>
                            <label className={THEME.label}>{TEXT.slug}</label>
                            <input
                                className={fieldClass(errors.slug)}
                                {...register("slug", {
                                    required: TEXT.slugRequired,
                                    pattern: { value: SLUG_PATTERN, message: TEXT.slugInvalid },
                                    onChange: () => setSlugLocked(true),
                                })}
                            />
                            {errors.slug && <p className={THEME.error}>{errors.slug.message}</p>}
                        </div>

                        <div>
                            <label className={THEME.label}>{TEXT.description}</label>
                            <textarea
                                className={`${THEME.textarea} ${errors.description ? THEME.inputError : ""}`}
                                placeholder={TEXT.descriptionPlaceholder}
                                {...register("description", {
                                    required: TEXT.descriptionRequired,
                                    minLength: { value: 10, message: TEXT.descriptionMin },
                                })}
                            />
                            {errors.description && <p className={THEME.error}>{errors.description.message}</p>}
                        </div>
                    </div>
                </section>

                <section className={THEME.card}>
                    <h2 className={THEME.cardTitle}>{TEXT.pricingTitle}</h2>
                    <p className={THEME.cardHint}>{TEXT.pricingHint}</p>

                    <div className={`mt-5 ${THEME.row} sm:grid-cols-3`}>
                        <div>
                            <label className={THEME.label}>{TEXT.price}</label>
                            <input
                                type="number"
                                step="0.01"
                                className={fieldClass(errors.price)}
                                {...register("price", {
                                    required: TEXT.priceRequired,
                                    validate: (value) => {
                                        const n = toNumber(value);
                                        return (n !== null && n > 0) || TEXT.priceInvalid;
                                    },
                                })}
                            />
                            {errors.price && <p className={THEME.error}>{errors.price.message}</p>}
                        </div>
                        <div>
                            <label className={THEME.label}>{TEXT.discountPrice}</label>
                            <input
                                type="number"
                                step="0.01"
                                className={fieldClass(errors.discountPrice)}
                                {...register("discountPrice", {
                                    validate: (value) => {
                                        if (value === "" || value === null) return true;
                                        const discount = toNumber(value);
                                        const base = toNumber(price);
                                        if (discount == null || Number.isNaN(discount) || discount < 0) return TEXT.discountInvalid;
                                        if (base != null && discount >= base) return TEXT.discountInvalid;
                                        return true;
                                    },
                                })}
                            />
                            {errors.discountPrice && <p className={THEME.error}>{errors.discountPrice.message}</p>}
                        </div>
                        <div>
                            <label className={THEME.label}>{TEXT.stock}</label>
                            <input
                                type="number"
                                className={fieldClass(errors.stock)}
                                {...register("stock", {
                                    validate: (value) => {
                                        const n = toNumber(value);
                                        return (n !== null && n >= 0 && Number.isInteger(n)) || TEXT.stockInvalid;
                                    },
                                })}
                            />
                            {errors.stock && <p className={THEME.error}>{errors.stock.message}</p>}
                        </div>
                    </div>
                </section>

                <section className={THEME.card}>
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <h2 className={THEME.cardTitle}>{TEXT.mediaTitle}</h2>
                            <p className={THEME.cardHint}>{TEXT.mediaHint}</p>
                        </div>
                        {imageFields.length < 10 && (
                            <button type="button" className={THEME.ghostBtn} onClick={() => appendImage({ url: "" })}>
                                <Plus size={14} />
                                {TEXT.addImage}
                            </button>
                        )}
                    </div>

                    <div className="mt-5 space-y-3">
                        {imageFields.map((field, index) => (
                            <div key={field.id} className="flex items-center gap-3">
                                {images?.[index]?.url && URL_PATTERN.test(images[index].url) ? (
                                    <img src={images[index].url} alt="" className={THEME.preview} />
                                ) : (
                                    <div className={THEME.preview} />
                                )}
                                <input
                                    className={fieldClass(errors.images?.[index]?.url)}
                                    placeholder={TEXT.imagePlaceholder}
                                    {...register(`images.${index}.url`, {
                                        validate: (value) => !value || URL_PATTERN.test(value) || TEXT.imageInvalid,
                                    })}
                                />
                                {imageFields.length > 1 && (
                                    <button type="button" className={THEME.dangerBtn} onClick={() => removeImage(index)}>
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                <section className={THEME.card}>
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <h2 className={THEME.cardTitle}>{TEXT.variantsTitle}</h2>
                            <p className={THEME.cardHint}>{TEXT.variantsHint}</p>
                        </div>
                        <button
                            type="button"
                            className={THEME.ghostBtn}
                            onClick={() => appendVariant(emptyVariant(price))}
                            disabled={!subCategory}
                        >
                            <Plus size={14} />
                            {TEXT.addVariant}
                        </button>
                    </div>

                    <div className="mt-5 space-y-4">
                        {variantFields.map((field, index) => (
                            <div key={field.id} className={THEME.variantBox}>
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-semibold text-[#3F4A46]">Variant {index + 1}</p>
                                    <button type="button" className={THEME.dangerBtn} onClick={() => removeVariant(index)}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                    {variantFieldsForSub.includes("size") && (
                                        <div>
                                            <label className={THEME.label}>Size</label>
                                            <input
                                                list={`size-${index}`}
                                                className={THEME.input}
                                                {...register(`variants.${index}.size`, {
                                                    required: variantFieldsForSub.includes("size"),
                                                })}
                                            />
                                            <datalist id={`size-${index}`}>
                                                {sizeSuggestions.map((size) => (
                                                    <option key={size} value={size} />
                                                ))}
                                            </datalist>
                                        </div>
                                    )}
                                    {variantFieldsForSub.includes("color") && (
                                        <div>
                                            <label className={THEME.label}>Color</label>
                                            <input className={THEME.input} {...register(`variants.${index}.color`, { required: true })} />
                                        </div>
                                    )}
                                    {variantFieldsForSub.includes("volume") && (
                                        <div>
                                            <label className={THEME.label}>Volume</label>
                                            <input className={THEME.input} {...register(`variants.${index}.volume`, { required: true })} />
                                        </div>
                                    )}
                                    {variantFieldsForSub.includes("scent") && (
                                        <div>
                                            <label className={THEME.label}>Scent</label>
                                            <input className={THEME.input} {...register(`variants.${index}.scent`, { required: true })} />
                                        </div>
                                    )}
                                    <div>
                                        <label className={THEME.label}>{TEXT.variantPrice}</label>
                                        <input type="number" step="0.01" className={THEME.input} {...register(`variants.${index}.price`)} />
                                    </div>
                                    <div>
                                        <label className={THEME.label}>{TEXT.variantDiscount}</label>
                                        <input type="number" step="0.01" className={THEME.input} {...register(`variants.${index}.discountPrice`)} />
                                    </div>
                                    <div>
                                        <label className={THEME.label}>{TEXT.variantStock}</label>
                                        <input type="number" className={THEME.input} {...register(`variants.${index}.stock`)} />
                                    </div>
                                    <div>
                                        <label className={THEME.label}>{TEXT.sku}</label>
                                        <input className={THEME.input} {...register(`variants.${index}.sku`)} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <div className="xl:col-span-4 space-y-6 xl:sticky xl:top-24 h-fit">
                <section className={THEME.card}>
                    <h2 className={THEME.cardTitle}>{TEXT.organizationTitle}</h2>
                    <p className={THEME.cardHint}>{TEXT.organizationHint}</p>

                    <div className="mt-5 space-y-4">
                        <div>
                            <label className={THEME.label}>{TEXT.category}</label>
                            <select className={fieldClass(errors.category)} {...register("category", { required: TEXT.categoryRequired })}>
                                <option value="">Select category</option>
                                {CATEGORY_VALUES.map((item) => (
                                    <option key={item} value={item}>{item}</option>
                                ))}
                            </select>
                            {errors.category && <p className={THEME.error}>{errors.category.message}</p>}
                        </div>

                        <div>
                            <label className={THEME.label}>{TEXT.subCategory}</label>
                            <select
                                className={fieldClass(errors.subCategory)}
                                disabled={!category}
                                {...register("subCategory", { required: TEXT.subCategoryRequired })}
                            >
                                <option value="">Select sub category</option>
                                {subCategories.map((item) => (
                                    <option key={item} value={item}>{formatSubCategory(item)}</option>
                                ))}
                            </select>
                            {errors.subCategory && <p className={THEME.error}>{errors.subCategory.message}</p>}
                        </div>

                        <div>
                            <label className={THEME.label}>{TEXT.brand}</label>
                            <input className={THEME.input} placeholder={TEXT.brandPlaceholder} {...register("brand")} />
                        </div>

                        <div>
                            <label className={THEME.label}>{TEXT.tags}</label>
                            <input className={THEME.input} placeholder={TEXT.tagsPlaceholder} {...register("tags")} />
                            <p className={THEME.cardHint}>{TEXT.tagsHint}</p>
                        </div>
                    </div>
                </section>

                <section className={THEME.card}>
                    <h2 className={THEME.cardTitle}>{TEXT.visibilityTitle}</h2>
                    <div className="mt-5 space-y-3">
                        <label className="flex items-center gap-2.5 text-sm text-[#3F4A46]">
                            <input type="checkbox" className={THEME.check} {...register("isFeatured")} />
                            {TEXT.featured}
                        </label>
                        <label className="flex items-center gap-2.5 text-sm text-[#3F4A46]">
                            <input type="checkbox" className={THEME.check} {...register("showInDiscount")} />
                            {TEXT.discountFlag}
                        </label>
                        <label className="flex items-center gap-2.5 text-sm text-[#3F4A46]">
                            <input type="checkbox" className={THEME.check} {...register("showSimilar")} />
                            {TEXT.similarFlag}
                        </label>
                        <div>
                            <label className={THEME.label}>{TEXT.status}</label>
                            <select className={THEME.input} {...register("status")}>
                                <option value="active">{TEXT.active}</option>
                                <option value="draft">{TEXT.draft}</option>
                            </select>
                        </div>
                    </div>
                </section>

                <section className={`${THEME.card} space-y-3`}>
                    <button type="submit" disabled={isSubmitting} className={THEME.submitBtn}>
                        {isSubmitting ? TEXT.publishing : TEXT.publish}
                    </button>
                    <button
                        type="button"
                        disabled={isSubmitting}
                        className={THEME.draftBtn}
                        onClick={handleSubmit((values) => onSubmit(values, "draft"))}
                    >
                        {TEXT.saveDraft}
                    </button>
                </section>
            </div>
        </form>
    );
}
