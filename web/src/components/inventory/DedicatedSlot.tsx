import React from 'react';
import { SlotWithItem } from '../../typings';
import { useDedicatedSlot } from './shared/inventoryHooks';
import { 
  SLOT_CONFIGURATIONS, 
  getSlotClasses, 
  getItemBackground, 
  getSlotInfo 
} from './shared/inventoryUtils';
import { isSlotWithItem } from '../../helpers';

interface DedicatedSlotProps {
  slotType: string;
  slotNumber?: number;
  currentItem?: SlotWithItem;
}

const DedicatedSlot: React.FC<DedicatedSlotProps> = ({
  slotType,
  currentItem
}) => {
  // Get slot configuration
  const config = SLOT_CONFIGURATIONS[slotType];
  if (!config) {
    console.warn(`No configuration found for slot type: ${slotType}`);
    return null;
  }

  // Use shared dedicated slot logic
  const { currentItem: foundItem, isOver, canDrop, drop } = useDedicatedSlot(
    slotType, 
    config.acceptedItems
  );

  // Use provided item or found item
  const item = currentItem || foundItem;
  const hasItem = item && isSlotWithItem(item);
  const slotInfo = getSlotInfo(item);

  return (
    <div
      ref={drop}
      className={getSlotClasses(item, slotType, isOver, canDrop)}
      style={{
        backgroundImage: getItemBackground(item),
      }}
    >
      {/* Placeholder when no item */}
      {!hasItem && (
        <div className="dedicated-slot-placeholder">
          <div className="slot-emoji">{config.icon}</div>
          <div className="slot-label">{config.label.toUpperCase()}</div>
        </div>
      )}
      
      {/* Item info when item exists */}
      {hasItem && slotInfo && (
        <div className="dedicated-slot-info">
          {slotInfo.hasCount && (
            <div className="item-count">{slotInfo.count}</div>
          )}
          {slotInfo.hasDurability && (
            <div 
              className="durability-bar" 
              style={{ '--durability': `${slotInfo.durability}%` } as React.CSSProperties}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default DedicatedSlot;
