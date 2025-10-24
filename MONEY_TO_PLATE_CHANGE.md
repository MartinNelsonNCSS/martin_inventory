# Dedicated Slot Change: Money → Armor Plate

## Change Summary

**Slot F3 (Index 44)** has been changed from a **Money slot** to an **Armor Plate slot**.

### Before
- Slot Type: `money`
- Purpose: Cash/money storage
- Example Items: money, black_money, marked_bills

### After
- Slot Type: `plate`
- Purpose: Armor plate for plate carrier
- Example Items: armor_plate, ballistic_plate, ceramic_plate

## Rationale

This change makes the inventory system more tactical and realistic:

1. **Better Armor System**: Allows players to equip armor plates separately from the plate carrier
2. **Gameplay Depth**: Plates can be damaged/replaced without replacing entire vest
3. **Money as Regular Item**: Money remains in regular inventory (more accessible)
4. **Tactical Realism**: Mirrors real-world plate carrier systems where plates are separate from the vest

## Updated Slot Layout

```
┌─────────────────────────────────────────┐
│  EQUIPMENT PANEL                        │
│                                         │
│  ┌─────────┐      ┌─────────┐         │
│  │Backpack │      │  Plate  │         │ ← CHANGED
│  │   F2    │      │   F3    │         │
│  └─────────┘      └─────────┘         │
│                                         │
│  ┌─────────┐      ┌─────────┐         │
│  │  Vest   │      │Secondary│         │ ← Plate goes here
│  │   F4    │      │ Weapon  │         │
│  └─────────┘      │   F5    │         │
│                   └─────────┘         │
│  ... (other slots)                    │
└─────────────────────────────────────────┘
```

## Item Configuration

### New Armor Plate Item

```lua
-- In data/items.lua
['armor_plate'] = {
    label = 'Armor Plate',
    weight = 500,
    stack = true, -- Plates can stack
    slot = 'plate', -- ✅ Dedicated plate slot
    client = {
        image = 'armor_plate.png'
    }
}
```

### Example Plate Variants

```lua
-- Ceramic plate (lighter, better protection)
['ceramic_plate'] = {
    label = 'Ceramic Armor Plate',
    weight = 400,
    stack = true,
    slot = 'plate',
    rarity = 'rare',
}

-- Steel plate (heavier, cheaper)
['steel_plate'] = {
    label = 'Steel Armor Plate',
    weight = 800,
    stack = true,
    slot = 'plate',
    rarity = 'common',
}

-- Level IV plate (best protection)
['plate_level4'] = {
    label = 'Level IV Ballistic Plate',
    weight = 600,
    stack = true,
    slot = 'plate',
    rarity = 'epic',
}
```

## Armor System Workflow

### 1. Equip Plate Carrier (Vest Slot - F4)
```lua
['plate_carrier'] = {
    label = 'Plate Carrier',
    weight = 2000,
    stack = false,
    slot = 'vest', -- Goes in vest slot
}
```

### 2. Insert Armor Plate (Plate Slot - F3)
```lua
['armor_plate'] = {
    label = 'Armor Plate',
    weight = 500,
    stack = true,
    slot = 'plate', -- Goes in plate slot
}
```

### 3. Full Protection
- Plate carrier provides base armor
- Armor plate adds ballistic protection
- Plates can be damaged/destroyed separately
- Replace worn plates without replacing carrier

## Gameplay Benefits

### For Players
✅ **Modular Armor** - Mix and match carriers and plates  
✅ **Cost Effective** - Replace cheap plates instead of expensive carriers  
✅ **Tactical Choice** - Choose plate type based on situation  
✅ **Weight Management** - Lighter plates = more mobility

### For Server Owners
✅ **Economy Balance** - Plates as consumable items  
✅ **Crafting System** - Plates can be crafted/upgraded  
✅ **Durability System** - Plates degrade with use  
✅ **Rarity Tiers** - Different plate qualities (common to legendary)

## Migration Notes

### If You Had Money in Money Slot
Money items are now **regular inventory items**:
- No longer restricted to dedicated slot
- Can be stored anywhere in inventory
- More accessible for transactions
- Black money, marked bills work the same way

### If You Want Money as Dedicated Slot
To revert back to money slot:

1. Change `type: 'plate'` to `type: 'money'` in DedicatedSlots.tsx
2. Change `DedicatedSlotType = ... | 'money'` in item.ts
3. Change label from 'Armor Plate' to 'Money'
4. Rebuild: `pnpm run build`

## Files Modified

### Frontend
- ✅ `web/src/typings/item.ts` - Changed `'money'` to `'plate'` in DedicatedSlotType
- ✅ `web/src/components/inventory/DedicatedSlots.tsx` - Updated slot config

### Backend
- ✅ `data/items.lua` - Added armor_plate item, removed slot from money

### Documentation
- ✅ `DEDICATED_SLOTS_WHITELIST.md` - Updated all references
- ✅ `QUICK_REFERENCE.md` - Updated slot table and examples

## Testing Checklist

- [x] TypeScript compiles without errors
- [x] Build completes successfully  
- [ ] Armor plate item can be placed in F3 slot
- [ ] Money cannot be placed in F3 slot
- [ ] Plate carrier can be placed in F4 slot (vest)
- [ ] Armor plates stack correctly
- [ ] Invalid items show red border in plate slot
- [ ] Keybind shows "F3" on plate slot

## Available Slot Types (Updated)

1. `'backpack'` - Backpacks (F2)
2. `'plate'` - **Armor Plates** (F3) ← NEW
3. `'vest'` - Plate carriers, vests (F4)
4. `'weapon-secondary'` - Pistols, SMGs (F5)
5. `'phone'` - Phones (F6)
6. `'weapon-primary'` - Rifles, shotguns (F7)
7. `'weapon-melee'` - Knives, bats (F8)
8. `'wallet'` - Wallets (F9)

## Example Implementations

### Server-Side Armor Calculation
```lua
-- Example: Calculate total armor value
function GetPlayerArmor(source)
    local inventory = GetPlayerInventory(source)
    local vestSlot = inventory[totalSlots - 5] -- F4 vest slot
    local plateSlot = inventory[totalSlots - 6] -- F3 plate slot
    
    local baseArmor = vestSlot and Items[vestSlot.name].armor or 0
    local plateArmor = plateSlot and Items[plateSlot.name].armor or 0
    
    return baseArmor + plateArmor
end
```

### Plate Durability System
```lua
-- Example: Damage plate on hit
RegisterNetEvent('damage:armorPlate')
AddEventHandler('damage:armorPlate', function(damage)
    local plateSlot = totalSlots - 6 -- F3 plate slot
    local plate = GetInventorySlot(source, plateSlot)
    
    if plate and plate.durability then
        plate.durability = plate.durability - damage
        
        if plate.durability <= 0 then
            RemoveItem(source, plateSlot, 1)
            TriggerClientEvent('notify', source, 'Your armor plate shattered!')
        end
    end
end)
```

## Summary

The dedicated slot system now supports a more realistic armor system where:
- **Plate carriers** (vests) provide structure
- **Armor plates** provide protection
- **Plates are consumable** and can be replaced
- **Money** remains accessible in regular inventory

This change enhances gameplay depth while maintaining the clean, organized inventory system.
