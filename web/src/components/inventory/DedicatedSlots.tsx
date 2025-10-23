import React from 'react';
import DedicatedSlot from './DedicatedSlot';

const DedicatedSlots: React.FC = () => {
  return (
    <div className="dedicated-slots-container">
      <div className="dedicated-slots-grid">
        {/* Weapon slots */}
        <div className="weapon-slots-container">
          <DedicatedSlot slotType="weapon-primary" />
          <DedicatedSlot slotType="weapon-secondary" />
          <DedicatedSlot slotType="weapon-melee" />
        </div>
        
        {/* Armor slots */}
        <div className="armor-slots-container">
          <DedicatedSlot slotType="plate_carrier" />
          <DedicatedSlot slotType="plate" />
        </div>
        
        {/* Utility slots */}
        <div className="utility-slots-container">
          <DedicatedSlot slotType="wallet" />
          <DedicatedSlot slotType="backpack" />
        </div>
      </div>
    </div>
  );
};

export default DedicatedSlots;
