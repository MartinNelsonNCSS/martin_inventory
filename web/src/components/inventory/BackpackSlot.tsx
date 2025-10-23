import React from 'react';
import DedicatedSlot from './DedicatedSlot';

const BackpackSlot: React.FC = () => {
  return (
    <DedicatedSlot
      slotType="backpack"
      label="Backpack"
      acceptedItems={['backpack']}
      slotNumber={1}
    />
  );
};

export default BackpackSlot;
