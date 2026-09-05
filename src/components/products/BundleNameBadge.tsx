import { Badge } from "../ui/badge";

export const BundleNameBadge = ({ name }: { name?: string }) => {
  if (!name) return null;

  return (
    <Badge variant="secondary" className="text-xs px-1 sm:px-1.5 py-0.5">
      <span className="text-muted-foreground font-medium text-[10px]">
        Bundle:
      </span>
      <span className="text-foreground font-medium text-[10px]">{name}</span>
    </Badge>
  );
};
