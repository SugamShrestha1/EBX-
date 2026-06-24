import React, { useState, useEffect } from 'react';
import { Card, Typography, Row, Col, Space, Button, message, Tag, Switch, Badge } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import CommonTable from '../../components/common/CommonTable';
import { useGetQueues, useDeleteQueue, useToggleQueueStatus } from '../../hooks/useQueueAction';
import { useThemeMode } from '../../contexts/ThemeContext';
import QueueFormModal from './QueueFromModal';
import { Columns } from './Columns';
import { useMemo } from 'react';

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

    const columns = useMemo(() => Columns({ handleToggleActive, toggleQueueStatus }), [handleToggleActive, toggleQueueStatus.isPending, toggleQueueStatus.variables]);

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