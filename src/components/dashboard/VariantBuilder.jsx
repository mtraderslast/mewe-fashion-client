"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { getOptionSuggestions, getVariantAxis } from "@/data/categories";

const THEME = {
    wrap: "space-y-5",
    guide: "rounded-xl border border-teal-100 bg-teal-50/70 px-4 py-3 text-sm text-[#2F5F59] leading-relaxed",
    groupCard: "rounded-xl border border-[#E4DED4] bg-[#FBF9F6] p-4 space-y-4",
    groupHead: "flex items-center justify-between gap-3",
    label: "block text-[11px] font-bold uppercase tracking-wider text-[#5C6560] mb-1.5",
    input: "w-full rounded-xl border border-[#E4DED4] bg-white px-3.5 py-2.5 text-sm text-[#1B2A26] outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15",
    ghostBtn: "inline-flex items-center gap-1.5 rounded-xl border border-[#E4DED4] bg-white px-3 py-2 text-xs font-semibold text-[#3F4A46] hover:bg-[#F4F1EC] transition-colors",
    dangerBtn: "p-2 rounded-lg text-[#8A9590] hover:bg-rose-50 hover:text-rose-600 transition-colors",
    chip: "inline-flex items-center gap-1 rounded-full bg-white border border-[#E4DED4] px-2.5 py-1 text-xs font-medium text-[#1B2A26]",
    chipX: "text-[#8A9590] hover:text-rose-600",
    suggest: "rounded-full border border-dashed border-[#C9D3CE] px-2.5 py-1 text-[11px] text-[#5C6560] hover:border-teal-600 hover:text-teal-700",
    tableWrap: "overflow-x-auto rounded-xl border border-[#E4DED4]",
    th: "text-left text-[11px] uppercase tracking-wider text-[#6B7873] px-3 py-2.5 bg-[#F4F1EC]",
    td: "px-3 py-2.5 text-sm text-[#1B2A26] border-t border-[#EFEAE2]",
    tableInput: "w-full min-w-[90px] rounded-lg border border-[#E4DED4] bg-white px-2.5 py-1.5 text-sm outline-none focus:border-teal-600",
    muted: "text-sm text-[#6B7873]",
    empty: "rounded-xl border border-dashed border-[#E4DED4] px-4 py-8 text-center text-sm text-[#6B7873]",
};

const TEXT = {
    title: "Variants",
    twoAxisGuide: (group, option, example) =>
        `First add each ${group.toLowerCase()}, then add only the ${option.toLowerCase()}s that exist for that ${group.toLowerCase()}. ${example}`,
    oneAxisGuide: (group) =>
        `Add every ${group.toLowerCase()} this product comes in. Each one becomes its own stock row.`,
    burqaExample: "Example: Red can have 52, 54, 56, 58, 60. Black can have only 52, 54, 56, 58.",
    perfumeExample: "Example: Noir Oud can have 50ml and 100ml. Another scent can have different volumes.",
    addGroup: (label) => `Add ${label.toLowerCase()}`,
    groupName: (label) => `${label} name`,
    optionsFor: (option, group, name) =>
        name ? `${option}s for ${name}` : `${option}s for this ${group.toLowerCase()}`,
    addOption: (option) => `Add ${option.toLowerCase()} and press Enter`,
    addChip: "Add",
    suggestions: "Quick add",
    tableTitle: "Generated combinations",
    tableHint: "Each row is one sellable variant. Set stock separately.",
    combo: "Combination",
    price: "Price ($)",
    discount: "Discount",
    stock: "Stock",
    sku: "SKU",
    emptyTwo: (group, option) => `Add a ${group.toLowerCase()}, then add ${option.toLowerCase()}s under it.`,
    emptyOne: (group) => `Add at least one ${group.toLowerCase()}.`,
    pickCategory: "Select a sub category first to build variants.",
    totalStock: "Total stock from variants",
};

let groupCount = 0;
const nextId = () => `grp-${Date.now()}-${groupCount++}`;

const comboKey = (groupName, optionValue) =>
    optionValue ? `${groupName}__${optionValue}` : groupName;

const hydrateFromVariants = (variants = [], subCategory) => {
    const axis = getVariantAxis(subCategory);
    const groups = [];
    const rows = {};

    if (!axis || !variants.length) return { groups, rows };

    const groupMap = new Map();

    variants.forEach((variant) => {
        const groupName = String(variant[axis.groupKey] || "").trim();
        if (!groupName) return;

        const mapKey = groupName.toLowerCase();
        if (!groupMap.has(mapKey)) {
            const group = { id: nextId(), name: groupName, options: [] };
            groupMap.set(mapKey, group);
            groups.push(group);
        }

        const group = groupMap.get(mapKey);
        const optionValue = axis.optionKey
            ? String(variant[axis.optionKey] || "").trim()
            : "";

        if (axis.optionKey) {
            if (!optionValue) return;
            if (!group.options.some((item) => item.toLowerCase() === optionValue.toLowerCase())) {
                group.options.push(optionValue);
            }
        }

        rows[comboKey(groupName, optionValue)] = {
            price: variant.price ?? "",
            discountPrice: variant.discountPrice ?? "",
            stock: variant.stock ?? 0,
            sku: variant.sku ?? "",
        };
    });

    return { groups, rows };
};

