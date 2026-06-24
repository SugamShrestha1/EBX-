import React, { useState, useMemo } from 'react';
import { Card, Typography, Row, Col, Space, Button, message, Tag, Switch } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import CommonTable from '../../components/common/CommonTable';
import { useGetAgents, useDeleteAgent, useToggleAgentStatus, useBulkDelete } from '../../hooks/useAgentAction';
import { useThemeMode } from '../../contexts/ThemeContext';
import { useAgentStore } from './useAgentStore';
import AgentFormModal from './AgentFormModal';
import { useQueryClient } from '@tanstack/react-query';
import { Columns } from './Columns';

const { Title, Text } = Typography;

const Agents = () => {
    const { isDark } = useThemeMode();
    const [statusFilter, setStatusFilter] = useState(null);

    const queryParams = {
        ...(statusFilter !== null ? { is_active: statusFilter } : {}),
    };

    const { isLoading, refetch } = useGetAgents(queryParams);
    const { agents, removeAgent } = useAgentStore();

    console.log(agents, "agents");


    const deleteAgent = useDeleteAgent();
    const bulkDeleteAgent = useBulkDelete();
    const toggleAgentStatus = useToggleAgentStatus();
    const queryClient = useQueryClient();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingAgent, setEditingAgent] = useState(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

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

    const handleBulkDelete = () => {
        const ids = selectedRowKeys as string[];

        bulkDeleteAgent.mutate(ids, {
            onSuccess: () => {
                message.success("Selected agents deleted successfully");
                setSelectedRowKeys([]);

                // Update React Query cache for all variations of the "agents" query
                queryClient.setQueriesData({ queryKey: ["agents"] }, (oldData: any) => {
                    if (!oldData || !oldData.data) return oldData;

                    return {
                        ...oldData,
                        data: oldData.data.filter(
                            (agent: any) => !ids.includes(agent.reference_id)
                        ),
                    };
                });

                // Also update the Zustand store immediately for instant UI update
                ids.forEach(id => removeAgent(id));
            },
            onError: (err: any) => {
                message.error(err?.message || "Bulk delete failed");
            },
        });
    };

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const bulkActions = (
        <Button
            danger
            onClick={handleBulkDelete}
            loading={bulkDeleteAgent.isPending}
        >
            Delete Selected
        </Button>
    );

    const handleToggleActive = (record) => {
        console.log(record, 'record')
        toggleAgentStatus.mutate(record.reference_id, {
            onSuccess: () => {
                message.success(`Agent ${record.is_active ? 'deactivated' : 'activated'} successfully`);
            },
            onError: (err) => message.error(err?.message || 'Toggle failed'),
        });
    };

    const columns = useMemo(() => Columns({ handleToggleActive, toggleAgentStatus }), [handleToggleActive, toggleAgentStatus.isPending, toggleAgentStatus.variables]);

    return (
        <div className={`h-full flex flex-col font-sans ${isDark ? 'bg-transparent text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
            <Card
                className="flex-1 flex flex-col overflow-hidden"
                style={{ borderRadius: 12 }}
                styles={{ body: { padding: '20px 24px', flex: 1, overflow: 'auto' } }}
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
                    selectedRowKeys={selectedRowKeys}
                    onSelectChange={onSelectChange}
                    bulkActions={bulkActions}
                    rowKey={(record) => record.reference_id || record.id || Math.random().toString()}
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