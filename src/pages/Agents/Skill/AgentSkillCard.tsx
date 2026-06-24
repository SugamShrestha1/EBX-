import React from 'react';
import { Popconfirm, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, ThunderboltOutlined } from '@ant-design/icons';

const TOP_BAR_COLORS = ['#E24B4A', '#F59E0B', '#10B981', '#3B82F6'];

const getProficiencyLabel = (proficiency) => {
    if (proficiency >= 80) return 'Expert';
    if (proficiency >= 50) return 'Intermediate';
    return 'Beginner';
};

const getProficiencyColors = (proficiency) => {
    if (proficiency >= 80) return { accent: '#10B981', bg: '#ECFDF5', color: '#059669' };
    if (proficiency >= 50) return { accent: '#F59E0B', bg: '#FFFBEB', color: '#D97706' };
    return { accent: '#E24B4A', bg: '#FEF2F2', color: '#DC2626' };
};

const getInitials = (agentId) => {
    if (!agentId) return 'AG';
    const str = String(agentId);
    return str.length >= 2 ? str.slice(-2).toUpperCase() : str.toUpperCase();
};

const PALETTE = {
    icon: { bg: '#EEF2FF', color: '#4F46E5' },
    codeBadge: { bg: '#F0FDFA', color: '#0D9488', border: '#99F6E4' },
    agentBg: { bg: '#FFF7ED', color: '#EA580C', border: '#FED7AA' },
    toggle: { on: '#8B5CF6', off: '#e5e7eb' },
    edit: { default: '#3B82F6', hover: '#2563EB', hoverBg: '#EFF6FF' },
    delete: { default: '#EF4444', hover: '#DC2626', hoverBg: '#FEF2F2' },
};

const PALETTE_DARK = {
    icon: { bg: '#1e1b4b', color: '#818CF8' },
    codeBadge: { bg: '#042f2e', color: '#2DD4BF', border: '#134e4a' },
    agentBg: { bg: '#1c1007', color: '#FB923C', border: '#431407' },
    toggle: { on: '#8B5CF6', off: '#333' },
    edit: { default: '#60A5FA', hover: '#93C5FD', hoverBg: '#1e3a5f' },
    delete: { default: '#F87171', hover: '#FCA5A5', hoverBg: '#2c0a0a' },
};

