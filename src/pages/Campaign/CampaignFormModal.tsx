import { useEffect } from "react";
import { Modal, Form, Input, InputNumber, Select, Switch, Row, Col } from "antd";
import type { Campaign } from "./campaign.types";

interface CampaignFormModalProps {
    open: boolean;
    initialValues: Campaign | null;
    confirmLoading: boolean;
    onCancel: () => void;
    onSubmit: (values: Partial<Campaign>) => void;
}

const DIAL_MODE_OPTIONS = [
    { label: "Predictive", value: "predictive" },
    { label: "Progressive", value: "progressive" },
    { label: "Preview", value: "preview" },
];

const CampaignFormModal = ({
    open,
    initialValues,
    confirmLoading,
    onCancel,
    onSubmit,
}: CampaignFormModalProps) => {
    const [form] = Form.useForm();
    const isEditing = Boolean(initialValues);

    useEffect(() => {
        if (open) {
            form.setFieldsValue(
                initialValues ?? {
                    is_active: true,
                    max_attempts: 3,
                    retry_interval_min: 15,
                    pacing_ratio: "1.0",
                }
            );
        } else {
            form.resetFields();
        }
    }, [open, initialValues, form]);

    const handleOk = async () => {
        const values = await form.validateFields();
        onSubmit(values);
    };

    return (
        <Modal
            title={isEditing ? "Edit Campaign" : "Create Campaign"}
            open={open}
            onCancel={onCancel}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            destroyOnClose
            width={920}
            okText={isEditing ? "Save Changes" : "Create"}
            styles={{ body: { overflowY: "auto", maxHeight: "calc(100vh - 220px)" } }}
        >
            <Form form={form} layout="vertical">
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            name="name"
                            label="Campaign Name"
                            rules={[{ required: true, message: "Please enter a campaign name" }]}
                        >
                            <Input placeholder="e.g. Q3 Renewal Outreach" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="caller_id"
                            label="Caller Number"
                            rules={[{ required: true, message: "Please enter a caller ID" }]}
                        >
                            <Input placeholder="e.g. +15551234567" />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            name="queue_id"
                            label="Queue"
                            rules={[{ required: true, message: "Please enter a queue ID" }]}
                        >
                            <Input placeholder="Queue ID" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="trunk_id"
                            label="Trunk"
                            rules={[{ required: true, message: "Please enter a trunk ID" }]}
                        >
                            <Input placeholder="Trunk ID" />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            name="dial_mode"
                            label="Dial Mode"
                            rules={[{ required: true, message: "Please select a dial mode" }]}
                        >
                            <Select options={DIAL_MODE_OPTIONS} placeholder="Select dial mode" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="pacing_ratio" label="Pacing Ratio">
                            <Input placeholder="e.g. 1.5" />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="max_attempts" label="Max Attempts">
                            <InputNumber min={0} style={{ width: "100%" }} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="retry_interval_min" label="Retry Interval (min)">
                            <InputNumber min={0} style={{ width: "100%" }} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="is_active" label="Active" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Form.Item name="schedule" label="Schedule">
                            <Input placeholder="e.g. Mon-Fri 9:00-18:00" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default CampaignFormModal;