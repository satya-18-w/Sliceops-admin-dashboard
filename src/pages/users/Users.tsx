import { Breadcrumb, Button, Drawer, Flex, Form, Input, Select, Space, Table, Tag, Upload, Row, Col, Switch, type TableProps, message } from 'antd';
import { PlusOutlined, RightOutlined, UserAddOutlined, UserOutlined, MailOutlined, LockOutlined, EditOutlined } from '@ant-design/icons';
import { Link, Navigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getallUsersInaTenant, CreateUser, updateUser, getAllTenants, createTenantAdmin } from '../../http/api';
import type { User } from '../../types';
import { useAuthStore } from '../../store';
import UserFilter from "./UserFilter"
import { useState, useEffect } from 'react';



const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};

const Users = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editDrawerOpen, setEditDrawerOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();
    const queryClient = useQueryClient();
    const { user } = useAuthStore();

    useEffect(() => {
        if (selectedUser) {
            editForm.setFieldsValue({
                name: selectedUser.name,
                role: selectedUser.role,
                is_banned: false,
            });
        }
    }, [selectedUser, editForm]);

    const { data: tenantsData } = useQuery({
        queryKey: ['tenants'],
        queryFn: getAllTenants,
        enabled: user?.role === 'platform-admin'
    });

    const tenantMap = tenantsData?.data
        ? new Map<string, string>(tenantsData.data.map((t: any) => [t.id, t.name]))
        : new Map<string, string>();

    const { mutate, isPending } = useMutation({
        mutationKey: ['createUser'],
        mutationFn: (values: any) => {
            if (user?.role === 'platform-admin') {
                return createTenantAdmin({
                    name: values.name,
                    email: values.email,
                    password: values.password,
                    role: 'tenant-admin',
                    tenant_id: values.tenant_id
                });
            } else {
                return CreateUser({
                    name: values.name,
                    email: values.email,
                    password: values.password,
                    role: values.role
                });
            }
        },
        onSuccess: () => {
            message.success('User created successfully!');
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setDrawerOpen(false);
            form.resetFields();
        },
        onError: (err: any) => {
            const errorMsg = err?.response?.data?.message || err?.message || 'Failed to create user';
            message.error(errorMsg);
        }
    });

    const { mutate: updateMutate, isPending: updatePending } = useMutation({
        mutationKey: ['updateUser'],
        mutationFn: ({ id, data }: { id: string; data: { name: string; role: string } }) => updateUser(id, data),
        onSuccess: () => {
            message.success('User updated successfully!');
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setEditDrawerOpen(false);
            setSelectedUser(null);
            editForm.resetFields();
        },
        onError: (err: any) => {
            const errorMsg = err?.response?.data?.message || err?.message || 'Failed to update user';
            message.error(errorMsg);
        }
    });

    const columns: TableProps<User>['columns'] = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (_, { id, name }) => <Link to={`/users/${id}`}>{name}</Link>,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (_, { role }) => (
                <Flex gap="small" align="center" wrap>
                    <Tag color={role === "manager" ? "green" : role === "tenant-admin" ? "orange" : "blue"}>
                        {role}
                    </Tag>
                </Flex>
            )
        },
        ...(user?.role === 'platform-admin' ? [{
            title: 'Restaurant',
            dataIndex: 'tenant_id',
            key: 'tenant_id',
            render: (tenantId: string) => tenantMap.get(tenantId) || tenantId || 'Platform Control'
        }] : []),
        {
            title: "Created At",
            key: "created_at",
            dataIndex: "created_at",
            render: (_, { created_at }) => (
                <Space size="small" align="center" wrap>
                    <Tag color="blue">
                        {new Date(created_at).toLocaleString()}
                    </Tag>
                </Space>
            )
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space size="small">
                    <Button 
                        type="primary" 
                        size="small" 
                        icon={<EditOutlined />}
                        onClick={() => {
                            setSelectedUser(record);
                            setEditDrawerOpen(true);
                        }}
                    >
                        Edit
                    </Button>
                    <Button type="default" size="small">
                        <Link to={`/users/${record.id}`}>Delete</Link>
                    </Button>
                </Space>
            ),
        },
    ];

    if (user?.role !== "tenant-admin" && user?.role !== "platform-admin") {
        return <Navigate to={"/"} replace={true} />
    }

    const { data: usersData, isLoading, isError, error } = useQuery({
        queryKey: ["users"],
        queryFn: getallUsersInaTenant,
    });
    return (
        <>
            <Breadcrumb
                separator={<RightOutlined />}
                items={[
                    {
                        title: <Link to="/">Dashboard</Link>,
                    },
                    {
                        title: "Users"
                    }
                ]}
            />
            {isLoading && <div>Loading...</div>}
            {isError && <div>{error.message}</div>}


            <UserFilter onFilterChange={(filterName: String, filterValue: String) => {
                console.log("FilterName: ", filterName)
                console.log("FilterValue: ", filterValue)
            }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => {
                    setDrawerOpen(true);
                }}>
                    Add User
                </Button>
            </UserFilter>
            {
                usersData && (
                    <>
                        <Table columns={columns} dataSource={usersData.data} rowKey="id" />

                        <Drawer
                            title={
                                <Space>
                                    <UserAddOutlined style={{ color: '#ff5533', fontSize: '20px' }} />
                                    <span style={{ fontWeight: 600 }}>Create New User</span>
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
                                    <Button type='primary' loading={isPending} onClick={() => form.submit()}>Submit</Button>
                                </Space>
                            }
                        >
                            <Form
                                layout="vertical"
                                form={form}
                                variant="filled"
                                onFinish={(values) => {
                                    mutate(values);
                                }}
                            >
                                {/* Personal Info Section */}
                                <div style={{ background: '#fcfcfc', border: '1px solid #f0f0f0', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
                                    <h4 style={{ margin: '0 0 16px 0', color: '#ff5533', fontWeight: 600, fontSize: '14px' }}>Personal Information</h4>
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item
                                                label="Full Name"
                                                name="name"
                                                rules={[{ required: true, message: 'Please input name!' }]}
                                            >
                                                <Input prefix={<UserOutlined style={{ color: '#bfbfbf' }} />} placeholder="John Doe" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                label="Email Address"
                                                name="email"
                                                rules={[
                                                    { required: true, message: 'Please input email!' },
                                                    { type: 'email', message: 'Please enter a valid email!' }
                                                ]}
                                            >
                                                <Input prefix={<MailOutlined style={{ color: '#bfbfbf' }} />} placeholder="john@example.com" />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    
                                    <Row gutter={16}>
                                        <Col span={24}>
                                            <Form.Item
                                                label="Role"
                                                name="role"
                                                initialValue={user?.role === 'platform-admin' ? "tenant-admin" : undefined}
                                                rules={[{ required: true, message: 'Please select a role!' }]}
                                            >
                                                {user?.role === 'platform-admin' ? (
                                                    <Select
                                                        disabled
                                                        options={[
                                                            { value: "tenant-admin", label: <Tag color="orange">Tenant Admin</Tag> }
                                                        ]}
                                                    />
                                                ) : (
                                                    <Select
                                                        placeholder="Select a role for the user"
                                                        allowClear={true}
                                                        options={[
                                                            {
                                                                value: "manager",
                                                                label: (
                                                                    <Space>
                                                                        <Tag color="green">Manager</Tag>
                                                                        <span style={{ fontSize: '12px', color: '#8c8c8c' }}>Full access to store, items, & promotions</span>
                                                                    </Space>
                                                                )
                                                            }, {
                                                                value: "employee",
                                                                label: (
                                                                    <Space>
                                                                        <Tag color="blue">Employee</Tag>
                                                                        <span style={{ fontSize: '12px', color: '#8c8c8c' }}>Access to orders feed & basic views</span>
                                                                    </Space>
                                                                )
                                                            }
                                                        ]}
                                                    />
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    {user?.role === 'platform-admin' && (
                                        <Row gutter={16}>
                                            <Col span={24}>
                                                <Form.Item
                                                    label="Restaurant / Tenant"
                                                    name="tenant_id"
                                                    rules={[{ required: true, message: 'Please select a restaurant!' }]}
                                                >
                                                    <Select
                                                        placeholder="Select a restaurant"
                                                        allowClear={true}
                                                        options={tenantsData?.data?.map((t: any) => ({
                                                            value: t.id,
                                                            label: t.name,
                                                        })) || []}
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    )}
                                </div>

                                {/* Security Credentials Section */}
                                <div style={{ background: '#fcfcfc', border: '1px solid #f0f0f0', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
                                    <h4 style={{ margin: '0 0 16px 0', color: '#ff5533', fontWeight: 600, fontSize: '14px' }}>Security & Credentials</h4>
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item
                                                label="Password"
                                                name="password"
                                                rules={[{ required: true, message: 'Please input password!' }]}
                                            >
                                                <Input.Password prefix={<LockOutlined style={{ color: '#bfbfbf' }} />} placeholder="••••••••" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                label="Confirm Password"
                                                name="confirm_password"
                                                dependencies={['password']}
                                                rules={[
                                                    { required: true, message: 'Please confirm password!' },
                                                    ({ getFieldValue }) => ({
                                                        validator(_, value) {
                                                            if (!value || getFieldValue('password') === value) {
                                                                return Promise.resolve();
                                                            }
                                                            return Promise.reject(new Error('Passwords do not match!'));
                                                        },
                                                    }),
                                                ]}
                                            >
                                                <Input.Password prefix={<LockOutlined style={{ color: '#bfbfbf' }} />} placeholder="Confirm Password" />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </div>

                                {/* Account Settings Section */}
                                <div style={{ background: '#fcfcfc', border: '1px solid #f0f0f0', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
                                    <h4 style={{ margin: '0 0 16px 0', color: '#ff5533', fontWeight: 600, fontSize: '14px' }}>Account Settings</h4>
                                    <Form.Item
                                        label="Ban User Account"
                                        name="is_banned"
                                        valuePropName="checked"
                                    >
                                        <Switch checkedChildren="Banned" unCheckedChildren="Active" />
                                    </Form.Item>
                                </div>

                                {/* Upload section */}
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0' }}>
                                    <Form.Item 
                                        label={<span style={{ fontWeight: 500, color: '#374151' }}>Profile Picture</span>} 
                                        name="upload"
                                        valuePropName="fileList"
                                        getValueFromEvent={(e: any) => {
                                            if (Array.isArray(e)) return e;
                                            return e?.fileList;
                                        }}
                                    >
                                        <Upload 
                                            action="/upload.do" 
                                            listType="picture-circle" 
                                            maxCount={1}
                                            className="avatar-uploader"
                                        >
                                            <button
                                                style={{ color: 'inherit', cursor: 'pointer', border: 0, background: 'none', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                                                type="button"
                                            >
                                                <PlusOutlined style={{ fontSize: '20px', color: '#ff5533' }} />
                                                <div style={{ marginTop: 8, fontWeight: 500, color: '#4b5563', fontSize: '12px' }}>Upload Photo</div>
                                            </button>
                                        </Upload>
                                    </Form.Item>
                                </div>
                            </Form>
                        </Drawer>

                        {/* Edit User Drawer */}
                        <Drawer
                            title={
                                <Space>
                                    <UserAddOutlined style={{ color: '#ff5533', fontSize: '20px' }} />
                                    <span style={{ fontWeight: 600 }}>Update User Info</span>
                                </Space>
                            }
                            width={560}
                            destroyOnClose={true}
                            onClose={() => {
                                setEditDrawerOpen(false);
                                setSelectedUser(null);
                                editForm.resetFields();
                            }}
                            open={editDrawerOpen}
                            extra={
                                <Space>
                                    <Button onClick={() => {
                                        setEditDrawerOpen(false);
                                        setSelectedUser(null);
                                        editForm.resetFields();
                                    }}>Cancel</Button>
                                    <Button type='primary' loading={updatePending} onClick={() => editForm.submit()}>Save Changes</Button>
                                </Space>
                            }
                        >
                            <Form
                                layout="vertical"
                                form={editForm}
                                variant="filled"
                                onFinish={(values) => {
                                    if (selectedUser) {
                                        updateMutate({
                                            id: selectedUser.id,
                                            data: {
                                                name: values.name,
                                                role: values.role,
                                            }
                                        });
                                    }
                                }}
                            >
                                {/* Personal Info Section */}
                                <div style={{ background: '#fcfcfc', border: '1px solid #f0f0f0', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
                                    <h4 style={{ margin: '0 0 16px 0', color: '#ff5533', fontWeight: 600, fontSize: '14px' }}>Personal Information</h4>
                                    <Row gutter={16}>
                                        <Col span={24}>
                                            <Form.Item
                                                label="Full Name"
                                                name="name"
                                                rules={[{ required: true, message: 'Please input name!' }]}
                                            >
                                                <Input prefix={<UserOutlined style={{ color: '#bfbfbf' }} />} placeholder="John Doe" />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    
                                    <Row gutter={16}>
                                        <Col span={24}>
                                            <Form.Item
                                                label="Role"
                                                name="role"
                                                rules={[{ required: true, message: 'Please select a role!' }]}
                                            >
                                                {user?.role === 'platform-admin' ? (
                                                    <Select
                                                        disabled
                                                        options={[
                                                            { value: "tenant-admin", label: <Tag color="orange">Tenant Admin</Tag> }
                                                        ]}
                                                    />
                                                ) : (
                                                    <Select
                                                        placeholder="Select a role for the user"
                                                        allowClear={true}
                                                        options={[
                                                            {
                                                                value: "manager",
                                                                label: (
                                                                    <Space>
                                                                        <Tag color="green">Manager</Tag>
                                                                        <span style={{ fontSize: '12px', color: '#8c8c8c' }}>Full access to store, items, & promotions</span>
                                                                    </Space>
                                                                )
                                                            }, {
                                                                value: "employee",
                                                                label: (
                                                                    <Space>
                                                                        <Tag color="blue">Employee</Tag>
                                                                        <span style={{ fontSize: '12px', color: '#8c8c8c' }}>Access to orders feed & basic views</span>
                                                                    </Space>
                                                                )
                                                            }
                                                        ]}
                                                    />
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </div>

                                {/* Account Settings Section */}
                                <div style={{ background: '#fcfcfc', border: '1px solid #f0f0f0', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
                                    <h4 style={{ margin: '0 0 16px 0', color: '#ff5533', fontWeight: 600, fontSize: '14px' }}>Account Settings</h4>
                                    <Form.Item
                                        label="Ban User Account"
                                        name="is_banned"
                                        valuePropName="checked"
                                    >
                                        <Switch checkedChildren="Banned" unCheckedChildren="Active" />
                                    </Form.Item>
                                </div>
                            </Form>
                        </Drawer>
                    </>
                )
            }
        </>
    )
}

export default Users;
