import React from 'react';
import DedicatedSlot from './DedicatedSlot';

const WeaponSlots: React.FC = () => {
  return (
    <div className="weapon-slots-container">
      <DedicatedSlot
        slotType="weapon-primary"
        label="Primary"
        acceptedItems={['weapon']}
        slotNumber={1}
      />
      <DedicatedSlot
        slotType="weapon-secondary"
        label="Secondary"
        acceptedItems={['weapon']}
        slotNumber={2}
      />
      <DedicatedSlot
        slotType="weapon-melee"
        label="Melee"
        acceptedItems={['weapon']}
        slotNumber={3}
      />
    </div>
  );
};

export default WeaponSlots;
