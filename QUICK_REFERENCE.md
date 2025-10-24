# Dedicated Slots - Quick Reference

## Visual Layout

```
┌─────────────────────────────────────────────────────┐
│  EQUIPMENT PANEL (Right Side)                       │
│                                                      │
│  ┌─────────┐              ┌─────────┐              │
│  │Backpack │              │  Money  │              │
│  │   F2    │              │   F3    │              │
│  └─────────┘              └─────────┘              │
│       ↑                        ↑                    │
│    Slot 43                  Slot 44                │
│                                                      │
│  ┌─────────┐              ┌─────────┐              │
│  │  Vest   │              │Secondary│              │
│  │   F4    │              │ Weapon  │              │
│  └─────────┘              │   F5    │              │
│       ↑                   └─────────┘              │
│    Slot 45                     ↑                    │
│                            Slot 46                  │
│                                                      │
│  ┌─────────┐              ┌─────────┐              │
│  │  Phone  │              │ Primary │              │
│  │   F6    │              │ Weapon  │              │
│  └─────────┘              │   F7    │              │
│       ↑                   └─────────┘              │
│    Slot 47                     ↑                    │
│                            Slot 48                  │
│                                                      │
│  ┌─────────┐              ┌─────────┐              │
│  │  Melee  │              │ Wallet  │              │
│  │ Weapon  │              │   F9    │              │
│  │   F8    │              └─────────┘              │
│  └─────────┘                   ↑                    │
│       ↑                     Slot 50                 │
│    Slot 49                                          │
└─────────────────────────────────────────────────────┘
```

## Item Whitelisting Examples

### ✅ CORRECT Usage

```lua
-- Phone item - whitelisted for phone slot
['phone'] = {
    label = 'Phone',
    weight = 190,
    slot = 'phone', -- ✅ Will ONLY work in phone slot (F6)
}

-- Pistol - whitelisted for secondary weapon slot
['WEAPON_PISTOL'] = {
    label = 'Pistol',
    weight = 970,
    slot = 'weapon-secondary', -- ✅ Will ONLY work in secondary slot (F5)
}
```

### ❌ INCORRECT Usage

```lua
-- DON'T: No slot property
['phone'] = {
    label = 'Phone',
    weight = 190,
    -- ❌ Missing slot property - won't work in any dedicated slot!
}

-- DON'T: Wrong slot type
['phone'] = {
    label = 'Phone',
    weight = 190,
    slot = 'wallet', -- ❌ Phone in wallet slot? Invalid!
}

-- DON'T: Invalid slot name
['armour'] = {
    label = 'Vest',
    weight = 3000,
    slot = 'armor', -- ❌ Typo! Should be 'vest'
}
```

## Slot Type Mapping

| Item Category | Slot Type | Items |
|---------------|-----------|-------|
| **Backpacks** | `backpack` | parachute, backpack, duffel_bag |
| **Currency** | `money` | money, black_money, marked_bills |
| **Armor** | `vest` | armour, bulletproof_vest, plate_carrier |
| **Sidearms** | `weapon-secondary` | WEAPON_PISTOL, WEAPON_COMBATPISTOL, WEAPON_MICROSMG |
| **Communication** | `phone` | phone, radio |
| **Main Weapons** | `weapon-primary` | WEAPON_ASSAULTRIFLE, WEAPON_SHOTGUN, WEAPON_SNIPERRIFLE |
| **Close Combat** | `weapon-melee` | WEAPON_KNIFE, WEAPON_BAT, WEAPON_NIGHTSTICK |
| **Personal Items** | `wallet` | wallet, id_card |

## Keybind Reference

```
F2 = Backpack Slot     (e.g., parachute)
F3 = Money Slot        (e.g., cash)
F4 = Vest Slot         (e.g., armor)
F5 = Secondary Weapon  (e.g., pistol)
F6 = Phone Slot        (e.g., phone)
F7 = Primary Weapon    (e.g., rifle)
F8 = Melee Weapon      (e.g., knife)
F9 = Wallet Slot       (e.g., wallet)
```

## Visual States

### Normal Slot (Valid Item)
```
┌─────────┐
│  Phone  │ ← Item image
│  📱     │ ← Item icon (if present)
│    F6   │ ← Keybind badge (orange)
└─────────┘
```

### Invalid Item (Wrong Slot)
```
┌─────────┐
│  Rifle  │ ← Item in wrong slot
│  🔫     │ ← Shows in red
│    F6   │ ← Keybind still visible
└─────────┘
  ↑ Red pulsing border
```

