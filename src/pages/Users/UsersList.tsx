import React, { useState } from 'react';
import {
    Table,
    Button,
    Space,
    Input,
    Modal,
    Form,
    Tag,
    Tooltip,
    Popconfirm,
    Typography,
    Divider,
    Badge,
    InputNumber,
    message,
    Row,
    Col,
    Card,
    Checkbox,
} from 'antd';
import {
    PlusOutlined,
    DeleteOutlined,
    EditOutlined,
    SearchOutlined,
    ReloadOutlined,
    ExclamationCircleOutlined,
    UserOutlined,
    CheckCircleOutlined,
    StopOutlined,
} from '@ant-design/icons';
import {
    useGetUsers,
    useCreateUser,
    useUpdateUser,
    useDeleteUser,
    useBulkDeleteUsers,
    useToggleUser,
} from '../../hooks/useUserApi';

const { Title, Text } = Typography;
const { confirm } = Modal;

// ─── User Form Modal ──────────────────────────────────────────────────────────
const UserFormModal = ({ open, onClose, editingUser }) => {
    const [form] = Form.useForm();
    const createUser = useCreateUser();
    const updateUser = useUpdateUser();
    const isEditing = !!editingUser;

    React.useEffect(() => {
        if (open) {
            form.setFieldsValue(
                editingUser
                    ? {
                        first_name: editingUser.first_name,
                        last_name: editingUser.last_name,
                        phone_number: editingUser.phone_number,
                        email: editingUser.email,
                        pin: editingUser.pin,
                        profile_picture: editingUser.profile_picture,
                        department: editingUser.department,
                    }
                    : {}
            );
        } else {
            form.resetFields();
        }
    }, [open, editingUser, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const payload = {
                first_name: values.first_name,
                last_name: values.last_name,
                phone_number: values.phone_number,
                email: values.email,
                pin: values.pin,
                profile_picture: values.profile_picture,
                department: values.department,
                ...(values.password ? { password: values.password } : {}),
            };

            if (isEditing) {
                await updateUser.mutateAsync({ id: editingUser.id, ...payload });
                message.success('User updated successfully');
            } else {
                await createUser.mutateAsync(payload);
                message.success('User created successfully');
            }
            onClose();
        } catch (err) {
            if (err?.errorFields) return; // validation error
            message.error(err?.message || 'Something went wrong');
        }
    };

    const isPending = createUser.isPending || updateUser.isPending;

    return (
        <Modal
            title={
                <Space>
                    <UserOutlined />
                    {isEditing ? 'Edit User' : 'Create New User'}
                </Space>
            }
            open={open}
            onCancel={onClose}
            onOk={handleSubmit}
            okText={isEditing ? 'Save Changes' : 'Create User'}
            confirmLoading={isPending}
            destroyOnClose
            width={600}
        >
            <Divider style={{ margin: '12px 0 20px' }} />
            <Form form={form} layout="vertical" requiredMark="optional">
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="First Name"
                            name="first_name"
                            rules={[{ required: true, message: 'Required' }]}
                        >
                            <Input placeholder="Jane" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Last Name"
                            name="last_name"
                            rules={[{ required: true, message: 'Required' }]}
                        >
                            <Input placeholder="Doe" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Phone Number"
                            name="phone_number"
                            rules={[{ required: true, message: 'Required' }]}
                        >
                            <Input placeholder="+977 9800000000" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: 'Required' },
                                { type: 'email', message: 'Enter a valid email' },
                            ]}
                        >
                            <Input placeholder="user@example.com" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="PIN"
                            name="pin"
                            rules={[{ required: true, message: 'Required' }]}
                        >
                            <Input.Password placeholder="Enter PIN" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Department"
                            name="department"
                            rules={[{ required: true, message: 'Required' }]}
                        >
                            <InputNumber
                                className="w-full"
                                min={0}
                                placeholder="Department ID"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item label="Profile Picture URL" name="profile_picture">
                    <Input placeholder="https://example.com/avatar.jpg" />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={
                        isEditing
                            ? [{ min: 8, message: 'Minimum 8 characters' }]
                            : [
                                { required: true, message: 'Required' },
                                { min: 8, message: 'Minimum 8 characters' },
                            ]
                    }
                >
                    <Input.Password
                        placeholder={isEditing ? 'Leave blank to keep current password' : '••••••••'}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const UsersList = () => {
    const [searchText, setSearchText] = useState('');
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

    const queryParams = {
        page: pagination.current,
        page_size: pagination.pageSize,
        ...(searchText ? { search: searchText } : {}),
    };

    const { data, isLoading, isFetching, refetch } = useGetUsers(queryParams);
    const deleteUser = useDeleteUser();
    const bulkDelete = useBulkDeleteUsers();
    const toggleUser = useToggleUser();

    // Support paginated API shapes: { data: { results, count } } | { results, count } | array
    const users =
        data?.data?.results ??
        data?.results ??
        (Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []);
    const total = data?.data?.count ?? data?.count ?? users.length;

    console.log(data,"www")

    // ── Handlers ────────────────────────────────────────────────────────────────
    const openCreate = () => {
        setEditingUser(null);
        setModalOpen(true);
    };

    const openEdit = (user) => {
        setEditingUser(user);
        setModalOpen(true);
    };

    const handleDelete = (id) => {
        deleteUser.mutate(id, {
            onSuccess: () => message.success('User deleted'),
            onError: (err) => message.error(err?.message || 'Delete failed'),
        });
    };

    const handleBulkDelete = () => {
        confirm({
            title: `Delete ${selectedRowKeys.length} users?`,
            icon: <ExclamationCircleOutlined />,
            content: 'This action cannot be undone.',
            okText: 'Delete',
            okType: 'danger',
            onOk: () =>
                bulkDelete.mutate(selectedRowKeys, {
                    onSuccess: () => {
                        message.success(`${selectedRowKeys.length} users deleted`);
                        setSelectedRowKeys([]);
                    },
                    onError: (err) => message.error(err?.message || 'Bulk delete failed'),
                }),
        });
    };

    const handleToggleActive = (user) => {
        toggleUser.mutate(
            { id: user.id, field: 'is_active' },
            {
                onSuccess: () =>
                    message.success(`User ${user.is_active ? 'deactivated' : 'activated'}`),
                onError: (err) => message.error(err?.message || 'Toggle failed'),
            }
        );
    };

    const handleSearch = (value) => {
        setSearchText(value);
        setPagination((p) => ({ ...p, current: 1 }));
    };

    const pageUserIds = users.map((u) => u.id);
    const isAllPageSelected =
        pageUserIds.length > 0 && pageUserIds.every((id) => selectedRowKeys.includes(id));
    const isPageIndeterminate =
        selectedRowKeys.length > 0 && !isAllPageSelected;

    const toggleSelectAllOnPage = () => {
        if (isAllPageSelected) {
            setSelectedRowKeys((prev) => prev.filter((id) => !pageUserIds.includes(id)));
        } else {
            setSelectedRowKeys((prev) => [...new Set([...prev, ...pageUserIds])]);
        }
    };

    // ── Columns ──────────────────────────────────────────────────────────────────
    const columns = [
        {
            title: (
                <Space size={8}>
                    <Checkbox
                        indeterminate={isPageIndeterminate}
                        checked={isAllPageSelected}
                        onChange={toggleSelectAllOnPage}
                    />
                    <span>User</span>
                </Space>
            ),
            key: 'user',
            sorter: (a, b) =>
                `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`),
            render: (_, record) => (
                <Space direction="vertical" size={0}>
                    <Text strong>
                        {record.first_name} {record.last_name}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        @{record.username}
                    </Text>
                </Space>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            sorter: (a, b) => a.email.localeCompare(b.email),
            ellipsis: true,
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            width: 110,
            filters: [
                { text: 'Admin', value: 'admin' },
                { text: 'Manager', value: 'manager' },
                { text: 'Staff', value: 'staff' },
                { text: 'Viewer', value: 'viewer' },
            ],
            onFilter: (value, record) => record.role === value,
            render: (role) => {
                const colors = {
                    admin: 'red',
                    manager: 'blue',
                    staff: 'green',
                    viewer: 'default',
                };
                return role ? (
                    <Tag color={colors[role] ?? 'default'} style={{ textTransform: 'capitalize' }}>
                        {role}
                    </Tag>
                ) : (
                    <Text type="secondary">—</Text>
                );
            },
        },
        {
            title: 'Status',
            dataIndex: 'is_active',
            key: 'is_active',
            width: 100,
            filters: [
                { text: 'Active', value: true },
                { text: 'Inactive', value: false },
            ],
            onFilter: (value, record) => record.is_active === value,
            render: (isActive) =>
                isActive ? (
                    <Badge status="success" text="Active" />
                ) : (
                    <Badge status="default" text="Inactive" />
                ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 140,
            align: 'center',
            render: (_, record) => (
                <Space size={4}>
                    <Tooltip title="Edit">
                        <Button
                            type="text"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => openEdit(record)}
                        />
                    </Tooltip>

                    <Tooltip title={record.is_active ? 'Deactivate' : 'Activate'}>
                        <Button
                            type="text"
                            size="small"
                            icon={record.is_active ? <StopOutlined /> : <CheckCircleOutlined />}
                            onClick={() => handleToggleActive(record)}
                            loading={toggleUser.isPending && toggleUser.variables?.id === record.id}
                        />
                    </Tooltip>

                    <Tooltip title="Delete">
                        <Popconfirm
                            title="Delete this user?"
                            description="This action cannot be undone."
                            onConfirm={() => handleDelete(record.id)}
                            okText="Delete"
                            okType="danger"
                            placement="topRight"
                        >
                            <Button
                                type="text"
                                size="small"
                                danger
                                icon={<DeleteOutlined />}
                                loading={deleteUser.isPending && deleteUser.variables === record.id}
                            />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    // ── Render ───────────────────────────────────────────────────────────────────
    return (
        <>
            <Card
                style={{ borderRadius: 12 }}
                styles={{ body: { padding: '20px 24px' } }}
            >
                {/* Header */}
                <Row align="middle" justify="space-between" style={{ marginBottom: 16 }}>
                    <Col>
                        <Title level={4} style={{ margin: 0 }}>
                            Users
                        </Title>
                        <Text type="secondary">
                            {total} {total === 1 ? 'user' : 'users'} total
                        </Text>
                    </Col>
                    <Col>
                        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
                            Add User
                        </Button>
                    </Col>
                </Row>

                {/* Toolbar */}
                <Row align="middle" justify="space-between" style={{ marginBottom: 12 }} gutter={[8, 8]}>
                    <Col flex="auto">
                        <Input.Search
                            placeholder="Search by name, email, username…"
                            allowClear
                            onSearch={handleSearch}
                            onChange={(e) => !e.target.value && handleSearch('')}
                            style={{ maxWidth: 360 }}
                            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                        />
                    </Col>
                    <Col>
                        <Space>
                            {selectedRowKeys.length > 0 && (
                                <Button
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={handleBulkDelete}
                                    loading={bulkDelete.isPending}
                                >
                                    Delete {selectedRowKeys.length} selected
                                </Button>
                            )}
                            <Tooltip title="Refresh">
                                <Button
                                    icon={<ReloadOutlined spin={isFetching} />}
                                    onClick={() => refetch()}
                                />
                            </Tooltip>
                        </Space>
                    </Col>
                </Row>

                {/* Table */}
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={users}
                    loading={isLoading || isFetching}
                    pagination={{
                        current: pagination.current,
                        pageSize: pagination.pageSize,
                        total,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '25', '50', '100'],
                        showTotal: (t, [from, to]) => `${from}–${to} of ${t}`,
                        onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
                    }}
                    scroll={{ x: 'max-content' }}
                    size="middle"
                />
            </Card>

            {/* Create / Edit Modal */}
            <UserFormModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                editingUser={editingUser}
            />
        </>
    );
};

export default UsersList;