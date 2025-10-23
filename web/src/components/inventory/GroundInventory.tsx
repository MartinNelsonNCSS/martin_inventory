import React from 'react';
import { useAppSelector } from '../../store';
import { selectInventoryViews } from '../../store/inventory';
import GenericInventoryContainer from './shared/GenericInventoryContainer';
import { INVENTORY_CONTAINER_CONFIGS } from './shared/inventoryUtils';

const GroundInventory: React.FC = () => {
  const inventoryViews = useAppSelector(selectInventoryViews);
  const groundInventory = inventoryViews.ground;

  return (
    <GenericInventoryContainer
      inventory={groundInventory}
      config={INVENTORY_CONTAINER_CONFIGS.ground}
    />
  );
};

export default GroundInventory;
