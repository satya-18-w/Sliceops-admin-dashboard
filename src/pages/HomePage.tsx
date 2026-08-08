import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
} from "recharts";
import { Flame, IndianRupee, Package, Percent, PlusCircle, Settings2, ShoppingBag } from "lucide-react";

import { useAuthStore } from "../store";
import { StatTile } from "@/components/stat-tile";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ordersList = [
  {
    id: "#ORD-9482",
    summary: "Pepperoni Pizza, Margherita Pizza",
    address: "Bandra, Mumbai",
    amount: 1200,
    status: "preparing",
    time: "2 mins ago",
  },
  {
    id: "#ORD-9481",
    summary: "BBQ Chicken Pizza, Cheese Garlic Bread",
    address: "Balurghat, West Bengal",
    amount: 2000,
    status: "on the way",
    time: "12 mins ago",
  },
  {
    id: "#ORD-9480",
    summary: "Farmhouse Pizza, Veggie Supreme",
    address: "Salt Lake, Kolkata",
    amount: 1850,
    status: "delivered",
    time: "45 mins ago",
  },
  {
    id: "#ORD-9479",
    summary: "Mushroom & Truffle Pizza, Coke",
    address: "Indiranagar, Bangalore",
    amount: 1450,
    status: "delivered",
    time: "1 hour ago",
  },
];

const topSellingItems = [
  { name: "Pepperoni Supreme", percentage: 82, sales: 340 },
  { name: "Classic Margherita", percentage: 68, sales: 280 },
  { name: "Double Cheese Margherita", percentage: 48, sales: 195 },
];

const salesData = [
  { day: "Mon", sales: 1200, orders: 8 },
  { day: "Tue", sales: 1800, orders: 12 },
  { day: "Wed", sales: 1500, orders: 10 },
  { day: "Thu", sales: 2600, orders: 19 },
  { day: "Fri", sales: 3100, orders: 24 },
  { day: "Sat", sales: 4800, orders: 36 },
  { day: "Sun", sales: 4100, orders: 30 },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

const HomePage = () => {
  const { user } = useAuthStore();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-6">
      {/* Header */}
      <motion.div variants={item} className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-800">
            {greeting}, <span className="text-brand-500">{user?.name || "Admin"}</span>
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Welcome back! You are managing the{" "}
            <span className="font-semibold text-neutral-600">{user?.tenant?.name || "Default Store"}</span> outlet.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-success/20 bg-success-bg px-2.5 py-1 text-xs font-semibold text-success">
            <span className="pulse-dot size-1.5 rounded-full bg-success" />
            System Live
          </span>
          <span className="text-xs text-neutral-400">Synced: Just now</span>
        </div>
      </motion.div>

      {/* Key stats */}
      <motion.div variants={item} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Total Sales" value="₹12,480.00" trend={{ direction: "up", label: "12.4%" }} icon={IndianRupee} />
        <StatTile label="Total Orders" value="89" trend={{ direction: "up", label: "8.2%" }} icon={ShoppingBag} />
        <StatTile label="Avg. Ticket Value" value="₹140.22" trend={{ direction: "down", label: "1.5%" }} icon={Package} />
        <StatTile label="Active Promos" value="5" icon={Percent} />
      </motion.div>

      {/* Analytics row */}
      <motion.div variants={item} className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Sales Performance &amp; Trends</CardTitle>
          </CardHeader>
          <CardContent className="pl-1 pr-4">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={salesData} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-brand-500)" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="var(--color-brand-500)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--color-neutral-100)" strokeDasharray="4 4" />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "var(--color-neutral-400)" }}
                />
                <RechartsTooltip
                  cursor={{ stroke: "var(--color-brand-200)", strokeWidth: 1 }}
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid var(--color-neutral-100)",
                    fontSize: 12,
                    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                  }}
                  formatter={(value) => [`₹${value}`, "Sales"]}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="var(--color-brand-500)"
                  strokeWidth={2.5}
                  fill="url(#salesFill)"
                  activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>
                <Flame className="size-[18px] text-brand-500" />
                Top Selling Pizzas
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {topSellingItems.map((it) => (
                <div key={it.name}>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="font-medium text-neutral-600">{it.name}</span>
                    <span className="text-neutral-400">{it.sales} sold</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-500 transition-all duration-500"
                      style={{ width: `${it.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <Settings2 className="size-[18px] text-brand-500" />
                Quick Admin Operations
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button variant="outline" className="justify-start hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600">
                <PlusCircle className="size-4" />
                Add New Pizza
              </Button>
              <Button variant="outline" className="justify-start hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600">
                <Percent className="size-4" />
                Create Promotion Coupon
              </Button>
              <Button variant="outline" className="justify-start hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600">
                <ShoppingBag className="size-4" />
                Manage Outlets
              </Button>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Recent orders */}
      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>
              <ShoppingBag className="size-[18px] text-brand-500" />
              Recent Incoming Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-neutral-100 px-0 py-0">
            {ordersList.map((o) => (
              <div key={o.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-semibold text-brand-500">{o.id}</span>
                    <span className="font-semibold text-neutral-800">{o.summary}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-neutral-500">
                    <span>{o.address}</span>
                    <span className="text-neutral-300">|</span>
                    <span>{o.time}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-neutral-800">₹{o.amount}</span>
                  <StatusBadge status={o.status} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default HomePage;
