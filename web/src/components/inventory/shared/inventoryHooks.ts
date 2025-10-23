/**
 * Custom hooks for inventory components
 */

import { useCallback } from 'react';
import { useDrop } from 'react-dnd';
import { DragSource, SlotWithItem } from '../../../typings';
import { useAppSelector } from '../../../store';
import { canAcceptItemInSlot, findItemBySlotType } from './inventoryUtils';

/**
 * Hook for managing dedicated slot behavior
 */
export const useDedicatedSlot = (slotType: string, acceptedItems: string[]) => {
  const inventory = useAppSelector((state) => state.inventory.leftInventory);
  
  // Find the current item in this slot
  const currentItem = findItemBySlotType(inventory.items, slotType);
  
  // Item acceptance logic
  const canAcceptItem = useCallback((draggedItem: DragSource) => {
    return canAcceptItemInSlot(draggedItem, acceptedItems);
  }, [acceptedItems]);

  // Drop functionality
  const [{ isOver, canDrop }, drop] = useDrop<DragSource, void, { isOver: boolean; canDrop: boolean }>(() => ({
    accept: 'SLOT',
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
    canDrop: (draggedItem) => canAcceptItem(draggedItem),
    drop: (draggedItem) => {
      // TODO: Implement dedicated slot drop logic
      console.log(`Dropped ${draggedItem.item.name} in ${slotType}`);
    },
  }), [slotType, canAcceptItem]);

  return {
    currentItem,
    isOver,
    canDrop,
    drop,
    canAcceptItem
  };
};

/**
 * Hook for inventory container behavior
 */
export const useInventoryContainer = (inventorySelector: (state: any) => any, showWhenEmpty = true) => {
  const inventory = useAppSelector(inventorySelector);
  
  const shouldShow = showWhenEmpty || (inventory && inventory.items && inventory.items.length > 0);
  
  return {
    inventory,
    shouldShow
  };
};
