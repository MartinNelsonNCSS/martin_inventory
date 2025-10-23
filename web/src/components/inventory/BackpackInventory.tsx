import React from 'react';
import InventoryGrid from './InventoryGrid';
import { useAppSelector } from '../../store';
import { selectInventoryViews } from '../../store/inventory';

const BackpackInventory: React.FC = () => {
  const inventoryViews = useAppSelector(selectInventoryViews);
  const backpackInventory = inventoryViews.backpack;

  if (!backpackInventory) return null;

  return (
    <div className="backpack-inventory-container">
      <div className="inventory-label">Backpack</div>
      <InventoryGrid inventory={backpackInventory} />
    </div>
  );
};

export default BackpackInventory;