const AgentSkillCard = ({ item, index, isDark, onEdit, onDelete, onToggle, isTogglingId, isSelected, onSelect, totalSelected }) => {
    const P = isDark ? PALETTE_DARK : PALETTE;
    const profColors = getProficiencyColors(item.proficiency ?? 0);
    const profLabel = getProficiencyLabel(item.proficiency ?? 0);
    const isActive = item.is_active;
    const isToggling = isTogglingId === (item.reference_id || item.id);
    const topBarColor = TOP_BAR_COLORS[index % 4];

    return (
        <div
            style={{
                background: isDark ? '#161616' : '#ffffff',
                border: `1px solid ${isSelected ? P.delete.default : isDark ? '#242424' : '#f0f0f0'}`,
                borderRadius: 16,
                overflow: 'hidden',
                transition: 'all 0.2s ease',
                opacity: isSelected ? 0.45 : 1,
                boxShadow: isSelected ? `0 0 0 2px ${P.delete.default}60` : 'none',
                transform: isSelected ? 'scale(0.98)' : 'scale(1)',
            }}
            onMouseEnter={(e) => {
                if (isSelected) return;
                e.currentTarget.style.borderColor = `${topBarColor}50`;
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 8px 24px ${topBarColor}20`;
            }}
            onMouseLeave={(e) => {
                if (isSelected) return;
                e.currentTarget.style.borderColor = isDark ? '#242424' : '#f0f0f0';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
            }}
        >
            {/* Top accent bar */}
            <div style={{
                height: 4,
                background: isActive ? topBarColor : isDark ? '#2a2a2a' : '#f3f4f6',
                transition: 'background 0.3s',
            }} />

            {/* Body */}
            <div style={{ padding: '16px 16px 12px' }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', flex: 1, minWidth: 0 }}>
                        {/* Icon */}
                        <div style={{
                            width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                            background: isActive ? P.icon.bg : isDark ? '#222' : '#f5f5f5',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: `1px solid ${isActive ? topBarColor + '25' : isDark ? '#2e2e2e' : '#ebebeb'}`,
                            transition: 'all 0.2s',
                        }}>
                            <ThunderboltOutlined style={{
                                fontSize: 18,
                                color: isActive ? topBarColor : isDark ? '#555' : '#ccc',
                            }} />
                        </div>

                        {/* Name + code badge */}
                        <div style={{ minWidth: 0 }}>
                            <p style={{
                                margin: '0 0 4px', fontSize: 13, fontWeight: 600,
                                color: isDark ? '#f0f0f0' : '#111827',
                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            }}>
                                {item.skill_name || item.skill_code || 'Unknown Skill'}
                            </p>
                            <span style={{
                                fontSize: 10, fontFamily: 'monospace', letterSpacing: '0.04em',
                                color: isActive ? P.codeBadge.color : isDark ? '#555' : '#aaa',
                                background: isActive ? P.codeBadge.bg : isDark ? '#1e1e1e' : '#f7f7f7',
                                border: `1px solid ${isActive ? P.codeBadge.border : isDark ? '#2a2a2a' : '#ebebeb'}`,
                                padding: '1px 7px', borderRadius: 4,
                                display: 'inline-block',
                            }}>
                                {item.skill_code || 'N/A'}
                            </span>
                        </div>
                    </div>

                    {/* Toggle */}
                    <Tooltip title={isActive ? 'Deactivate' : 'Activate'}>
                        <button
                            onClick={() => onToggle(item)}
                            disabled={isToggling}
                            aria-label={isActive ? 'Deactivate skill' : 'Activate skill'}
                            style={{
                                width: 34, height: 20, borderRadius: 10, border: 'none', padding: 0,
                                background: isActive ? P.toggle.on : P.toggle.off,
                                cursor: isToggling ? 'not-allowed' : 'pointer',
                                position: 'relative', flexShrink: 0, marginLeft: 10,
                                opacity: isToggling ? 0.5 : 1,
                                transition: 'background 0.25s',
                                boxShadow: isActive ? `0 0 0 3px ${P.toggle.on}30` : 'none',
                            }}
                        >
                            <span style={{
                                position: 'absolute', top: 3, borderRadius: '50%', background: '#fff',
                                width: 14, height: 14,
                                transition: 'left 0.25s cubic-bezier(0.4,0,0.2,1)',
                                left: isActive ? 17 : 3,
                                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                            }} />
                        </button>
                    </Tooltip>
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: isDark ? '#1e1e1e' : '#f5f5f5', margin: '0 0 12px' }} />

                {/* Agent row */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14,
                    padding: '7px 10px',
                    background: isActive ? P.agentBg.bg : isDark ? '#1a1a1a' : '#fafafa',
                    border: `1px solid ${isActive ? P.agentBg.border : isDark ? '#222' : '#f0f0f0'}`,
                    borderRadius: 8,
                }}>
                    <div style={{
                        width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                        background: isActive ? P.agentBg.border : isDark ? '#222' : '#f0f0f0',
                        border: `1px solid ${isActive ? P.agentBg.color + '40' : isDark ? '#2e2e2e' : '#e5e7eb'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 10, fontWeight: 700,
                        color: isActive ? P.agentBg.color : isDark ? '#555' : '#aaa',
                    }}>
                        {getInitials(item.agent_number || item.agent_id)}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <span style={{ fontSize: 10, color: isDark ? '#555' : '#bbb', lineHeight: 1 }}>
                            Assigned Agent
                        </span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: isDark ? '#d0d0d0' : '#374151', lineHeight: 1.3 }}>
                            #{item.agent_number || item.agent_id || 'N/A'}
                        </span>
                    </div>
                    {!isActive && (
                        <span style={{
                            marginLeft: 'auto', fontSize: 10, fontWeight: 500,
                            color: isDark ? '#555' : '#9ca3af',
                            background: isDark ? '#222' : '#f3f4f6',
                            border: `1px solid ${isDark ? '#2a2a2a' : '#e5e7eb'}`,
                            padding: '2px 7px', borderRadius: 20,
                        }}>
                            Inactive
                        </span>
                    )}
                </div>

                {/* Proficiency */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                    <span style={{ fontSize: 11, color: isDark ? '#555' : '#bbb', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        Proficiency
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{
                            fontSize: 10, fontWeight: 600,
                            color: isActive ? profColors.color : isDark ? '#555' : '#bbb',
                            background: isActive ? profColors.bg : isDark ? '#1e1e1e' : '#f5f5f5',
                            border: `1px solid ${isActive ? profColors.accent + '40' : isDark ? '#2a2a2a' : '#ebebeb'}`,
                            padding: '1px 7px', borderRadius: 20,
                        }}>
                            {profLabel}
                        </span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: isActive ? profColors.accent : isDark ? '#555' : '#bbb' }}>
                            {item.proficiency ?? 0}%
                        </span>
                    </div>
                </div>

                {/* Proficiency bar */}
                <div style={{
                    height: 6, borderRadius: 4,
                    background: isDark ? '#1e1e1e' : '#f3f4f6',
                    overflow: 'hidden',
                    border: `1px solid ${isDark ? '#222' : '#efefef'}`,
                }}>
                    <div style={{
                        height: '100%', borderRadius: 4,
                        width: `${item.proficiency ?? 0}%`,
                        background: isActive ? profColors.accent : isDark ? '#333' : '#e5e7eb',
                        transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1)',
                    }} />
                </div>
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', borderTop: `1px solid ${isDark ? '#1e1e1e' : '#f5f5f5'}` }}>
                <button
                    onClick={() => onEdit(item)}
                    style={{
                        flex: 1, padding: '10px 0',
                        background: isActive ? (isDark ? '#1e3a5f20' : '#EFF6FF') : 'transparent',
                        border: 'none',
                        borderRight: `1px solid ${isDark ? '#1e1e1e' : '#f5f5f5'}`,
                        cursor: 'pointer', fontSize: 12, fontWeight: 600,
                        color: P.edit.default,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                        transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = P.edit.hoverBg;
                        e.currentTarget.style.color = P.edit.hover;
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = isActive ? (isDark ? '#1e3a5f20' : '#EFF6FF') : 'transparent';
                        e.currentTarget.style.color = P.edit.default;
                    }}
                >
                    <EditOutlined style={{ fontSize: 12 }} /> Edit
                </button>

                <Popconfirm
                    title="Delete confirmation"
                    description="Are you sure you want to delete this agent skill?"
                    open={isSelected && totalSelected === 1}
                    onConfirm={() => {
                        onDelete(item.reference_id || item.id);
                        if (onSelect) onSelect(item.reference_id || item.id, false);
                    }}
                    onCancel={() => onSelect && onSelect(item.reference_id || item.id, false)}
                    okText="Yes"
                    cancelText="No"
                    okButtonProps={{ danger: true }}
                >
                    <button
                        onClick={() => onSelect && onSelect(item.reference_id || item.id, !isSelected)}
                        style={{
                            flex: 1, padding: '10px 0',
                            background: isSelected ? P.delete.hoverBg : 'transparent',
                            border: 'none',
                            cursor: 'pointer', fontSize: 12, fontWeight: 600,
                            color: isSelected ? P.delete.hover : P.delete.default,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                            transition: 'all 0.15s',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = P.delete.hoverBg;
                            e.currentTarget.style.color = P.delete.hover;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = isSelected ? P.delete.hoverBg : 'transparent';
                            e.currentTarget.style.color = isSelected ? P.delete.hover : P.delete.default;
                        }}
                    >
                        <DeleteOutlined style={{ fontSize: 12 }} /> {isSelected && totalSelected > 1 ? 'Selected' : 'Delete'}
                    </button>
                </Popconfirm>
            </div>
        </div>
    );
};

export default AgentSkillCard;