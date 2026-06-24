import React from 'react';
import { Button, Space, Switch, Tag, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

export const Columns = ({ handleToggleActive, openEditModal, handleDelete, isDeleting }) => [
    {
        header: "Name",
        accessor: "name",
    },
    {
        header: "Queue",
        accessor: "queue_name",
    },
    {
        header: "Trunk",
        accessor: "trunk_name",
    },
    {
        header: "Caller ID",
        accessor: "caller_id",
    },
    {
        header: "Dial Mode",
        accessor: "dial_mode",
        render: (mode) => <Tag color="blue">{mode}</Tag>,
    },
    {
        header: "Pacing Ratio",
        accessor: "pacing_ratio",
    },
    {
        header: "Max Attempts",
        accessor: "max_attempts",
    },
    {
        header: "Retry Interval (min)",
        accessor: "retry_interval_min",
    },
    {
        header: "Status",
        accessor: "is_active",
        render: (isActive, record) => (
            <Switch
                checked={isActive}
                onChange={(checked) => handleToggleActive(record, checked)}
            />
        ),
    },
    {
        header: "Updated At",
        accessor: "updated_at",
        render: (val) => (val ? new Date(val).toLocaleString() : "-"),
    },
    {
        header: "Actions",
        accessor: "actions",
        render: (_, record) => (
            <Space>
                <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => openEditModal(record)}
                    aria-label="Edit campaign"
                />
                <Popconfirm
                    title="Delete this campaign?"
                    description="This action cannot be undone."
                    okText="Delete"
                    okButtonProps={{ danger: true, loading: isDeleting }}
                    onConfirm={() => handleDelete(record.reference_id)}
                >
                    <Button type="text" danger icon={<DeleteOutlined />} aria-label="Delete campaign" />
                </Popconfirm>
            </Space>
        ),
    },
];
