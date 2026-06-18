import React, { useState } from "react";
import {
    Button,
    Tag,
    Space,
    Typography,
    message,
    Tooltip,
    Badge,
} from "antd";
import {
    PlusOutlined,
    PauseCircleOutlined,
    PlayCircleOutlined,
} from "@ant-design/icons";
import CommonTable from "../../components/common/CommonTable";
import { useGetQueueMember } from "../../hooks/useQueueAction";
import QueueMemberModal from "./QueueMemberFormModal";

const { Title, Text } = Typography;

const membershipColor = { static: "blue", dynamic: "purple", hint: "cyan" };

const QueueMember = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [saving, setSaving] = useState(false);
    const { data: queryMeneber, isLoading } = useGetQueueMember();

    const openCreate = () => {
        setEditTarget(null);
        setModalOpen(true);
    };

    const openEdit = (record) => {
        setEditTarget(record);
        setModalOpen(true);
    };

    const handleSubmit = async (values) => {
        setSaving(true);
        /* TODO: replace with real API call */
        await new Promise((r) => setTimeout(r, 800));
        message.success(editTarget ? "Member updated" : "Member added");
        setSaving(false);
        setModalOpen(false);
    };

    const handleDelete = (key) => {
        /* TODO: replace with real API call */
        message.success("Member removed");
    };

    const togglePause = (record) => {
        /* TODO: replace with real API call */
    };

    const columns = [
        {
            title: "Agent Number",
            dataIndex: "agent_number",
            key: "agent_number",
            render: (v) => <Text strong>{v}</Text>,
        },
        {
            title: "Queue Number",
            dataIndex: "queue_number",
            key: "queue_number",
        },
        {
            title: "Membership",
            dataIndex: "membership",
            key: "membership",
            render: (v) => (
                <Tag color={membershipColor[v] ?? "default"}>
                    {v.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: "Penalty",
            dataIndex: "penalty",
            key: "penalty",
            align: "center",
            render: (v, record) => (
                <Space size={4}>
                    <Text>{v}</Text>
                    {record.penalty_locked && (
                        <Tooltip title="Penalty locked">
                            <Tag color="orange" style={{ margin: 0 }}>
                                Locked
                            </Tag>
                        </Tooltip>
                    )}
                </Space>
            ),
        },
        {
            title: "Status",
            key: "status",
            render: (_, record) =>
                record.paused ? (
                    <Tooltip title={record.pause_reason || "Paused"}>
                        <Badge status="warning" text="Paused" />
                    </Tooltip>
                ) : (
                    <Badge status="success" text="Active" />
                ),
        },
        {
            title: "Pause",
            key: "pause",
            align: "center",
            width: 80,
            render: (_, record) => (
                <Tooltip title={record.paused ? "Resume" : "Pause"}>
                    <Button
                        size="small"
                        icon={
                            record.paused ? <PlayCircleOutlined /> : <PauseCircleOutlined />
                        }
                        onClick={() => togglePause(record)}
                    />
                </Tooltip>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <Space
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 16,
                }}
            >
                <Title level={4} style={{ margin: 0 }}>
                    Queue Members
                </Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
                    Add Member
                </Button>
            </Space>

            <CommonTable
                columns={columns}
                dataSource={queryMeneber?.data}
                rowKey="key"
                loading={isLoading}
                onEdit={openEdit}
                onDelete={handleDelete}
                bordered={false}
                size="middle"
                emptyText="No queue members found"
            />

            <QueueMemberModal
                modalOpen={modalOpen}
                onCancel={() => setModalOpen(false)}
                onSubmit={handleSubmit}
                initialValues={editTarget}
                Saving={saving}
            />
        </div>
    );
};

export default QueueMember;