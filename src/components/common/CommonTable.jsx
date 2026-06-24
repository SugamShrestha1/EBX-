import React from "react";
import { Table, Space, Button, Tooltip, Popconfirm, Empty, Spin, Typography } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import useGetAntColumns from "../../hooks/useGetAntColumns";

const { Text } = Typography;

export default function CommonTable({
  columns = [],
  dataSource = [],
  onEdit,
  onDelete,
  onView,
  loading = false,
  pagination = {},
  onChange,
  showActions = true,
  actionAlign = "center",
  emptyText = "No data available",
  rowKey = "id",
  bordered = false,
  stripe = true,
  size = "middle",
  scroll = { x: 1200 },
  // Row selection / bulk-action props
  selectedRowKeys,
  onSelectChange,
  bulkActions,
  ...restProps
}) {
  const actionColumn = showActions && (onEdit || onDelete || onView) ? {
    title: "Actions",
    key: "actions",
    align: actionAlign,
    width: 120,
    fixed: "right",
    render: (_, record) => (
      <Space size="small" wrap>
        {onView && (
          <Tooltip title="View">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined style={{ color: "#8c8c8c" }} />}
              onClick={() => onView(record)}
            />
          </Tooltip>
        )}
        {onEdit && (
          <Tooltip title="Edit">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined style={{ color: "#1677ff" }} />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
        )}
        {onDelete && (
          <Popconfirm
            title="Delete Confirmation"
            description="Are you sure you want to delete this item?"
            onConfirm={() => onDelete(record.reference_id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Delete">
              <Button
                type="text"
                size="small"
                icon={<DeleteOutlined style={{ color: "#ff4d4f" }} />}
              />
            </Tooltip>
          </Popconfirm>
        )}
      </Space>
    ),
  } : null;

  const columnsInput = columns && columns.length > 0 ? columns : dataSource;
  const transformedColumns = useGetAntColumns(columnsInput);
  const finalColumns = actionColumn ? [...transformedColumns, actionColumn] : transformedColumns;

  const paginationConfig = {
    pageSize: 10,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
    ...pagination,
  };

  // Only wire up rowSelection when the parent opts in via onSelectChange
  const rowSelection = onSelectChange
    ? {
      selectedRowKeys,
      onChange: onSelectChange,
      preserveSelectedRowKeys: true,
    }
    : undefined;

  const hasBulkBar = rowSelection && selectedRowKeys?.length > 0 && bulkActions;

  return (
    <Spin spinning={loading}>
      {hasBulkBar && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "8px 16px",
            marginBottom: 8,
            borderRadius: 8,
            background: "var(--bulk-bar-bg, rgba(22,119,255,0.08))",
            border: "1px solid var(--bulk-bar-border, rgba(22,119,255,0.2))",
          }}
        >
          <Text style={{ color: "#1677ff", fontWeight: 500 }}>
            {selectedRowKeys.length} row{selectedRowKeys.length > 1 ? "s" : ""} selected
          </Text>
          <Space>{bulkActions}</Space>
        </div>
      )}
      <Table
        columns={finalColumns}
        dataSource={dataSource}
        loading={loading}
        pagination={paginationConfig}
        onChange={onChange}
        rowKey={rowKey}
        bordered={bordered}
        size={size}
        scroll={scroll}
        rowSelection={rowSelection}
        locale={{
          emptyText: <Empty description={emptyText} />,
        }}
        {...restProps}
      />
    </Spin>
  );
}