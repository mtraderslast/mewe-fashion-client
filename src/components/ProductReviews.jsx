"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Pencil, Star, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { authClient } from "@/lib/auth-client";
import {
    createReview,
    deleteReview,
    fetchProductReviews,
    updateReview,
} from "@/lib/action/reviews";

const THEME = {
    card: "w-full border-t border-slate-200 bg-white px-4 sm:px-6 lg:px-8 py-6 lg:py-8",
    title: "text-lg sm:text-xl font-semibold text-slate-900",
    muted: "text-sm text-slate-500",
    average: "text-4xl font-extrabold text-slate-900",
    barTrack: "h-2 rounded-full bg-slate-100 overflow-hidden",
    barFill: "h-full rounded-full bg-teal-600",
    textarea:
        "w-full min-h-[110px] rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15 resize-y",
    submit:
        "inline-flex items-center justify-center rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2.5 disabled:opacity-50",
    ghost:
        "inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50",
    login:
        "inline-flex items-center justify-center rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2.5",
    reviewCard: "rounded-xl border border-slate-100 bg-slate-50/70 p-4 sm:p-5",
    iconBtn: "p-2 rounded-lg text-slate-500 hover:bg-white hover:text-teal-700 transition-colors",
    dangerBtn: "p-2 rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors",
    starBtn: "p-0.5 text-slate-300 hover:text-amber-400 transition-colors",
    starOn: "text-amber-400 fill-amber-400",
    error: "mt-1 text-xs font-medium text-rose-500",
};

const TEXT = {
    title: "Customer reviews",
    empty: "No reviews yet. Be the first to share your experience.",
    unavailable: "Reviews are available once this product is in the live catalog.",
    loadError: "Could not load reviews.",
    average: "Average rating",
    basedOn: (count) => `Based on ${count} ${count === 1 ? "review" : "reviews"}`,
    write: "Write a review",
    update: "Update your review",
    comment: "Your review",
    commentPlaceholder: "How was the fabric, fit and quality?",
    commentRequired: "Please write at least 3 characters.",
    ratingRequired: "Please choose a rating.",
    submit: "Submit review",
    save: "Save changes",
    cancel: "Cancel",
    loginPrompt: "Sign in to write a review for this product.",
    login: "Sign in",
    already: "You already reviewed this product.",
    yours: "Your review",
    edit: "Edit",
    delete: "Delete",
    deleteTitle: "Delete this review?",
    deleteText: "This review will be removed permanently.",
    confirmDelete: "Delete",
    deleted: "Review deleted",
    created: "Review submitted",
    updated: "Review updated",
    errorTitle: "Could not save review",
};

const STARS = [1, 2, 3, 4, 5];

const emptyMeta = {
    averageRating: 0,
    totalReviews: 0,
    breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
};

const getApiMessage = (error) =>
    error?.response?.data?.message || error?.message || TEXT.errorTitle;

