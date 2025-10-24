export type RarityType = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export type DedicatedSlotType = 'backpack' | 'money' | 'vest' | 'weapon-secondary' | 'phone' | 'weapon-primary' | 'weapon-melee' | 'wallet';

export type ItemData = {
  name: string;
  label: string;
  stack: boolean;
  usable: boolean;
  close: boolean;
  count: number;
  description?: string;
  buttons?: string[];
  ammoName?: string;
  image?: string;
  rarity?: RarityType;
  slot?: DedicatedSlotType; // Dedicated slot this item can be placed in
};
