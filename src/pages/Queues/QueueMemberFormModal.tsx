import { Modal, Form, InputNumber, Switch, Select, Checkbox, Input, message } from "antd";
import { useEffect } from "react";
import { useGetQueues, useCreateQueueMember, useUpdateQueueMember } from "../../hooks/useQueueAction";
import { useGetAgents } from "../../hooks/useAgentAction";

const QueueMemberModal = ({ modalOpen, onCancel, onSuccess, initialValues }) => {
    const [form] = Form.useForm();
    const { data: queueData, isLoading: queueLoading } = useGetQueues();
    const { data: agentData, isLoading: agentLoading } = useGetAgents();
    const { mutate: createQueueMember, isLoading: createLoading } = useCreateQueueMember();
    const { mutate: updateQueueMember, isLoading: updateLoading } = useUpdateQueueMember();

    useEffect(() => {
        if (modalOpen) {
            if (initialValues) {
                form.setFieldsValue(initialValues);
            } else {
                form.resetFields();
            }
        }
    }, [modalOpen, initialValues]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            if (initialValues) {
                updateQueueMember(
                    { id: initialValues.reference_id, data: values },
                    {
                        onSuccess: () => {
                            message.success("Member updated successfully");
                            form.resetFields();
                            onSuccess?.();
                            onCancel?.();
                        },
                        onError: (err) => message.error(err?.message || "Update failed"),
                    }
                );
            } else {
                createQueueMember(values, {
                    onSuccess: () => {
                        message.success("Member added successfully");
                        form.resetFields();
                        onSuccess?.();
                        onCancel?.();
                    },
                    onError: (err) => message.error(err?.message || "Create failed"),
                });
            }
        } catch {
            // validation failed
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onCancel?.();
    };

    return (
        <Modal
            title={initialValues ? "Edit Member" : "Add Member"}
            open={modalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="Save"
            cancelText="Cancel"
            confirmLoading={createLoading || updateLoading}
            destroyOnClose
        >
            <Form form={form} layout="vertical">

                <Form.Item
                    label="Queue"
                    name="queue_id"
                    rules={[{ required: true, message: "Please select a queue" }]}
                >
                    <Select
                        placeholder="Select a queue"
                        loading={queueLoading}
                        showSearch
                        optionFilterProp="label"
                        options={queueData?.data?.map((q) => ({
                            label: q.name ?? q.queue_number ?? q.id,
                            value: q.reference_id,
                        }))}
                    />
                </Form.Item>

                <Form.Item
                    label="Agent"
                    name="agent_id"
                    rules={[{ required: true, message: "Please select an agent" }]}
                >
                    <Select
                        placeholder="Select an agent"
                        loading={agentLoading}
                        showSearch
                        optionFilterProp="label"
                        options={agentData?.data?.map((a) => ({
                            label: a.user_full_name ?? a.id,
                            value: a.reference_id,
                        }))}
                    />
                </Form.Item>

                <Form.Item
                    label="Penalty"
                    name="penalty"
                    rules={[{ required: true, message: "Please enter a penalty value" }]}
                >
                    <InputNumber min={0} style={{ width: "100%" }} placeholder="0" />
                </Form.Item>

                <Form.Item
                    label="Membership"
                    name="membership"
                    rules={[{ required: true, message: "Please select a membership type" }]}
                >
                    <Select placeholder="Select membership type">
                        <Select.Option value="static">Static</Select.Option>
                        <Select.Option value="dynamic">Dynamic</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item label="Paused" name="paused" valuePropName="checked">
                    <Switch />
                </Form.Item>

                <Form.Item
                    noStyle
                    shouldUpdate={(prev, curr) => prev.paused !== curr.paused}
                >
                    {({ getFieldValue }) =>
                        getFieldValue("paused") ? (
                            <Form.Item label="Pause Reason" name="pause_reason">
                                <Input placeholder="Enter pause reason" />
                            </Form.Item>
                        ) : null
                    }
                </Form.Item>

                <Form.Item name="penalty_locked" valuePropName="checked">
                    <Checkbox>Penalty Locked</Checkbox>
                </Form.Item>

            </Form>
        </Modal>
    );
};

export default QueueMemberModal;