const formatDate = (value) => {
    if (!value) return "";
    return new Date(value).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

function Stars({ value = 0, size = 16 }) {
    return (
        <span className="inline-flex items-center gap-0.5" aria-label={`${value} out of 5`}>
            {STARS.map((star) => (
                <Star
                    key={star}
                    size={size}
                    className={star <= Math.round(value) ? THEME.starOn : "text-slate-300"}
                />
            ))}
        </span>
    );
}

export default function ProductReviews({ productId, productSlug, onSummary }) {
    const { data: session } = authClient.useSession();
    const user = session?.user;
    const isAdmin = user?.role === "admin";

    const [reviews, setReviews] = useState([]);
    const [meta, setMeta] = useState(emptyMeta);
    const [loading, setLoading] = useState(Boolean(productId));
    const [saving, setSaving] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [formError, setFormError] = useState("");
    const [editingId, setEditingId] = useState("");

    const myReview = useMemo(
        () => reviews.find((review) => String(review.userId) === String(user?.id)),
        [reviews, user?.id]
    );

    const loadReviews = async () => {
        if (!productId) return;
        try {
            const res = await fetchProductReviews(productId);
            const nextReviews = res?.data || [];
            const nextMeta = res?.meta || emptyMeta;
            setReviews(nextReviews);
            setMeta(nextMeta);
            onSummary?.(nextMeta);
        } catch {
            setFormError(TEXT.loadError);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReviews();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productId]);

    const startEdit = (review) => {
        setEditingId(review._id);
        setRating(review.rating);
        setComment(review.comment);
        setFormError("");
    };

    const resetForm = () => {
        setEditingId("");
        setRating(0);
        setComment("");
        setFormError("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!rating) {
            setFormError(TEXT.ratingRequired);
            return;
        }
        if (comment.trim().length < 3) {
            setFormError(TEXT.commentRequired);
            return;
        }

        setSaving(true);
        setFormError("");
        try {
            if (editingId) {
                await updateReview(editingId, { rating, comment: comment.trim() });
                await Swal.fire({ icon: "success", title: TEXT.updated, timer: 1200, showConfirmButton: false });
            } else {
                await createReview({ productId, rating, comment: comment.trim() });
                await Swal.fire({ icon: "success", title: TEXT.created, timer: 1200, showConfirmButton: false });
            }
            resetForm();
            await loadReviews();
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: TEXT.errorTitle,
                text: getApiMessage(error),
                confirmButtonColor: "#0d9488",
            });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (review) => {
        const confirmed = await Swal.fire({
            icon: "warning",
            title: TEXT.deleteTitle,
            text: TEXT.deleteText,
            showCancelButton: true,
            confirmButtonColor: "#e11d48",
            cancelButtonColor: "#64748b",
            confirmButtonText: TEXT.confirmDelete,
            cancelButtonText: TEXT.cancel,
        });
        if (!confirmed.isConfirmed) return;

        try {
            await deleteReview(review._id);
            if (editingId === review._id) resetForm();
            await loadReviews();
            Swal.fire({ icon: "success", title: TEXT.deleted, timer: 1200, showConfirmButton: false });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: TEXT.errorTitle,
                text: getApiMessage(error),
                confirmButtonColor: "#0d9488",
            });
        }
    };

    if (!productId) {
        return (
            <section className={THEME.card}>
                <h2 className={THEME.title}>{TEXT.title}</h2>
                <p className={`mt-2 ${THEME.muted}`}>{TEXT.unavailable}</p>
            </section>
        );
    }

    const showForm = Boolean(user) && (editingId || !myReview);
    const loginHref = `/login?redirect=${encodeURIComponent(`/product/${productSlug || ""}`)}`;

    return (
        <section id="reviews" className={THEME.card}>
            <h2 className={THEME.title}>{TEXT.title}</h2>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4">
                    <p className={THEME.average}>{meta.averageRating.toFixed(1)}</p>
                    <div className="mt-2">
                        <Stars value={meta.averageRating} size={18} />
                    </div>
                    <p className={`mt-2 ${THEME.muted}`}>{TEXT.basedOn(meta.totalReviews)}</p>

                    <div className="mt-5 space-y-2">
                        {STARS.slice().reverse().map((star) => {
                            const count = meta.breakdown?.[star] || 0;
                            const percent = meta.totalReviews ? Math.round((count / meta.totalReviews) * 100) : 0;
                            return (
                                <div key={star} className="flex items-center gap-2 text-xs text-slate-500">
                                    <span className="w-8">{star}★</span>
                                    <div className={`flex-1 ${THEME.barTrack}`}>
                                        <div className={THEME.barFill} style={{ width: `${percent}%` }} />
                                    </div>
                                    <span className="w-8 text-right">{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="lg:col-span-8">
                    {!user && (
                        <div className="rounded-xl border border-dashed border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <p className="text-sm text-slate-600">{TEXT.loginPrompt}</p>
                            <Link href={loginHref} className={THEME.login}>{TEXT.login}</Link>
                        </div>
                    )}

                    {user && myReview && !editingId && (
                        <p className={`${THEME.muted} mb-4`}>{TEXT.already}</p>
                    )}

                    {showForm && (
                        <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 p-4 sm:p-5">
                            <p className="text-sm font-semibold text-slate-800">
                                {editingId ? TEXT.update : TEXT.write}
                            </p>
                            <div className="mt-3 flex items-center gap-1">
                                {STARS.map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className={THEME.starBtn}
                                        onClick={() => setRating(star)}
                                        aria-label={`${star} star`}
                                    >
                                        <Star
                                            size={22}
                                            className={star <= rating ? THEME.starOn : "text-slate-300"}
                                        />
                                    </button>
                                ))}
                            </div>
                            <label className="mt-4 block">
                                <span className="sr-only">{TEXT.comment}</span>
                                <textarea
                                    className={THEME.textarea}
                                    placeholder={TEXT.commentPlaceholder}
                                    value={comment}
                                    maxLength={1000}
                                    onChange={(event) => setComment(event.target.value)}
                                />
                            </label>
                            {formError && <p className={THEME.error}>{formError}</p>}
                            <div className="mt-3 flex flex-wrap gap-2">
                                <button type="submit" disabled={saving} className={THEME.submit}>
                                    {saving ? "Saving..." : editingId ? TEXT.save : TEXT.submit}
                                </button>
                                {editingId && (
                                    <button type="button" className={THEME.ghost} onClick={resetForm}>
                                        {TEXT.cancel}
                                    </button>
                                )}
                            </div>
                        </form>
                    )}
                </div>
            </div>

            <div className="mt-8 space-y-3">
                {loading && <p className={THEME.muted}>Loading reviews...</p>}
                {!loading && reviews.length === 0 && <p className={THEME.muted}>{TEXT.empty}</p>}
                {reviews.map((review) => {
                    const isOwner = String(review.userId) === String(user?.id);
                    return (
                        <article key={review._id} className={THEME.reviewCard}>
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0">
                                    <span className="h-10 w-10 rounded-full bg-teal-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
                                        {review.userName?.charAt(0)?.toUpperCase() || "U"}
                                    </span>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-slate-800 truncate">
                                            {review.userName}
                                            {isOwner && (
                                                <span className="ml-2 text-[11px] font-semibold uppercase tracking-wide text-teal-700">
                                                    {TEXT.yours}
                                                </span>
                                            )}
                                        </p>
                                        <div className="mt-0.5 flex items-center gap-2">
                                            <Stars value={review.rating} size={14} />
                                            <span className="text-xs text-slate-400">{formatDate(review.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                                {(isOwner || isAdmin) && (
                                    <div className="flex items-center">
                                        {isOwner && (
                                            <button type="button" className={THEME.iconBtn} title={TEXT.edit} onClick={() => startEdit(review)}>
                                                <Pencil size={15} />
                                            </button>
                                        )}
                                        <button type="button" className={THEME.dangerBtn} title={TEXT.delete} onClick={() => handleDelete(review)}>
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                )}
                            </div>
                            <p className="mt-3 text-sm leading-relaxed text-slate-700">{review.comment}</p>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}
