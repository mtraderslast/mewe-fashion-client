"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles } from "lucide-react";
import { FaHome } from "react-icons/fa";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const AUTH_THEME = {
    sectionBg: "bg-slate-50 text-slate-900",
    blobOne: "bg-teal-500/10",
    blobTwo: "bg-cyan-500/10",
    cardBg: "bg-white border border-slate-200/80 shadow-xl shadow-slate-900/5",
    homeBtnBg: "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-teal-500",
    homeBtnIcon: "text-teal-600",
    iconBox: "bg-teal-50 border border-teal-100 text-teal-600",
    accentGradient: "from-teal-600 to-emerald-600",
    inputBg: "bg-slate-50/50 border-slate-200 focus:border-teal-600 focus:ring-teal-600/20 text-slate-800 placeholder:text-slate-400",
    inputError: "border-rose-400 focus:border-rose-500 focus:ring-rose-500/30",
    inputIcon: "text-slate-400 group-focus-within:text-teal-600",
    submitBtn: "bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-900/10",
    linkText: "text-teal-600 hover:text-teal-700",
    divider: "border-slate-100",
};

const AUTH_TEXT = {
    homeBtn: "Back to Home",
    brandName: "MEWE",
    brandSuffix: "FASHION",
    title: "Create an Account",
    subtitle: "Join MEWE Fashion and explore our exclusive clothing lines and seamless shopping experience.",
    nameLabel: "Full Name",
    namePlaceholder: "Enter your full name",
    nameRequired: "Full name is required",
    nameMinLength: "Name must be at least 3 characters",
    emailLabel: "Email Address",
    emailPlaceholder: "example@mewefashion.com",
    emailRequired: "Email address is required",
    emailInvalid: "Please enter a valid email address",
    passwordLabel: "Password",
    passwordPlaceholder: "••••••••",
    passwordRequired: "Password is required",
    passwordMinLength: "Password must be at least 6 characters",
    confirmPasswordLabel: "Confirm Password",
    confirmPasswordRequired: "Please confirm your password",
    passwordMismatch: "Passwords do not match",
    submitLoading: "Creating account...",
    submitDefault: "Sign Up",
    hasAccountText: "Already have an account?",
    loginLinkText: "Sign in",
    swalErrorTitle: "Registration Failed",
    swalErrorDefault: "Failed to create account. Please try again.",
    swalSuccessTitle: "Welcome!",
    swalSuccessText: "Your account has been created successfully.",
    loadingFallback: "Loading...",
};

