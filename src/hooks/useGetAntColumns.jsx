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

const useGetAntColumns = (columnsOrData) => {
    const antColumns = useMemo(() => {
        if (!columnsOrData || !Array.isArray(columnsOrData) || columnsOrData.length === 0) return [];
        
        // Check if the input is an array of actual data rows instead of column config
        let rawColumns = columnsOrData;
        if (typeof columnsOrData[0] === 'object' && columnsOrData[0] !== null &&
            !('accessor' in columnsOrData[0]) && !('dataIndex' in columnsOrData[0]) && 
            !('title' in columnsOrData[0]) && !('header' in columnsOrData[0]) && !('render' in columnsOrData[0])) {
            rawColumns = Object.keys(columnsOrData[0]);
        }

        return rawColumns.map((col) => {
            // Support passing just the string key as a column definition
            if (typeof col === 'string') {
                return {
                    title: <div style={{ whiteSpace: "nowrap" }}>{col.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>,
                    dataIndex: col,
                    key: col,
                    width: 150,
                    ellipsis: true,
                    render: (value, record) => (
                        <div style={{ whiteSpace: "nowrap" }}>
                            {renderCellValue(getNestedValue(record, col))}
                        </div>
                    ),
                };
            }

            return {
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
                            {renderCellValue(getNestedValue(record, col.accessor || col.dataIndex))}
                        </div>
                    ),
            };
        });
    }, [columnsOrData]);

    return antColumns;
};

export default useGetAntColumns;
