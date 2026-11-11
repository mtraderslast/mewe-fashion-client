import DashboardShell from "@/components/dashboard/DashboardShell";

export const instant = false;

export const metadata = {
    title: "Dashboard - MEWE Fashion",
    description: "MEWE Fashion studio console",
};

export default function DashboardLayout({ children }) {
    return <DashboardShell>{children}</DashboardShell>;
}