function RegisterContent() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const router = useRouter();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
        reset,
    } = useForm();

    const password = watch("password");

    const onRegisterSubmit = async (userData) => {
        const { error } = await authClient.signUp.email({
            name: userData.name,
            email: userData.email,
            password: userData.password,
        });

        if (error) {
            Swal.fire({
                icon: "error",
                title: AUTH_TEXT.swalErrorTitle,
                text: error.message || AUTH_TEXT.swalErrorDefault,
                confirmButtonColor: "#0d9488",
            });
            reset();
        } else {
            Swal.fire({
                icon: "success",
                title: AUTH_TEXT.swalSuccessTitle,
                text: AUTH_TEXT.swalSuccessText,
                confirmButtonColor: "#0d9488",
            }).then(() => {
                router.push("/");
            });
        }
    };

    return (
        <section className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-teal-500 selection:text-white font-sans ${AUTH_THEME.sectionBg}`}>

            <div className={`absolute -top-32 -left-32 w-96 h-96 rounded-full blur-[120px] pointer-events-none ${AUTH_THEME.blobOne}`} />
            <div className={`absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-[120px] pointer-events-none ${AUTH_THEME.blobTwo}`} />

            {/* Return Home Button */}
            <Link
                href="/"
                className={`absolute top-6 left-6 inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md transition-all text-xs font-semibold tracking-wide shadow-sm hover:shadow group ${AUTH_THEME.homeBtnBg}`}
            >
                <FaHome className={`group-hover:-translate-x-0.5 transition-transform ${AUTH_THEME.homeBtnIcon}`} />
                <span>{AUTH_TEXT.homeBtn}</span>
            </Link>

            {/* Main Auth Card */}
            <div className={`max-w-md w-full space-y-6 p-8 sm:p-10 rounded-3xl backdrop-blur-xl relative z-10 my-auto ${AUTH_THEME.cardBg}`}>

                {/* Header */}
                <div className="text-center space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-serif">
                        {AUTH_TEXT.title}
                    </h2>

                    <p className="text-xs font-normal text-slate-500 leading-relaxed max-w-xs mx-auto">
                        Join <span className={`bg-gradient-to-r ${AUTH_THEME.accentGradient} bg-clip-text text-transparent font-semibold`}>{AUTH_TEXT.brandName} {AUTH_TEXT.brandSuffix}</span> and explore our exclusive collections.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onRegisterSubmit)} className="space-y-4">

                    {/* Full Name Input */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block pl-1">
                            {AUTH_TEXT.nameLabel}
                        </label>
                        <div className="relative group">
                            <span className={`absolute inset-y-0 left-0 flex items-center pl-3.5 transition-colors ${AUTH_THEME.inputIcon}`}>
                                <User size={18} />
                            </span>
                            <input
                                type="text"
                                placeholder={AUTH_TEXT.namePlaceholder}
                                {...register("name", {
                                    required: AUTH_TEXT.nameRequired,
                                    minLength: {
                                        value: 3,
                                        message: AUTH_TEXT.nameMinLength,
                                    },
                                })}
                                className={`w-full pl-11 pr-4 py-3 border rounded-xl text-sm focus:outline-none transition-all ${errors.name ? AUTH_THEME.inputError : AUTH_THEME.inputBg
                                    }`}
                            />
                        </div>
                        {errors.name && (
                            <p className="text-[11px] text-rose-500 pl-1 font-medium">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    {/* Email Input */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block pl-1">
                            {AUTH_TEXT.emailLabel}
                        </label>
                        <div className="relative group">
                            <span className={`absolute inset-y-0 left-0 flex items-center pl-3.5 transition-colors ${AUTH_THEME.inputIcon}`}>
                                <Mail size={18} />
                            </span>
                            <input
                                type="email"
                                placeholder={AUTH_TEXT.emailPlaceholder}
                                {...register("email", {
                                    required: AUTH_TEXT.emailRequired,
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: AUTH_TEXT.emailInvalid,
                                    },
                                })}
                                className={`w-full pl-11 pr-4 py-3 border rounded-xl text-sm focus:outline-none transition-all ${errors.email ? AUTH_THEME.inputError : AUTH_THEME.inputBg
                                    }`}
                            />
                        </div>
                        {errors.email && (
                            <p className="text-[11px] text-rose-500 pl-1 font-medium">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block pl-1">
                            {AUTH_TEXT.passwordLabel}
                        </label>
                        <div className="relative group">
                            <span className={`absolute inset-y-0 left-0 flex items-center pl-3.5 transition-colors ${AUTH_THEME.inputIcon}`}>
                                <Lock size={18} />
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder={AUTH_TEXT.passwordPlaceholder}
                                {...register("password", {
                                    required: AUTH_TEXT.passwordRequired,
                                    minLength: {
                                        value: 6,
                                        message: AUTH_TEXT.passwordMinLength,
                                    },
                                })}
                                className={`w-full pl-11 pr-11 py-3 border rounded-xl text-sm focus:outline-none transition-all ${errors.password ? AUTH_THEME.inputError : AUTH_THEME.inputBg
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-[11px] text-rose-500 pl-1 font-medium">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Confirm Password Input */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block pl-1">
                            {AUTH_TEXT.confirmPasswordLabel}
                        </label>
                        <div className="relative group">
                            <span className={`absolute inset-y-0 left-0 flex items-center pl-3.5 transition-colors ${AUTH_THEME.inputIcon}`}>
                                <Lock size={18} />
                            </span>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder={AUTH_TEXT.passwordPlaceholder}
                                {...register("confirmPassword", {
                                    required: AUTH_TEXT.confirmPasswordRequired,
                                    validate: (value) =>
                                        value === password || AUTH_TEXT.passwordMismatch,
                                })}
                                className={`w-full pl-11 pr-11 py-3 border rounded-xl text-sm focus:outline-none transition-all ${errors.confirmPassword ? AUTH_THEME.inputError : AUTH_THEME.inputBg
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-[11px] text-rose-500 pl-1 font-medium">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full mt-3 flex items-center justify-center gap-2 font-bold py-3 px-4 rounded-xl transition-all duration-300 active:scale-[0.99] disabled:opacity-50 cursor-pointer text-sm font-sans tracking-wide ${AUTH_THEME.submitBtn}`}
                    >
                        <span>{isSubmitting ? AUTH_TEXT.submitLoading : AUTH_TEXT.submitDefault}</span>
                        <ArrowRight size={16} />
                    </button>
                </form>

                {/* Login Redirect */}
                <div className={`text-center pt-2 border-t ${AUTH_THEME.divider}`}>
                    <p className="text-xs font-medium text-slate-500">
                        {AUTH_TEXT.hasAccountText}{" "}
                        <Link href="/login" className={`font-semibold hover:underline transition-colors ${AUTH_THEME.linkText}`}>
                            {AUTH_TEXT.loginLinkText}
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    );
}

export default function Register() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                    <div className="text-teal-600 font-semibold text-sm">{AUTH_TEXT.loadingFallback}</div>
                </div>
            }
        >
            <RegisterContent />
        </Suspense>
    );
}