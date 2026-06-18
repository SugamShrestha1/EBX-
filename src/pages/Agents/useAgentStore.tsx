import { create } from 'zustand';

interface Agent {
    id?: string | number;
    reference_id?: string;
    name?: string;
    extension?: string;
    is_active?: boolean;
    user?: {
        first_name?: string;
        last_name?: string;
    };
    [key: string]: any; // Catch-all for other agent properties
}

interface AgentStore {
    agents: Agent[];
    selectedAgent: Agent | null;
    isLoading: boolean;
    error: string | null;

    setAgents: (agents: Agent[]) => void;
    addAgent: (agent: Agent) => void;
    updateAgent: (id: string | number, updates: Partial<Agent>) => void;
    removeAgent: (id: string | number) => void;
    setSelectedAgent: (agent: Agent | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    reset: () => void;
}

const initialState = {
    agents: [],
    selectedAgent: null,
    isLoading: false,
    error: null,
};

export const useAgentStore = create<AgentStore>((set) => ({
    ...initialState,

    setAgents: (agents) => set({ agents }),

    addAgent: (agent) =>
        set((state) => ({ agents: [...state.agents, agent] })),

    updateAgent: (id, updates) =>
        set((state) => ({
            agents: state.agents.map((agent) =>
                (agent.id === id || agent.reference_id === id) ? { ...agent, ...updates } : agent
            ),
        })),

    removeAgent: (id) =>
        set((state) => ({
            agents: state.agents.filter((agent) => agent.id !== id && agent.reference_id !== id),
        })),

    setSelectedAgent: (selectedAgent) => set({ selectedAgent }),

    setLoading: (isLoading) => set({ isLoading }),

    setError: (error) => set({ error }),

    reset: () => set(initialState),
}));