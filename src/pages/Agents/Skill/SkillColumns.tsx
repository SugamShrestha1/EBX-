import React from 'react';
import { Typography, Switch } from 'antd';

const { Text } = Typography;

export const SkillColumns = ({ handleToggleActive, toggleSkillStatus }: { handleToggleActive: (record: any) => void; toggleSkillStatus: any }) => [
    {
        header: 'Code',
        accessor: 'code',
        render: (text: string) => <Text code>{text || '—'}</Text>,
        width: 140,
    },
    {
        header: 'Name',
        accessor: 'name',
        render: (text: string) => <Text strong>{text || '—'}</Text>,
        width: 200,
    },
    {
        header: 'Description',
        accessor: 'description',
        render: (text: string) =>
            text ? (
                <Text type="secondary" style={{ fontSize: 13 }}>
                    {text}
                </Text>
            ) : (
                <Text type="secondary">—</Text>
            ),
    },
    {
        header: 'Status',
        accessor: 'is_active',
        width: 100,
        render: (isActive: boolean, record: any) => (
            <Switch
                checked={isActive}
                onChange={() => handleToggleActive(record)}
                loading={toggleSkillStatus.isPending && toggleSkillStatus.variables === record.reference_id}
            />
        ),
    },
];
