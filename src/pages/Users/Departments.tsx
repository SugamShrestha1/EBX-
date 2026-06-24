import { useState, useRef, useEffect } from "react";
import { Button, Modal, Input, InputNumber, Space, Tag, Empty, Spin, Alert } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import CommonTable from "../../components/common/CommonTable";
import {
    useCreateDepartment,
    useGetDepartments,
    useUpdateDepartment,
    useDeleteDepartment,
    useBulkDeleteDepartments,
    useToggleDepartment,
} from "../../hooks/useUserApi";

import { defaultHours, fromPayload, DAYS } from "./components/BusinessHoursPopover";
import DepartmentFormModal from "./components/DepartmentFormModal";
import { Columns } from "./DepartmentsColumns";
import { useMemo } from "react";

import { useUsersStore } from "./useUserStore";
import { useThemeMode } from "../../contexts/ThemeContext";

// ─── Main Component ───────────────────────────────────────────────────────────

const emptyForm = { name: "", code: "", description: "", business_hours: defaultHours() };

export default function DepartmentManager() {
    const { isDark } = useThemeMode();
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});
    const [editingId, setEditingId] = useState(null);
    const [apiError, setApiError] = useState(null);

    const { departments, setDepartments } = useUsersStore();

    const { data: departmentsData, isLoading: isLoadingDepartments } = useGetDepartments();

    const { mutateAsync: createDepartment, isPending: isCreating } = useCreateDepartment();
    const { mutateAsync: updateDepartment, isPending: isUpdating } = useUpdateDepartment();
    const { mutateAsync: deleteDepartment, isPending: isDeleting } = useDeleteDepartment();

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = "Department name is required.";
        if (!form.code.trim()) e.code = "Code is required.";
        else if (!/^[A-Z0-9_-]{1,10}$/i.test(form.code))
            e.code = "Use up to 10 letters, numbers, - or _.";
        return e;
    };

    const openCreate = () => {
        setForm(emptyForm);
        setErrors({});
        setApiError(null);
        setEditingId(null);
        setShowModal(true);
    };

    const openEdit = (dept) => {
        setForm({
            name: dept.name,
            code: dept.code,
            description: dept.description,
            business_hours: fromPayload(dept.business_hours) || defaultHours(),
        });
        setErrors({});
        setApiError(null);
        setEditingId(dept.reference_id);
        setShowModal(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
        if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
        if (apiError) setApiError(null);
    };

    const handleSubmit = async () => {
        const e = validate();
        if (Object.keys(e).length) { setErrors(e); return; }
        setApiError(null);

        // Build payload — business_hours converted to {mon: ["09:00", "17:00"]} format
        const businessHoursPayload = {};
        DAYS.forEach(d => {
            const slots = form.business_hours[d] || [];
            businessHoursPayload[d] = slots.length === 0 ? [] : [slots[0].start, slots[0].end];
        });

        const payload = {
            name: form.name,
            code: form.code,
            description: form.description,
            business_hours: businessHoursPayload,
        };

        if (editingId !== null) {
            try {
                await updateDepartment({ id: editingId, ...payload });
                setShowModal(false);
            } catch (err) {
                const message =
                    err?.response?.data?.message ||
                    err?.message ||
                    "Something went wrong. Please try again.";
                setApiError(message);
            }
            return;
        }

        try {
            await createDepartment(payload);
            setShowModal(false);
        } catch (err) {
            const message =
                err?.response?.data?.message ||
                err?.message ||
                "Something went wrong. Please try again.";
            setApiError(message);
        }
    };

    const handleDelete = async (id) => {
        console.log(id, "id")
        if (window.confirm("Are you sure you want to delete this department?")) {
            try {
                await deleteDepartment(id);
            } catch (err) {
                console.error("Failed to delete department:", err);
            }
        }
    };

    const columns = useMemo(() => Columns(), []);

    return (
        <div className={`min-h-screen font-sans ${isDark ? 'bg-transparent text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
            {/* Header */}
            <header className={`border-b px-6 py-4 flex items-center justify-between ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div>
                    <h1 className={`text-xl font-semibold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Departments</h1>
                    <p className={`text-sm mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {departments.length} department{departments.length !== 1 ? "s" : ""} configured
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
                >
                    <PlusOutlined />
                    Add Department
                </button>
            </header>

            {/* Content */}
            <main className="px-6 py-6">
                <CommonTable
                    columns={columns}
                    dataSource={departments}
                    loading={isLoadingDepartments}
                    onEdit={openEdit}
                    onDelete={handleDelete}
                    rowKey="reference_id"
                    emptyText="No departments found"
                />
            </main>

            <DepartmentFormModal
                showModal={showModal}
                onCancel={() => !(isCreating || isUpdating) && setShowModal(false)}
                form={form}
                handleChange={handleChange}
                setForm={setForm}
                errors={errors}
                apiError={apiError}
                editingId={editingId}
                isCreating={isCreating}
                isUpdating={isUpdating}
                handleSubmit={handleSubmit}
            />
        </div>
    );
}