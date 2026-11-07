
export const metadata = {
    title: "Auth - Login",
    description: "Login to your account",
};

function AuthLayout({ children }) {
    return (
        <div className="auth-container min-h-screen bg-white">
            {/* Theme Toggle */}
            <div className="fixed top-2 right-6 z-50">
            </div>
            {children}
        </div>
    );
}

export default AuthLayout;
