# Backend Implementation Guide for Dedicated Slots

## Overview
This guide provides detailed implementation steps for integrating the dedicated slots frontend with the server-side Lua code. Follow these steps in order for a complete implementation.

---

## ✅ Todo List Summary

1. **Configure Server Inventory Slots** - Ensure 50+ slots allocated
2. **Implement Server-Side Slot Validation** - Validate item placements
3. **Add Item Slot Property to Database** - Add slot metadata to all items
4. **Implement Keybind System** - F2-F9 key handlers
5. **Create Equipment Slot API Functions** - Exports for other resources
6. **Implement Armor Plate System** - Vest + Plate = Total Armor
7. **Add Weapon Quick-Equip Logic** - Fast weapon switching
8. **Create Phone/Wallet Integration** - F6 phone, F9 wallet
9. **Implement Backpack Inventory Expansion** - Dynamic slot increase
10. **Add Slot Filtering to Inventory Search** - Search compatibility
11. **Create Migration Script** - Existing player migration
12. **Add Logging and Debugging** - Debug tools and metrics
13. **Test Multi-Framework Compatibility** - ESX/QB/ox/ND testing
14. **Performance Optimization** - Edge cases and optimization
15. **Documentation and Configuration** - Admin guides

---

## 📋 Implementation Steps

### Step 1: Configure Server Inventory Slots

**Files to modify:**
- `init.lua` or your server configuration file
- `modules/bridge/*/server.lua` (framework-specific)

**Changes needed:**

```lua
-- In init.lua or server.cfg
setr inventory:slots 50  -- Minimum 50 slots (42 regular + 8 dedicated)
setr inventory:weight 30000  -- Adjust as needed

-- Or in Lua config
shared.playerSlots = 50
shared.playerMaxWeight = 30000
```

**Framework-specific updates:**

**ESX (`modules/bridge/esx/server.lua`):**
```lua
-- Update inventory initialization
function server.setPlayerInventory(player, items)
    local inventory = {
        id = player.identifier,
        type = 'player',
        slots = 50, -- Changed from default
        maxWeight = shared.playerMaxWeight,
        items = items or {},
    }
    return inventory
end
```

**QBCore (`modules/bridge/qbx/server.lua`):**
```lua
-- Update player inventory setup
Player.Functions.SetInventory = function(items)
    Player.PlayerData.items = items or {}
    Player.PlayerData.slots = 50 -- Ensure 50 slots
    TriggerClientEvent('inventory:client:SetInventory', Player.PlayerData.source, items)
end
```

**Testing:**
```lua
-- Test command
RegisterCommand('checkslots', function(source)
    local inventory = Inventory(source)
    print(string.format('Player %d has %d slots', source, inventory.slots))
end, true)
```

---

### Step 2: Implement Server-Side Slot Validation

**File to modify:** `modules/inventory/server.lua`

**Add helper functions:**

```lua
-- Check if slot index is a dedicated slot
local function isDedicatedSlot(slotIndex, totalSlots)
    return slotIndex > (totalSlots - 8)
end

-- Get dedicated slot type based on index
local function getDedicatedSlotType(slotIndex, totalSlots)
    local offset = totalSlots - slotIndex
    local slotTypes = {
        [0] = 'wallet',      -- Last slot
        [1] = 'weapon-melee',
        [2] = 'weapon-primary',
        [3] = 'phone',
        [4] = 'weapon-secondary',
        [5] = 'vest',
        [6] = 'plate',
        [7] = 'backpack',    -- First dedicated slot
    }
    return slotTypes[offset]
end

-- Check if item is allowed in dedicated slot
local function canMoveToSlot(itemName, targetSlot, totalSlots)
    if not isDedicatedSlot(targetSlot, totalSlots) then
        return true -- Regular slot, no restrictions
    end
    
    local dedicatedSlotType = getDedicatedSlotType(targetSlot, totalSlots)
    local item = Items(itemName)
    
    if not item then
        print(string.format('[ERROR] Item %s not found in Items database', itemName))
        return false
    end
    
    if not item.slot then
        -- Item has no slot property, cannot be placed in dedicated slots
        return false, string.format('%s cannot be equipped in dedicated slots', item.label)
    end
    
    if item.slot ~= dedicatedSlotType then
        return false, string.format('%s can only be equipped in %s slot', item.label, item.slot)
    end
    
    return true
end
```

**Integrate with existing move functions:**

