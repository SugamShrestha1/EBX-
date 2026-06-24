import React from 'react';
import { Typography, Space, Tag, Switch, Badge } from 'antd';

const { Text } = Typography;

const strategyColorMap = {
    'round-robin': 'blue',
    'least-busy': 'green',
    'priority': 'orange',
    'random': 'purple',
};

export const Columns = ({ handleToggleActive, toggleQueueStatus }) => [
    {
        header: 'Queue Name',
        accessor: 'queue_name',
        render: (text, record) => (
            <Space direction="vertical" size={0}>
                <Text strong>{record.name || 'Unnamed Queue'}</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>{record.queue_description}</Text>
            </Space>
        ),
    },
    {
        header: 'Queue No.',
        accessor: 'queue_number',
        render: (text) => <Text code>{text}</Text>,
    },
    {
        header: 'Strategy',
        accessor: 'strategy',
        render: (text) =>
            text ? (
                <Tag color={strategyColorMap[text] || 'default'}>
                    {text.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                </Tag>
            ) : (
                <Text type="secondary">—</Text>
            ),
    },
    {
        header: 'Max Wait (s)',
        accessor: 'max_wait_time',
        render: (text) =>
            text != null ? <Text>{text}s</Text> : <Text type="secondary">—</Text>,
    },
    {
        header: 'Max Size',
        accessor: 'max_size',
        render: (text) =>
            text != null ? <Text>{text}</Text> : <Text type="secondary">—</Text>,
    },
    {
        header: 'Members',
        accessor: 'member_count',
        render: (count) => (
            <Badge
                count={count ?? 0}
                showZero
                style={{ backgroundColor: count > 0 ? '#1677ff' : '#d9d9d9' }}
            />
        ),
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
                loading={
                    toggleQueueStatus.isPending &&
                    toggleQueueStatus.variables === record.reference_id
                }
            />
        ),
    },
];
