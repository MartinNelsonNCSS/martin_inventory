import { Inventory } from './inventory';
import { Slot } from './slot';

export enum InventoryView {
  CURRENT = 'current',
  BACKPACK = 'backpack',
  GROUND = 'ground'
}

export type State = {
  leftInventory: Inventory;
  rightInventory: Inventory;
  itemAmount: number;
  shiftPressed: boolean;
  isBusy: boolean;
  additionalMetadata: Array<{ metadata: string; value: string }>;
  // Inventory cycling state
  currentView: InventoryView;
  inventoryViews: {
    current: Inventory;
    backpack?: Inventory;
    ground?: Inventory;
  };
  history?: {
    leftInventory: Inventory;
    rightInventory: Inventory;
  };
};
