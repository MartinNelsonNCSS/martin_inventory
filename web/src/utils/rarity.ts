import { RarityType } from '../typings/item';
import { SlotWithItem } from '../typings';
import { Items } from '../store/items';

export const getRarityForItem = (item: SlotWithItem): RarityType => {
  // Check if item has rarity in metadata first (for individual item overrides)
  if (item.metadata?.rarity) {
    return item.metadata.rarity as RarityType;
  }
  
  // Check if item definition has rarity
  const itemData = Items[item.name];
  if (itemData?.rarity) {
    return itemData.rarity;
  }
  
  // Default to common if no rarity specified
  return 'common';
};

export const getRarityColor = (rarity: RarityType): string => {
  const rarityColors = {
    common: '#9BA3A6', // concrete-gray-light
    uncommon: '#10B981', // green
    rare: '#3B82F6', // blue
    epic: '#8B5CF6', // purple
    legendary: '#FF6B35', // sunset-orange-primary
  };
  
  return rarityColors[rarity];
};

export const getRarityClassName = (rarity: RarityType): string => {
  return `rarity-${rarity}`;
};

export const getRarityGlowIntensity = (rarity: RarityType): number => {
  const intensities = {
    common: 0,
    uncommon: 0.3,
    rare: 0.5,
    epic: 0.8,
    legendary: 1.2,
  };
  
  return intensities[rarity];
};
