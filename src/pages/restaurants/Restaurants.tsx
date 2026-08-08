import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MapPin, Plus, Store as StoreIcon } from "lucide-react";
import { toast } from "sonner";

import { getAllTenants, createTenant } from "../../http/api";
import { useAuthStore } from "../../store";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

interface Tenant {
  id: string;
  name: string;
  slug: string;
  address: string;
  created_at: string;
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const Restaurants = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [address, setAddress] = useState("");
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const resetForm = () => {
    setName("");
    setSlug("");
    setAddress("");
  };

  const { mutate, isPending } = useMutation({
    mutationKey: ["createTenant"],
    mutationFn: createTenant,
    onSuccess: () => {
      toast.success("Restaurant registered successfully!");
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      setDrawerOpen(false);
      resetForm();
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error ? err.message : "Failed to register restaurant";
      toast.error(message);
    },
  });

  const { data: tenantsData, isLoading } = useQuery({
    queryKey: ["tenants"],
    queryFn: getAllTenants,
    enabled: user?.role === "platform-admin",
  });
  const tenants: Tenant[] = tenantsData?.data ?? [];

  if (user?.role !== "platform-admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Dashboard", to: "/" }, { label: "Restaurants" }]}
        actions={
          <Button onClick={() => setDrawerOpen(true)}>
            <Plus className="size-4" />
            Register Restaurant
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : tenants.length === 0 ? (
        <EmptyState
          icon={StoreIcon}
          title="No restaurants yet"
          description="Register your first tenant to get started."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tenants.map((tenant) => (
              <TableRow key={tenant.id}>
                <TableCell className="font-semibold text-neutral-800">{tenant.name}</TableCell>
                <TableCell>
                  <Badge variant="brand">{tenant.slug}</Badge>
                </TableCell>
                <TableCell>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-3.5 text-neutral-400" />
                    {tenant.address}
                  </span>
                </TableCell>
                <TableCell className="text-neutral-500">
                  {new Date(tenant.created_at).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="right" title="Register new restaurant" className="w-full max-w-md">
          <form
            className="flex flex-1 flex-col gap-4 overflow-y-auto"
            onSubmit={(e) => {
              e.preventDefault();
              mutate({ name, slug, address });
            }}
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Restaurant name</Label>
              <Input
                id="name"
                required
                minLength={3}
                placeholder="e.g. Pizza Palace"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setSlug(slugify(e.target.value));
                }}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="slug">Slug (URL path)</Label>
              <Input
                id="slug"
                required
                pattern="[a-z0-9-]+"
                title="Lowercase letters, numbers, and hyphens only"
                placeholder="e.g. pizza-palace"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                required
                minLength={3}
                rows={4}
                placeholder="e.g. 123 Main St, New York, NY 10001"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="mt-auto flex gap-2 border-t border-neutral-100 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setDrawerOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isPending}>
                {isPending ? "Registering..." : "Register"}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Restaurants;
