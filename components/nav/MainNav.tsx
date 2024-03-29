import Link from "next/link";
import { cn } from "@/lib/utils";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn(
        "flex items-center space-x-4 lg:space-x-6 text-sm font-medium transition-colors",
        className
      )}
      {...props}
    >
      <Link
        href="/feed"
        className="text-sm font-medium transition-colors hover:text-gray-300"
      >
        Feed
      </Link>
    </nav>
  );
}
