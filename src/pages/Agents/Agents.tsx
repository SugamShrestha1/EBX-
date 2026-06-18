import React, { useState } from 'react';
import { Card, Typography, Row, Col, Space, Button, message, Tag, Switch } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import CommonTable from '../../components/common/CommonTable';
import { useGetAgents, useDeleteAgent, useToggleAgentStatus } from '../../hooks/useAgentAction';
import { useThemeMode } from '../../contexts/ThemeContext';
import { useAgentStore } from './useAgentStore';
import AgentFormModal from './AgentFormModal';

const { Title, Text } = Typography;

const Agents = () => {
    const { isDark } = useThemeMode();
    const [statusFilter, setStatusFilter] = useState(null);

    const queryParams = {
        ...(statusFilter !== null ? { is_active: statusFilter } : {}),
    };

    const { isLoading, refetch } = useGetAgents(queryParams);
    const { agents, removeAgent } = useAgentStore();

    const deleteAgent = useDeleteAgent();
    const toggleAgentStatus = useToggleAgentStatus();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingAgent, setEditingAgent] = useState(null);

    const openCreate = () => {
        setEditingAgent(null);
        setIsModalVisible(true);
    };

    const openEdit = (record) => {
        setEditingAgent(record);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingAgent(null);
    };

    const handleSuccess = () => {
        // Fallback or additional behavior if necessary, like refetch()
        refetch();
    };

    const handleTableChange = (pagination, filters) => {
        if (filters.is_active && filters.is_active.length === 1) {
            setStatusFilter(filters.is_active[0]);
        } else {
            setStatusFilter(null);
        }
    };

    const handleDelete = (id) => {
        deleteAgent.mutate(id, {
            onSuccess: () => {
                message.success('Agent deleted successfully');
                removeAgent(id);
            },
            onError: (err) => message.error(err?.message || 'Delete failed'),
        });
    };

    const handleToggleActive = (record) => {
        console.log(record, 'record')
        toggleAgentStatus.mutate(record.reference_id, {
            onSuccess: () => {
                message.success(`Agent ${record.is_active ? 'deactivated' : 'activated'} successfully`);
            },
            onError: (err) => message.error(err?.message || 'Toggle failed'),
        });
    };

    const columns = [
        {
            title: 'Agent Name',
            dataIndex: 'user_full_name',
            key: 'user_full_name',
            render: (text, record) => (
                <Space direction="vertical" size={0}>
                    <Text strong>{text || 'Unknown'}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>{record.user_email}</Text>
                </Space>
            ),
        },
        {
            title: 'Agent No.',
            dataIndex: 'agent_number',
            key: 'agent_number',
            render: (text) => <Text code>{text}</Text>,
        },
        {
            title: 'Extension',
            dataIndex: 'extension_number',
            key: 'extension_number',
            render: (text) => text ? <Tag color="blue">{text}</Tag> : <Text type="secondary">—</Text>,
        },
        {
            title: 'Priority',
            dataIndex: 'priority',
            key: 'priority',
        },
        {
            title: 'Max Concurrent',
            dataIndex: 'max_concurrent',
            key: 'max_concurrent',
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
                    loading={toggleAgentStatus.isPending && toggleAgentStatus.variables === record.reference_id}
                />
            ),
        },
    ];

    return (
        <div className={`min-h-screen font-sans ${isDark ? 'bg-transparent text-slate-100' : 'bg-slate-50 text-slate-900'} p-6`}>
            <Card
                style={{ borderRadius: 12 }}
                styles={{ body: { padding: '20px 24px' } }}
            >
                <Row align="middle" justify="space-between" style={{ marginBottom: 16 }}>
                    <Col>
                        <Title level={4} style={{ margin: 0 }}>
                            Agents
                        </Title>
                        <Text type="secondary">
                            Manage your agents
                        </Text>
                    </Col>
                    <Col>
                        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
                            Add Agent
                        </Button>
                    </Col>
                </Row>

                <CommonTable
                    columns={columns}
                    dataSource={agents}
                    loading={isLoading}
                    onEdit={openEdit}
                    onDelete={(id) => handleDelete(id)}
                    onChange={handleTableChange}
                    rowKey={(record) => record.id || record.reference_id || Math.random().toString()}
                    emptyText="No agents found"
                />
            </Card>
            <AgentFormModal
                visible={isModalVisible}
                onCancel={handleCancel}
                editingAgent={editingAgent}
                onSuccess={handleSuccess}
            />
        </div>
    );
};

export default Agents;