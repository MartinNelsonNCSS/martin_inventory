import React, { useCallback } from 'react';
import { useDrop } from 'react-dnd';
import { DragSource, InventoryType, SlotWithItem } from '../../typings';
import { useAppSelector } from '../../store';
import { isSlotWithItem, getItemUrl } from '../../helpers';
import { getRarityForItem, getRarityClassName } from '../../utils/rarity';

interface DedicatedSlotProps {
  slotType: string;
  label: string;
  acceptedItems: string[];
  slotNumber: number;
  currentItem?: SlotWithItem;
}

const DedicatedSlot: React.FC<DedicatedSlotProps> = ({
  slotType,
  label,
  acceptedItems,
  slotNumber,
  currentItem
}) => {
  const inventory = useAppSelector((state) => state.inventory.leftInventory);
  
  // Find the item in this dedicated slot based on slot type
  const item = currentItem || inventory.items.find(item => 
    isSlotWithItem(item) && 
    item.metadata?.dedicatedSlot === slotType
  ) as SlotWithItem | undefined;

  const canAcceptItem = useCallback((draggedItem: DragSource) => {
    // Check if the dragged item is accepted by this slot type
    if (!draggedItem.item?.name) return false;
    
    // For now, simple item type checking
    // This can be expanded with more sophisticated logic
    return acceptedItems.some(type => {
      switch(type) {
        case 'weapon':
          return draggedItem.item.name?.includes('weapon') || 
                 draggedItem.item.name?.includes('pistol') ||
                 draggedItem.item.name?.includes('rifle');
        case 'wallet':
          return draggedItem.item.name === 'wallet';
        case 'backpack':
          return draggedItem.item.name?.includes('backpack');
        case 'plate_carrier':
          return draggedItem.item.name?.includes('plate_carrier');
        case 'plate':
          return draggedItem.item.name?.includes('plate') && 
                 !draggedItem.item.name?.includes('carrier');
        default:
          return false;
      }
    });
  }, [acceptedItems]);

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

  const rarityClass = item && isSlotWithItem(item) ? getRarityClassName(getRarityForItem(item)) : '';
  const hasItem = item && isSlotWithItem(item);

  return (
    <div
      ref={drop}
      className={`dedicated-slot ${slotType} ${rarityClass} ${hasItem ? 'has-item' : ''} ${isOver && canDrop ? 'drop-valid' : ''} ${isOver && !canDrop ? 'drop-invalid' : ''}`}
      style={{
        backgroundImage: hasItem ? `url(${getItemUrl(item)})` : 'none',
      }}
    >
      {/* New placeholder structure with emoji and label */}
      {!hasItem && (
        <div className="dedicated-slot-placeholder">
          <div className="slot-emoji">{getSlotIcon(slotType)}</div>
          <div className="slot-label">{label.toUpperCase()}</div>
        </div>
      )}
      
      {hasItem && (
        <div className="dedicated-slot-info">
          {item.count && item.count > 1 && (
            <div className="item-count">{item.count}</div>
          )}
          {item.durability !== undefined && item.durability < 100 && (
            <div 
              className="durability-bar" 
              style={{ '--durability': `${item.durability}%` } as React.CSSProperties}
            />
          )}
        </div>
      )}
    </div>
  );
};

const getSlotIcon = (slotType: string): string => {
  const icons: Record<string, string> = {
    'weapon-primary': '🔫',
    'weapon-secondary': '🔫',
    'weapon-melee': '🗡️',
    'wallet': '�',
    'backpack': '🎒',
    'plate_carrier': '🦺',
    'plate': '🛡️',
  };
  
  return icons[slotType] || '📦';
};

export default DedicatedSlot;
