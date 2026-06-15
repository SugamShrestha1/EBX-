import { Modal, Button, Alert, Input } from "antd";
import BusinessHoursPopover from "./BusinessHoursPopover";

export default function DepartmentFormModal({
    showModal,
    onCancel,
    form,
    handleChange,
    setForm,
    errors,
    apiError,
    editingId,
    isCreating,
    isUpdating,
    handleSubmit
}) {
    return (
        <Modal
            title={editingId !== null ? "Edit Department" : "New Department"}
            open={showModal}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel} disabled={isCreating || isUpdating}>
                    Cancel
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={isCreating || isUpdating}
                    onClick={handleSubmit}
                >
                    {editingId !== null ? "Save Changes" : "Create Department"}
                </Button>,
            ]}
        >
            {apiError && (
                <Alert
                    message="Error"
                    description={apiError}
                    type="error"
                    showIcon
                    closable
                    style={{ marginBottom: "1rem" }}
                />
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {/* Name */}
                <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>
                        Department Name <span style={{ color: "red" }}>*</span>
                    </label>
                    <Input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="e.g. Engineering"
                        disabled={isCreating || isUpdating}
                        status={errors.name ? "error" : ""}
                    />
                    {errors.name && <div style={{ color: "red", fontSize: "0.875rem", marginTop: "0.25rem" }}>{errors.name}</div>}
                </div>

                {/* Code */}
                <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>
                        Code <span style={{ color: "red" }}>*</span>
                    </label>
                    <Input
                        name="code"
                        value={form.code}
                        onChange={(e) =>
                            handleChange({ target: { name: "code", value: e.target.value.toUpperCase() } })
                        }
                        placeholder="e.g. ENG"
                        maxLength={10}
                        disabled={isCreating || isUpdating}
                        status={errors.code ? "error" : ""}
                    />
                    {errors.code && <div style={{ color: "red", fontSize: "0.875rem", marginTop: "0.25rem" }}>{errors.code}</div>}
                </div>

                {/* Description */}
                <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>
                        Description
                    </label>
                    <Input.TextArea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Brief summary of this department's role…"
                        rows={3}
                        disabled={isCreating || isUpdating}
                    />
                </div>

                {/* Business Hours */}
                <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>
                        Business Hours
                    </label>
                    <BusinessHoursPopover
                        value={form.business_hours}
                        onChange={(val) => setForm((f) => ({ ...f, business_hours: val }))}
                    />
                </div>
            </div>
        </Modal>
    );
}
