import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Lock, Mail } from "lucide-react";

import type { Credential } from "../../types";
import { getSelf, login } from "../../http/api";
import { useAuthStore } from "../../store";
import { usePermission } from "../../hooks/usePermission";
import { useLogoutUser } from "../../hooks/useLogoutUser";
import { AppLogo } from "@/components/layout/AppLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const loginUser = async (userData: Credential) => {
  const { data } = await login(userData);
  return data;
};

const getself = async () => {
  const { data } = await getSelf();
  return data;
};

const Login = () => {
  const { isAllowed } = usePermission();
  const { setUser } = useAuthStore();
  const { logoutMutate } = useLogoutUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);

  const { refetch } = useQuery({
    queryKey: ["self"],
    queryFn: getself,
    enabled: false,
  });

  const { mutate, isPending, isError, error } = useMutation({
    mutationKey: ["Login"],
    mutationFn: loginUser,
    onSuccess: async () => {
      const { data: fetchedSelfData } = await refetch();

      if (!isAllowed(fetchedSelfData)) {
        logoutMutate();
        return;
      }

      setUser(fetchedSelfData);
    },
  });

  return (
    <div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-8 px-4">
      <AppLogo />

      <Card className="w-full shadow-xl shadow-neutral-900/5">
        <CardContent className="pt-6">
          <div className="mb-6 flex items-center justify-center gap-2 text-[15px] font-semibold text-neutral-800">
            <Lock className="size-4 text-brand-500" />
            Log in to your dashboard
          </div>

          {isError && (
            <div className="mb-4 rounded-lg border border-danger/20 bg-danger-bg px-3 py-2 text-sm text-danger">
              {error instanceof Error ? error.message : "Something went wrong. Please try again."}
            </div>
          )}

          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              mutate({ email, password, role: "tenant-admin" });
            }}
          >
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-medium text-neutral-500">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="you@store.com"
                  className="pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-xs font-medium text-neutral-500">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="pl-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-neutral-600">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="size-4 rounded border-neutral-300 accent-brand-500"
                />
                Remember me
              </label>
              <a href="#" className="font-medium text-brand-500 hover:text-brand-600">
                Forgot password?
              </a>
            </div>

            <Button type="submit" className="mt-2 w-full" disabled={isPending}>
              {isPending ? "Signing in..." : "Log in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