function ChipInput({ values, onChange, placeholder, suggestions = [] }) {
    const [draft, setDraft] = useState("");

    const addValue = (raw) => {
        const value = String(raw || "").trim();
        if (!value) return;
        if (values.some((item) => item.toLowerCase() === value.toLowerCase())) {
            setDraft("");
            return;
        }
        onChange([...values, value]);
        setDraft("");
    };

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap gap-1.5">
                {values.map((value) => (
                    <span key={value} className={THEME.chip}>
                        {value}
                        <button
                            type="button"
                            className={THEME.chipX}
                            onClick={() => onChange(values.filter((item) => item !== value))}
                        >
                            ×
                        </button>
                    </span>
                ))}
            </div>
            <div className="flex gap-2">
                <input
                    className={THEME.input}
                    placeholder={placeholder}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === ",") {
                            e.preventDefault();
                            addValue(draft);
                        }
                    }}
                />
                <button type="button" className={THEME.ghostBtn} onClick={() => addValue(draft)}>
                    {TEXT.addChip}
                </button>
            </div>
            {suggestions.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    <span className="text-[11px] text-[#8A9590] mr-1">{TEXT.suggestions}</span>
                    {suggestions
                        .filter((item) => !values.some((value) => value.toLowerCase() === item.toLowerCase()))
                        .map((item) => (
                            <button
                                type="button"
                                key={item}
                                className={THEME.suggest}
                                onClick={() => addValue(item)}
                            >
                                {item}
                            </button>
                        ))}
                </div>
            )}
        </div>
    );
}

