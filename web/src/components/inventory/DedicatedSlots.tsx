import React, { useMemo, useEffect } from 'react';
import InventorySlot from './InventorySlot';
import { InventoryType, Slot } from '../../typings';
import { useAppSelector } from '../../store';
import { selectLeftInventory } from '../../store/inventory';
import { DedicatedSlotType } from '../../typings/item';
import { isItemAllowedInSlot } from '../../helpers';
import { Items } from '../../store/items';

interface DedicatedSlotConfig {
  slotIndex: number; // Actual slot number in inventory (1-based)
  type: DedicatedSlotType;
  label: string;
  keybind?: string; // Display keybind hint
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
    transform?: string;
  };
}

const DedicatedSlots: React.FC = () => {
  const leftInventory = useAppSelector(selectLeftInventory);

  // Define which inventory slots are used for dedicated equipment
  // These should be the last slots in the player's inventory
  // Adjust these slot numbers based on your server configuration
  const dedicatedSlotConfigs: DedicatedSlotConfig[] = useMemo(() => {
    const totalSlots = leftInventory.slots;
    
    // Use the last 8 slots for dedicated equipment
    // This assumes player has at least 8 slots in their inventory
    return [
      // Top row - around head area
      { 
        slotIndex: totalSlots - 7, // slot for backpack
        type: 'backpack', 
        label: 'Backpack',
        keybind: 'F2',
        position: { top: '20px', left: '0px' }
      },
      { 
        slotIndex: totalSlots - 6, // slot for plate
        type: 'plate', 
        label: 'Armor Plate',
        keybind: 'F3', 
        position: { top: '20px', right: '0px' }
      },
      
      // Mid-upper row - around chest/shoulders
      { 
        slotIndex: totalSlots - 5, // slot for vest
        type: 'vest', 
        label: 'Heavy Bulletproof Vest',
        keybind: 'F4',
        position: { top: '100px', left: '0px' }
      },
      { 
        slotIndex: totalSlots - 4, // slot for secondary weapon
        type: 'weapon-secondary', 
        label: 'Secondary Weapon',
        keybind: 'F5',
        position: { top: '100px', right: '0px' }
      },
      
      // Lower row - around waist/legs  
      { 
        slotIndex: totalSlots - 3, // slot for phone
        type: 'phone', 
        label: 'Phone',
        keybind: 'F6',
        position: { top: '200px', left: '0px' }
      },
      { 
        slotIndex: totalSlots - 2, // slot for primary weapon
        type: 'weapon-primary', 
        label: 'Primary Weapon',
        keybind: 'F7',
        position: { top: '200px', right: '0px' }
      },
      
      // Bottom row - around feet/lower body
      { 
        slotIndex: totalSlots - 1, // slot for melee weapon
        type: 'weapon-melee', 
        label: 'Melee Weapon',
        keybind: 'F8',
        position: { top: '280px', left: '0px'}
      },
      
      { 
        slotIndex: totalSlots, // last slot for wallet
        type: 'wallet', 
        label: 'Wallet',
        keybind: 'F9',
        position: { top: '280px', right: '0px' }
      },
    ];
  }, [leftInventory.slots]);

  // Validate that items in dedicated slots are whitelisted
  const validateSlotItem = (slot: Slot, slotType: DedicatedSlotType): boolean => {
    if (!slot.name) return true; // Empty slots are always valid
    return isItemAllowedInSlot(slot.name, slotType);
  };

  return (
    <div className="dedicated-slots-container">
      {/* Human silhouette background */}
      <div className="human-silhouette">
        
      </div>
      {/* Equipment slots positioned anatomically around the silhouette */}
        {dedicatedSlotConfigs.map((config) => {
          // Get the actual slot from the inventory
          const actualSlot = leftInventory.items[config.slotIndex - 1];
          
          // If slot doesn't exist (inventory not loaded yet), create empty slot
          const slot: Slot = actualSlot || {
            slot: config.slotIndex,
            name: undefined,
            count: undefined,
            weight: 0,
          };

          // Check if item is valid for this slot
          const isValid = validateSlotItem(slot, config.type);

          return (
            <div 
              key={config.slotIndex}
              className={`equipment-slot-positioned equipment-${config.type} ${!isValid ? 'invalid-item' : ''}`}
              style={config.position}
              title={`${config.label}${config.keybind ? ` (${config.keybind})` : ''}`}
            >
              <InventorySlot
                item={slot}
                inventoryType={InventoryType.PLAYER}
                inventoryGroups={leftInventory.groups || {}}
                inventoryId={leftInventory.id || "player"}
              />
              {config.keybind && (
                <div className="slot-keybind-hint">{config.keybind}</div>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default DedicatedSlots;
