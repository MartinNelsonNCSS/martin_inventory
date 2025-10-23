import React from 'react';
import GenericInventoryContainer from './shared/GenericInventoryContainer';
import { useAppSelector } from '../../store';
import { selectLeftInventory } from '../../store/inventory';
import { INVENTORY_CONTAINER_CONFIGS } from './shared/inventoryUtils';

const LeftInventory: React.FC = () => {
  const leftInventory = useAppSelector(selectLeftInventory);

  return (
    <GenericInventoryContainer
      inventory={leftInventory}
      config={INVENTORY_CONTAINER_CONFIGS.primary}
    />
  );
};

export default LeftInventory;
