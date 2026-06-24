import React, { useMemo, useState } from 'react';
import { Button, Card, Col, Row, Typography, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import CommonTable from '../../../components/common/CommonTable';
import { useGetSkills, useDeleteSkill, useBulkDeleteSkill, useToggleSkillStatus } from '../../../hooks/useAgentAction';
import { useThemeMode } from '../../../contexts/ThemeContext';
import SkillFormModal from './SkillFormModal';
import { SkillColumns } from './SkillColumns';
import { useQueryClient } from '@tanstack/react-query';

const { Title, Text } = Typography;

const Skills = () => {
    const { isDark } = useThemeMode();

    const { data: skillsData, isLoading, refetch } = useGetSkills();

    console.log(skillsData, "skill data")
    const deleteSkill = useDeleteSkill();
    const bulkDeleteSkill = useBulkDeleteSkill();
    const toggleSkillStatus = useToggleSkillStatus();
    const queryClient = useQueryClient();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingSkill, setEditingSkill] = useState<any | null>(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const skills = skillsData?.data ?? skillsData ?? [];

    const openCreate = () => {
        setEditingSkill(null);
        setIsModalVisible(true);
    };

    const openEdit = (record: any) => {
        setEditingSkill(record);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingSkill(null);
    };


    const handleDelete = (id: string) => {
        deleteSkill.mutate(id, {
            onSuccess: () => {
                message.success('Skill deleted successfully');

                queryClient.setQueryData(["skills"], (oldData: any) => {
                    if (!oldData) return oldData;

                    return {
                        ...oldData,
                        data: oldData.data.filter(
                            (skill: any) => skill.reference_id !== id
                        ),
                        pagination: {
                            ...oldData.pagination,
                            totalItems: oldData.pagination.totalItems - 1,
                        },
                    };
                });
            },
            onError: (err: any) =>
                message.error(err?.message || 'Delete failed'),
        });
    };

    const handleBulkDelete = () => {
        const ids = selectedRowKeys as string[];

        bulkDeleteSkill.mutate({ ids }, {
            onSuccess: () => {
                message.success("Selected skills deleted successfully");
                setSelectedRowKeys([]);

                queryClient.setQueryData(["skills"], (oldData: any) => {
                    if (!oldData || !oldData.data) return oldData;

                    return {
                        ...oldData,
                        data: oldData.data.filter(
                            (skill: any) => !ids.includes(skill.reference_id)
                        ),
                    };
                });
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
            loading={bulkDeleteSkill.isPending}
        >
            Delete Selected
        </Button>
    );

    const handleToggleActive = (record: any) => {
        toggleSkillStatus.mutate(record.reference_id, {
            onSuccess: () => {
                message.success(`Skill ${record.is_active ? 'deactivated' : 'activated'} successfully`);
                queryClient.setQueryData(["skills"], (oldData: any) => {
                    if (!oldData || !oldData.data) return oldData;
                    return {
                        ...oldData,
                        data: oldData.data.map((skill: any) =>
                            skill.reference_id === record.reference_id
                                ? { ...skill, is_active: !skill.is_active }
                                : skill
                        ),
                    };
                });
            },
            onError: (err: any) => message.error(err?.message || 'Toggle failed'),
        });
    };

    const columns = useMemo(() => SkillColumns({ handleToggleActive, toggleSkillStatus }), [handleToggleActive, toggleSkillStatus.isPending, toggleSkillStatus.variables]);

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
                            Skills
                        </Title>
                        <Text type="secondary">
                            Manage skill definitions for your agents
                        </Text>
                    </Col>
                    <Col>
                        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
                            Add Skill
                        </Button>
                    </Col>
                </Row>

                <CommonTable
                    columns={columns}
                    dataSource={skills}
                    loading={isLoading}
                    onEdit={openEdit}
                    onDelete={(id) => handleDelete(id)}
                    selectedRowKeys={selectedRowKeys}
                    onSelectChange={onSelectChange}
                    bulkActions={bulkActions}
                    rowKey={(record: any) => record.reference_id || record.id || Math.random().toString()}
                    emptyText="No skills found"
                />
            </Card>

            <SkillFormModal
                visible={isModalVisible}
                onCancel={handleCancel}
                editingSkill={editingSkill}
            // onSuccess={handleSuccess}
            />
        </div>
    );
};

export default Skills;
