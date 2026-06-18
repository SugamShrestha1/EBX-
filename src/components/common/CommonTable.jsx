import React from "react";
import { Table, Space, Button, Tooltip, Popconfirm, Empty, Spin } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";

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

  const finalColumns = actionColumn ? [...columns, actionColumn] : columns;

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