import React, { useEffect } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { useCreateSkill, useUpdateSkill } from '../../../hooks/useAgentAction';
import { useQueryClient } from '@tanstack/react-query';

const { TextArea } = Input;

interface SkillFormModalProps {
    visible: boolean;
    onCancel: () => void;
    editingSkill: any | null;
}

const SkillFormModal = ({ visible, onCancel, editingSkill }: SkillFormModalProps) => {
    const [form] = Form.useForm();
    const createSkill = useCreateSkill();
    const updateSkill = useUpdateSkill();
    const queryClient = useQueryClient();
    const isEditing = !!editingSkill;
    const isPending = createSkill.isPending || updateSkill.isPending;

    useEffect(() => {
        if (visible) {
            if (editingSkill) {
                form.setFieldsValue({
                    code: editingSkill.code,
                    name: editingSkill.name,
                    description: editingSkill.description ?? '',
                });
            } else {
                form.resetFields();
            }
        }
    }, [visible, editingSkill, form]);

    const handleSave = async () => {
        try {
            const values = await form.validateFields();

            if (isEditing) {
                updateSkill.mutate(
                    { id: editingSkill.reference_id || editingSkill.id, data: values },
                    {
                        onSuccess: (response: any) => {
                            message.success('Skill updated successfully');
                            onCancel();
                            queryClient.setQueryData(["skills"], (oldData: any) => {
                                if (!oldData) return oldData;

                                return {
                                    ...oldData,
                                    data: oldData.data.map((skill: any) =>
                                        skill.reference_id === response.data.reference_id
                                            ? response.data
                                            : skill
                                    ),
                                };
                            });
                        },
                        onError: (err: any) => message.error(err?.message || 'Update failed'),
                    }
                );
            } else {
                createSkill.mutate(values, {
                    onSuccess: (response: any) => {
                        message.success('Skill created successfully');
                        onCancel();
                        queryClient.setQueryData(["skills"], (oldData: any) => {
                            if (!oldData) return oldData;

                            return {
                                ...oldData,
                                data: [response.data, ...oldData.data],
                                pagination: {
                                    ...oldData.pagination,
                                    totalItems: oldData.pagination.totalItems + 1,
                                },
                            };
                        });

                    },
                    onError: (err: any) => message.error(err?.message || 'Create failed'),
                });
            }
        } catch {
            // validation errors — Ant Design handles display
        }
    };

    return (
        <Modal
            title={isEditing ? 'Edit Skill' : 'Create Skill'}
            open={visible}
            onOk={handleSave}
            onCancel={onCancel}
            confirmLoading={isPending}
            okText={isEditing ? 'Update' : 'Create'}
            destroyOnClose
            width={480}
        >
            <Form form={form} layout="vertical" style={{ marginTop: 8 }}>
                <Form.Item
                    name="code"
                    label="Code"
                    rules={[{ required: true, message: 'Please enter a skill code' }]}
                >
                    <Input placeholder="e.g. SKILL_001" />
                </Form.Item>

                <Form.Item
                    name="name"
                    label="Name"
                    rules={[{ required: true, message: 'Please enter a skill name' }]}
                >
                    <Input placeholder="e.g. Customer Support" />
                </Form.Item>

                <Form.Item name="description" label="Description">
                    <TextArea
                        placeholder="Brief description of the skill (optional)"
                        rows={3}
                        showCount
                        maxLength={255}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default SkillFormModal;
