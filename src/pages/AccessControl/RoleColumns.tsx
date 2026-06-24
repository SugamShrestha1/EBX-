import React from 'react';
import { Button, Space, Switch, Tag, Popconfirm, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined, LockOutlined } from "@ant-design/icons";

export const Columns = ({ handleToggleActive, openEditModal, handleDelete, isDeleting }) => [
    {
        header: "Name",
        accessor: "name",
        render: (name, record) => (
            <Space>
                <span
                    style={{
                        display: "inline-block",
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: record.color || "#d9d9d9",
                    }}
                />
                {name}
                {record.is_predefined && (
                    <Tooltip title="Predefined role">
                        <LockOutlined style={{ color: "#999", fontSize: 12 }} />
                    </Tooltip>
                )}
            </Space>
        ),
    },
    {
        header: "Slug",
        accessor: "slug",
        render: (slug) => <Tag>{slug}</Tag>,
    },
    {
        header: "Description",
        accessor: "description",
    },
    {
        header: "Priority",
        accessor: "priority",
    },
    {
        header: "Assignable",
        accessor: "is_assignable",
        render: (val) => (val ? <Tag color="green">Yes</Tag> : <Tag>No</Tag>),
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
                    aria-label="Edit role"
                />
                <Popconfirm
                    title="Delete this role?"
                    description={
                        record.is_predefined
                            ? "This is a predefined role and may be required by the system."
                            : "This action cannot be undone."
                    }
                    okText="Delete"
                    okButtonProps={{ danger: true, loading: isDeleting }}
                    onConfirm={() => handleDelete(record.reference_id)}
                >
                    <Button type="text" danger icon={<DeleteOutlined />} aria-label="Delete role" />
                </Popconfirm>
            </Space>
        ),
    },
];
