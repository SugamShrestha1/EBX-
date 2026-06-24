import React from 'react';
import { Tag } from 'antd';

export const Columns = () => [
    {
        header: "Name",
        accessor: "name",
        width: 200,
        render: (text) => <span className="font-medium">{text}</span>,
    },
    {
        header: "Code",
        accessor: "code",
        width: 120,
        render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
        header: "Description",
        accessor: "description",
        render: (text) => text || <span className="text-slate-400 italic">—</span>,
    },
];
