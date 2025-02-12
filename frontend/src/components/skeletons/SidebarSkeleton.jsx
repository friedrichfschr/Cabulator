import { Users } from "lucide-react";

const SidebarSkeleton = () => {
    // Create 8 skeleton items
    const skeletonContacts = Array(8).fill(null);

    return (
        <aside
            className="h-full grow-1 border-r border-base-300 
    flex flex-col transition-all duration-200"
        >


            {/* Skeleton Contacts */}
            <div className="overflow-y-auto w-full py-3">
                {skeletonContacts.map((_, idx) => (
                    <div key={idx} className="w-full p-3 flex items-center gap-3">
                        {/* Avatar skeleton */}
                        <div className="relative mx-auto lg:mx-0">
                            <div className="skeleton size-12 rounded-full" />
                        </div>

                        {/* User info skeleton - only visible on larger screens */}
                        <div className="block text-left min-w-0 flex-1">
                            <div className="skeleton h-4 w-32 mb-2" />
                            <div className="skeleton h-3 w-16" />
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
};

export default SidebarSkeleton;