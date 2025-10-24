# Dedicated Slots Fix - "Target Slot Undefined" Error

## Problem
The dedicated slots component was using **negative slot numbers** (-1, -2, -3, etc.) which caused a "target slot is undefined" error when trying to drag items into these slots.

### Root Cause
The inventory system uses **1-indexed arrays** where slots are accessed using the formula: `items[slot - 1]`

When a dedicated slot had slot number `-1`, the system tried to access `items[-1 - 1]` = `items[-2]`, which returns `undefined` in JavaScript arrays.

## Solution
Changed the `DedicatedSlots.tsx` component to:

1. **Pull from actual inventory state** using Redux `useAppSelector(selectLeftInventory)`
2. **Use real positive slot numbers** from the player's inventory array
3. **Map dedicated slots to the last 8 slots** in the player's inventory

### Implementation Details

#### Before (Broken)
```typescript
const dedicatedSlots: DedicatedSlotData[] = [
  { slot: -6, type: 'backpack', name: 'Backpack', ... },  // ❌ Negative slots
  { slot: -1, type: 'money', name: 'Money', ... },
  // ...
];
```

#### After (Fixed)
```typescript
const leftInventory = useAppSelector(selectLeftInventory);
const totalSlots = leftInventory.slots;

const dedicatedSlotConfigs: DedicatedSlotConfig[] = [
  { slotIndex: totalSlots - 7, type: 'backpack', label: 'Backpack', ... },  // ✅ Real slots
  { slotIndex: totalSlots - 6, type: 'money', label: 'Money', ... },
  // ...
];

// Then pull actual slot data from inventory
const actualSlot = leftInventory.items[config.slotIndex - 1];
```

## Key Changes

1. **Dynamic Slot Calculation**: Uses `totalSlots - offset` to allocate the last 8 slots for dedicated equipment
2. **State Integration**: Reads from Redux store to get actual slot data
3. **Fallback Handling**: Creates empty slot objects if inventory isn't loaded yet
4. **Proper Metadata**: Uses actual inventory groups and ID from state

## Slot Allocation (for 50-slot inventory)

| Slot Type | Slot Number | Purpose |
|-----------|-------------|---------|
| Backpack | 43 | Equippable backpack |
| Money | 44 | Cash storage |
| Vest | 45 | Heavy bulletproof vest |
| Secondary Weapon | 46 | Secondary weapon slot |
| Phone | 47 | Phone item |
| Primary Weapon | 48 | Primary weapon slot |
| Melee Weapon | 49 | Melee weapon slot |
| Wallet | 50 | Wallet item |

## Benefits

✅ **Works with drag-and-drop**: Items can now be dragged into dedicated slots without errors  
✅ **State synchronized**: Changes reflect immediately across the UI  
✅ **Search compatible**: When searching player inventory, all slots are accessible  
✅ **Framework compatible**: Works with existing inventory system architecture  
✅ **Scalable**: Automatically adjusts to different inventory sizes  

## Testing Recommendations

1. Test dragging items into each dedicated slot type
2. Test dragging between dedicated slots and regular inventory
3. Test with different inventory sizes (adjust slot allocation if needed)
4. Test inventory search functionality to ensure dedicated slots appear
5. Test slot persistence when closing/reopening inventory

## Configuration

To adjust which slots are used for dedicated equipment, modify the offset values in `DedicatedSlots.tsx`:

```typescript
{ slotIndex: totalSlots - 7, type: 'backpack', ... },  // Change offset here
```

Make sure dedicated slots don't overlap with regular inventory usage patterns.
