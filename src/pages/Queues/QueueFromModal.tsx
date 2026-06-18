import React, { useEffect } from 'react';
import {
    Modal,
    Form,
    Input,
    InputNumber,
    Select,
    Switch,
    Row,
    Col,
    Divider,
    Typography,
    message
} from 'antd';

import { useGetDepartments } from '../../hooks/useUserApi';
import { useCreateQueue, useUpdateQueue } from '../../hooks/useQueueAction';

const { Text } = Typography;
const { Option } = Select;

const STRATEGY_OPTIONS = [
    { label: 'Round Robin Memory', value: 'rrmemory' },
    { label: 'Round Robin', value: 'roundrobin' },
    { label: 'Least Recent', value: 'leastrecent' },
    { label: 'Fewest Calls', value: 'fewestcalls' },
    { label: 'Random', value: 'random' },
    { label: 'Ring All', value: 'ringall' },
    { label: 'Linear', value: 'linear' },
];

const CALL_RECORDING_OPTIONS = [
    { label: 'Inherit', value: 'inherit' },
    { label: 'Always', value: 'always' },
    { label: 'Never', value: 'never' },
    { label: 'On Demand', value: 'ondemand' },
];

const SECTION_STYLE = { marginBottom: 4 };

const QueueFormModal = ({
    visible,
    onCancel,
    editingQueue = null,
    onSuccess,
    // departments = [],
}) => {
    const [form] = Form.useForm();
    const isEditing = !!editingQueue;
    const createQueue = useCreateQueue();
    const updateQueue = useUpdateQueue();
    const { data: departmentsResponse } = useGetDepartments();
    console.log(departmentsResponse, 'departmentsResponse')
    const departments = departmentsResponse?.data || (Array.isArray(departmentsResponse) ? departmentsResponse : []);
    console.log(departments, '123')
    useEffect(() => {
        if (visible) {
            if (editingQueue) {
                form.setFieldsValue(editingQueue);
            } else {
                form.resetFields();
            }
        }
    }, [visible, editingQueue, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            if (isEditing) {
                updateQueue.mutate({ id: editingQueue.reference_id, data: values }, {
                    onSuccess: () => {
                        message.success('Queue updated successfully');
                        onCancel();
                    },
                    onError: (err: any) => {
                        message.error(err?.message || 'Failed to update queue');
                    }
                });
            } else {
                createQueue.mutate(values, {
                    onSuccess: () => {
                        message.success('Queue created successfully');
                        onCancel();
                    },
                    onError: (err: any) => {
                        message.error(err?.message || 'Failed to create queue');
                    }
                });
            }
        } catch {
            // validation errors are shown inline
        }
    };

    return (
        <Modal
            title={isEditing ? 'Edit Queue' : 'Add Queue'}
            open={visible}
            onCancel={onCancel}
            onOk={handleSubmit}
            okText={isEditing ? 'Save Changes' : 'Create Queue'}
            width={720}
            destroyOnClose
            styles={{
                body: {
                    maxHeight: '65vh',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    paddingRight: '12px'
                }
            }}
            style={{ top: 40 }}
        >
            <Form
                form={form}
                layout="vertical"
                requiredMark="optional"
            >
                {/* ── Basic Info ─────────────────────────────────────── */}
                <Text type="secondary" style={SECTION_STYLE}>Basic Info</Text>
                <Divider style={{ marginTop: 6, marginBottom: 16 }} />

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="name"
                            label="Queue Name"
                            rules={[{ required: true, message: 'Queue name is required' }]}
                        >
                            <Input placeholder="e.g. Support Queue" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="queue_number"
                            label="Queue Number"
                            rules={[{ required: true, message: 'Queue number is required' }]}
                        >
                            <Input placeholder="e.g. 7001" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="department_id"
                            label="Department"
                            rules={[{ required: true, message: 'Please select a department' }]}
                        >
                            <Select placeholder="Select department" allowClear>
                                {departments?.map((d) => {
                                    const value = d.reference_id;
                                    return (
                                        <Option key={value} value={value}>
                                            {d.name}
                                        </Option>
                                    );
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="asterisk_queue_name"
                            label="Asterisk Queue Name"
                            tooltip="Internal Asterisk identifier for this queue"
                        >
                            <Input placeholder="e.g. support_q" />
                        </Form.Item>
                    </Col>
                </Row>

                {/* ── Routing Strategy ───────────────────────────────── */}
                <Text type="secondary" style={SECTION_STYLE}>Routing Strategy</Text>
                <Divider style={{ marginTop: 6, marginBottom: 16 }} />

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="strategy"
                            label="Strategy"
                            rules={[{ required: true, message: 'Strategy is required' }]}
                        >
                            <Select>
                                {STRATEGY_OPTIONS.map((s) => (
                                    <Option key={s.value} value={s.value}>
                                        {s.label}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="call_recording"
                            label="Call Recording"
                        >
                            <Select>
                                {CALL_RECORDING_OPTIONS.map((r) => (
                                    <Option key={r.value} value={r.value}>
                                        {r.label}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                {/* ── Timing ─────────────────────────────────────────── */}
                <Text type="secondary" style={SECTION_STYLE}>Timing</Text>
                <Divider style={{ marginTop: 6, marginBottom: 16 }} />

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            name="timeout"
                            label="Timeout (s)"
                            tooltip="Seconds to ring an agent before moving on"
                        >
                            <InputNumber min={1} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="retry"
                            label="Retry (s)"
                            tooltip="Seconds to wait before trying another agent"
                        >
                            <InputNumber min={0} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="wrapup_time"
                            label="Wrap-up Time (s)"
                            tooltip="Seconds an agent is paused after a call ends"
                        >
                            <InputNumber min={0} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            name="max_wait"
                            label="Max Wait (s)"
                            tooltip="Maximum time a caller will wait in queue"
                        >
                            <InputNumber min={0} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="sla_seconds"
                            label="SLA (s)"
                            tooltip="Target answer time for SLA reporting"
                        >
                            <InputNumber min={0} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="max_callers"
                            label="Max Callers"
                            tooltip="0 means unlimited callers in queue"
                        >
                            <InputNumber min={0} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>

                {/* ── Announcements ──────────────────────────────────── */}
                <Text type="secondary" style={SECTION_STYLE}>Announcements</Text>
                <Divider style={{ marginTop: 6, marginBottom: 16 }} />

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="music_class"
                            label="Music on Hold Class"
                        >
                            <Input placeholder="default" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="announce_frequency"
                            label="Announce Frequency (s)"
                            tooltip="How often to announce position/hold time to callers"
                        >
                            <InputNumber min={0} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="join_announcement"
                            label="Join Announcement"
                            tooltip="Audio file played when a caller joins the queue"
                        >
                            <Input placeholder="e.g. queue-youarenext" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={32}>
                    <Col>
                        <Form.Item
                            name="announce_position"
                            label="Announce Position"
                            valuePropName="checked"
                        >
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item
                            name="announce_holdtime"
                            label="Announce Hold Time"
                            valuePropName="checked"
                        >
                            <Switch />
                        </Form.Item>
                    </Col>
                </Row>

                {/* ── Overflow ───────────────────────────────────────── */}
                <Text type="secondary" style={SECTION_STYLE}>Overflow</Text>
                <Divider style={{ marginTop: 6, marginBottom: 16 }} />

                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="overflow_destination"
                            label="Overflow Destination"
                            tooltip="Extension or number to forward callers when the queue is full or times out"
                        >
                            <Input placeholder="e.g. 9999 or voicemail@context" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default QueueFormModal;