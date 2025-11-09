import { DashboardHeader } from "@/components/dashboard/header";
import { BudgetHealth } from "@/components/dashboard/budget-health";
import { GoalsSlider } from "@/components/dashboard/goals-slider";
import { ActivityFeed } from "@/components/dashboard/activity-feed";

export default function DashboardPage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-6">
      <div className="space-y-6">
        <DashboardHeader />
        <div className="grid gap-6 md:grid-cols-2">
          <BudgetHealth />
          <GoalsSlider />
        </div>
        <ActivityFeed />
      </div>
    </div>
  );
}
