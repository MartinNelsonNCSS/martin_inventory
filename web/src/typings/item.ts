export type RarityType = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

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
};