```lua
-- Find existing swapSlots or moveSlots function and add validation
-- Example integration:

function Inventory.SwapSlots(source, data)
    local fromInventory = Inventory(data.fromInventory)
    local toInventory = Inventory(data.toInventory)
    
    if not fromInventory or not toInventory then
        return false, 'Invalid inventory'
    end
    
    local fromSlot = fromInventory.items[data.fromSlot]
    local toSlot = toInventory.items[data.toSlot]
    
    -- VALIDATION: Check dedicated slot restrictions
    if fromSlot.name then
        local canMove, errorMsg = canMoveToSlot(fromSlot.name, data.toSlot, toInventory.slots)
        if not canMove then
            TriggerClientEvent('ox_lib:notify', source, {
                type = 'error',
                description = errorMsg or 'Cannot place item in this slot'
            })
            return false, errorMsg
        end
    end
    
    if toSlot.name then
        local canMove, errorMsg = canMoveToSlot(toSlot.name, data.fromSlot, fromInventory.slots)
        if not canMove then
            TriggerClientEvent('ox_lib:notify', source, {
                type = 'error',
                description = errorMsg or 'Cannot place item in this slot'
            })
            return false, errorMsg
        end
    end
    
    -- Continue with existing swap logic...
end
```

---

### Step 3: Add Item Slot Property to Database

**Files to modify:**
- `data/items.lua`
- `data/weapons.lua`

**Item examples:**

```lua
-- In data/items.lua

['phone'] = {
    label = 'Phone',
    weight = 190,
    stack = false,
    slot = 'phone', -- ADD THIS
    client = {
        -- existing config
    }
},

['armor_plate'] = {
    label = 'Armor Plate',
    weight = 500,
    stack = true,
    slot = 'plate', -- ADD THIS
},

['armour'] = {
    label = 'Bulletproof Vest',
    weight = 3000,
    stack = false,
    slot = 'vest', -- ADD THIS
},

['parachute'] = {
    label = 'Parachute',
    weight = 8000,
    stack = false,
    slot = 'backpack', -- ADD THIS
},

['wallet'] = {
    label = 'Wallet',
    weight = 50,
    stack = false,
    slot = 'wallet', -- ADD THIS
},
```

**Weapon examples:**

```lua
-- In data/weapons.lua

Weapons = {
    -- PRIMARY WEAPONS
    ['WEAPON_ASSAULTRIFLE'] = {
        label = 'Assault Rifle',
        weight = 4500,
        durability = 0.03,
        ammoname = 'ammo-rifle2',
        slot = 'weapon-primary', -- ADD THIS
    },
    
    ['WEAPON_PUMPSHOTGUN'] = {
        label = 'Pump Shotgun',
        weight = 3200,
        durability = 0.05,
        ammoname = 'ammo-shotgun',
        slot = 'weapon-primary', -- ADD THIS
    },
    
    -- SECONDARY WEAPONS
    ['WEAPON_PISTOL'] = {
        label = 'Pistol',
        weight = 970,
        durability = 0.1,
        ammoname = 'ammo-9',
        slot = 'weapon-secondary', -- ADD THIS
    },
    
    ['WEAPON_COMBATPISTOL'] = {
        label = 'Combat Pistol',
        weight = 1100,
        durability = 0.1,
        ammoname = 'ammo-9',
        slot = 'weapon-secondary', -- ADD THIS
    },
    
    -- MELEE WEAPONS
    ['WEAPON_KNIFE'] = {
        label = 'Knife',
        weight = 300,
        durability = 0.1,
        slot = 'weapon-melee', -- ADD THIS
    },
    
    ['WEAPON_BAT'] = {
        label = 'Baseball Bat',
        weight = 1100,
        durability = 0.1,
        slot = 'weapon-melee', -- ADD THIS
    },
}
```

---

### Step 4: Implement Keybind System (Client)

**File to create/modify:** `modules/inventory/client.lua`

**Add keybind registrations:**

