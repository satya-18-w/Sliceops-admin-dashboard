import { Search } from "lucide-react";
import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type UserFilterProps = {
  onFilterChange: (filterName: string, filterValue: string) => void;
  children?: ReactNode;
};

const UserFilter = ({ onFilterChange, children }: UserFilterProps) => {
  return (
    <Card className="mb-5 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="relative w-full max-w-[260px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
            <Input
              placeholder="Search users..."
              className="pl-9"
              onChange={(e) => onFilterChange("SearchQuery", e.target.value)}
            />
          </div>
          <Select
            defaultValue="All"
            className="w-[140px]"
            onChange={(e) => onFilterChange("UserRole", e.target.value)}
          >
            <option value="All">All Roles</option>
            <option value="Manager">Manager</option>
            <option value="Employee">Employee</option>
            <option value="Admin">Admin</option>
          </Select>
          <Select
            defaultValue=""
            className="w-[140px]"
            onChange={(e) => onFilterChange("UserStatus", e.target.value)}
          >
            <option value="" disabled>
              Select Status
            </option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Ban">Ban</option>
          </Select>
        </div>

        <div className="flex items-center gap-2">{children}</div>
      </div>
    </Card>
  );
};

export default UserFilter;
