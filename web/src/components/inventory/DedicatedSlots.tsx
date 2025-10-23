import React from 'react';
import InventorySlot from './InventorySlot';
import { InventoryType, Slot } from '../../typings';

interface DedicatedSlotData {
  slot: number;
  type: string;
  name: string;
  isEmpty: boolean;
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
    transform?: string;
  };
}

const DedicatedSlots: React.FC = () => {
  // Create dedicated slot configurations matching reference image layout
  const dedicatedSlots: DedicatedSlotData[] = [
    // Top row - around head area
    { 
      slot: -6, 
      type: 'backpack', 
      name: 'Backpack', 
      isEmpty: true,
      position: { top: '20px', left: '0px' } // Brought closer from -70px
    },
    { 
      slot: -1, 
      type: 'money', 
      name: 'Money', 
      isEmpty: true,
      position: { top: '20px', right: '0px' } // Brought closer from -70px
    },
    
    // Mid-upper row - around chest/shoulders
    { 
      slot: -4, 
      type: 'vest', 
      name: 'Heavy Bulletproof Vest', 
      isEmpty: true,
      position: { top: '100px', left: '0px' } // Brought closer from -70px
    },
    { 
      slot: -2, 
      type: 'weapon-secondary', 
      name: 'Secondary Weapon', 
      isEmpty: true,
      position: { top: '100px', right: '0px' } // Brought closer from -70px
    },
    
    // Lower row - around waist/legs  
    { 
      slot: -7, 
      type: 'phone', 
      name: 'Phone', 
      isEmpty: true,
      position: { top: '200px', left: '0px' } // Brought closer from -70px
    },
    { 
      slot: -1, 
      type: 'weapon-primary', 
      name: 'Primary Weapon', 
      isEmpty: true,
      position: { top: '200px', right: '0px' } // Brought closer from -70px
    },
    
    // Bottom row - around feet/lower body
    { 
      slot: -3, 
      type: 'weapon-melee', 
      name: 'Melee Weapon', 
      isEmpty: true,
      position: { top: '280px', left: '0px'} // Brought closer from -70px
    },
    
    { 
      slot: -8, 
      type: 'wallet', 
      name: 'Wallet', 
      isEmpty: true,
      position: { top: '280px', right: '0px' } // Brought closer from -70px
    },
  ];

  // Convert dedicated slot data to inventory slot format
  const createSlotItem = (slotData: DedicatedSlotData): Slot => ({
    slot: slotData.slot,
    name: slotData.isEmpty ? undefined : slotData.name,
    count: slotData.isEmpty ? undefined : 1,
    weight: 0,
    metadata: slotData.isEmpty ? undefined : { dedicatedSlot: slotData.type },
  });

  return (
    <div className="dedicated-slots-container">
      {/* Human silhouette background */}
      <div className="human-silhouette">
        
      </div>
      {/* Equipment slots positioned anatomically around the silhouette */}
        {dedicatedSlots.map((slotData, index) => (
          <div 
            key={slotData.slot}
            className={`equipment-slot-positioned equipment-${slotData.type}`}
            style={slotData.position}
          >
            <InventorySlot
              item={createSlotItem(slotData)}
              inventoryType={InventoryType.PLAYER}
              inventoryGroups={{}}
              inventoryId="player"
            />
          </div>
        ))}
    </div>
  );
};

export default DedicatedSlots;
