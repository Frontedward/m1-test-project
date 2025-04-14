import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { ListItem } from './components';
import useData from './useData';
import useSort from './useSort';

const SubTitle: React.FC<{ children: React.ReactNode }> = React.memo(({children}) => (
    <h2 className="list-subtitle">Active Item ID: {children}</h2>
));

// Компонент для рендеринга отдельной строки списка
const Row = React.memo(({ index, style, data }: any) => {
    const { items, activeItemId, onItemClick } = data;
    const item = items[index];
    
    return (
        <div style={style}>
            <ListItem
                key={item.id}
                isactive={activeItemId === item.id}
                id={item.id}
                name={item.name}
                description={item.description}
                onClick={onItemClick}
            />
        </div>
    );
});

const ITEM_HEIGHT = 180; // Примерная высота каждой карточки
const ITEM_PADDING = 16; // Отступ между карточками

function ListPage() {
    const { items, loading, error, hasMore, loadMore } = useData();
    const [sortedItems, sortBy, handleSortClick] = useSort(items);
    
    const [activeItemId, setActiveItemId] = useState<number | null>(null);
    const [filteredItems, setFilteredItems] = useState<typeof items>([]);
    const [query, setQuery] = useState<string>('');
    
    const activeItemText = useMemo(() => 
        activeItemId !== null ? activeItemId.toString() : 'Empty', 
        [activeItemId]
    );
    
    const handleItemClick = useCallback((id: number) => {
        setActiveItemId(prevId => prevId === id ? null : id);
    }, []);
    
    const handleQueryChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value.trim());
    }, []);
    
    useEffect(() => {
        const newFilteredItems = query
            ? sortedItems.filter(item => 
                item.id.toString().includes(query.toLowerCase())
              )
            : sortedItems;
            
        setFilteredItems(newFilteredItems);
    }, [query, sortedItems]);

    // Мемоизируем данные для виртуализированного списка
    const listData = useMemo(() => ({
        items: filteredItems,
        activeItemId,
        onItemClick: handleItemClick
    }), [filteredItems, activeItemId, handleItemClick]);

    if (loading) {
        return (
            <div className="list-wrapper">
                <div className="list-header">
                    <h1 className="list-title">Loading...</h1>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="list-wrapper">
                <div className="list-header">
                    <h1 className="list-title">Error</h1>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="list-wrapper">
            <div className="list-header">
                <h1 className="list-title">Items List</h1>
                <SubTitle>{activeItemText}</SubTitle>
                <div className="controls">
                    <button onClick={handleSortClick}>
                        Sort ({sortBy})
                    </button>
                    <input 
                        type="text" 
                        placeholder="Filter by ID" 
                        value={query} 
                        onChange={handleQueryChange}
                        aria-label="Filter items by ID" 
                    />
                </div>
            </div>
            <div className="list-container">
                {filteredItems.length === 0 ? (
                    <span className="no-items">No items found</span>
                ) : (
                    <AutoSizer>
                        {({ height, width }: { height: number; width: number }) => (
                            <List
                                className="list"
                                height={height || 800}
                                itemCount={filteredItems.length}
                                itemSize={ITEM_HEIGHT + ITEM_PADDING}
                                width={width || 1200}
                                itemData={listData}
                            >
                                {Row}
                            </List>
                        )}
                    </AutoSizer>
                )}
            </div>
        </div>
    );
}

export default React.memo(ListPage);
