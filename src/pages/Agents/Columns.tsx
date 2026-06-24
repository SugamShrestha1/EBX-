import React from 'react';
import { Typography, Space, Tag, Switch } from 'antd';

const { Text } = Typography;

export const Columns = ({ handleToggleActive, toggleAgentStatus }) => [
    {
        header: 'Agent Name',
        accessor: 'user_full_name',
        render: (text, record) => (
            <Space direction="vertical" size={0}>
                <Text strong>{text || 'Unknown'}</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>{record.user_email}</Text>
            </Space>
        ),
    },
    {
        header: 'Agent No.',
        accessor: 'agent_number',
        render: (text) => <Text code>{text}</Text>,
    },
    {
        header: 'Extension',
        accessor: 'extension_number',
        render: (text) => text ? <Tag color="blue">{text}</Tag> : <Text type="secondary">—</Text>,
    },
    {
        header: 'Priority',
        accessor: 'priority',
    },
    {
        header: 'Max Concurrent',
        accessor: 'max_concurrent',
    },
    {
        header: 'Status',
        accessor: 'is_active',
        filters: [
            { text: 'Active', value: true },
            { text: 'Inactive', value: false },
        ],
        render: (isActive, record) => (
            <Switch
                checked={isActive}
                onChange={() => handleToggleActive(record)}
                loading={toggleAgentStatus.isPending && toggleAgentStatus.variables === record.reference_id}
            />
        ),
    },
];
