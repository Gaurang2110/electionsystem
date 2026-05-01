import * as React from "react";
import { Skeleton } from "./Skeleton";
import { Card } from "./Card";

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-10 pb-32">
      {/* Progress Section Skeleton */}
      <Card className="h-[280px] bg-slate-900/40 border-white/5 p-10" hover={false}>
        <div className="flex justify-between items-start mb-10">
          <div className="space-y-3">
            <Skeleton className="w-48 h-10 rounded-xl" />
            <Skeleton className="w-32 h-4 rounded-lg opacity-30" />
          </div>
          <Skeleton variant="circular" className="w-14 h-14 rounded-2xl" />
        </div>
        <Skeleton className="w-full h-4 rounded-full mb-8 opacity-20" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="w-full h-16 rounded-3xl opacity-10" />
          <Skeleton className="w-full h-16 rounded-3xl opacity-10" />
        </div>
      </Card>

      {/* Next Step Skeleton */}
      <Card className="flex items-center justify-between py-8 px-8 bg-slate-900/40 border-white/5" hover={false}>
        <div className="flex items-center gap-6">
          <Skeleton variant="circular" className="w-16 h-16 rounded-2xl opacity-40" />
          <div className="flex flex-col gap-3">
            <Skeleton className="w-24 h-3 rounded-md opacity-20" />
            <Skeleton className="w-56 h-7 rounded-lg opacity-40" />
          </div>
        </div>
        <Skeleton variant="circular" className="w-12 h-12 rounded-full opacity-20" />
      </Card>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="flex flex-col items-center justify-center p-10 gap-6 bg-slate-900/40 border-white/5" hover={false}>
            <Skeleton variant="circular" className="w-16 h-16 rounded-[1.5rem] opacity-30" />
            <Skeleton className="w-24 h-4 rounded-lg opacity-20" />
          </Card>
        ))}
      </div>

      {/* List Skeleton */}
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-end px-2">
          <div className="space-y-2">
            <Skeleton className="w-48 h-8 rounded-lg" />
            <Skeleton className="w-32 h-3 rounded-md opacity-30" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2].map((i) => (
            <Card key={i} className="flex items-center gap-6 py-6 px-6 bg-slate-900/40 border-white/5" hover={false}>
              <Skeleton variant="circular" className="w-16 h-16 rounded-2xl opacity-20" />
              <div className="flex-1 flex flex-col gap-3">
                <Skeleton className="w-full h-6 rounded-lg opacity-30" />
                <Skeleton className="w-32 h-3 rounded-md opacity-10" />
              </div>
              <Skeleton className="w-8 h-8 rounded-full opacity-10" />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
