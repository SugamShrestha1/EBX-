import { useMemo, useState } from "react";
import { Button, Space, Switch, Tag, message, Popconfirm, Input, Tooltip } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, LockOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

import CommonTable from "../../components/common/CommonTable";
import {
    useGetRoles,
    useCreateRole,
    useUpdateRole,
    useDeleteRole,
    useToggleRoleStatus,
} from "../../hooks/useAccessControlAction";
import RoleFormModal from "./RoleFormModal";
import { Columns } from "./RoleColumns";

const Roles = () => {
    const { data, isLoading } = useGetRoles();
    console.log(data, 'data');

    const { mutateAsync: createRole, isPending: isCreating } = useCreateRole();
    const { mutateAsync: updateRole, isPending: isUpdating } = useUpdateRole();
    const { mutateAsync: deleteRole, isPending: isDeleting } = useDeleteRole();
    const { mutateAsync: toggleStatus } = useToggleRoleStatus();

    const [searchText, setSearchText] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);

    const roles: Role[] = data?.data || [];

    const filteredRoles = useMemo(() => {
        if (!searchText.trim()) return roles;
        const q = searchText.toLowerCase();
        return roles.filter(
            (r) =>
                r.name?.toLowerCase().includes(q) ||
                r.slug?.toLowerCase().includes(q) ||
                r.description?.toLowerCase().includes(q)
        );
    }, [roles, searchText]);

    const openCreateModal = () => {
        setEditingRole(null);
        setModalOpen(true);
    };

    const openEditModal = (record: Role) => {
        setEditingRole(record);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingRole(null);
    };

    const handleSubmit = async (values: Partial<Role>) => {
        console.log(values, 'values');
        try {
            if (editingRole) {
                await updateRole({ id: editingRole.reference_id, data: values });
                message.success("Role updated successfully");
            } else {
                await createRole(values);
                message.success("Role created successfully");
            }
            closeModal();
        } catch (err: any) {
            message.error(err?.message || "Something went wrong. Please try again.");
        }
    };

    const handleDelete = async (reference_id: string) => {
        try {
            await deleteRole(reference_id);
            message.success("Role deleted successfully");
        } catch (err: any) {
            message.error(err?.message || "Failed to delete role");
        }
    };

    const handleToggleActive = async (record: Role) => {
        try {
            await toggleStatus(record?.reference_id);
            message.success(`Role ${record.is_active ? "activated" : "deactivated"}`);
        } catch (err: any) {
            message.error(err?.message || "Failed to update status");
        }
    };

    const columns = useMemo(() => Columns({ handleToggleActive, openEditModal, handleDelete, isDeleting }), [handleToggleActive, openEditModal, handleDelete, isDeleting]);

    return (
        <div style={{ padding: 24 }}>
            <Space style={{ marginBottom: 16, width: "100%", justifyContent: "space-between" }}>
                <h1 style={{ margin: 0 }}>Roles</h1>
                <Space>
                    <Input
                        placeholder="Search roles..."
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        allowClear
                        style={{ width: 260 }}
                    />
                    <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
                        New Role
                    </Button>
                </Space>
            </Space>

            <CommonTable
                columns={columns}
                showActions={false}
                dataSource={filteredRoles}
                loading={isLoading}
                rowKey="reference_id"
            />

            <RoleFormModal
                open={modalOpen}
                initialValues={editingRole}
                confirmLoading={isCreating || isUpdating}
                onCancel={closeModal}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default Roles;