### Empty Slot
```
┌─────────┐
│         │ ← Empty
│         │
│    F6   │ ← Keybind visible
└─────────┘
  ↑ Normal border
```

## Inventory Filtering

### BEFORE (Old System)
```
Main Inventory Grid:
┌────┬────┬────┬────┬────┐
│ 1  │ 2  │ 3  │ 4  │ 5  │ ← Hotbar
├────┼────┼────┼────┼────┤
│ 6  │ 7  │ 8  │ ... │ 42 │ ← Regular items
├────┼────┼────┼────┼────┤
│ 43 │ 44 │ 45 │ 46 │ 47 │ ← Equipment (shown in main grid)
├────┼────┼────┼────┼────┤
│ 48 │ 49 │ 50 │    │    │ ← Equipment (cluttered!)
└────┴────┴────┴────┴────┘
```

### AFTER (New System)
```
Main Inventory Grid:        Equipment Panel:
┌────┬────┬────┬────┬────┐  ┌──────┐  ┌──────┐
│ 1  │ 2  │ 3  │ 4  │ 5  │  │ 43   │  │ 44   │
├────┼────┼────┼────┼────┤  │ Back │  │Money │
│ 6  │ 7  │ 8  │ ... │ 42 │  │  F2  │  │  F3  │
└────┴────┴────┴────┴────┘  └──────┘  └──────┘
     ↑ Clean!                ┌──────┐  ┌──────┐
   No equipment              │ 45   │  │ 46   │
   shown here               │ Vest │  │ 2nd  │
                            │  F4  │  │  F5  │
                            └──────┘  └──────┘
                            ... and so on
```

## Code Examples

### Adding New Item
```lua
-- In data/items.lua
['tactical_backpack'] = {
    label = 'Tactical Backpack',
    weight = 1500,
    stack = false,
    slot = 'backpack', -- ✅ Whitelist for backpack slot
    client = {
        image = 'backpack_tactical.png'
    }
}
```

### Adding New Weapon
```lua
-- In data/weapons.lua
['WEAPON_COMBATPISTOL'] = {
    label = 'Combat Pistol',
    weight = 1100,
    durability = 0.1,
    ammoname = 'ammo-9',
    slot = 'weapon-secondary', -- ✅ Goes in secondary weapon slot
}

['WEAPON_ASSAULTRIFLE'] = {
    label = 'Assault Rifle',
    weight = 4500,
    durability = 0.03,
    ammoname = 'ammo-rifle2',
    slot = 'weapon-primary', -- ✅ Goes in primary weapon slot
}

['WEAPON_KNIFE'] = {
    label = 'Knife',
    weight = 300,
    durability = 0.1,
    slot = 'weapon-melee', -- ✅ Goes in melee weapon slot
}
```

## Common Mistakes

### ❌ MISTAKE 1: No Slot Property
```lua
['phone'] = {
    label = 'Phone',
    weight = 190,
    -- Missing: slot = 'phone'
}
```
**Result:** Item can't be placed in ANY dedicated slot

### ❌ MISTAKE 2: Wrong Slot Type
```lua
['WEAPON_ASSAULTRIFLE'] = {
    label = 'Assault Rifle',
    slot = 'weapon-secondary', -- Wrong! Should be 'weapon-primary'
}
```
**Result:** Rifle can only go in pistol slot (awkward!)

### ❌ MISTAKE 3: Typo in Slot Name
```lua
['armour'] = {
    label = 'Vest',
    slot = 'armor', -- Typo! Should be 'vest'
}
```
**Result:** Item won't be recognized, can't be placed

## Testing Your Items

1. **Add item to player inventory** via admin command
2. **Open inventory** (default: Tab key)
3. **Try dragging to dedicated slot**
   - ✅ Green/normal border = Working correctly
   - ❌ Red pulsing border = Wrong slot type
4. **Check keybind display**
   - Should show F2-F9 badge
5. **Verify main inventory**
   - Item should NOT appear in slots 43-50 of main grid
   - Should ONLY appear in equipment panel

## Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Red border on item | Add/fix `slot` property in items.lua |
| Item in main grid (slots 43-50) | Rebuild web UI: `pnpm run build` |
| No keybind showing | Check DedicatedSlots component |
| Can't drag to slot | Item needs `slot` property |
| Wrong keybind | Check slot configuration in DedicatedSlots.tsx |

## Resources

- Full documentation: `DEDICATED_SLOTS_WHITELIST.md`
- Implementation details: `IMPLEMENTATION_SUMMARY.md`
- Original fix: `DEDICATED_SLOTS_FIX.md`
