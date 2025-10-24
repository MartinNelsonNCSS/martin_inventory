# Dedicated Slots Whitelist System

## Overview
The dedicated slots system now supports **item whitelisting** and **keybindings**. Items must be explicitly whitelisted in `data/items.lua` or `data/weapons.lua` to be placed in specific dedicated equipment slots.

## Features

### ✅ Whitelisted Slot System
- Items can only be placed in slots they're whitelisted for
- Invalid items show red pulsing border
- Empty slots always accept whitelisted items

### ✅ Keybinding Support
- Each dedicated slot has a keybind hint displayed
- Visual F-key indicators (F2-F9)
- Ready for backend keybind implementation

### ✅ Filtered Inventory Display
- Dedicated slot items don't appear in main inventory grid
- Cleaner primary inventory display
- Equipment-only panel separation

## Dedicated Slot Types

| Slot Type | Purpose | Keybind | Slot Index |
|-----------|---------|---------|------------|
| `backpack` | Equippable backpack (adds inventory space) | F2 | slots-7 |
| `plate` | Armor plate for plate carrier | F3 | slots-6 |
| `vest` | Armor/bulletproof vest/plate carrier | F4 | slots-5 |
| `weapon-secondary` | Secondary weapon (pistol/SMG) | F5 | slots-4 |
| `phone` | Mobile phone | F6 | slots-3 |
| `weapon-primary` | Primary weapon (rifle/shotgun) | F7 | slots-2 |
| `weapon-melee` | Melee weapon (knife/bat) | F8 | slots-1 |
| `wallet` | Wallet item | F9 | slots |

## How to Whitelist Items

### In `data/items.lua`

Add the `slot` property to item definitions:

```lua
['phone'] = {
    label = 'Phone',
    weight = 190,
    stack = false,
    slot = 'phone', -- ✅ Whitelist for phone slot
    client = {
        -- ... phone client config
    }
},

['armour'] = {
    label = 'Bulletproof Vest',
    weight = 3000,
    stack = false,
    slot = 'vest', -- ✅ Whitelist for vest slot
    client = {
        anim = { dict = 'clothingshirt', clip = 'try_shirt_positive_d' },
        usetime = 3500
    }
},

['wallet'] = {
    label = 'Wallet',
    weight = 50,
    stack = false,
    slot = 'wallet', -- ✅ Whitelist for wallet slot
    client = {
        image = 'wallet.png'
    }
},

['money'] = {
    label = 'Money',
    slot = 'money', -- ✅ Whitelist for money slot
},

['armor_plate'] = {
    label = 'Armor Plate',
    weight = 500,
    stack = true,
    slot = 'plate', -- ✅ Whitelist for armor plate slot
},

['parachute'] = {
    label = 'Parachute',
    weight = 8000,
    stack = false,
    slot = 'backpack', -- ✅ Whitelist for backpack slot
},
```

### In `data/weapons.lua`

Add the `slot` property to weapon definitions based on weapon type:

```lua
-- Primary weapons (rifles, shotguns, heavy weapons)
['WEAPON_ASSAULTRIFLE'] = {
    label = 'Assault Rifle',
    weight = 4500,
    durability = 0.03,
    ammoname = 'ammo-rifle2',
    slot = 'weapon-primary', -- ✅ Whitelist as primary weapon
},

-- Secondary weapons (pistols, SMGs)
['WEAPON_PISTOL'] = {
    label = 'Pistol',
    weight = 970,
    durability = 0.1,
    ammoname = 'ammo-9',
    slot = 'weapon-secondary', -- ✅ Whitelist as secondary weapon
},

-- Melee weapons
['WEAPON_KNIFE'] = {
    label = 'Knife',
    weight = 300,
    durability = 0.1,
    slot = 'weapon-melee', -- ✅ Whitelist as melee weapon
},
```

## Item Categorization Guide

### Weapon Slot Assignment

**Primary Weapons** (`weapon-primary`):
- Assault Rifles (AK, M4, etc.)
- Sniper Rifles
- Shotguns
- Heavy Weapons (RPG, Minigun)
- LMGs

**Secondary Weapons** (`weapon-secondary`):
- Pistols
- SMGs (Micro SMG, MP5, etc.)
- Compact PDWs

**Melee Weapons** (`weapon-melee`):
- Knife
- Baseball Bat
- Nightstick
- Hatchet
- Crowbar
- Golf Club

### Equipment Slot Assignment

**Backpack** (`backpack`):
- Any item that increases inventory capacity
- Parachute (if used as backpack)
- Duffel bags
- Tactical backpacks

**Vest** (`vest`):
- Bulletproof vests
- Plate carriers
- Body armor
- Tactical vests

**Phone** (`phone`):
- Mobile phones
- Radio devices (if categorized as phone)

**Plate** (`plate`):
- Armor plates
- Ballistic plates
- Ceramic plates
- Steel plates

**Wallet** (`wallet`):
- Wallet items
- ID holders
- Card holders

**Money** (`money`):
- Cash
- Black money
- Marked bills

(Note: Money is now a regular inventory item, not a dedicated slot)

## Validation Rules

### Valid Item Placement
✅ Item has `slot = 'phone'` property → Can be placed in phone slot  
✅ Empty slot → Can accept any whitelisted item for that slot type  
✅ Item in correct slot → Shows normal border colors

### Invalid Item Placement
❌ Item without `slot` property → Cannot be placed in dedicated slots  
❌ Item with wrong `slot` value → Shows red pulsing border  
❌ Non-whitelisted item → Rejected by drag-and-drop system

## Visual Indicators

