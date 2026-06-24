import React from 'react';
import { Typography, Tag, Space, Tooltip, Badge, Switch } from 'antd';

const { Text } = Typography;

const membershipColor = { static: "blue", dynamic: "purple", hint: "cyan" };

export const Columns = ({ toggleOverrides, togglePause }) => [
    {
        header: "Agent Number",
        accessor: "agent_number",
        render: (v) => <Text strong>{v}</Text>,
    },
    {
        header: "Queue Number",
        accessor: "queue_number",
    },
    {
        header: "Membership",
        accessor: "membership",
        render: (v) => (
            <Tag color={membershipColor[v] ?? "default"}>
                {v?.toUpperCase()}
            </Tag>
        ),
    },
    {
        header: "Penalty",
        accessor: "penalty",
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
        header: "Status",
        accessor: "status",
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
        header: "Paused",
        accessor: "pause",
        render: (_, record) => (
            <Tooltip title={record.paused ? "Click to Resume" : "Click to Pause"}>
                <Switch
                    checked={
                        toggleOverrides[record.reference_id] ??
                        record.paused
                    }
                    onChange={() => togglePause(record)}
                />
            </Tooltip>
        ),
    },
];
