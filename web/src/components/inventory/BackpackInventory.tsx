import React from 'react';
import { useAppSelector } from '../../store';
import { selectInventoryViews } from '../../store/inventory';
import GenericInventoryContainer from './shared/GenericInventoryContainer';
import { INVENTORY_CONTAINER_CONFIGS } from './shared/inventoryUtils';

const BackpackInventory: React.FC = () => {
  const inventoryViews = useAppSelector(selectInventoryViews);
  const backpackInventory = inventoryViews.backpack;

  return (
    <GenericInventoryContainer
      inventory={backpackInventory}
      config={INVENTORY_CONTAINER_CONFIGS.backpack}
    />
  );
};

export default BackpackInventory;
