import React, { useState, useRef, useEffect } from "react";

export const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
export const DAY_LABELS = { mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun" };

export const TIMES = [];
for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
        TIMES.push({ label: `${h % 12 === 0 ? 12 : h % 12}:${m === 0 ? "00" : "30"} ${h < 12 ? "AM" : "PM"}`, h, m });
    }
}

export const defaultHours = () =>
    Object.fromEntries(
        DAYS.map((d, i) => [d, i < 5 ? [{ start: "09:00", end: "17:00" }] : []])
    );

// Convert API business_hours {mon: ["09:00", "17:00"]} → internal format {mon: [{start:"09:00", end:"17:00"}]}
export function fromPayload(hours) {
    return Object.fromEntries(
        DAYS.map((d) => {
            const times = hours?.[d] || [];
            if (times.length === 0) return [d, []];
            return [d, [{ start: times[0], end: times[1] || times[0] }]];
        })
    );
}

export function summaryText(hours) {
    const openDays = DAYS.filter((d) => hours[d]?.length > 0);
    if (!openDays.length) return "No hours set";
    const first = hours[openDays[0]][0];
    const allSame = openDays.every(
        (d) => hours[d][0]?.start === first.start && hours[d][0]?.end === first.end
    );
    if (allSame)
        return `${openDays.map((d) => DAY_LABELS[d]).join(", ")} · ${fmt12(first.start)} – ${fmt12(first.end)}`;
    return `${openDays.length} days configured`;
}

export function fmt12(time) {
    const [h, m] = time.split(":").map(Number);
    const hh = h % 12 === 0 ? 12 : h % 12;
    return `${hh}:${m === 0 ? "00" : "30"} ${h < 12 ? "AM" : "PM"}`;
}

export default function BusinessHoursPopover({ value, onChange }) {
    const [open, setOpen] = useState(false);
    const [draft, setDraft] = useState(value);
    const ref = useRef(null);

    useEffect(() => {
        function handler(e) {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        }
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const toggleDay = (day) => {
        setDraft((prev) => ({
            ...prev,
            [day]: prev[day]?.length ? [] : [{ start: "09:00", end: "17:00" }],
        }));
    };

    const updateSlot = (day, field, val) => {
        setDraft((prev) => ({
            ...prev,
            [day]: [{ ...prev[day][0], [field]: val }],
        }));
    };

    const save = () => {
        onChange(draft);
        setOpen(false);
    };

    const cancel = () => {
        setDraft(value);
        setOpen(false);
    };

    return (
        <div className="relative" ref={ref}>
            {/* Trigger */}
            <button
                type="button"
                onClick={() => { setDraft(value); setOpen((o) => !o); }}
                className="w-full flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition hover:border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
                <span className={summaryText(value) === "No hours set" ? "text-slate-300" : "text-slate-700"}>
                    {summaryText(value)}
                </span>
                <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
                </svg>
            </button>

            {/* Popover */}
            {open && (
                <div className="absolute left-0 bottom-full mb-1 z-50 w-96 bg-white rounded-xl border border-slate-200 shadow-lg p-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Business hours</p>

                    <div className="max-h-64 overflow-y-auto space-y-2">
                        {DAYS.map((day) => {
                            const isOpen = draft[day]?.length > 0;
                            const slot = draft[day]?.[0] || { start: "09:00", end: "17:00" };
                            return (
                                <div key={day} className="flex items-center gap-3 py-2 pr-2">
                                    {/* Toggle */}
                                    <button
                                        type="button"
                                        onClick={() => toggleDay(day)}
                                        className={`relative w-7 h-4 rounded-full transition-colors shrink-0 ${isOpen ? "bg-indigo-600" : "bg-slate-200"}`}
                                    >
                                        <span className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${isOpen ? "translate-x-3.5" : "translate-x-0.5"}`} />
                                    </button>

                                    {/* Day label */}
                                    <span className="text-xs font-medium text-slate-700 w-12 shrink-0">{DAY_LABELS[day]}</span>

                                    {/* Time selects or closed */}
                                    {isOpen ? (
                                        <div className="flex items-center gap-1 flex-1">
                                            <select
                                                value={slot.start}
                                                onChange={(e) => updateSlot(day, "start", e.target.value)}
                                                className="flex-1 text-xs border border-slate-200 rounded-md px-1.5 py-1 bg-white text-slate-800 outline-none focus:ring-1 focus:ring-indigo-400"
                                            >
                                                {TIMES.map((t) => (
                                                    <option key={t.label} value={`${String(t.h).padStart(2, "0")}:${t.m === 0 ? "00" : "30"}`}>
                                                        {t.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <span className="text-slate-300 text-xs">–</span>
                                            <select
                                                value={slot.end}
                                                onChange={(e) => updateSlot(day, "end", e.target.value)}
                                                className="flex-1 text-xs border border-slate-200 rounded-md px-1.5 py-1 bg-white text-slate-800 outline-none focus:ring-1 focus:ring-indigo-400"
                                            >
                                                {TIMES.map((t) => (
                                                    <option key={t.label} value={`${String(t.h).padStart(2, "0")}:${t.m === 0 ? "00" : "30"}`}>
                                                        {t.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-slate-300 italic">Closed</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={cancel}
                            className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={save}
                            className="px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                        >
                            Apply
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
