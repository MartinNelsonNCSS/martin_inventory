import React from 'react';
import InventoryGrid from './InventoryGrid';
import { useAppSelector } from '../../store';
import { selectInventoryViews } from '../../store/inventory';

const GroundInventory: React.FC = () => {
  const inventoryViews = useAppSelector(selectInventoryViews);
  const groundInventory = inventoryViews.ground;

  if (!groundInventory) return null;

  return (
    <div className="ground-inventory-container">
      <div className="inventory-label">Ground</div>
      <InventoryGrid inventory={groundInventory} />
    </div>
  );
};

export default GroundInventory;
