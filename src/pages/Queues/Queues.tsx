import React, { useState, useEffect } from 'react';
import { Card, Typography, Row, Col, Space, Button, message, Tag, Switch, Badge } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import CommonTable from '../../components/common/CommonTable';
import { useGetQueues, useDeleteQueue, useToggleQueueStatus } from '../../hooks/useQueueAction';
import { useThemeMode } from '../../contexts/ThemeContext';
import QueueFormModal from './QueueFromModal';

const { Title, Text } = Typography;

const Queues = () => {
    const { isDark } = useThemeMode();
    const [statusFilter, setStatusFilter] = useState(null);

    const queryParams = {
        ...(statusFilter !== null ? { is_active: statusFilter } : {}),
    };

    const { data: queueData, isLoading } = useGetQueues(queryParams);
    const queues = queueData?.data || queueData || [];

    console.log(queueData, 'queue')

    const deleteQueue = useDeleteQueue();
    const toggleQueueStatus = useToggleQueueStatus();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingQueue, setEditingQueue] = useState(null);

    const openCreate = () => {
        setEditingQueue(null);
        setIsModalVisible(true);
    };

    const openEdit = (record) => {
        setEditingQueue(record);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingQueue(null);
    };

    const handleTableChange = (pagination, filters) => {
        if (filters.is_active && filters.is_active.length === 1) {
            setStatusFilter(filters.is_active[0]);
        } else {
            setStatusFilter(null);
        }
    };

    const handleDelete = (id) => {
        deleteQueue.mutate(id, {
            onSuccess: () => {
                message.success('Queue deleted successfully');
            },
            onError: (err) => message.error(err?.message || 'Delete failed'),
        });
    };

    const handleToggleActive = (record) => {
        toggleQueueStatus.mutate(record.reference_id, {
            onSuccess: () => {
                message.success(`Queue ${record.is_active ? 'deactivated' : 'activated'} successfully`);
            },
            onError: (err) => message.error(err?.message || 'Toggle failed'),
        });
    };

    const strategyColorMap = {
        'round-robin': 'blue',
        'least-busy': 'green',
        'priority': 'orange',
        'random': 'purple',
    };

    const columns = [
        {
            title: 'Queue Name',
            dataIndex: 'queue_name',
            key: 'queue_name',
            render: (text, record) => (
                <Space direction="vertical" size={0}>
                    <Text strong>{record.name || 'Unnamed Queue'}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>{record.queue_description}</Text>
                </Space>
            ),
        },
        {
            title: 'Queue No.',
            dataIndex: 'queue_number',
            key: 'queue_number',
            render: (text) => <Text code>{text}</Text>,
        },
        {
            title: 'Strategy',
            dataIndex: 'strategy',
            key: 'strategy',
            render: (text) =>
                text ? (
                    <Tag color={strategyColorMap[text] || 'default'}>
                        {text.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                    </Tag>
                ) : (
                    <Text type="secondary">—</Text>
                ),
        },
        {
            title: 'Max Wait (s)',
            dataIndex: 'max_wait_time',
            key: 'max_wait_time',
            render: (text) =>
                text != null ? <Text>{text}s</Text> : <Text type="secondary">—</Text>,
        },
        {
            title: 'Max Size',
            dataIndex: 'max_size',
            key: 'max_size',
            render: (text) =>
                text != null ? <Text>{text}</Text> : <Text type="secondary">—</Text>,
        },
        {
            title: 'Members',
            dataIndex: 'member_count',
            key: 'member_count',
            render: (count) => (
                <Badge
                    count={count ?? 0}
                    showZero
                    style={{ backgroundColor: count > 0 ? '#1677ff' : '#d9d9d9' }}
                />
            ),
        },
        {
            title: 'Status',
            dataIndex: 'is_active',
            key: 'is_active',
            filters: [
                { text: 'Active', value: true },
                { text: 'Inactive', value: false },
            ],
            render: (isActive, record) => (
                <Switch
                    checked={isActive}
                    onChange={() => handleToggleActive(record)}
                    loading={
                        toggleQueueStatus.isPending &&
                        toggleQueueStatus.variables === record.reference_id
                    }
                />
            ),
        },
    ];

    return (
        <div
            className={`min-h-screen font-sans ${isDark ? 'bg-transparent text-slate-100' : 'bg-slate-50 text-slate-900'
                } p-6`}
        >
            <Card
                style={{ borderRadius: 12 }}
                styles={{ body: { padding: '20px 24px' } }}
            >
                <Row align="middle" justify="space-between" style={{ marginBottom: 16 }}>
                    <Col>
                        <Title level={4} style={{ margin: 0 }}>
                            Queues
                        </Title>
                        <Text type="secondary">Manage your call queues</Text>
                    </Col>
                    <Col>
                        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
                            Add Queue
                        </Button>
                    </Col>
                </Row>

                <CommonTable
                    columns={columns}
                    dataSource={queues}
                    loading={isLoading}
                    onEdit={openEdit}
                    onDelete={(id) => handleDelete(id)}
                    onChange={handleTableChange}
                    rowKey={(record) => record.id || record.reference_id || Math.random().toString()}
                    emptyText="No queues found"
                />
            </Card>

            <QueueFormModal
                visible={isModalVisible}
                onCancel={handleCancel}
                editingQueue={editingQueue}
            />
        </div>
    );
};

export default Queues;