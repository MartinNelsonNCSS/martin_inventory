import React from 'react';
import DedicatedSlot from './DedicatedSlot';

const ArmorSlots: React.FC = () => {
  return (
    <div className="armor-slots-container">
      <DedicatedSlot
        slotType="plate_carrier"
        label="Plate Carrier"
        acceptedItems={['plate_carrier']}
        slotNumber={1}
      />
      <DedicatedSlot
        slotType="plate"
        label="Armor Plate"
        acceptedItems={['plate']}
        slotNumber={2}
      />
    </div>
  );
};

export default ArmorSlots;
