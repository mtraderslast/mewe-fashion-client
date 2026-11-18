"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Camera, Loader2, Mail, MapPin, Phone, Save, Shield, User, X } from "lucide-react";
import Swal from "sweetalert2";
import { authClient } from "@/lib/auth-client";
import BrandLoader from "@/components/BrandLoader";

const THEME = {
    page: "bg-slate-50 min-h-[70vh] py-6 sm:py-8",
    kicker: "text-[11px] font-bold tracking-[0.28em] text-teal-700",
    title: "mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900",
    subtitle: "mt-2 max-w-2xl text-sm sm:text-base text-slate-500",
    card: "rounded-2xl border border-slate-200 bg-white overflow-hidden",
    banner: "h-24 sm:h-28 bg-gradient-to-r from-teal-600 to-emerald-600",
    avatar: "h-24 w-24 sm:h-28 sm:w-28 rounded-2xl border-4 border-white bg-teal-600 object-cover text-white shadow-sm",
    label: "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500",
    input: "h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-800 outline-none focus:border-teal-600 focus:bg-white focus:ring-2 focus:ring-teal-100",
    inputError: "border-rose-400 focus:border-rose-500 focus:ring-rose-100",
    error: "mt-1 text-xs text-rose-600",
    editBtn: "inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 transition-colors",
    saveBtn: "inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60 transition-colors",
    cancelBtn: "inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors",
    fact: "rounded-xl border border-slate-200 bg-slate-50 p-4",
    factLabel: "text-[11px] font-bold uppercase tracking-wider text-slate-400",
    factValue: "mt-1.5 flex items-start gap-2 text-sm font-semibold text-slate-900",
};

const TEXT = {
    kicker: "MEWE FASHION",
    title: "My profile",
    subtitle: "Keep your name, photo, phone, and address up to date for faster checkout.",
    edit: "Edit profile",
    save: "Save changes",
    saving: "Saving...",
    cancel: "Cancel",
    name: "Full name",
    namePlaceholder: "Your name",
    nameRequired: "Please enter your name",
    email: "Email",
    phone: "Phone number",
    phonePlaceholder: "(555) 123-4567",
    phoneInvalid: "Enter a valid phone number",
    address: "Address",
    addressPlaceholder: "Street, city, state, ZIP",
    image: "Profile image URL",
    imagePlaceholder: "https://...",
    imageHint: "Paste a public image URL. A clear photo works best.",
    imageInvalid: "Enter a valid image URL",
    empty: "Not added",
    emailLocked: "Email cannot be changed here.",
    securityTitle: "Account notice",
    securityBody: "Use a reachable phone and a complete US address so orders can be delivered without delay.",
    swalError: "Update failed",
    swalSuccess: "Profile updated",
    swalSuccessBody: "Your details have been saved.",
};

function initials(name) {
    const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return "U";
    return parts.slice(0, 2).map((part) => part[0].toUpperCase()).join("");
}

function ProfileAvatar({ src, name, editing }) {
    const [broken, setBroken] = useState(false);

    useEffect(() => {
        setBroken(false);
    }, [src]);

    const showImage = Boolean(src) && !broken;

    return (
        <div className="relative shrink-0">
            {showImage ? (
                <img
                    src={src}
                    alt={name || TEXT.title}
                    className={THEME.avatar}
                    onError={() => setBroken(true)}
                />
            ) : (
                <div className={`${THEME.avatar} flex items-center justify-center text-2xl font-bold`}>
                    {initials(name)}
                </div>
            )}
            {editing ? (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-2xl bg-slate-900/40">
                    <Camera size={20} className="text-white" />
                </div>
            ) : null}
        </div>
    );
}

