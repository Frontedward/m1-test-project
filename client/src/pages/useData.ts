import { useState, useEffect, useCallback } from 'react';

interface Item {
	id: number;
	name: string;
	description: string;
}

export default function useData() {
	const [items, setItems] = useState<Item[]>([]);
	const [isFirstLoading, setIsFirstLoading] = useState(true);
	const [isUpdating, setIsUpdating] = useState(false);
	const [error, setError] = useState<string | null>(null);
	
	const fetchItems = useCallback(async (isInitial: boolean = false) => {
		try {
			if (isInitial) {
				setIsFirstLoading(true);
			} else {
				setIsUpdating(true);
			}
			setError(null);
			
			const response = await fetch('http://localhost:3100/items');
			if (!response.ok) {
				throw new Error('Failed to fetch data');
			}
			const data = await response.json();
			setItems(data);
		} catch (err) {
			console.error('Failed to fetch items:', err);
			setError(err instanceof Error ? err.message : 'An error occurred');
		} finally {
			setIsFirstLoading(false);
			setIsUpdating(false);
		}
	}, []);
	
	useEffect(() => {
		fetchItems(true); // Первичная загрузка
		const intervalId = setInterval(() => fetchItems(false), 10000); // Обновления
		return () => clearInterval(intervalId);
	}, [fetchItems]);

	return { 
		items, 
		loading: isFirstLoading, // Для обратной совместимости используем только флаг первичной загрузки
		error,
		hasMore: false,
		loadMore: () => {} 
	};
}
