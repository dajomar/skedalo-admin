import type { ResourceHeaderProps } from '../types';

export function ResourceHeader({ resources }: ResourceHeaderProps) {
  return (
    <div className="grid grid-cols-[60px_repeat(auto-fill,minmax(150px,1fr))] border-b">
      <div className="border-r"></div>
      {resources.map((resource) => (
        <div key={resource.resourceId} className="flex flex-col items-center gap-2 p-2 border-r">
          <div className="relative w-12 h-12">
            <img
              src={resource.imageUrl || "https://via.placeholder.com/50"}
              className="w-full h-full rounded-full object-cover"
              alt={resource.resourceName}
              loading="lazy"
            />
          </div>
          <span className="text-xs text-center font-medium line-clamp-2">
            {resource.resourceName}
          </span>
        </div>
      ))}
    </div>
  );
}