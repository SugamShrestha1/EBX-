import React, { useState } from "react";
import {
    Button,
    Tag,
    Space,
    Typography,
    message,
    Tooltip,
    Badge,
    Radio,
    Switch,
    Popconfirm,
} from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import CommonTable from "../../components/common/CommonTable";
import {
    useGetQueueMember,
    useDeleteQueueMember,
    useToggleQueueMemberStatus,
} from "../../hooks/useQueueAction";
import QueueMemberModal from "./QueueMemberFormModal";
import { useBUlkDelelteQueueMember } from "../../hooks/useQueueAction";
import { Columns } from "./QueueMemberColumns";
import { useMemo } from "react";

const { Title, Text } = Typography;

const QueueMember = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [pauseFilter, setPauseFilter] = useState(null); // null = all, true = paused, false = active
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const { data: queryMember, isLoading } = useGetQueueMember(
        pauseFilter !== null ? { paused: pauseFilter } : {}
    );
    const { mutate: deleteQueueMember } = useDeleteQueueMember();
    const { mutate: bulkDeleteQueueMember, isPending: isBulkDeleting } = useBUlkDelelteQueueMember();
    const [toggleOverrides, setToggleOverrides] = useState<Record<string, boolean>>({});
    const { mutate: toggleQueueMemberStatus } = useToggleQueueMemberStatus(setToggleOverrides);

    console.log(toggleOverrides, "toggle")
    console.log(queryMember, 'queue')

    const openCreate = () => {
        setEditTarget(null);
        setModalOpen(true);
    };

    const openEdit = (record) => {
        setEditTarget(record);
        setModalOpen(true);
    };

    const handleDelete = (key) => {
        deleteQueueMember(key, {
            onSuccess: () => message.success("Member deleted successfully"),
            onError: (err) => message.error(err?.message || "Delete failed"),
        });
    };

    const togglePause = (record) => {
        toggleQueueMemberStatus(record.reference_id);
    };

    const handleBulkDelete = () => {
        bulkDeleteQueueMember(
            { ids: selectedRowKeys },
            {
                onSuccess: () => {
                    message.success(`${selectedRowKeys.length} member(s) deleted successfully`);
                    setSelectedRowKeys([]);
                },
                onError: (err: any) => message.error(err?.message || "Bulk delete failed"),
            }
        );
    };

    const columns = useMemo(() => Columns({ toggleOverrides, togglePause }), [toggleOverrides, togglePause]);

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

            {/* Pause filter */}
            <Space style={{ marginBottom: 16 }}>
                <Text type="secondary">Filter by status:</Text>
                <Radio.Group
                    value={pauseFilter === null ? "all" : pauseFilter ? "paused" : "active"}
                    onChange={(e) => {
                        const v = e.target.value;
                        setPauseFilter(v === "all" ? null : v === "paused");
                    }}
                    optionType="button"
                    buttonStyle="outline"
                >
                    <Radio.Button value="all">All</Radio.Button>
                    <Radio.Button value="active">Active</Radio.Button>
                    <Radio.Button value="paused">Paused</Radio.Button>
                </Radio.Group>
            </Space>

            <CommonTable
                columns={columns}
                dataSource={queryMember?.data}
                rowKey="reference_id"
                loading={isLoading}
                onEdit={openEdit}
                onDelete={handleDelete}
                bordered={false}
                size="middle"
                emptyText="No queue members found"
                selectedRowKeys={selectedRowKeys}
                onSelectChange={(keys: React.Key[]) => setSelectedRowKeys(keys)}
                bulkActions={
                    <Popconfirm
                        title="Delete Selected Members"
                        description={`Are you sure you want to delete ${selectedRowKeys.length} selected member(s)?`}
                        onConfirm={handleBulkDelete}
                        okText="Yes, Delete"
                        cancelText="Cancel"
                        okButtonProps={{ danger: true, loading: isBulkDeleting }}
                    >
                        <Button
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                            loading={isBulkDeleting}
                        >
                            Delete Selected ({selectedRowKeys.length})
                        </Button>
                    </Popconfirm>
                }
            />

            <QueueMemberModal
                modalOpen={modalOpen}
                onCancel={() => setModalOpen(false)}
                onSuccess={() => setModalOpen(false)}
                initialValues={editTarget}
            />
        </div>
    );
};

export default QueueMember;