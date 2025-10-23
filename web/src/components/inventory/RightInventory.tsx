import React from 'react';
import GenericInventoryContainer from './shared/GenericInventoryContainer';
import { useAppSelector } from '../../store';
import { selectRightInventory } from '../../store/inventory';
import { INVENTORY_CONTAINER_CONFIGS } from './shared/inventoryUtils';

const RightInventory: React.FC = () => {
  const rightInventory = useAppSelector(selectRightInventory);

  return (
    <GenericInventoryContainer
      inventory={rightInventory}
      config={INVENTORY_CONTAINER_CONFIGS.right}
    />
  );
};

export default RightInventory;
