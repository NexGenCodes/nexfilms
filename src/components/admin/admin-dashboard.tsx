import { AdminOverview } from "@/components/admin/admin-overview"
import { AdminMovies } from "@/components/admin/admin-movies"
import { AdminSeries } from "@/components/admin/admin-series"
import { AdminAnimations } from "@/components/admin/admin-animations"
import { AdminUsers } from "@/components/admin/admin-users"
import { ContentTabs } from "@/components/ui/content-tabs"

export async function AdminDashboard() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your entertainment content and users</p>
        </div>
      </div>

      <ContentTabs
        tabs={[
          {
            id: "overview",
            label: "Overview",
            content: <AdminOverview />,
          },
          {
            id: "movies",
            label: "Movies",
            content: <AdminMovies />,
          },
          {
            id: "series",
            label: "Series",
            content: <AdminSeries />,
          },
          {
            id: "animations",
            label: "Animations",
            content: <AdminAnimations />,
          },
          {
            id: "users",
            label: "Users",
            content: <AdminUsers />,
          },
        ]}
        defaultTab="overview"
      />
    </div>
  )
}
