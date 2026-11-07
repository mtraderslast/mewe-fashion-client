"use client";

import { useState } from "react";
import AdminGuard from "./AdminGuard";
import DashboardHeader from "./DashboardHeader";
import DashboardSidebar from "./DashboardSidebar";

const THEME = {
    shell: "min-h-screen bg-[#F4F1EC] text-[#1B2A26] flex",
    content: "flex-1 flex flex-col min-w-0",
    main: "flex-1 px-4 py-6 lg:px-8 lg:py-8",
};

export default function DashboardShell({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <AdminGuard>
            <div className={THEME.shell}>
                <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <div className={THEME.content}>
                    <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />
                    <main className={THEME.main}>{children}</main>
                </div>
            </div>
        </AdminGuard>
    );
}