```lua
-- Register keybinds for dedicated slots
RegisterKeyMapping('equipment_backpack', 'Backpack (F2)', 'keyboard', 'F2')
RegisterKeyMapping('equipment_plate', 'Armor Plate (F3)', 'keyboard', 'F3')
RegisterKeyMapping('equipment_vest', 'Vest (F4)', 'keyboard', 'F4')
RegisterKeyMapping('equipment_secondary', 'Secondary Weapon (F5)', 'keyboard', 'F5')
RegisterKeyMapping('equipment_phone', 'Phone (F6)', 'keyboard', 'F6')
RegisterKeyMapping('equipment_primary', 'Primary Weapon (F7)', 'keyboard', 'F7')
RegisterKeyMapping('equipment_melee', 'Melee Weapon (F8)', 'keyboard', 'F8')
RegisterKeyMapping('equipment_wallet', 'Wallet (F9)', 'keyboard', 'F9')

-- Keybind handlers
local function useEquipmentSlot(slotType, slotIndex)
    -- Don't trigger if inventory is open
    if currentInventory then return end
    
    -- Don't trigger if player is dead, cuffed, etc.
    if IsEntityDead(PlayerPedId()) or IsPlayerFreeAiming(PlayerId()) then return end
    
    local inventory = PlayerData.inventory
    if not inventory or not inventory[slotIndex] then return end
    
    local item = inventory[slotIndex]
    if not item or not item.name then 
        -- Slot is empty
        lib.notify({
            type = 'error',
            description = string.format('%s slot is empty', slotType)
        })
        return 
    end
    
    -- Trigger slot-specific actions
    if slotType == 'weapon-primary' or slotType == 'weapon-secondary' or slotType == 'weapon-melee' then
        -- Equip weapon
        TriggerServerEvent('ox_inventory:equipWeapon', item)
    elseif slotType == 'phone' then
        -- Open phone
        TriggerEvent('phone:open')
    elseif slotType == 'wallet' then
        -- Open wallet UI
        TriggerEvent('wallet:open')
    elseif slotType == 'vest' then
        -- Equip/remove vest
        TriggerServerEvent('ox_inventory:equipArmor', item)
    else
        -- Generic use item
        TriggerServerEvent('ox_inventory:useSlot', slotIndex)
    end
end

-- Register commands
RegisterCommand('equipment_backpack', function()
    local totalSlots = #PlayerData.inventory
    useEquipmentSlot('backpack', totalSlots - 7)
end, false)

RegisterCommand('equipment_plate', function()
    local totalSlots = #PlayerData.inventory
    useEquipmentSlot('plate', totalSlots - 6)
end, false)

RegisterCommand('equipment_vest', function()
    local totalSlots = #PlayerData.inventory
    useEquipmentSlot('vest', totalSlots - 5)
end, false)

RegisterCommand('equipment_secondary', function()
    local totalSlots = #PlayerData.inventory
    useEquipmentSlot('weapon-secondary', totalSlots - 4)
end, false)

RegisterCommand('equipment_phone', function()
    local totalSlots = #PlayerData.inventory
    useEquipmentSlot('phone', totalSlots - 3)
end, false)

RegisterCommand('equipment_primary', function()
    local totalSlots = #PlayerData.inventory
    useEquipmentSlot('weapon-primary', totalSlots - 2)
end, false)

RegisterCommand('equipment_melee', function()
    local totalSlots = #PlayerData.inventory
    useEquipmentSlot('weapon-melee', totalSlots - 1)
end, false)

RegisterCommand('equipment_wallet', function()
    local totalSlots = #PlayerData.inventory
    useEquipmentSlot('wallet', totalSlots)
end, false)
```

---

### Step 5: Create Equipment Slot API Functions

**File to modify:** `modules/inventory/server.lua`

**Add exports:**

```lua
-- Get item from dedicated slot
exports('getEquipmentSlot', function(source, slotType)
    local inventory = Inventory(source)
    if not inventory then return nil end
    
    local slotIndex = getDedicatedSlotIndex(slotType, inventory.slots)
    return inventory.items[slotIndex]
end)

-- Set item in dedicated slot
exports('setEquipmentSlot', function(source, slotType, item)
    local inventory = Inventory(source)
    if not inventory then return false end
    
    local slotIndex = getDedicatedSlotIndex(slotType, inventory.slots)
    
    -- Validate item can go in this slot
    if item and item.name then
        local canMove, err = canMoveToSlot(item.name, slotIndex, inventory.slots)
        if not canMove then
            return false, err
        end
    end
    
    inventory.items[slotIndex] = item
    TriggerClientEvent('ox_inventory:updateSlots', source, { 
        { item = item, inventory = 'player' } 
    })
    return true
end)

-- Check if player has item in specific slot
exports('hasEquipmentSlot', function(source, slotType, itemName)
    local item = exports.ox_inventory:getEquipmentSlot(source, slotType)
    if not item or not item.name then return false end
    if itemName then
        return item.name == itemName
    end
    return true
end)

-- Helper function
function getDedicatedSlotIndex(slotType, totalSlots)
    local offsets = {
        ['wallet'] = 0,
        ['weapon-melee'] = 1,
        ['weapon-primary'] = 2,
        ['phone'] = 3,
        ['weapon-secondary'] = 4,
        ['vest'] = 5,
        ['plate'] = 6,
        ['backpack'] = 7,
    }
    return totalSlots - (offsets[slotType] or 0)
end
```

