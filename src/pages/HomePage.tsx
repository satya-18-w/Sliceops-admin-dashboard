import { useState } from 'react';
import { useAuthStore } from '../store';
import {
  Card,
  Col,
  Flex,
  List,
  Row,
  Skeleton,
  Space,
  Statistic,
  Tag,
  Typography,
  Progress,
  Button,
  Badge,
} from 'antd';
import type { ComponentType } from 'react';
import Icon, {
  ArrowUpOutlined,
  ArrowDownOutlined,
  PlusOutlined,
  PercentageOutlined,
  SettingOutlined,
  ShoppingOutlined,
  FireOutlined,
} from "@ant-design/icons";
import { BarChartIcon } from '../icons/BarChartIcon';
import BasketIcon from '../icons/BasketIcon';

const { Title, Text, Paragraph } = Typography;

const ordersList = [
  {
    id: '#ORD-9482',
    OrderSummary: 'Pepperoni Pizza, Margherita Pizza',
    address: 'Bandra, Mumbai',
    amount: 1200,
    status: 'preparing',
    time: '2 mins ago',
  },
  {
    id: '#ORD-9481',
    OrderSummary: 'BBQ Chicken Pizza, Cheese Garlic Bread',
    address: 'Balurghat, West Bengal',
    amount: 2000,
    status: 'on the way',
    time: '12 mins ago',
  },
  {
    id: '#ORD-9480',
    OrderSummary: 'Farmhouse Pizza, Veggie Supreme',
    address: 'Salt Lake, Kolkata',
    amount: 1850,
    status: 'delivered',
    time: '45 mins ago',
  },
  {
    id: '#ORD-9479',
    OrderSummary: 'Mushroom & Truffle Pizza, Coke',
    address: 'Indiranagar, Bangalore',
    amount: 1450,
    status: 'delivered',
    time: '1 hour ago',
  },
];

const topSellingItems = [
  { name: 'Pepperoni Supreme', percentage: 82, sales: 340, color: '#ff5533' },
  { name: 'Classic Margherita', percentage: 68, sales: 280, color: '#ff774c' },
  { name: 'Double Cheese Margherita', percentage: 48, sales: 195, color: '#ffa07a' },
];

interface CardTitleProps {
  title: string;
  PrefixIcon: ComponentType<unknown> | typeof Icon;
}

const CardTitle = ({ title, PrefixIcon }: CardTitleProps) => {
  return (
    <Space>
      <Icon component={PrefixIcon} style={{ fontSize: '18px', color: '#ff5533' }} />
      <span style={{ fontWeight: 600, fontSize: '15px', color: '#1f2937' }}>{title}</span>
    </Space>
  )
}

