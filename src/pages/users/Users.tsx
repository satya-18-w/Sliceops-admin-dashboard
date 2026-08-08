import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2, UserPlus, Users as UsersIcon } from "lucide-react";
import { toast } from "sonner";

import { getallUsersInaTenant, CreateUser, updateUser, getAllTenants, createTenantAdmin } from "../../http/api";
import type { User } from "../../types";
import { useAuthStore } from "../../store";
import UserFilter from "./UserFilter";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

interface Tenant {
  id: string;
  name: string;
}

const roleBadgeVariant = (role: string) =>
  role === "manager" ? "success" : role === "tenant-admin" ? "warning" : "info";

const Users = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  // Create-form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState(user?.role === "platform-admin" ? "tenant-admin" : "");
  const [tenantId, setTenantId] = useState("");
  const [isBanned, setIsBanned] = useState(false);

  // Edit-form state
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editIsBanned, setEditIsBanned] = useState(false);

  const { data: tenantsData } = useQuery({
    queryKey: ["tenants"],
    queryFn: getAllTenants,
    enabled: user?.role === "platform-admin",
  });
  const tenants: Tenant[] = tenantsData?.data ?? [];
  const tenantMap = new Map(tenants.map((t) => [t.id, t.name]));

  const openEditDrawer = (u: User) => {
    setSelectedUser(u);
    setEditName(u.name);
    setEditRole(u.role);
    setEditIsBanned(false);
    setEditDrawerOpen(true);
  };

  const resetCreateForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setRole(user?.role === "platform-admin" ? "tenant-admin" : "");
    setTenantId("");
    setIsBanned(false);
  };

  const { mutate, isPending } = useMutation({
    mutationKey: ["createUser"],
    mutationFn: () => {
      if (user?.role === "platform-admin") {
        return createTenantAdmin({ name, email, password, role: "tenant-admin", tenant_id: tenantId });
      }
      return CreateUser({ name, email, password, role });
    },
    onSuccess: () => {
      toast.success("User created successfully!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setDrawerOpen(false);
      resetCreateForm();
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Failed to create user");
    },
  });

  const { mutate: updateMutate, isPending: updatePending } = useMutation({
    mutationKey: ["updateUser"],
    mutationFn: ({ id, data }: { id: string; data: { name: string; role: string } }) => updateUser(id, data),
    onSuccess: () => {
      toast.success("User updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setEditDrawerOpen(false);
      setSelectedUser(null);
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Failed to update user");
    },
  });

  const isAuthorized = user?.role === "tenant-admin" || user?.role === "platform-admin";

  const { data: usersData, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getallUsersInaTenant,
    enabled: isAuthorized,
  });
  const users: User[] = usersData?.data ?? [];

  if (!isAuthorized) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <PageHeader crumbs={[{ label: "Dashboard", to: "/" }, { label: "Users" }]} />

      <UserFilter onFilterChange={() => {}}>
        <Button onClick={() => setDrawerOpen(true)}>
          <UserPlus className="size-4" />
          Add User
        </Button>
      </UserFilter>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <EmptyState icon={UsersIcon} title="No users yet" description="Add your first team member." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              {user?.role === "platform-admin" && <TableHead>Restaurant</TableHead>}
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  <Link to={`/users/${u.id}`} className="font-semibold text-neutral-800 hover:text-brand-500">
                    {u.name}
                  </Link>
                </TableCell>
                <TableCell className="text-neutral-500">{u.email}</TableCell>
                <TableCell>
                  <Badge variant={roleBadgeVariant(u.role)} className="capitalize">
                    {u.role}
                  </Badge>
                </TableCell>
                {user?.role === "platform-admin" && (
                  <TableCell className="text-neutral-500">
                    {tenantMap.get(u.tenant_id) || "Platform Control"}
                  </TableCell>
                )}
                <TableCell className="text-neutral-500">{new Date(u.created_at).toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Edit ${u.name}`}
                      onClick={() => openEditDrawer(u)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label={`Delete ${u.name}`} asChild>
                      <Link to={`/users/${u.id}`}>
                        <Trash2 className="size-4 text-danger" />
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Create User */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="right" title="Create new user" className="w-full max-w-md">
          <form
            className="flex flex-1 flex-col gap-4 overflow-y-auto"
            onSubmit={(e) => {
              e.preventDefault();
              if (password !== confirmPassword) {
                toast.error("Passwords do not match");
                return;
              }
              mutate();
            }}
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="c-name">Full name</Label>
              <Input id="c-name" required placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="c-email">Email address</Label>
              <Input
                id="c-email"
                type="email"
                required
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="c-role">Role</Label>
              {user?.role === "platform-admin" ? (
                <Select id="c-role" value="tenant-admin" disabled>
                  <option value="tenant-admin">Tenant Admin</option>
                </Select>
              ) : (
                <Select id="c-role" required value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="" disabled>
                    Select a role for the user
                  </option>
                  <option value="manager">Manager — full access to store, items &amp; promotions</option>
                  <option value="employee">Employee — access to orders feed &amp; basic views</option>
                </Select>
              )}
            </div>

            {user?.role === "platform-admin" && (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="c-tenant">Restaurant / tenant</Label>
                <Select id="c-tenant" required value={tenantId} onChange={(e) => setTenantId(e.target.value)}>
                  <option value="" disabled>
                    Select a restaurant
                  </option>
                  {tenants.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </Select>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="c-password">Password</Label>
              <Input
                id="c-password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="c-confirm">Confirm password</Label>
              <Input
                id="c-confirm"
                type="password"
                required
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-neutral-100 px-3 py-2.5">
              <span className="text-sm font-medium text-neutral-700">Ban user account</span>
              <Switch checked={isBanned} onCheckedChange={setIsBanned} label="Ban user account" />
            </div>

            <div className="mt-auto flex gap-2 border-t border-neutral-100 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setDrawerOpen(false);
                  resetCreateForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isPending}>
                {isPending ? "Creating..." : "Create user"}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>

      {/* Edit User */}
      <Sheet open={editDrawerOpen} onOpenChange={setEditDrawerOpen}>
        <SheetContent side="right" title="Update user info" className="w-full max-w-md">
          <form
            className="flex flex-1 flex-col gap-4 overflow-y-auto"
            onSubmit={(e) => {
              e.preventDefault();
              if (selectedUser) {
                updateMutate({ id: selectedUser.id, data: { name: editName, role: editRole } });
              }
            }}
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="e-name">Full name</Label>
              <Input id="e-name" required value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="e-role">Role</Label>
              {user?.role === "platform-admin" ? (
                <Select id="e-role" value="tenant-admin" disabled>
                  <option value="tenant-admin">Tenant Admin</option>
                </Select>
              ) : (
                <Select id="e-role" required value={editRole} onChange={(e) => setEditRole(e.target.value)}>
                  <option value="manager">Manager — full access to store, items &amp; promotions</option>
                  <option value="employee">Employee — access to orders feed &amp; basic views</option>
                </Select>
              )}
            </div>

            <div className="flex items-center justify-between rounded-lg border border-neutral-100 px-3 py-2.5">
              <span className="text-sm font-medium text-neutral-700">Ban user account</span>
              <Switch checked={editIsBanned} onCheckedChange={setEditIsBanned} label="Ban user account" />
            </div>

            <div className="mt-auto flex gap-2 border-t border-neutral-100 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setEditDrawerOpen(false);
                  setSelectedUser(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={updatePending}>
                {updatePending ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Users;