export default function VariantBuilder({ subCategory, basePrice = "", onChange, initialVariants = [] }) {
    const axis = getVariantAxis(subCategory);
    const [{ groups: initialGroups, rows: initialRows }] = useState(() =>
        hydrateFromVariants(initialVariants, subCategory)
    );
    const [groups, setGroups] = useState(initialGroups);
    const [rows, setRows] = useState(initialRows);
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    const optionSuggestions = axis?.optionKey
        ? getOptionSuggestions(subCategory, axis.optionKey)
        : getOptionSuggestions(subCategory, axis?.groupKey);

    const combos = useMemo(() => {
        if (!axis) return [];

        if (!axis.optionKey) {
            return groups
                .map((group) => group.name.trim())
                .filter(Boolean)
                .map((name) => ({
                    key: comboKey(name),
                    label: name,
                    [axis.groupKey]: name,
                }));
        }

        return groups.flatMap((group) => {
            const groupName = group.name.trim();
            if (!groupName) return [];
            return (group.options || [])
                .map((option) => option.trim())
                .filter(Boolean)
                .map((option) => ({
                    key: comboKey(groupName, option),
                    label: `${groupName} · ${option}`,
                    [axis.groupKey]: groupName,
                    [axis.optionKey]: option,
                }));
        });
    }, [axis, groups]);

    useEffect(() => {
        if (!axis) {
            onChangeRef.current([]);
            return;
        }

        const variants = combos.map((combo) => {
            const saved = rows[combo.key] || {};
            return {
                size: combo.size || "",
                color: combo.color || "",
                volume: combo.volume || "",
                scent: combo.scent || "",
                price: saved.price ?? basePrice ?? "",
                discountPrice: saved.discountPrice ?? "",
                stock: saved.stock ?? 0,
                sku: saved.sku ?? "",
            };
        });

        onChangeRef.current(variants);
    }, [axis, combos, rows, basePrice]);

    const updateRow = (key, field, value) => {
        setRows((prev) => ({
            ...prev,
            [key]: {
                price: basePrice ?? "",
                discountPrice: "",
                stock: 0,
                sku: "",
                ...prev[key],
                [field]: value,
            },
        }));
    };

    const addGroup = () => {
        setGroups((prev) => [...prev, { id: nextId(), name: "", options: [] }]);
    };

    const updateGroup = (id, patch) => {
        setGroups((prev) => prev.map((group) => (group.id === id ? { ...group, ...patch } : group)));
    };

    const removeGroup = (id) => {
        setGroups((prev) => prev.filter((group) => group.id !== id));
    };

    if (!axis) {
        return <p className={THEME.empty}>{TEXT.pickCategory}</p>;
    }

    const guide = axis.optionKey
        ? TEXT.twoAxisGuide(
            axis.groupLabel,
            axis.optionLabel,
            axis.groupKey === "scent" ? TEXT.perfumeExample : TEXT.burqaExample
        )
        : TEXT.oneAxisGuide(axis.groupLabel);

    const totalStock = combos.reduce((sum, combo) => sum + (Number(rows[combo.key]?.stock) || 0), 0);

    return (
        <div className={THEME.wrap}>
            <p className={THEME.guide}>{guide}</p>

            <div className="flex flex-wrap items-center justify-between gap-3">
                {!axis.optionKey && optionSuggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        <span className="text-[11px] text-[#8A9590] mr-1">{TEXT.suggestions}</span>
                        {optionSuggestions
                            .filter((item) => !groups.some((group) => group.name.toLowerCase() === item.toLowerCase()))
                            .map((item) => (
                                <button
                                    type="button"
                                    key={item}
                                    className={THEME.suggest}
                                    onClick={() => setGroups((prev) => [...prev, { id: nextId(), name: item, options: [] }])}
                                >
                                    {item}
                                </button>
                            ))}
                    </div>
                )}
                <button type="button" className={`${THEME.ghostBtn} ml-auto`} onClick={addGroup}>
                    <Plus size={14} />
                    {TEXT.addGroup(axis.groupLabel)}
                </button>
            </div>

            {groups.length === 0 && (
                <div className={THEME.empty}>
                    {axis.optionKey
                        ? TEXT.emptyTwo(axis.groupLabel, axis.optionLabel)
                        : TEXT.emptyOne(axis.groupLabel)}
                </div>
            )}

            {groups.map((group) => (
                <div key={group.id} className={THEME.groupCard}>
                    <div className={THEME.groupHead}>
                        <div className="flex-1">
                            <label className={THEME.label}>{TEXT.groupName(axis.groupLabel)}</label>
                            <input
                                className={THEME.input}
                                placeholder={axis.groupPlaceholder}
                                value={group.name}
                                onChange={(e) => updateGroup(group.id, { name: e.target.value })}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") e.preventDefault();
                                }}
                            />
                        </div>
                        <button type="button" className={THEME.dangerBtn} onClick={() => removeGroup(group.id)}>
                            <Trash2 size={16} />
                        </button>
                    </div>

                    {axis.optionKey && (
                        <div>
                            <label className={THEME.label}>
                                {TEXT.optionsFor(axis.optionLabel, axis.groupLabel, group.name.trim())}
                            </label>
                            <ChipInput
                                values={group.options}
                                onChange={(options) => updateGroup(group.id, { options })}
                                placeholder={TEXT.addOption(axis.optionLabel)}
                                suggestions={optionSuggestions}
                            />
                        </div>
                    )}
                </div>
            ))}

            {combos.length > 0 && (
                <div>
                    <div className="mb-3">
                        <p className="text-sm font-semibold text-[#1B2A26]">{TEXT.tableTitle}</p>
                        <p className={THEME.muted}>{TEXT.tableHint}</p>
                    </div>
                    <div className={THEME.tableWrap}>
                        <table className="w-full min-w-[720px]">
                            <thead>
                                <tr>
                                    <th className={THEME.th}>{TEXT.combo}</th>
                                    <th className={THEME.th}>{TEXT.price}</th>
                                    <th className={THEME.th}>{TEXT.discount}</th>
                                    <th className={THEME.th}>{TEXT.stock}</th>
                                    <th className={THEME.th}>{TEXT.sku}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {combos.map((combo) => {
                                    const saved = rows[combo.key] || {};
                                    return (
                                        <tr key={combo.key}>
                                            <td className={THEME.td}>{combo.label}</td>
                                            <td className={THEME.td}>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    className={THEME.tableInput}
                                                    value={saved.price ?? basePrice ?? ""}
                                                    onChange={(e) => updateRow(combo.key, "price", e.target.value)}
                                                />
                                            </td>
                                            <td className={THEME.td}>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    className={THEME.tableInput}
                                                    value={saved.discountPrice ?? ""}
                                                    onChange={(e) => updateRow(combo.key, "discountPrice", e.target.value)}
                                                />
                                            </td>
                                            <td className={THEME.td}>
                                                <input
                                                    type="number"
                                                    className={THEME.tableInput}
                                                    value={saved.stock ?? 0}
                                                    onChange={(e) => updateRow(combo.key, "stock", e.target.value)}
                                                />
                                            </td>
                                            <td className={THEME.td}>
                                                <input
                                                    className={THEME.tableInput}
                                                    value={saved.sku ?? ""}
                                                    onChange={(e) => updateRow(combo.key, "sku", e.target.value)}
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <p className={`mt-3 ${THEME.muted}`}>
                        {TEXT.totalStock}: <span className="font-semibold text-[#1B2A26]">{totalStock}</span>
                    </p>
                </div>
            )}
        </div>
    );
}
