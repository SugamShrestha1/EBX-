import { create } from 'zustand';

interface Department {
    reference_id: string;
    code: string;
    name: string;
    description?: string;
    is_active: boolean;
    business_hours: Record<string, string[]>;
    created_at?: string;
    updated_at?: string;
}

interface DepartmentStore {
    departments: Department[];
    selectedDepartment: Department | null;
    isLoading: boolean;
    error: string | null;

    setDepartments: (departments: Department[]) => void;
    addDepartment: (department: Department) => void;
    updateDepartment: (reference_id: string, updates: Partial<Department>) => void;
    removeDepartment: (reference_id: string) => void;
    setSelectedDepartment: (department: Department | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    reset: () => void;
}

const initialState = {
    departments: [],
    selectedDepartment: null,
    isLoading: false,
    error: null,
};

export const useUsersStore = create<DepartmentStore>((set) => ({
    ...initialState,

    setDepartments: (departments) => set({ departments }),

    addDepartment: (department) =>
        set((state) => ({ departments: [...state.departments, department] })),

    updateDepartment: (reference_id, updates) =>
        set((state) => ({
            departments: state.departments.map((dept) =>
                dept.reference_id === reference_id ? { ...dept, ...updates } : dept
            ),
        })),

    removeDepartment: (reference_id) =>
        set((state) => ({
            departments: state.departments.filter((dept) => dept.reference_id !== reference_id),
        })),

    setSelectedDepartment: (department) => set({ selectedDepartment: department }),

    setLoading: (loading) => set({ isLoading: loading }),

    setError: (error) => set({ error }),

    reset: () => set(initialState),
}));