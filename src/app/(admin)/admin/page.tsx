import { Suspense } from "react";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { AdminSkeleton } from "@/components/admin/admin-skeleton";

export default function AdminPage() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <AdminDashboard />
    </Suspense>
  );
}
