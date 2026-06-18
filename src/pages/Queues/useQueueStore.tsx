import { create } from 'zustand';

export interface Queue {
    id?: string | number;
    reference_id?: string;
    queue_name?: string;
    queue_description?: string;
    queue_number?: string;
    strategy?: string;
    max_wait_time?: number;
    max_size?: number;
    member_count?: number;
    is_active?: boolean;
    [key: string]: any; // Catch-all for other queue properties
}

interface QueueStore {
    queues: Queue[];
    selectedQueue: Queue | null;
    isLoading: boolean;
    error: string | null;

    setQueues: (queues: Queue[]) => void;
    addQueue: (queue: Queue) => void;
    updateQueue: (id: string | number, updates: Partial<Queue>) => void;
    removeQueue: (id: string | number) => void;
    setSelectedQueue: (queue: Queue | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    reset: () => void;
}

const initialState = {
    queues: [],
    selectedQueue: null,
    isLoading: false,
    error: null,
};

export const useQueueStore = create<QueueStore>((set) => ({
    ...initialState,

    setQueues: (queues) => set({ queues }),

    addQueue: (queue) =>
        set((state) => ({ queues: [...state.queues, queue] })),

    updateQueue: (id, updates) =>
        set((state) => ({
            queues: state.queues.map((queue) =>
                (queue.id === id || queue.reference_id === id) ? { ...queue, ...updates } : queue
            ),
        })),

    removeQueue: (id) =>
        set((state) => ({
            queues: state.queues.filter((queue) => queue.id !== id && queue.reference_id !== id),
        })),

    setSelectedQueue: (selectedQueue) => set({ selectedQueue }),

    setLoading: (isLoading) => set({ isLoading }),

    setError: (error) => set({ error }),

    reset: () => set(initialState),
}));
