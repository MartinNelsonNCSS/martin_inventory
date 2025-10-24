import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Inventory } from '../../typings';
import WeightBar from '../utils/WeightBar';
import InventorySlot from './InventorySlot';
import { getTotalWeight, isDedicatedSlot } from '../../helpers';
import { useAppSelector } from '../../store';
import { useIntersection } from '../../hooks/useIntersection';

const PAGE_SIZE = 30;

const InventoryGrid: React.FC<{ inventory: Inventory }> = ({ inventory }) => {
  const weight = useMemo(
    () => (inventory.maxWeight !== undefined ? Math.floor(getTotalWeight(inventory.items) * 1000) / 1000 : 0),
    [inventory.maxWeight, inventory.items]
  );
  const [page, setPage] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { ref, entry } = useIntersection({ threshold: 0.5 });
  const isBusy = useAppSelector((state) => state.inventory.isBusy);

  // Filter out dedicated equipment slots from main inventory display
  const filteredItems = useMemo(() => {
    // Only filter for player inventory type
    if (inventory.type !== 'player') {
      return inventory.items;
    }
    
    return inventory.items.filter((item) => {
      return !isDedicatedSlot(item.slot, inventory.slots);
    });
  }, [inventory.items, inventory.type, inventory.slots]);

  // Dynamic slot sizing based on container width
  useEffect(() => {
    const updateSlotSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const padding = 16; // 8px on each side
        const gap = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--grid-slot-gap')) || 2;
        const totalGapWidth = gap * 4; // 4 gaps between 5 columns
        const availableWidth = containerWidth - padding - totalGapWidth;
        const slotSize = Math.max(45, Math.floor(availableWidth / 5)); // Minimum 45px, divide by 5 columns
        
        // Update CSS custom property for this container's slots
        containerRef.current.style.setProperty('--dynamic-slot-size', `${slotSize}px`);
      }
    };

    // Use ResizeObserver for more accurate container size changes
    const resizeObserver = new ResizeObserver(() => {
      updateSlotSize();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
      updateSlotSize(); // Initial calculation
    }
    
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (entry && entry.isIntersecting) {
      setPage((prev) => ++prev);
    }
  }, [entry]);
  return (
    <>
      <div className="inventory-grid-wrapper" style={{ pointerEvents: isBusy ? 'none' : 'auto' }}>
        <div>
          <div className="inventory-grid-header-wrapper">
            <p>{inventory.label}</p>
            {inventory.maxWeight && (
              <p>
                {weight / 1000}/{inventory.maxWeight / 1000}kg
              </p>
            )}
          </div>
          <WeightBar percent={inventory.maxWeight ? (weight / inventory.maxWeight) * 100 : 0} />
        </div>
        <div className="inventory-grid-container" ref={containerRef}>
          <>
            {filteredItems.slice(0, (page + 1) * PAGE_SIZE).map((item, index) => (
              <InventorySlot
                key={`${inventory.type}-${inventory.id}-${item.slot}`}
                item={item}
                ref={index === (page + 1) * PAGE_SIZE - 1 ? ref : null}
                inventoryType={inventory.type}
                inventoryGroups={inventory.groups}
                inventoryId={inventory.id}
              />
            ))}
          </>
        </div>
      </div>
    </>
  );
};

export default InventoryGrid;