const HomePage = () => {
  const { user } = useAuthStore();
  const time = new Date();
  const hour = time.getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  const salesData = [
    { day: 'Mon', sales: 1200, orders: 8 },
    { day: 'Tue', sales: 1800, orders: 12 },
    { day: 'Wed', sales: 1500, orders: 10 },
    { day: 'Thu', sales: 2600, orders: 19 },
    { day: 'Fri', sales: 3100, orders: 24 },
    { day: 'Sat', sales: 4800, orders: 36 },
    { day: 'Sun', sales: 4100, orders: 30 },
  ];

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // SVG Chart Dimensions
  const svgWidth = 500;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingY = 30;

  const chartWidth = svgWidth - paddingX * 2;
  const chartHeight = svgHeight - paddingY * 2;
  const maxSales = Math.max(...salesData.map(d => d.sales));

  const points = salesData.map((d, i) => {
    const x = paddingX + (i * chartWidth) / (salesData.length - 1);
    const y = paddingY + chartHeight - (d.sales / maxSales) * chartHeight;
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, "");

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${paddingY + chartHeight} L ${points[0].x} ${paddingY + chartHeight} Z`
    : "";

  return (
    <div style={{ padding: '4px 8px 24px 8px' }}>
      
      {/* 1. Header Welcome Section (Simple & Clean) */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <Title level={2} style={{ margin: 0, fontWeight: 700, color: '#1f2937', letterSpacing: '-0.3px' }}>
            {greeting}, <span style={{ color: '#ff5533' }}>{user?.name || 'Admin'}</span>! 🍕
          </Title>
          <Text type="secondary" style={{ fontSize: '14px', display: 'block', marginTop: '4px' }}>
            Welcome back! You are managing the <strong style={{ color: '#4b5563' }}>{user?.tenant?.name || 'Default Store'}</strong> outlet.
          </Text>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="pulse-badge" style={{ background: '#f0fdf4', border: '1px solid #dcfce7', color: '#16a34a' }}>
            <span className="pulse-dot" style={{ backgroundColor: '#16a34a' }}></span>
            System Live
          </span>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Synced: Just now
          </Text>
        </div>
      </div>

      {/* 2. Key Stats Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="dashboard-card" variant="borderless">
            <Statistic
              title={<span style={{ color: '#6b7280', fontWeight: 500 }}>Total Sales</span>}
              value={12480}
              precision={2}
              prefix="₹"
              valueStyle={{ color: '#1f2937', fontWeight: 700, fontSize: '26px' }}
            />
            <div style={{ marginTop: '8px' }}>
              <Tag color="success" icon={<ArrowUpOutlined />}>12.4%</Tag>
              <Text type="secondary" style={{ fontSize: '12px' }}> vs last week</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="dashboard-card" variant="borderless">
            <Statistic
              title={<span style={{ color: '#6b7280', fontWeight: 500 }}>Total Orders</span>}
              value={89}
              valueStyle={{ color: '#1f2937', fontWeight: 700, fontSize: '26px' }}
            />
            <div style={{ marginTop: '8px' }}>
              <Tag color="success" icon={<ArrowUpOutlined />}>8.2%</Tag>
              <Text type="secondary" style={{ fontSize: '12px' }}> vs last week</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="dashboard-card" variant="borderless">
            <Statistic
              title={<span style={{ color: '#6b7280', fontWeight: 500 }}>Avg. Ticket Value</span>}
              value={140.22}
              precision={2}
              prefix="₹"
              valueStyle={{ color: '#1f2937', fontWeight: 700, fontSize: '26px' }}
            />
            <div style={{ marginTop: '8px' }}>
              <Tag color="error" icon={<ArrowDownOutlined />}>1.5%</Tag>
              <Text type="secondary" style={{ fontSize: '12px' }}> vs last week</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="dashboard-card" variant="borderless">
            <Statistic
              title={<span style={{ color: '#6b7280', fontWeight: 500 }}>Active Promos</span>}
              value={5}
              valueStyle={{ color: '#1f2937', fontWeight: 700, fontSize: '26px' }}
            />
            <div style={{ marginTop: '8px' }}>
              <Tag color="warning">2 Expiring soon</Tag>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 3. Analytics & Sidebars */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        
        {/* Sales Chart */}
        <Col xs={24} lg={16}>
          <Card
            title={<CardTitle title="Sales Performance & Trends" PrefixIcon={BarChartIcon} />}
            variant="borderless"
            className="dashboard-card"
            style={{ height: '100%' }}
          >
            <div style={{ position: 'relative', width: '100%' }}>
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} width="100%" height="100%">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff5533" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#ff5533" stopOpacity="0.00" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                  const y = paddingY + ratio * chartHeight;
                  return (
                    <line
                      key={index}
                      x1={paddingX}
                      y1={y}
                      x2={svgWidth - paddingX}
                      y2={y}
                      stroke="#f3f4f6"
                      strokeWidth={1}
                      strokeDasharray="4 4"
                    />
                  );
                })}

                {/* Y Axis Grid Lines labels */}
                <text x={paddingX - 8} y={paddingY + 4} fill="#9ca3af" fontSize="10" textAnchor="end">
                  ₹{maxSales}
                </text>
                <text x={paddingX - 8} y={paddingY + chartHeight / 2 + 4} fill="#9ca3af" fontSize="10" textAnchor="end">
                  ₹{Math.round(maxSales / 2)}
                </text>
                <text x={paddingX - 8} y={paddingY + chartHeight + 4} fill="#9ca3af" fontSize="10" textAnchor="end">
                  ₹0
                </text>

                {/* Area under the line */}
                <path d={areaD} fill="url(#chartGrad)" />

                {/* Path line */}
                <path d={pathD} fill="none" stroke="#ff5533" strokeWidth={3} strokeLinecap="round" />

                {/* Data Points */}
                {points.map((p, i) => (
                  <g key={i}>
                    {/* Invisible larger hover trigger area */}
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={15}
                      fill="transparent"
                      cursor="pointer"
                      onMouseEnter={() => setHoveredIndex(i)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    />
                    {/* Actual visual point */}
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={hoveredIndex === i ? 6 : 4}
                      fill={hoveredIndex === i ? '#ff5533' : '#ffffff'}
                      stroke="#ff5533"
                      strokeWidth={2.5}
                      pointerEvents="none"
                      style={{ transition: 'all 0.15s ease' }}
                    />
                    {hoveredIndex === i && (
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={12}
                        fill="#ff5533"
                        fillOpacity={0.15}
                        pointerEvents="none"
                      />
                    )}
                  </g>
                ))}

                {/* X Axis labels */}
                {points.map((p, i) => (
                  <text
                    key={i}
                    x={p.x}
                    y={svgHeight - 10}
                    fill="#9ca3af"
                    fontSize="11"
                    textAnchor="middle"
                    fontWeight={hoveredIndex === i ? 'bold' : 'normal'}
                  >
                    {p.day}
                  </text>
                ))}
              </svg>

              {/* Tooltip Overlay */}
              {hoveredIndex !== null && (
                <div
                  style={{
                    position: 'absolute',
                    top: `${points[hoveredIndex].y - 50}px`,
                    left: `${(points[hoveredIndex].x / svgWidth) * 100}%`,
                    transform: 'translateX(-50%)',
                    background: '#1f2937',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                    pointerEvents: 'none',
                    zIndex: 10,
                    textAlign: 'center',
                    minWidth: '80px',
                  }}
                >
                  <div style={{ fontWeight: '600' }}>{points[hoveredIndex].day}</div>
                  <div style={{ color: '#ffdcd2', marginTop: '2px' }}>₹{points[hoveredIndex].sales}</div>
                  <div style={{ fontSize: '10px', opacity: 0.8 }}>{points[hoveredIndex].orders} orders</div>
                </div>
              )}
            </div>
          </Card>
        </Col>

        {/* Top items & Quick Controls */}
        <Col xs={24} lg={8}>
          <Flex vertical gap="16px" style={{ height: '100%' }}>
            
            {/* Top Items */}
            <Card
              title={<CardTitle title="Top Selling Pizzas" PrefixIcon={FireOutlined} />}
              variant="borderless"
              className="dashboard-card"
              style={{ flexGrow: 1 }}
            >
              <Flex vertical gap="18px">
                {topSellingItems.map((item, index) => (
                  <div key={index}>
                    <Flex justify="space-between" style={{ marginBottom: '6px' }}>
                      <Text strong style={{ color: '#4b5563' }}>{item.name}</Text>
                      <Text type="secondary">{item.sales} sold</Text>
                    </Flex>
                    <Progress
                      percent={item.percentage}
                      strokeColor={item.color}
                      trailColor="#f3f4f6"
                      showInfo={false}
                      strokeWidth={8}
                    />
                  </div>
                ))}
              </Flex>
            </Card>

            {/* Quick Actions */}
            <Card
              title={<CardTitle title="Quick Admin Operations" PrefixIcon={SettingOutlined} />}
              variant="borderless"
              className="dashboard-card"
            >
              <Flex vertical gap="8px">
                <Button type="default" icon={<PlusOutlined />} className="quick-action-btn" block>
                  Add New Pizza
                </Button>
                <Button type="default" icon={<PercentageOutlined />} className="quick-action-btn" block>
                  Create Promotion Coupon
                </Button>
                <Button type="default" icon={<ShoppingOutlined />} className="quick-action-btn" block>
                  Manage Outlets
                </Button>
              </Flex>
            </Card>

          </Flex>
        </Col>

      </Row>

      {/* 4. Recent Orders Row */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card
            variant="borderless"
            className="dashboard-card"
            title={<CardTitle title="Recent Incoming Orders" PrefixIcon={BasketIcon} />}
          >
            <List
              dataSource={ordersList}
              renderItem={(item) => {
                let tagColor = 'orange';
                if (item.status === 'on the way') tagColor = 'blue';
                if (item.status === 'delivered') tagColor = 'green';

                return (
                  <List.Item style={{ padding: '16px 8px' }}>
                    <List.Item.Meta
                      title={
                        <Space size="middle">
                          <Text strong style={{ color: '#ff5533' }}>{item.id}</Text>
                          <Text strong>{item.OrderSummary}</Text>
                        </Space>
                      }
                      description={
                        <Space size="middle" style={{ marginTop: '4px' }}>
                          <Text type="secondary">{item.address}</Text>
                          <span style={{ color: '#d1d5db' }}>|</span>
                          <Text type="secondary">{item.time}</Text>
                        </Space>
                      }
                    />
                    <Flex gap="large" align="center">
                      <Text strong style={{ fontSize: '15px' }}>₹{item.amount}</Text>
                      <Tag color={tagColor} style={{ borderRadius: '12px', padding: '2px 10px', textTransform: 'capitalize' }}>
                        {item.status}
                      </Tag>
                    </Flex>
                  </List.Item>
                );
              }}
            />
          </Card>
        </Col>
      </Row>

    </div>
  )
}

export default HomePage;