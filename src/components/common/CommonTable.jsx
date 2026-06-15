import React from "react";
import { Table, Space, Button, Tooltip, Popconfirm, Empty, Spin } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";

/**
 * CommonTable Component
 * Reusable table component using Ant Design
 * 
 * @param {Array} columns - Column definitions following antd Table format
 * @param {Array} dataSource - Data to display in table
 * @param {Function} onEdit - Callback when edit button is clicked
 * @param {Function} onDelete - Callback when delete button is clicked
 * @param {Function} onView - Callback when view button is clicked
 * @param {Boolean} loading - Loading state
 * @param {Object} pagination - Pagination config
 * @param {Function} onChange - Callback when table state changes (pagination, sorting, filtering)
 * @param {Boolean} showActions - Show action buttons (default: true)
 * @param {String} actionAlign - Alignment of action column (default: 'center')
 * @param {String} emptyText - Empty state text
 */
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
  bordered = true,
  stripe = true,
  size = "middle",
  scroll = { x: 1200 },
  ...restProps
}) {
  // Build action column if callbacks are provided
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
              icon={<EyeOutlined />}
              onClick={() => onView(record)}
              className="text-blue-500 hover:text-blue-700"
            />
          </Tooltip>
        )}
        {onEdit && (
          <Tooltip title="Edit">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
              className="text-green-500 hover:text-green-700"
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
                icon={<DeleteOutlined />}
                className="text-red-500 hover:text-red-700"
              />
            </Tooltip>
          </Popconfirm>
        )}
      </Space>
    ),
  } : null;

  // Combine columns with action column
  const finalColumns = actionColumn ? [...columns, actionColumn] : columns;

  // Default pagination
  const paginationConfig = {
    pageSize: 10,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
    ...pagination,
  };

  return (
    <Spin spinning={loading}>
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
        locale={{
          emptyText: <Empty description={emptyText} />,
        }}
        {...restProps}
      />
    </Spin>
  );
}
