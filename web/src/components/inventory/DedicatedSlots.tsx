import React from 'react';
import WeaponSlots from './WeaponSlots';
import WalletSlot from './WalletSlot';
import ArmorSlots from './ArmorSlots';
import BackpackSlot from './BackpackSlot';

const DedicatedSlots: React.FC = () => {
  return (
    <div className="dedicated-slots-container">
      <div className="dedicated-slots-grid">
        {/* All slots in one grid - no sections */}
        <WeaponSlots />
        <ArmorSlots />
        <WalletSlot />
        <BackpackSlot />
      </div>
    </div>
  );
};

export default DedicatedSlots;