### Keybind Hints
- Orange gradient badge in bottom-right corner
- Shows F-key assignment (F2-F9)
- Always visible on dedicated slots
- Non-interactive (display only)

### Invalid Item Warning
- Red pulsing border animation
- Indicates item doesn't belong in that slot
- Suggests item should be moved

### Empty Slot
- Normal border color
- No keybind visible when occupied
- Accepts whitelisted items via drag-and-drop

## Backend Implementation Notes

### Client-Side Keybinding (Lua)
You'll need to implement keybind handlers in your client.lua:

```lua
-- Example keybind registration
RegisterKeyMapping('use_phone', 'Use Phone (F6)', 'keyboard', 'F6')
RegisterCommand('use_phone', function()
    -- Trigger phone slot item use
    local phoneSlot = totalSlots - 3 -- Phone slot index
    TriggerEvent('ox_inventory:useSlot', phoneSlot)
end, false)
```

### Slot Validation (Server-Side)
Server should validate slot assignments:

```lua
-- Example validation in server.lua
local function isItemAllowedInSlot(itemName, slotIndex)
    local item = Items[itemName]
    local dedicatedSlotType = getDedicatedSlotType(slotIndex)
    
    if dedicatedSlotType and item.slot ~= dedicatedSlotType then
        return false -- Item not whitelisted for this slot
    end
    
    return true
end
```

## Configuration

### Slot Count Configuration
Dedicated slots use the **last 8 slots** of player inventory. Ensure your server config has enough slots:

```lua
-- In server config
Config.Inventory = {
    Slots = 50, -- Minimum 8 slots needed for dedicated equipment
    -- Slots 1-42: Regular inventory
    -- Slots 43-50: Dedicated equipment (8 slots)
}
```

### Adjusting Slot Allocation
To change which slots are dedicated, edit `DedicatedSlots.tsx`:

```typescript
// Use last 8 slots (default)
slotIndex: totalSlots - 7, // First dedicated slot

// OR use first 8 slots
slotIndex: 1, // First slot
slotIndex: 2, // Second slot
// etc.
```

## Examples

### Complete Weapon Setup

```lua
-- data/weapons.lua
return {
    Weapons = {
        -- Primary weapons
        ['WEAPON_ASSAULTRIFLE'] = {
            label = 'Assault Rifle',
            weight = 4500,
            durability = 0.03,
            ammoname = 'ammo-rifle2',
            slot = 'weapon-primary',
        },
        
        -- Secondary weapons
        ['WEAPON_PISTOL'] = {
            label = 'Pistol',
            weight = 970,
            durability = 0.1,
            ammoname = 'ammo-9',
            slot = 'weapon-secondary',
        },
        
        -- Melee weapons
        ['WEAPON_KNIFE'] = {
            label = 'Knife',
            weight = 300,
            durability = 0.1,
            slot = 'weapon-melee',
        },
    }
}
```

### Complete Equipment Setup

```lua
-- data/items.lua
return {
    ['phone'] = {
        label = 'Phone',
        weight = 190,
        stack = false,
        slot = 'phone',
    },
    
    ['armour'] = {
        label = 'Bulletproof Vest',
        weight = 3000,
        stack = false,
        slot = 'vest',
    },
    
    ['wallet'] = {
        label = 'Wallet',
        weight = 50,
        stack = false,
        slot = 'wallet',
    },
    
    ['money'] = {
        label = 'Money',
        slot = 'money',
    },
    
    ['backpack'] = {
        label = 'Tactical Backpack',
        weight = 1000,
        stack = false,
        slot = 'backpack',
    },
}
```

## Troubleshooting

### Items Not Filtering from Main Inventory
- Check that `inventory.type === 'player'` in your setup
- Verify slot indices are correct (last 8 slots)
- Rebuild web UI: `cd web && pnpm run build`

### Items Show Red Border
- Item doesn't have `slot` property matching the slot type
- Add correct `slot = 'type'` to item definition in data/items.lua
- Restart server to reload item data

### Keybinds Not Working
- Keybind hints are display-only in this implementation
- Implement actual keybind handlers in client.lua
- Use RegisterKeyMapping for FiveM keybinds

### Slots Not Appearing
- Check total slots configuration (must be ≥ 8)
- Verify leftInventory state is populated
- Check console for TypeScript errors

## Migration Guide

### Existing Servers
1. Add `slot` property to all equipment items in `data/items.lua`
2. Add `slot` property to all weapons in `data/weapons.lua`
3. Rebuild web UI: `cd web && pnpm run build`
4. Restart server
5. Test item placement in dedicated slots

### Fresh Install
1. Follow examples above for item configuration
2. Configure server slots (minimum 8)
3. Build web UI
4. Start server
5. Items automatically enforce slot restrictions

## API Reference

### TypeScript Types

```typescript
// Dedicated slot type definition
export type DedicatedSlotType = 
  | 'backpack' 
  | 'money' 
  | 'vest' 
  | 'weapon-secondary' 
  | 'phone' 
  | 'weapon-primary' 
  | 'weapon-melee' 
  | 'wallet';

// Item data with slot property
export type ItemData = {
  name: string;
  label: string;
  slot?: DedicatedSlotType; // Optional whitelist property
  // ... other properties
};
```

### Helper Functions

```typescript
// Check if item is allowed in slot
isItemAllowedInSlot(itemName: string, slotType: DedicatedSlotType): boolean

// Check if slot index is a dedicated slot
isDedicatedSlot(slotIndex: number, totalSlots: number): boolean
```

## Support

For issues or questions:
1. Check that items have correct `slot` property
2. Verify inventory has enough total slots (≥ 8)
3. Rebuild web UI after changes
4. Check browser console for errors
5. Verify server-side item data loaded correctly
