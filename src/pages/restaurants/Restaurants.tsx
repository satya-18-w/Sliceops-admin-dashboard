import { Breadcrumb, Button, Drawer, Flex, Form, Input, Space, Table, Tag, Row, Col, type TableProps, message } from 'antd';
import { PlusOutlined, RightOutlined, ShopOutlined, InfoCircleOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { Link, Navigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllTenants, createTenant } from '../../http/api';
import { useAuthStore } from '../../store';
import { useState } from 'react';

interface Tenant {
    id: string;
    name: string;
    slug: string;
    address: string;
    created_at: string;
}

const Restaurants = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const { user } = useAuthStore();

    const { mutate, isPending } = useMutation({
        mutationKey: ['createTenant'],
        mutationFn: createTenant,
        onSuccess: () => {
            message.success('Restaurant registered successfully!');
            queryClient.invalidateQueries({ queryKey: ['tenants'] });
            setDrawerOpen(false);
            form.resetFields();
        },
        onError: (err: any) => {
            const errorMsg = err?.response?.data?.message || err?.message || 'Failed to register restaurant';
            message.error(errorMsg);
        }
    });

    const columns: TableProps<Tenant>['columns'] = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <span style={{ fontWeight: 600, color: '#374151' }}>{text}</span>,
        },
        {
            title: 'Slug',
            dataIndex: 'slug',
            key: 'slug',
            render: (text) => <Tag color="orange">{text}</Tag>,
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            render: (text) => (
                <Space>
                    <EnvironmentOutlined style={{ color: '#8c8c8c' }} />
                    <span>{text}</span>
                </Space>
            ),
        },
        {
            title: "Created At",
            key: "created_at",
            dataIndex: "created_at",
            render: (text) => (
                <Tag color="blue">
                    {new Date(text).toLocaleString()}
                </Tag>
            )
        }
    ];

    if (user?.role !== "platform-admin") {
        return <Navigate to={"/"} replace={true} />
    }

    const { data: tenantsData, isLoading, isError, error } = useQuery({
        queryKey: ["tenants"],
        queryFn: getAllTenants,
    });

    // Auto-generate slug when name changes
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const nameVal = e.target.value;
        const slugVal = nameVal
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
        form.setFieldsValue({ slug: slugVal });
    };

    return (
        <>
            <Flex justify="space-between" align="center" style={{ marginBottom: '24px' }}>
                <Breadcrumb
                    separator={<RightOutlined />}
                    items={[
                        {
                            title: <Link to="/">Dashboard</Link>,
                        },
                        {
                            title: "Restaurants"
                        }
                    ]}
                />
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    style={{ background: '#ff5533', borderColor: '#ff5533' }}
                    onClick={() => setDrawerOpen(true)}
                >
                    Register Restaurant
                </Button>
            </Flex>

            {isLoading && <div>Loading restaurants...</div>}
            {isError && <div style={{ color: 'red' }}>Error: {error.message}</div>}

            {tenantsData && (
                <>
                    <Table columns={columns} dataSource={tenantsData.data} rowKey="id" />

                    <Drawer
                        title={
                            <Space>
                                <ShopOutlined style={{ color: '#ff5533', fontSize: '20px' }} />
                                <span style={{ fontWeight: 600 }}>Register New Restaurant</span>
                            </Space>
                        }
                        width={560}
                        destroyOnClose={true}
                        onClose={() => {
                            setDrawerOpen(false);
                            form.resetFields();
                        }}
                        open={drawerOpen}
                        extra={
                            <Space>
                                <Button onClick={() => {
                                    setDrawerOpen(false);
                                    form.resetFields();
                                }}>Cancel</Button>
                                <Button 
                                    type='primary' 
                                    loading={isPending} 
                                    style={{ background: '#ff5533', borderColor: '#ff5533' }}
                                    onClick={() => form.submit()}
                                >
                                    Register
                                </Button>
                            </Space>
                        }
                    >
                        <Form
                            layout="vertical"
                            form={form}
                            variant="filled"
                            onFinish={(values) => {
                                mutate({
                                    name: values.name,
                                    slug: values.slug,
                                    address: values.address,
                                });
                            }}
                        >
                            <div style={{ background: '#fcfcfc', border: '1px solid #f0f0f0', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
                                <h4 style={{ margin: '0 0 16px 0', color: '#ff5533', fontWeight: 600, fontSize: '14px' }}>Restaurant Information</h4>
                                
                                <Row gutter={16}>
                                    <Col span={24}>
                                        <Form.Item
                                            label="Restaurant Name"
                                            name="name"
                                            rules={[
                                                { required: true, message: 'Please input restaurant name!' },
                                                { min: 3, message: 'Name must be at least 3 characters!' }
                                            ]}
                                        >
                                            <Input 
                                                prefix={<ShopOutlined style={{ color: '#bfbfbf' }} />} 
                                                placeholder="e.g. Pizza Palace" 
                                                onChange={handleNameChange}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={16}>
                                    <Col span={24}>
                                        <Form.Item
                                            label="Slug (URL Path)"
                                            name="slug"
                                            rules={[
                                                { required: true, message: 'Please input slug!' },
                                                { pattern: /^[a-z0-9-]+$/, message: 'Slug can only contain lowercase letters, numbers, and hyphens!' }
                                            ]}
                                        >
                                            <Input 
                                                prefix={<InfoCircleOutlined style={{ color: '#bfbfbf' }} />} 
                                                placeholder="e.g. pizza-palace" 
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={16}>
                                    <Col span={24}>
                                        <Form.Item
                                            label="Address"
                                            name="address"
                                            rules={[
                                                { required: true, message: 'Please input address!' },
                                                { min: 3, message: 'Address must be at least 3 characters!' }
                                            ]}
                                        >
                                            <Input.TextArea 
                                                rows={4}
                                                placeholder="e.g. 123 Main St, New York, NY 10001" 
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </div>
                        </Form>
                    </Drawer>
                </>
            )}
        </>
    );
};

export default Restaurants;
