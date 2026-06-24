import { useEffect } from "react";
import { Modal, Form, Input, InputNumber, Switch, Row, Col, ColorPicker } from "antd";
import type { Role } from "./roles.types";

interface RoleFormModalProps {
    open: boolean;
    initialValues: Role | null;
    confirmLoading: boolean;
    onCancel: () => void;
    onSubmit: (values: Partial<Role>) => void;
}

const RoleFormModal = ({
    open,
    initialValues,
    confirmLoading,
    onCancel,
    onSubmit,
}: RoleFormModalProps) => {
    const [form] = Form.useForm();
    const isEditing = Boolean(initialValues);
    const isPredefined = Boolean(initialValues?.is_predefined);

    useEffect(() => {
        if (open) {
            form.setFieldsValue(
                initialValues ?? {
                    priority: 0,
                    is_assignable: true,
                    color: "#1677ff",
                }
            );
        } else {
            form.resetFields();
        }
    }, [open, initialValues, form]);

    const handleOk = async () => {
        const values = await form.validateFields();
        onSubmit({
            ...values,
            color: typeof values.color === "string" ? values.color : values.color?.toHexString?.(),
        });
    };

    return (
        <Modal
            title={isEditing ? "Edit Role" : "Create Role"}
            open={open}
            onCancel={onCancel}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            destroyOnClose
            width={680}
            okText={isEditing ? "Save Changes" : "Create"}
            styles={{ body: { overflowY: "auto", maxHeight: "calc(100vh - 220px)" } }}
        >
            <Form form={form} layout="vertical">
                <Row gutter={24}>
                    <Col span={16}>
                        <Form.Item
                            name="name"
                            label="Role Name"
                            rules={[{ required: true, message: "Please enter a role name" }]}
                        >
                            <Input placeholder="e.g. Team Lead" disabled={isPredefined} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="color" label="Color">
                            <ColorPicker format="hex" showText />
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Form.Item name="description" label="Description">
                            <Input.TextArea
                                placeholder="What does this role do?"
                                autoSize={{ minRows: 2, maxRows: 4 }}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item name="icon" label="Icon">
                            <Input placeholder="e.g. shield, user, star" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="priority" label="Priority">
                            <InputNumber min={0} style={{ width: "100%" }} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="is_assignable" label="Assignable" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default RoleFormModal;