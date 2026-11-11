"use client";

import { useCallback, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { createProduct, updateProduct } from "@/lib/action/products";
import { slugify } from "@/lib/slugify";
import {
    CATEGORY_TREE,
    CATEGORY_VALUES,
    formatSubCategory,
} from "@/data/categories";
import VariantBuilder from "./VariantBuilder";

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
    pricingHint: "Discount must stay below the regular price. Variant stock is counted separately.",
    price: "Price ($)",
    priceRequired: "Price is required",
    priceInvalid: "Price must be greater than 0",
    discountPrice: "Discount price ($)",
    discountInvalid: "Discount must be less than price",
    stock: "Base stock",
    stockHint: "Used when there are no variants. With variants, total stock comes from the table.",
    stockInvalid: "Stock cannot be negative",
    mediaTitle: "Images",
    mediaHint: "Paste image URLs. Maximum 10.",
    imagePlaceholder: "https://...",
    imageInvalid: "Enter a valid image URL",
    addImage: "Add image",
    variantsTitle: "Variants",
    variantsHint: "Build options in groups. Combinations appear automatically.",
    visibilityTitle: "Visibility",
    featured: "Featured product",
    discountFlag: "Show in discount section",
    similarFlag: "Show similar products",
    status: "Status",
    active: "Active",
    draft: "Draft",
    publish: "Publish product",
    saveChanges: "Save changes",
    saveDraft: "Save as draft",
    publishing: "Saving...",
    successTitle: "Product created",
    successText: "The form is cleared. Add another product, or open the catalog.",
    editSuccessTitle: "Product updated",
    editSuccessText: "The listing is saved. Open the catalog, or keep editing.",
    addAnother: "Add another",
    viewCatalog: "View catalog",
    keepEditing: "Keep editing",
    errorTitle: "Could not create product",
    editErrorTitle: "Could not update product",
    errorDefault: "Please check the form and try again.",
};

const productToFormValues = (product) => ({
    title: product.title || "",
    slug: product.slug || "",
    description: product.description || "",
    category: product.category || "",
    subCategory: product.subCategory || "",
    brand: product.brand || "",
    tags: (product.tags || []).join(", "),
    price: product.price ?? "",
    discountPrice: product.discountPrice ?? "",
    stock: product.stock ?? 0,
    images: (product.images?.length ? product.images : [""]).map((url) => ({ url })),
    variants: product.variants || [],
    isFeatured: Boolean(product.isFeatured),
    showInDiscount: Boolean(product.showInDiscount),
    showSimilar: product.showSimilar !== false,
    status: product.status || "active",
});

const URL_PATTERN = /^https?:\/\/.+/i;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const DEFAULT_VALUES = {
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
};

const toNumber = (value) => {
    if (value === "" || value === null || value === undefined) return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : NaN;
};

const getApiMessage = (error) =>
    error?.response?.data?.message || error?.message || TEXT.errorDefault;