---

### Step 6: Implement Armor Plate System

**File to modify:** `modules/inventory/server.lua`

```lua
-- Calculate total armor from vest + plate
function CalculatePlayerArmor(source)
    local vest = exports.ox_inventory:getEquipmentSlot(source, 'vest')
    local plate = exports.ox_inventory:getEquipmentSlot(source, 'plate')
    
    local baseArmor = 0
    local plateArmor = 0
    
    if vest and vest.name then
        local vestData = Items(vest.name)
        baseArmor = vestData.armor or 50
    end
    
    if plate and plate.name then
        local plateData = Items(plate.name)
        plateArmor = plateData.armor or 50
        
        -- Apply plate durability modifier
        if plate.metadata and plate.metadata.durability then
            plateArmor = plateArmor * (plate.metadata.durability / 100)
        end
    end
    
    return math.min(100, baseArmor + plateArmor)
end

-- Damage plate on hit
RegisterNetEvent('damage:armorPlate')
AddEventHandler('damage:armorPlate', function(damage)
    local source = source
    local plate = exports.ox_inventory:getEquipmentSlot(source, 'plate')
    
    if not plate or not plate.name then return end
    
    -- Reduce durability
    local durability = (plate.metadata and plate.metadata.durability) or 100
    durability = durability - (damage or 10)
    
    if durability <= 0 then
        -- Plate destroyed
        exports.ox_inventory:setEquipmentSlot(source, 'plate', nil)
        TriggerClientEvent('ox_lib:notify', source, {
            type = 'error',
            description = 'Your armor plate shattered!'
        })
    else
        -- Update durability
        plate.metadata = plate.metadata or {}
        plate.metadata.durability = durability
        exports.ox_inventory:setEquipmentSlot(source, 'plate', plate)
    end
    
    -- Update player armor
    local newArmor = CalculatePlayerArmor(source)
    SetPedArmour(GetPlayerPed(source), newArmor)
end)
```

---

### Step 7-15: Additional Implementation Steps

Due to length constraints, the remaining steps follow similar patterns:

- **Step 7 (Weapon Quick-Equip):** Create weapon switching logic using `SetCurrentPedWeapon`
- **Step 8 (Phone/Wallet):** Integrate with existing phone/wallet resources
- **Step 9 (Backpack Expansion):** Dynamically adjust `inventory.slots` when backpack equipped
- **Step 10 (Search Filtering):** Apply `isDedicatedSlot` filter in search/admin views
- **Step 11 (Migration):** SQL script + Lua converter for existing inventories
- **Step 12 (Logging):** Add debug commands and metrics tracking
- **Step 13 (Framework Testing):** Test across ESX/QB/ox/ND
- **Step 14 (Optimization):** Cache validation, rate limiting
- **Step 15 (Documentation):** Create admin guides and API docs

---

## Testing Checklist

After implementation, test these scenarios:

- [ ] Player spawns with 50 inventory slots
- [ ] Items with `slot` property can only be placed in matching slots
- [ ] Items without `slot` property cannot be placed in dedicated slots
- [ ] F2-F9 keybinds trigger correct actions
- [ ] Armor = vest + plate combined value
- [ ] Plate takes damage and breaks at 0 durability
- [ ] Weapons equip/unequip from keybinds
- [ ] Phone/wallet open from keybinds
- [ ] Backpack adds inventory slots when equipped
- [ ] Search/admin views filter dedicated slots correctly
- [ ] Migration moves existing items to dedicated slots
- [ ] Multi-framework compatibility (ESX/QB/ox/ND)

---

## Support Resources

- Original documentation: `DEDICATED_SLOTS_WHITELIST.md`
- Quick reference: `QUICK_REFERENCE.md`
- Frontend implementation: `IMPLEMENTATION_SUMMARY.md`
- Plate system changes: `MONEY_TO_PLATE_CHANGE.md`

For issues, check the console for validation errors and use debug commands to inspect slot states.
