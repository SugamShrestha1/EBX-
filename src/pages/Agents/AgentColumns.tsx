import React, { useMemo } from 'react';
import { Typography, Space, Tag, Switch } from 'antd';
import useGetAntColumns from '../../hooks/useGetAntColumns';

const { Text } = Typography;

export const useAgentColumns = ({ handleToggleActive, toggleAgentStatus }) => {
    const rawColumns = useMemo(() => [
        {
            header: 'Agent Name',
            accessor: 'user_full_name',
            render: (text, record) => (
                <Space direction="vertical" size={0}>
                    <Text strong>{text || 'Unknown'}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>{record.user_email}</Text>
                </Space>
            ),
            width: 200,
        },
        {
            header: 'Agent No.',
            accessor: 'agent_number',
            render: (text) => <Text code>{text}</Text>,
            width: 120,
        },
        {
            header: 'Extension',
            accessor: 'extension_number',
            render: (text) => text ? <Tag color="blue">{text}</Tag> : <Text type="secondary">—</Text>,
            width: 120,
        },
        {
            header: 'Priority',
            accessor: 'priority',
            width: 100,
        },
        {
            header: 'Max Concurrent',
            accessor: 'max_concurrent',
            width: 150,
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
            width: 120,
        },
    ], [handleToggleActive, toggleAgentStatus.isPending, toggleAgentStatus.variables]);

    return useGetAntColumns(rawColumns);
};
