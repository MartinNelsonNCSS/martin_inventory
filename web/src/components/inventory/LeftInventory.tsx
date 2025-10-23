import React from 'react';
import InventoryGrid from './InventoryGrid';
import DedicatedSlots from './DedicatedSlots';
import InventoryTabs from './InventoryTabs';
import GroundInventory from './GroundInventory';
import BackpackInventory from './BackpackInventory';
import { useAppSelector } from '../../store';
import { selectLeftInventory } from '../../store/inventory';

const LeftInventory: React.FC = () => {
  const leftInventory = useAppSelector(selectLeftInventory);

  return (
    <>
      {/* Primary Inventory */}
      <div className="primary-inventory-container">
        <div className="inventory-label">Primary Inventory</div>
        <InventoryGrid inventory={leftInventory} />
      </div>
      
      {/* Ground Inventory */}
      <GroundInventory />
      
      {/* Backpack Inventory */}
      <BackpackInventory />
    </>
  );
};

export default LeftInventory;