export default function ProfilePage() {
    const router = useRouter();
    const pathname = usePathname();
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;
    const [isEditing, setIsEditing] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: "",
            image: "",
            phone: "",
            address: "",
        },
    });

    const imagePreview = watch("image");

    useEffect(() => {
        if (isPending) return;
        if (!user) {
            const redirect = encodeURIComponent(pathname || "/profile");
            router.replace(`/login?redirect=${redirect}`);
        }
    }, [isPending, user, pathname, router]);

    useEffect(() => {
        if (!user || isEditing) return;
        reset({
            name: user.name || "",
            image: user.image || "",
            phone: user.phone || "",
            address: user.address || "",
        });
    }, [user, isEditing, reset]);

    const startEdit = () => {
        reset({
            name: user?.name || "",
            image: user?.image || "",
            phone: user?.phone || "",
            address: user?.address || "",
        });
        setIsEditing(true);
    };

    const cancelEdit = () => {
        reset({
            name: user?.name || "",
            image: user?.image || "",
            phone: user?.phone || "",
            address: user?.address || "",
        });
        setIsEditing(false);
    };

    const onSubmit = async (data) => {
        setIsUpdating(true);

        const { error } = await authClient.updateUser({
            name: data.name.trim(),
            image: data.image.trim() || null,
            phone: data.phone.trim(),
            address: data.address.trim(),
        });

        setIsUpdating(false);

        if (error) {
            Swal.fire({
                icon: "error",
                title: TEXT.swalError,
                text: error.message || "Please try again.",
                confirmButtonColor: "#0d9488",
            });
            return;
        }

        await authClient.getSession();
        setIsEditing(false);

        Swal.fire({
            icon: "success",
            title: TEXT.swalSuccess,
            text: TEXT.swalSuccessBody,
            confirmButtonColor: "#0d9488",
        });
    };

    if (isPending || !user) {
        return <BrandLoader fullScreen />;
    }

    const displayImage = isEditing ? imagePreview : user.image;

    return (
        <main className={THEME.page}>
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className={THEME.kicker}>{TEXT.kicker}</p>
                        <h1 className={THEME.title}>{TEXT.title}</h1>
                        <p className={THEME.subtitle}>{TEXT.subtitle}</p>
                    </div>
                    {!isEditing ? (
                        <button type="button" onClick={startEdit} className={THEME.editBtn}>
                            {TEXT.edit}
                        </button>
                    ) : null}
                </header>

                <div className={`${THEME.card} mt-6`}>
                    <div className={THEME.banner} />

                    <div className="px-4 pb-6 sm:px-6 sm:pb-8">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:-mt-12 -mt-10 mb-6">
                            <ProfileAvatar src={displayImage} name={user.name} editing={isEditing} />
                            <div className="min-w-0 pb-1">
                                <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
                                    {user.name || TEXT.empty}
                                </h2>
                                <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                                    <Mail size={14} className="shrink-0 text-teal-600" />
                                    <span className="truncate">{user.email}</span>
                                </p>
                                {user.role ? (
                                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-teal-700">
                                        {user.role}
                                    </p>
                                ) : null}
                            </div>
                        </div>

                        {isEditing ? (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 border-t border-slate-200 pt-6">
                                <div>
                                    <label className={THEME.label} htmlFor="profile-name">{TEXT.name}</label>
                                    <div className="relative">
                                        <User className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                        <input
                                            id="profile-name"
                                            type="text"
                                            placeholder={TEXT.namePlaceholder}
                                            className={`${THEME.input} ${errors.name ? THEME.inputError : ""}`}
                                            {...register("name", { required: TEXT.nameRequired })}
                                        />
                                    </div>
                                    {errors.name ? <p className={THEME.error}>{errors.name.message}</p> : null}
                                </div>

                                <div>
                                    <label className={THEME.label} htmlFor="profile-phone">{TEXT.phone}</label>
                                    <div className="relative">
                                        <Phone className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                        <input
                                            id="profile-phone"
                                            type="tel"
                                            placeholder={TEXT.phonePlaceholder}
                                            className={`${THEME.input} ${errors.phone ? THEME.inputError : ""}`}
                                            {...register("phone", {
                                                validate: (value) => {
                                                    const phone = String(value || "").trim();
                                                    if (!phone) return true;
                                                    return /^[0-9+()\-\s]{8,20}$/.test(phone) || TEXT.phoneInvalid;
                                                },
                                            })}
                                        />
                                    </div>
                                    {errors.phone ? <p className={THEME.error}>{errors.phone.message}</p> : null}
                                </div>

                                <div>
                                    <label className={THEME.label} htmlFor="profile-address">{TEXT.address}</label>
                                    <div className="relative">
                                        <MapPin className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                        <input
                                            id="profile-address"
                                            type="text"
                                            placeholder={TEXT.addressPlaceholder}
                                            className={`${THEME.input} ${errors.address ? THEME.inputError : ""}`}
                                            {...register("address")}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className={THEME.label} htmlFor="profile-image">{TEXT.image}</label>
                                    <div className="relative">
                                        <Camera className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                        <input
                                            id="profile-image"
                                            type="url"
                                            placeholder={TEXT.imagePlaceholder}
                                            className={`${THEME.input} ${errors.image ? THEME.inputError : ""}`}
                                            {...register("image", {
                                                validate: (value) => {
                                                    const url = String(value || "").trim();
                                                    if (!url) return true;
                                                    return /^https?:\/\/.+/i.test(url) || TEXT.imageInvalid;
                                                },
                                            })}
                                        />
                                    </div>
                                    {errors.image ? <p className={THEME.error}>{errors.image.message}</p> : null}
                                    <p className="mt-1.5 text-xs text-slate-500">{TEXT.imageHint}</p>
                                </div>

                                <p className="text-xs text-slate-500">{TEXT.emailLocked} {user.email}</p>

                                <div className="flex gap-3 border-t border-slate-200 pt-4">
                                    <button type="submit" disabled={isUpdating} className={THEME.saveBtn}>
                                        {isUpdating ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                {TEXT.saving}
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4" />
                                                {TEXT.save}
                                            </>
                                        )}
                                    </button>
                                    <button type="button" onClick={cancelEdit} className={THEME.cancelBtn}>
                                        <X className="h-4 w-4" />
                                        {TEXT.cancel}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="grid grid-cols-1 gap-3 border-t border-slate-200 pt-6 sm:grid-cols-2">
                                <div className={THEME.fact}>
                                    <p className={THEME.factLabel}>{TEXT.name}</p>
                                    <p className={THEME.factValue}>
                                        <User className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                                        <span>{user.name || TEXT.empty}</span>
                                    </p>
                                </div>
                                <div className={THEME.fact}>
                                    <p className={THEME.factLabel}>{TEXT.phone}</p>
                                    <p className={THEME.factValue}>
                                        <Phone className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                                        <span>{user.phone || TEXT.empty}</span>
                                    </p>
                                </div>
                                <div className={`${THEME.fact} sm:col-span-2`}>
                                    <p className={THEME.factLabel}>{TEXT.address}</p>
                                    <p className={THEME.factValue}>
                                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                                        <span>{user.address || TEXT.empty}</span>
                                    </p>
                                </div>
                                <div className={`${THEME.fact} sm:col-span-2`}>
                                    <p className={THEME.factLabel}>{TEXT.email}</p>
                                    <p className={THEME.factValue}>
                                        <Mail className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                                        <span>{user.email}</span>
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="mt-5 flex gap-3 rounded-xl border border-teal-100 bg-teal-50/70 p-4">
                            <Shield className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
                            <div>
                                <p className="text-sm font-semibold text-slate-900">{TEXT.securityTitle}</p>
                                <p className="mt-0.5 text-xs text-slate-600">{TEXT.securityBody}</p>
                            </div>
                        </div>

                        <p className="mt-4 text-xs text-slate-500">
                            Need to check a delivery?{" "}
                            <Link href="/track-order" className="font-semibold text-teal-700 hover:text-teal-800">
                                Track an order
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