export default function AddProductForm({ product } = {}) {
    const router = useRouter();
    const isEdit = Boolean(product?._id);
    const [slugLocked, setSlugLocked] = useState(isEdit);
    const [builderKey, setBuilderKey] = useState(0);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: isEdit ? productToFormValues(product) : DEFAULT_VALUES,
    });

    const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
        control,
        name: "images",
    });

    const title = watch("title");
    const category = watch("category");
    const subCategory = watch("subCategory");
    const price = watch("price");
    const images = watch("images");
    const variantsWatch = watch("variants");
    const hasVariants = (variantsWatch || []).length > 0;
    const subCategories = CATEGORY_TREE[category] || [];

    const handleVariantsChange = useCallback((variants) => {
        setValue("variants", variants);
    }, [setValue]);

    const resetForm = useCallback(() => {
        reset(DEFAULT_VALUES);
        setSlugLocked(false);
        setBuilderKey((key) => key + 1);
    }, [reset]);

    useEffect(() => {
        if (!slugLocked) {
            setValue("slug", slugify(title));
        }
    }, [title, slugLocked, setValue]);

    const categoryRegister = register("category", { required: TEXT.categoryRequired });

    const onSubmit = async (values, statusOverride) => {
        const parsedPrice = toNumber(values.price);
        const parsedDiscount = toNumber(values.discountPrice);
        const parsedStock = toNumber(values.stock) ?? 0;
        const variants = (values.variants || [])
            .filter((variant) => variant.size || variant.color || variant.volume || variant.scent)
            .map((variant) => ({
                size: variant.size?.trim() || undefined,
                color: variant.color?.trim() || undefined,
                volume: variant.volume?.trim() || undefined,
                scent: variant.scent?.trim() || undefined,
                price: toNumber(variant.price) ?? parsedPrice,
                discountPrice: toNumber(variant.discountPrice),
                stock: toNumber(variant.stock) ?? 0,
                sku: variant.sku?.trim() || undefined,
            }));

        const payload = {
            title: values.title.trim(),
            slug: values.slug.trim(),
            description: values.description.trim(),
            category: values.category,
            subCategory: values.subCategory,
            brand: values.brand.trim() || undefined,
            price: parsedPrice,
            discountPrice: parsedDiscount,
            stock: variants.length
                ? variants.reduce((sum, variant) => sum + (variant.stock || 0), 0)
                : parsedStock,
            images: (values.images || []).map((item) => item.url?.trim()).filter(Boolean),
            variants,
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
            if (isEdit) {
                await updateProduct(product._id, payload);
                const result = await Swal.fire({
                    icon: "success",
                    title: TEXT.editSuccessTitle,
                    text: TEXT.editSuccessText,
                    confirmButtonColor: "#0d9488",
                    confirmButtonText: TEXT.keepEditing,
                    showCancelButton: true,
                    cancelButtonText: TEXT.viewCatalog,
                });

                if (result.dismiss === Swal.DismissReason.cancel) {
                    router.push("/dashboard/products");
                }
                return;
            }

            await createProduct(payload);
            resetForm();
            const result = await Swal.fire({
                icon: "success",
                title: TEXT.successTitle,
                text: TEXT.successText,
                confirmButtonColor: "#0d9488",
                confirmButtonText: TEXT.addAnother,
                showCancelButton: true,
                cancelButtonText: TEXT.viewCatalog,
            });

            if (result.dismiss === Swal.DismissReason.cancel) {
                router.push("/dashboard/products");
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: isEdit ? TEXT.editErrorTitle : TEXT.errorTitle,
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
                                disabled={hasVariants}
                                className={fieldClass(errors.stock)}
                                {...register("stock", {
                                    validate: (value) => {
                                        if (hasVariants) return true;
                                        const n = toNumber(value);
                                        return (n !== null && n >= 0 && Number.isInteger(n)) || TEXT.stockInvalid;
                                    },
                                })}
                            />
                            <p className={THEME.cardHint}>{TEXT.stockHint}</p>
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
                    <h2 className={THEME.cardTitle}>{TEXT.variantsTitle}</h2>
                    <p className={THEME.cardHint}>{TEXT.variantsHint}</p>
                    <div className="mt-5">
                        <VariantBuilder
                            key={`${builderKey}-${subCategory}`}
                            subCategory={subCategory}
                            basePrice={price}
                            onChange={handleVariantsChange}
                            initialVariants={subCategory === product?.subCategory ? (product?.variants || []) : []}
                        />
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
                            <select
                                className={fieldClass(errors.category)}
                                {...categoryRegister}
                                onChange={(event) => {
                                    categoryRegister.onChange(event);
                                    setValue("subCategory", "");
                                }}
                            >
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
                        {isSubmitting ? TEXT.publishing : (isEdit ? TEXT.saveChanges : TEXT.publish)}
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
