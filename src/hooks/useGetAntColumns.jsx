import React, { useMemo } from 'react';

export const getNestedValue = (obj, accessor) => {
    if (!obj || !accessor) return null;
    if (typeof accessor === "function") {
        return accessor(obj);
    }
    return accessor.split(".").reduce((acc, key) => (acc ? acc[key] : null), obj);
};

export const renderCellValue = (value) => {
    if (value === "" || value === null || value === undefined) {
        return "-";
    }
    if (Array.isArray(value)) {
        return value.map((item) => item.content || item).join(", ");
    }
    if (typeof value === "object" && value !== null && !React.isValidElement(value)) {
        return value.content || "-";
    }
    return value;
};

const useGetAntColumns = (columns) => {
    const antColumns = useMemo(() => {
        if (!columns || !Array.isArray(columns)) return [];
        
        return columns.map((col) => ({
            ...col,
            // If header is provided, use it for title
            title: col.header ? <div style={{ whiteSpace: "nowrap" }}>{col.header}</div> : col.title,
            // Fallback for antd dataIndex/key requirements
            dataIndex: col.accessor || col.dataIndex,
            key: col.accessor || col.key,
            width: col.width || 150,
            ellipsis: col.ellipsis !== undefined ? col.ellipsis : true,
            // If a custom render is provided use it, otherwise provide a fallback generic render
            render: col.render
                ? (value, record, index) => col.render(value, record, index)
                : (value, record) => (
                    <div style={{ whiteSpace: "nowrap" }}>
                        {renderCellValue(getNestedValue(record, col.accessor))}
                    </div>
                ),
        }));
    }, [columns]);

    return antColumns;
};

export default useGetAntColumns;
