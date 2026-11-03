import { SectionSkeleton } from "@/features/admin/Skeletons";

// shown the moment a section is opened from the sidebar, while its content loads from the database
export default function Loading() {
  return <SectionSkeleton />;
}
