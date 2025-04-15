import { create } from "zustand"

const useInsightStore = create((set) => ({
	insights: [],
	loading: false,
	error: null,
	setInsights: (insights) => set({ insights }),
	setLoading: (loading) => set({ loading }),
	setError: (error) => set({ error }),
}))

// Atomic selectors
export const useInsights = () => useInsightStore((state) => state.insights)
export const useInsightLoading = () => useInsightStore((state) => state.loading)
export const useInsightError = () => useInsightStore((state) => state.error)
export const useInsightActions = () =>
	useInsightStore((state) => ({
		setInsights: state.setInsights,
		setLoading: state.setLoading,
		setError: state.setError,
	}))
