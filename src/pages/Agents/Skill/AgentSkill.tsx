import React, { useState } from 'react';
import { Card, Typography, Row, Col, Button, message, Spin, Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useThemeMode } from '../../../contexts/ThemeContext';
import { useGetAgentskills, useDeleteAgentskill, useToggleAgentskillStatus, useBulkDeleteAgentSkill } from '../../../hooks/useAgentAction';
import AgentSkillFormModal from './AgentSkillFormModal';
import AgentSkillCard from './AgentSkillCard';
import { useQueryClient } from '@tanstack/react-query';

const { Title, Text } = Typography;

const AgentSkill = () => {
    const { isDark } = useThemeMode();
    const { data: skillsData, isLoading, refetch } = useGetAgentskills();
    const deleteSkill = useDeleteAgentskill();
    const toggleStatus = useToggleAgentskillStatus();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [togglingId, setTogglingId] = useState(null);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const queryClient = useQueryClient()
    const bulkDeleteSkill = useBulkDeleteAgentSkill();

    console.log(skillsData, "skillsData from agent skill")

    const skills = skillsData?.data || skillsData || [];

    const handleCreate = () => {
        setEditingItem(null);
        setIsModalVisible(true);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setIsModalVisible(true);
    };

    const handleDelete = (id) => {
        deleteSkill.mutate(id, {
            onSuccess: () => {
                message.success('Agent skill deleted successfully');
                queryClient.setQueryData(["agentskills"], (oldData: any) => {
                    if (!oldData) return oldData;

                    return {
                        ...oldData,
                        data: oldData.data.filter((item: any) => item.reference_id !== id),
                        pagination: {
                            ...oldData.pagination,
                            totalItems: Math.max(0, (oldData.pagination?.totalItems || 1) - 1),
                        },
                    };
                });
            },
            onError: (err) => message.error(err?.message || 'Delete failed'),
        });
    };

    const handleToggle = (record) => {
        const id = record.reference_id || record.id;
        setTogglingId(id);
        toggleStatus.mutate(id, {
            onSuccess: (responseData: any) => {
                const response = responseData?.data ?? responseData;
                const { field, new_value } = response || {};

                message.success('Status updated successfully');
                queryClient.setQueryData(["agentskills"], (oldData: any) => {
                    if (!oldData) return oldData;

                    return {
                        ...oldData,
                        data: oldData.data.map((item: any) =>
                            item.reference_id === id
                                ? {
                                    ...item,
                                    [field || 'is_active']: new_value !== undefined ? new_value : !item.is_active,
                                }
                                : item
                        ),
                    };
                });
            },
            onError: (err) => message.error(err?.message || 'Toggle failed'),
            onSettled: () => setTogglingId(null),
        });
    };

    const handleSelect = (id, checked) => {
        if (checked) {
            setSelectedKeys((prev) => [...prev, id]);
        } else {
            setSelectedKeys((prev) => prev.filter((k) => k !== id));
        }
    };

    const handleBulkDelete = () => {
        bulkDeleteSkill.mutate(selectedKeys, {
            onSuccess: () => {
                message.success('Selected skills deleted successfully');
                setSelectedKeys([]);
                queryClient.setQueryData(["agentskills"], (oldData: any) => {
                    if (!oldData) return oldData;

                    return {
                        ...oldData,
                        data: oldData.data.filter(
                            (item: any) =>
                                !selectedKeys.includes(item.reference_id)
                        ),
                        pagination: {
                            ...oldData.pagination,
                            totalItems:
                                oldData.pagination.totalItems -
                                selectedKeys.length,
                        },
                    };
                });
            },
            onError: (err) => message.error(err?.message || 'Bulk delete failed'),
        });
    };

    return (
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', background: isDark ? 'transparent' : '#f8fafc' }}>
            <Card
                style={{ flex: 1, borderRadius: 12, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}
                styles={{ body: { padding: '20px 24px', flex: 1, overflow: 'auto', minHeight: 0 } }}
            >
                <Row align="middle" justify="space-between" style={{ marginBottom: 24 }}>
                    <Col>
                        <Title level={4} style={{ margin: 0, color: isDark ? '#fff' : '#000' }}>Agent Skills</Title>
                        <Text type="secondary">Manage skills and proficiencies for your agents</Text>
                    </Col>
                    <Col>
                        {selectedKeys.length > 0 && (
                            <Button
                                danger
                                onClick={handleBulkDelete}
                                loading={bulkDeleteSkill.isPending}
                                style={{ marginRight: 16 }}
                            >
                                Delete Selected ({selectedKeys.length})
                            </Button>
                        )}
                        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                            Assign Skill
                        </Button>
                    </Col>
                </Row>

                <Spin spinning={isLoading}>
                    {!isLoading && (!skills || skills.length === 0) ? (
                        <Empty description="No agent skills found" style={{ marginTop: 48 }} />
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            columnGap: 16,
                            rowGap: 36,
                        }}>
                            {skills.map((item, index) => (
                                <AgentSkillCard
                                    key={item.reference_id || item.id || Math.random()}
                                    item={item}
                                    index={index}
                                    isDark={isDark}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    onToggle={handleToggle}
                                    isTogglingId={togglingId}
                                    isSelected={selectedKeys.includes(item.reference_id || item.id)}
                                    onSelect={handleSelect}
                                    totalSelected={selectedKeys.length}
                                />
                            ))}
                        </div>
                    )}
                </Spin>
            </Card>

            <AgentSkillFormModal
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                editingItem={editingItem}
                onSuccess={() => {
                    refetch();
                    setIsModalVisible(false);
                }}
            />
        </div>
    );
};

export default AgentSkill;