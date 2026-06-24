import React, { useEffect } from 'react';
import { Modal, Form, InputNumber, Switch, Button, message, Select } from 'antd';
import { useCreateAgentskill, useUpdateAgentskill, useGetAgents, useGetSimpleSkills } from '../../../hooks/useAgentAction';
import { useThemeMode } from '../../../contexts/ThemeContext';
import { useQueryClient } from '@tanstack/react-query';

const AgentSkillFormModal = ({ visible, onCancel, editingItem, onSuccess }) => {
    const [form] = Form.useForm();
    const { isDark } = useThemeMode();
    const createSkill = useCreateAgentskill();
    const updateSkill = useUpdateAgentskill();
    const queryClient = useQueryClient();
    const { data: skills, isLoading: isLoadingSkills } = useGetSimpleSkills();

    console.log(skills, "skill")
    // Fetch agents for the dropdown
    const { data: agentsData, isLoading: isLoadingAgents } = useGetAgents();
    const agents = agentsData?.data || agentsData || [];

    console.log(agentsData, "agents")

    useEffect(() => {
        if (visible) {
            if (editingItem) {
                form.setFieldsValue({
                    agent_id: editingItem.agent_id,
                    skill_id: editingItem.skill_id,
                    proficiency: editingItem.proficiency,
                });
            } else {
                form.resetFields();
                form.setFieldsValue({ proficiency: 0 });
            }
        }
    }, [visible, editingItem, form]);

    const handleFinish = (values: any) => {
        if (editingItem) {
            updateSkill.mutate(
                {
                    id: editingItem.reference_id || editingItem.id,
                    data: values,
                },
                {
                    onSuccess: (response: any) => {
                        message.success('Agent skill updated successfully');

                        queryClient.setQueryData(
                            ["agentskills"],
                            (oldData: any) => {
                                if (!oldData) return oldData;

                                return {
                                    ...oldData,
                                    data: oldData.data.map((item: any) =>
                                        item.reference_id === response.data.reference_id
                                            ? response.data
                                            : item
                                    ),
                                };
                            }
                        );

                        onSuccess();
                    },
                    onError: (err) =>
                        message.error(err?.message || 'Update failed'),
                }
            );
        } else {
            createSkill.mutate(values, {
                onSuccess: (response: any) => {
                    message.success('Agent skill assigned successfully');

                    queryClient.setQueryData(
                        ["agentskills"],
                        (oldData: any) => {
                            if (!oldData) return oldData;

                            return {
                                ...oldData,
                                data: [response.data, ...oldData.data],
                                pagination: {
                                    ...oldData.pagination,
                                    totalItems:
                                        oldData.pagination.totalItems + 1,
                                },
                            };
                        }
                    );

                    onSuccess();
                },
                onError: (err) =>
                    message.error(err?.message || 'Creation failed'),
            });
        }
    };

    return (
        <Modal
            title={editingItem ? 'Edit Agent Skill' : 'Assign Agent Skill'}
            open={visible}
            onCancel={onCancel}
            footer={null}
            destroyOnClose
            className={isDark ? 'dark-modal' : ''}
            styles={{
                content: {
                    background: isDark ? '#141414' : '#fff',
                    color: isDark ? '#fff' : '#000',
                },
                header: {
                    background: isDark ? '#141414' : '#fff',
                    color: isDark ? '#fff' : '#000',
                    borderBottom: `1px solid ${isDark ? '#303030' : '#f0f0f0'}`,
                }
            }}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                style={{ marginTop: 24 }}
            >
                <Form.Item
                    name="agent_id"
                    label={<span style={{ color: isDark ? '#fff' : '#000' }}>Agent</span>}
                    rules={[{ required: true, message: 'Please select an agent' }]}
                >
                    <Select
                        placeholder="Select Agent"
                        loading={isLoadingAgents}
                        options={agents.map((a) => ({
                            label: `${a.user_full_name || 'Agent'} (${a.agent_number})`,
                            value: a.reference_id || a.id
                        }))}
                        style={{ width: '100%' }}
                        popupClassName={isDark ? 'dark-dropdown' : ''}
                    />
                </Form.Item>

                <Form.Item
                    name="skill_id"
                    label={<span style={{ color: isDark ? '#fff' : '#000' }}>Skill</span>}
                    rules={[{ required: true, message: 'Please select a skill' }]}
                >
                    <Select
                        placeholder="Select Skill"
                        style={{ width: '100%' }}
                        popupClassName={isDark ? 'dark-dropdown' : ''}
                        options={skills?.data?.map((s) => ({ label: s.name, value: s.reference_id }))}
                    />
                </Form.Item>

                <Form.Item
                    name="proficiency"
                    label={<span style={{ color: isDark ? '#fff' : '#000' }}>Proficiency (%)</span>}
                    rules={[{ required: true, message: 'Please enter proficiency level' }]}
                >
                    <InputNumber
                        min={0}
                        max={100}
                        style={{
                            width: '100%',
                            background: isDark ? '#1f1f1f' : '#fff',
                            color: isDark ? '#fff' : '#000',
                            borderColor: isDark ? '#303030' : '#d9d9d9',
                        }}
                    />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                    <Button onClick={onCancel} style={{ marginRight: 8 }}>
                        Cancel
                    </Button>
                    <Button type="primary" htmlType="submit" loading={createSkill.isPending || updateSkill.isPending}>
                        {editingItem ? 'Update' : 'Assign'}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AgentSkillFormModal;