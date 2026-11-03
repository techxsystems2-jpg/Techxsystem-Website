import { OverviewSkeleton } from "@/features/admin/Skeletons";

// shown inside the admin shell the moment the overview is opened, while its numbers load from the database
export default function Loading() {
  return <OverviewSkeleton />;
}
