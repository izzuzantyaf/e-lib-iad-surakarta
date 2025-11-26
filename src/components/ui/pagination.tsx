import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-0 flex w-full justify-end", className)}
    {...props}
  />
);

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = React.ComponentProps<typeof Link> & {
  isActive?: boolean;
};

const baseLinkClasses =
  "inline-flex h-8 items-center justify-center rounded border bg-background px-3 text-xs font-medium text-foreground hover:bg-accent hover:text-accent-foreground aria-disabled:opacity-50 aria-disabled:pointer-events-none";

const PaginationLink = ({
  className,
  isActive,
  ...props
}: PaginationLinkProps) => (
  <Link
    className={cn(
      baseLinkClasses,
      isActive && "border-primary bg-primary text-primary-foreground",
      className
    )}
    {...props}
  />
);

type PaginationButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const PaginationButton = ({
  className,
  ...props
}: PaginationButtonProps) => (
  <button
    type="button"
    className={cn(baseLinkClasses, className)}
    {...props}
  />
);

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationButton,
};


