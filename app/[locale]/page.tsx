import { DashboardScreen } from "@/features/dashboard/DashboardScreen";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  await params; // Just to satisfy the async requirement if needed
  return <div className="px-4 sm:px-10"><DashboardScreen /></div>;
}
