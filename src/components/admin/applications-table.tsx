import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  CheckIcon,
  EyeIcon,
  MoreHorizontalIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";
import { useMemo, useState } from "react";

import { ApplicationStatusBadge } from "@/components/admin/application-status-badge";
import { formatApplicationDate } from "@/lib/format-application-date";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  applicationStatusLabels,
  normalizeApplicationStatus,
  type ApplicationStatus,
} from "@/lib/application-status";
import { cn } from "@/lib/utils";
import type { Doc } from "../../../convex/_generated/dataModel";

const filterControlBorderClass =
  "border-foreground/30 dark:border-foreground/40";

const statusFilterItemClass = cn(
  filterControlBorderClass,
  "data-[state=on]:bg-primary data-[state=on]:font-medium data-[state=on]:text-primary-foreground data-[state=on]:hover:bg-primary/90 data-[state=on]:hover:text-primary-foreground"
);

export type ApplicationRow = Doc<"memberApplications"> & {
  status: ApplicationStatus;
};

type StatusFilter = ApplicationStatus | "all";

type ApplicationsTableProps = {
  applications: ApplicationRow[];
  onApprove: (application: ApplicationRow) => void;
  onReject: (application: ApplicationRow) => void;
  onReview: (application: ApplicationRow) => void;
};

const getApplicantName = (application: ApplicationRow) =>
  `${application.firstName} ${application.surname}`;

type ApplicationActionsCellProps = {
  application: ApplicationRow;
  onApprove: (application: ApplicationRow) => void;
  onReject: (application: ApplicationRow) => void;
  onReview: (application: ApplicationRow) => void;
};

const ApplicationActionsCell = ({
  application,
  onApprove,
  onReject,
  onReview,
}: ApplicationActionsCellProps) => {
  const isPending = normalizeApplicationStatus(application.status) === "pending";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="ghost">
          <MoreHorizontalIcon />
          <span className="sr-only">Open actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onReview(application)}>
          <EyeIcon data-icon="inline-start" />
          Review
        </DropdownMenuItem>
        {isPending ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onApprove(application)}>
              <CheckIcon data-icon="inline-start" />
              Approve
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onReject(application)}
              variant="destructive"
            >
              <XIcon data-icon="inline-start" />
              Reject
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const createColumns = ({
  onApprove,
  onReject,
  onReview,
}: Omit<ApplicationsTableProps, "applications">): ColumnDef<ApplicationRow>[] => [
  {
    accessorFn: (row) => getApplicantName(row),
    accessorKey: "name",
    cell: ({ row }) => (
      <span className="font-medium">{getApplicantName(row.original)}</span>
    ),
    header: "Name",
  },
  {
    accessorKey: "status",
    cell: ({ row }) => (
      <ApplicationStatusBadge
        status={normalizeApplicationStatus(row.original.status)}
      />
    ),
    filterFn: (row, _columnId, filterValue) => {
      if (filterValue === "all") {
        return true;
      }

      return normalizeApplicationStatus(row.original.status) === filterValue;
    },
    header: "Status",
  },
  {
    accessorKey: "createdAt",
    cell: ({ row }) => formatApplicationDate(row.original.createdAt),
    header: "Submitted",
  },
  {
    cell: ({ row }) => (
      <ApplicationActionsCell
        application={row.original}
        onApprove={onApprove}
        onReject={onReject}
        onReview={onReview}
      />
    ),
    enableHiding: false,
    header: "",
    id: "actions",
  },
];

export const ApplicationsTable = ({
  applications,
  onApprove,
  onReject,
  onReview,
}: ApplicationsTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [nameSearch, setNameSearch] = useState("");

  const columns = useMemo(
    () => createColumns({ onApprove, onReject, onReview }),
    [onApprove, onReject, onReview]
  );

  const table = useReactTable({
    columns,
    data: applications,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    state: {
      columnFilters,
      sorting,
    },
  });

  const handleStatusFilterChange = (value: string) => {
    const nextFilter = (value || "all") as StatusFilter;
    setStatusFilter(nextFilter);
    table.getColumn("status")?.setFilterValue(nextFilter);
  };

  const handleNameSearchChange = (value: string) => {
    setNameSearch(value);
    table.getColumn("name")?.setFilterValue(value);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <SearchIcon className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground" />
          <Input
            className={cn("pr-9", filterControlBorderClass)}
            onChange={(event) => handleNameSearchChange(event.target.value)}
            placeholder="Search by applicant name"
            value={nameSearch}
          />
        </div>
        <ToggleGroup
          className={cn("rounded-md", filterControlBorderClass)}
          onValueChange={handleStatusFilterChange}
          type="single"
          value={statusFilter}
          variant="outline"
        >
          <ToggleGroupItem className={statusFilterItemClass} value="all">
            All
          </ToggleGroupItem>
          <ToggleGroupItem className={statusFilterItemClass} value="pending">
            {applicationStatusLabels.pending}
          </ToggleGroupItem>
          <ToggleGroupItem className={statusFilterItemClass} value="approved">
            {applicationStatusLabels.approved}
          </ToggleGroupItem>
          <ToggleGroupItem className={statusFilterItemClass} value="rejected">
            {applicationStatusLabels.rejected}
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead className="font-bold" key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="cursor-pointer"
                  key={row.id}
                  onClick={() => onReview(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      onClick={
                        cell.column.id === "actions"
                          ? (event) => event.stopPropagation()
                          : undefined
                      }
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="h-24 text-center" colSpan={columns.length}>
                  No applications found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
