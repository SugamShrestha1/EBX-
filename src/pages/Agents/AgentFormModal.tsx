import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Switch, Row, Col, Select, message } from 'antd';
import { useCreateAgent, useUpdateAgent } from '../../hooks/useAgentAction';
import { useAgentStore } from './useAgentStore';
import { useGetSimpleUser } from '../../hooks/useUserApi';

const { Option } = Select;

const AgentFormModal = ({ visible, onCancel, editingAgent, onSuccess }) => {
    const [form] = Form.useForm();
    const createAgent = useCreateAgent();
    const updateAgentMutation = useUpdateAgent();

    const { data: simpleUsers, isLoading: isSimpleUserLoading, error: simpleUserError } = useGetSimpleUser();
    const { updateAgent, addAgent } = useAgentStore();

    const users = simpleUsers?.data || [];

    useEffect(() => {
        if (visible) {
            if (editingAgent) {
                form.setFieldsValue({
                    agent_number: editingAgent.agent_number,
                    extension_id: editingAgent.extension_id,
                    priority: editingAgent.priority,
                    max_concurrent: editingAgent.max_concurrent,
                    wrap_up_time: editingAgent.wrap_up_time,
                    is_active: editingAgent.is_active,
                });
            } else {
                form.resetFields();
                form.setFieldsValue({
                    priority: 1,
                    max_concurrent: 1,
                    wrap_up_time: 10,
                    is_active: true,
                });
            }
        }
    }, [visible, editingAgent, form]);

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            if (editingAgent) {
                updateAgentMutation.mutate({ id: editingAgent.reference_id, data: values }, {
                    onSuccess: () => {
                        message.success('Agent updated successfully');
                        updateAgent(editingAgent.reference_id, values);
                        onCancel();
                        if (onSuccess) onSuccess();
                    },
                    onError: (err) => message.error(err?.message || 'Update failed'),
                });
            } else {
                createAgent.mutate(values, {
                    onSuccess: (res) => {
                        message.success('Agent created successfully');
                        const newAgent = res?.data || res;
                        if (newAgent && newAgent.reference_id) {
                            addAgent(newAgent);
                        }
                        onCancel();
                        if (onSuccess) onSuccess();
                    },
                    onError: (err) => message.error(err?.message || 'Create failed'),
                });
            }
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    return (
        <Modal
            title={editingAgent ? "Edit Agent" : "Create Agent"}
            open={visible}
            onOk={handleSave}
            onCancel={onCancel}
            confirmLoading={updateAgentMutation.isPending || createAgent.isPending}
            destroyOnClose
        >
            <Form form={form} layout="vertical">
                {/* user and extension only on create */}
                {!editingAgent && (
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="user_id"
                                label="User"
                                rules={[{ required: true, message: 'Please select a user' }]}
                            >
                                <Select
                                    placeholder="Select a user"
                                    loading={isSimpleUserLoading}
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                >
                                    {users.map((user) => (
                                        <Option key={user.reference_id} value={user.reference_id}>
                                            {user.full_name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="extension_id"
                                label="Extension"
                                rules={[{ required: true, message: 'Please select an extension' }]}
                            >
                                <Select
                                    placeholder="Select an extension"
                                    loading={isSimpleUserLoading}
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                >
                                    {users.map((user) => (
                                        <Option key={user.extension_id} value={user.extension_id}>
                                            {1001}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                )}

                <Form.Item
                    name="agent_number"
                    label="Agent Number"
                    rules={[{ required: true, message: 'Please enter agent number' }]}
                >
                    <Input placeholder="e.g. 1005" />
                </Form.Item>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="priority" label="Priority">
                            <InputNumber min={0} className="w-full" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="max_concurrent" label="Max Concurrent">
                            <InputNumber min={1} className="w-full" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="wrap_up_time" label="Wrap Up Time (s)">
                            <InputNumber min={0} className="w-full" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="is_active"
                            label="Status"
                            valuePropName="checked"
                        >
                            <Switch size="medium" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default AgentFormModal;