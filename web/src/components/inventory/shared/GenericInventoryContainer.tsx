/**
 * Generic inventory container component to reduce duplication
 */

import React from 'react';
import InventoryGrid from '../InventoryGrid';
import { Inventory } from '../../../typings';
import { InventoryContainerConfig } from './inventoryUtils';

interface GenericInventoryContainerProps {
  inventory: Inventory | null | undefined;
  config: InventoryContainerConfig;
  children?: React.ReactNode;
}

const GenericInventoryContainer: React.FC<GenericInventoryContainerProps> = ({
  inventory,
  config,
  children
}) => {
  // Don't render if inventory is null/empty and showWhenEmpty is false
  if (!inventory && !config.showWhenEmpty) {
    return null;
  }
  
  // Don't render if inventory has no items and showWhenEmpty is false
  if (inventory && !inventory.items?.length && !config.showWhenEmpty) {
    return null;
  }

  return (
    <div className={config.containerClass}>
      <div className="inventory-label">{config.labelText}</div>
      {inventory && <InventoryGrid inventory={inventory} />}
      {children}
    </div>
  );
};

export default GenericInventoryContainer;
