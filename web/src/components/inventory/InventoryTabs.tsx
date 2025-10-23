import React from 'react';
import { useAppSelector, useAppDispatch } from '../../store';
import { selectCurrentView, selectInventoryViews, setCurrentView, cycleInventoryView } from '../../store/inventory';
import { InventoryView } from '../../typings';

const InventoryTabs: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentView = useAppSelector(selectCurrentView);
  const inventoryViews = useAppSelector(selectInventoryViews);

  const handleTabClick = (view: InventoryView) => {
    dispatch(setCurrentView(view));
  };

  const handleCycleHotkey = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab' && !event.shiftKey) {
      event.preventDefault();
      dispatch(cycleInventoryView());
    }
  };

  // Determine which tabs to show based on available inventories
  const availableTabs = [
    { 
      view: InventoryView.CURRENT, 
      label: 'Current', 
      available: true,
      icon: '🎒'
    },
    { 
      view: InventoryView.BACKPACK, 
      label: 'Backpack', 
      available: !!inventoryViews.backpack,
      icon: '🎒'
    },
    { 
      view: InventoryView.GROUND, 
      label: 'Ground', 
      available: !!inventoryViews.ground,
      icon: '📦'
    },
  ].filter(tab => tab.available);

  // Don't show tabs if only one is available
  if (availableTabs.length <= 1) {
    return null;
  }

  return (
    <div className="inventory-tabs-container" onKeyDown={handleCycleHotkey} tabIndex={0}>
      <div className="inventory-tabs-header">
        <span className="inventory-tabs-title">Inventory</span>
        <span className="inventory-tabs-hint">Tab to cycle</span>
      </div>
      
      <div className="inventory-tabs">
        {availableTabs.map((tab) => (
          <button
            key={tab.view}
            className={`inventory-tab ${currentView === tab.view ? 'active' : ''}`}
            onClick={() => handleTabClick(tab.view)}
            disabled={!tab.available}
          >
            <span className="inventory-tab-icon">{tab.icon}</span>
            <span className="inventory-tab-label">{tab.label}</span>
            {currentView === tab.view && <div className="inventory-tab-indicator" />}
          </button>
        ))}
      </div>
      
      <div className="inventory-tab-content-indicator">
        <div className="current-view-label">
          {availableTabs.find(tab => tab.view === currentView)?.label || 'Current'}
        </div>
      </div>
    </div>
  );
};

export default InventoryTabs;
