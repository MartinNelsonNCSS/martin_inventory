import React, { useState } from 'react';
import useNuiEvent from '../../hooks/useNuiEvent';
import InventoryControl from './InventoryControl';
import InventoryHotbar from './InventoryHotbar';
import DedicatedSlots from './DedicatedSlots';
import { useAppDispatch } from '../../store';
import { refreshSlots, setAdditionalMetadata, setupInventory } from '../../store/inventory';
import { useExitListener } from '../../hooks/useExitListener';
import type { Inventory as InventoryProps } from '../../typings';
import RightInventory from './RightInventory';
import LeftInventory from './LeftInventory';
import Tooltip from '../utils/Tooltip';
import { closeTooltip } from '../../store/tooltip';
import InventoryContext from './InventoryContext';
import { closeContextMenu } from '../../store/contextMenu';
import Fade from '../utils/transitions/Fade';
import BackpackInventory from './BackpackInventory';

const Inventory: React.FC = () => {
  const [inventoryVisible, setInventoryVisible] = useState(false);
  const dispatch = useAppDispatch();

  useNuiEvent<boolean>('setInventoryVisible', setInventoryVisible);
  useNuiEvent<false>('closeInventory', () => {
    setInventoryVisible(false);
    dispatch(closeContextMenu());
    dispatch(closeTooltip());
  });
  useExitListener(setInventoryVisible);

  useNuiEvent<{
    leftInventory?: InventoryProps;
    rightInventory?: InventoryProps;
  }>('setupInventory', (data) => {
    dispatch(setupInventory(data));
    !inventoryVisible && setInventoryVisible(true);
  });

  useNuiEvent('refreshSlots', (data) => dispatch(refreshSlots(data)));

  useNuiEvent('displayMetadata', (data: Array<{ metadata: string; value: string }>) => {
    dispatch(setAdditionalMetadata(data));
  });

  return (
    <>
      <Fade in={inventoryVisible}>
        <div className="tarkov-inventory-wrapper">
          {/* Left Panel - Character & Equipment */}
          <div className="tarkov-left-panel">
            <div className="character-section">
              <div className="character-model">
                {/* Character silhouette placeholder */}
                <div className="character-silhouette">
                  <div className="character-avatar">👤</div>
                </div>
              </div>
              
              {/* Character stats */}
              <div className="character-stats">
                <div className="stat-bar health">
                  <span>Health</span>
                  <div className="bar"><div className="fill" style={{width: '100%'}}></div></div>
                </div>
                <div className="stat-bar energy">
                  <span>Armour</span>
                  <div className="bar"><div className="fill" style={{width: '75%'}}></div></div>
                </div>
                <div className="stat-bar hydration">
                  <span>Hydration</span>
                  <div className="bar"><div className="fill" style={{width: '60%'}}></div></div>
                </div>
                <div className="stat-bar hydration">
                  <span>Food</span>
                  <div className="bar"><div className="fill" style={{width: '90%'}}></div></div>
                </div>
              </div>
              {/* Action buttons */}
            <div className="action-panel">
              <InventoryControl />
            </div>
            </div>
          </div>
          
          {/* Center Panel - Main Inventory */}
          <div className="tarkov-center-panel">
            <div className="inventory-header">
              <span className="inventory-title">INVENTORY</span>
              <div className="inventory-weight">
                <span>Weight: 15.2 / 35.0 kg</span>
              </div>
            </div>
            <div className="split-inventory-container">
              <LeftInventory />
              <RightInventory />
            </div>
          </div>
          
          {/* Right Panel - Secondary Inventory & Actions */}
          <div className="tarkov-right-panel">
             <div className="equipment-panel">
              <div className="inventory-label">Equipment</div>
              <DedicatedSlots />
            </div>
            <div className="inventory-label">Backpack</div>
            <BackpackInventory/>
          </div>
          
          <Tooltip />
          <InventoryContext />
        </div>
      </Fade>
      <InventoryHotbar />
    </>
  );
};

export default Inventory;
