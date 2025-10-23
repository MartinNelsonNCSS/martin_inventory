import React from 'react';
import DedicatedSlot from './DedicatedSlot';

const WalletSlot: React.FC = () => {
  return (
    <DedicatedSlot
      slotType="wallet"
      label="Wallet"
      acceptedItems={['wallet']}
      slotNumber={1}
    />
  );
};

export default WalletSlot;
