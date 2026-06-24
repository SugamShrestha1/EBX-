import { useMemo, useState } from "react";
import { Button, Space, Switch, Tag, message, Popconfirm, Input } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

import CommonTable from "../../components/common/CommonTable";
import {
    useGetOutboundCampaign,
    useCreateOutboundCampaign,
    useUpdateOutboundCampaign,
    useDeleteOutboundCampaign,
    useToggleOutboundCampaignStatus,
} from "../../hooks/useCampaignAction";
import CampaignFormModal from "./CampaignFormModal";
import type { Campaign as CampaignType } from "./campaign.types";
import { Columns } from "./CampaignColumns";

const Campaign = () => {
    const { data, isLoading, refetch } = useGetOutboundCampaign();

    const { mutateAsync: createCampaign, isPending: isCreating } = useCreateOutboundCampaign();
    const { mutateAsync: updateCampaign, isPending: isUpdating } = useUpdateOutboundCampaign();
    const { mutateAsync: deleteCampaign, isPending: isDeleting } = useDeleteOutboundCampaign();
    const { mutateAsync: toggleStatus } = useToggleOutboundCampaignStatus();

    const [searchText, setSearchText] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState<CampaignType | null>(null);

    const campaigns: CampaignType[] = data?.data || [];

    const filteredCampaigns = useMemo(() => {
        if (!searchText.trim()) return campaigns;
        const q = searchText.toLowerCase();
        return campaigns.filter(
            (c) =>
                c.name?.toLowerCase().includes(q) ||
                c.queue_name?.toLowerCase().includes(q) ||
                c.trunk_name?.toLowerCase().includes(q) ||
                c.reference_id?.toLowerCase().includes(q)
        );
    }, [campaigns, searchText]);

    const openCreateModal = () => {
        setEditingCampaign(null);
        setModalOpen(true);
    };

    const openEditModal = (record: CampaignType) => {
        setEditingCampaign(record);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingCampaign(null);
    };

    const handleSubmit = async (values: Partial<CampaignType>) => {
        try {
            if (editingCampaign) {
                await updateCampaign({ reference_id: editingCampaign.reference_id, ...values });
                message.success("Campaign updated successfully");
            } else {
                await createCampaign(values);
                message.success("Campaign created successfully");
            }
            closeModal();
            refetch();
        } catch (err: any) {
            message.error(err?.message || "Something went wrong. Please try again.");
        }
    };

    const handleDelete = async (reference_id: string) => {
        try {
            await deleteCampaign(reference_id);
            message.success("Campaign deleted successfully");
            refetch();
        } catch (err: any) {
            message.error(err?.message || "Failed to delete campaign");
        }
    };

    const handleToggleActive = async (record: CampaignType, checked: boolean) => {
        try {
            await toggleStatus({ reference_id: record.reference_id, is_active: checked });
            message.success(`Campaign ${checked ? "activated" : "deactivated"}`);
            refetch();
        } catch (err: any) {
            message.error(err?.message || "Failed to update status");
        }
    };

    const columns = useMemo(() => Columns({ handleToggleActive, openEditModal, handleDelete, isDeleting }), [handleToggleActive, openEditModal, handleDelete, isDeleting]);

    return (
        <div style={{ padding: 24 }}>
            <Space style={{ marginBottom: 16, width: "100%", justifyContent: "space-between" }}>
                <h1 style={{ margin: 0 }}>Campaigns</h1>
                <Space>
                    <Input
                        placeholder="Search campaigns..."
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        allowClear
                        style={{ width: 260 }}
                    />
                    <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
                        New Campaign
                    </Button>
                </Space>
            </Space>

            <CommonTable
                columns={columns}
                showActions={false}
                dataSource={filteredCampaigns}
                loading={isLoading}
                rowKey="reference_id"
            />

            <CampaignFormModal
                open={modalOpen}
                initialValues={editingCampaign}
                confirmLoading={isCreating || isUpdating}
                onCancel={closeModal}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default Campaign;