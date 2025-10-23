import React from 'react';
import GroundInventory from './GroundInventory';
import BackpackInventory from './BackpackInventory';
import GenericInventoryContainer from './shared/GenericInventoryContainer';
import { useAppSelector } from '../../store';
import { selectLeftInventory } from '../../store/inventory';
import { INVENTORY_CONTAINER_CONFIGS } from './shared/inventoryUtils';

const LeftInventory: React.FC = () => {
  const leftInventory = useAppSelector(selectLeftInventory);

  return (
    <>
      {/* Primary Inventory */}
      <GenericInventoryContainer
        inventory={leftInventory}
        config={INVENTORY_CONTAINER_CONFIGS.primary}
      />
      
      {/* Ground Inventory */}
      <GroundInventory />
      
      {/* Backpack Inventory */}
      <BackpackInventory />
    </>
  );
};

export default LeftInventory;
