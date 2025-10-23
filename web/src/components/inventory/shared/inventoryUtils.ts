/**
 * Shared utility functions for inventory components
 */

import { SlotWithItem, DragSource, InventoryType } from '../../../typings';
import { isSlotWithItem, getItemUrl } from '../../../helpers';
import { getRarityForItem, getRarityClassName } from '../../../utils/rarity';

// Slot type definitions and configurations
export interface SlotConfig {
  slotType: string;
  label: string;
  acceptedItems: string[];
  icon: string;
  description?: string;
}

export const SLOT_CONFIGURATIONS: Record<string, SlotConfig> = {
  'weapon-primary': {
    slotType: 'weapon-primary',
    label: 'Primary',
    acceptedItems: ['weapon'],
    icon: '🔫',
    description: 'Primary weapon slot'
  },
  'weapon-secondary': {
    slotType: 'weapon-secondary',
    label: 'Secondary', 
    acceptedItems: ['weapon'],
    icon: '🔫',
    description: 'Secondary weapon slot'
  },
  'weapon-melee': {
    slotType: 'weapon-melee',
    label: 'Melee',
    acceptedItems: ['weapon'],
    icon: '🗡️',
    description: 'Melee weapon slot'
  },
  'wallet': {
    slotType: 'wallet',
    label: 'Wallet',
    acceptedItems: ['wallet'],
    icon: '💳',
    description: 'Wallet slot'
  },
  'backpack': {
    slotType: 'backpack',
    label: 'Backpack',
    acceptedItems: ['backpack'],
    icon: '🎒',
    description: 'Backpack slot'
  },
  'plate_carrier': {
    slotType: 'plate_carrier',
    label: 'Plate Carrier',
    acceptedItems: ['plate_carrier'],
    icon: '🦺',
    description: 'Plate carrier armor slot'
  },
  'plate': {
    slotType: 'plate',
    label: 'Armor Plate',
    acceptedItems: ['plate'],
    icon: '🛡️',
    description: 'Armor plate slot'
  }
};

/**
 * Check if a dragged item can be accepted by a dedicated slot
 */
export const canAcceptItemInSlot = (draggedItem: DragSource, acceptedItems: string[]): boolean => {
  if (!draggedItem.item?.name) return false;
  
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
};

/**
 * Find item in inventory by dedicated slot type
 */
export const findItemBySlotType = (items: any[], slotType: string): SlotWithItem | undefined => {
  return items.find(item => 
    isSlotWithItem(item) && 
    item.metadata?.dedicatedSlot === slotType
  ) as SlotWithItem | undefined;
};

/**
 * Get slot styling classes for an item
 */
export const getSlotClasses = (
  item: SlotWithItem | undefined, 
  slotType: string, 
  isOver: boolean, 
  canDrop: boolean
): string => {
  const classes = [`dedicated-slot`, slotType];
  
  if (item && isSlotWithItem(item)) {
    classes.push('has-item');
    const rarityClass = getRarityClassName(getRarityForItem(item));
    if (rarityClass) classes.push(rarityClass);
  }
  
  if (isOver && canDrop) classes.push('drop-valid');
  if (isOver && !canDrop) classes.push('drop-invalid');
  
  return classes.join(' ');
};

/**
 * Get item background image URL or none
 */
export const getItemBackground = (item: SlotWithItem | undefined): string => {
  return item && isSlotWithItem(item) ? `url(${getItemUrl(item)})` : 'none';
};

/**
 * Create slot info display data
 */
export const getSlotInfo = (item: SlotWithItem | undefined) => {
  if (!item || !isSlotWithItem(item)) return null;
  
  return {
    hasCount: item.count && item.count > 1,
    count: item.count,
    hasDurability: item.durability !== undefined && item.durability < 100,
    durability: item.durability
  };
};

/**
 * Inventory container configuration
 */
export interface InventoryContainerConfig {
  containerClass: string;
  labelText: string;
  showWhenEmpty?: boolean;
}

export const INVENTORY_CONTAINER_CONFIGS: Record<string, InventoryContainerConfig> = {
  ground: {
    containerClass: 'ground-inventory-container',
    labelText: 'Ground',
    showWhenEmpty: false
  },
  backpack: {
    containerClass: 'backpack-inventory-container', 
    labelText: 'Backpack',
    showWhenEmpty: false
  },
  primary: {
    containerClass: 'primary-inventory-container',
    labelText: 'Primary Inventory',
    showWhenEmpty: true
  },
  right: {
    containerClass: 'right-inventory-container',
    labelText: 'Secondary Inventory',
    showWhenEmpty: true
  }
};
