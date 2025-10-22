# AI Coding Agent Instructions for ox_inventory

## Project Overview
This is `ox_inventory` - a slot-based inventory system for FiveM supporting multiple frameworks (ESX, QB, ox_core, ND_Core) with server-side security, item metadata, weapon systems, and crafting. It's a dual-architecture project combining Lua server/client code with a React-based UI.

## Fork-Specific Goals
This fork focuses on enhanced UI/UX and specialized inventory features:

### 1. Visual Design Theme: "Sunset Orange, HighRise, Concrete Jungle"
- **Color Palette**: Sunset orange accents (#FF6B35, #FF8C42) with concrete grays (#6C7B7F, #9BA3A6)
- **Typography**: Modern, clean fonts suggesting urban/industrial aesthetic
- **Visual Style**: Sharp edges, metallic textures, urban-inspired design elements
- **Interactive Elements**: Hover states, smooth transitions, glowing effects on important items

### 2. Item Rarity System
- **Rarity Levels**: Common, Uncommon, Rare, Epic, Legendary
- **Visual Indicators**: Color-coded borders, glow effects, background gradients
- **UI Integration**: Rarity affects item appearance, sorting, and display priority

### 3. Dedicated Inventory Slots
- **3 Weapon Slots**: Primary, Secondary, Melee (dedicated weapon inventory area)
- **Wallet Slot**: Special slot for "wallet" item type
- **Backpack Slot**: Equippable backpack that provides additional inventory space
- **Plate Carrier Slot**: Armor slot for plate carrier equipment
- **Plate Slot**: Armor plate that goes into equipped plate carrier

### 4. Multi-Inventory Cycling System
- **Current Inventory**: Player's base inventory slots
- **Backpack Inventory**: Contents of equipped backpack (lowest slot index priority)
- **Ground Inventory**: Items dropped on ground/nearby
- **Cycling Interface**: Tab system or hotkey cycling between inventory views

## Architecture Understanding

### Core Components
- **Bridge System**: Framework-agnostic design using `modules/bridge/` with adapter pattern for ESX, QB, ox_core, ND_Core
- **Modular Structure**: Each feature is isolated in `modules/` (inventory, shops, crafting, weapons, items, etc.)
- **Dual Runtime**: Lua backend + React/TypeScript frontend in `web/` directory
- **Configuration-Driven**: Data files in `data/` define items, shops, stashes, vehicles, weapons

### Key Architectural Patterns

#### 1. Framework Bridge Pattern
```lua
-- Framework detection via convars
shared.framework = GetConvar('inventory:framework', 'esx')

-- Bridge modules adapt framework-specific APIs
-- Located in: modules/bridge/{esx,qbx,ox,nd}/
```

#### 2. Server-Client Split with NUI
- **Server**: Inventory state, validation, database operations (`server.lua`, `modules/inventory/server.lua`)
- **Client**: UI interactions, animations, weapon handling (`client.lua`, `modules/inventory/client.lua`) 
- **NUI**: React UI for inventory management (`web/src/`)

#### 3. Item Definition System
Items defined in `data/items.lua` with client/server callbacks:
```lua
['item_name'] = {
    label = 'Display Name',
    weight = 100,
    client = { anim = 'eating', usetime = 2500 },
    server = { export = 'resource.function' }
}
```

## Development Workflows

### Frontend Development (Primary Focus)
```powershell
cd web
pnpm install      # Install dependencies  
pnpm run dev      # Development server with hot reload
pnpm run build    # Production build (REQUIRED before testing)
```
**Critical**: UI must be built before testing - FiveM serves from `web/build/`

#### UI/UX Development Patterns
- **React Components**: Located in `web/src/components/` with drag-and-drop functionality
- **State Management**: Redux store in `web/src/store/` manages inventory state
- **Styling**: SCSS files for component styling, main styles in `web/src/index.scss`
- **Asset Management**: Item images in `web/images/` (PNG format, referenced by item name)
- **NUI Communication**: Uses `SendNUIMessage`/`RegisterNUICallback` for Lua ↔ React communication

#### Frontend Architecture
- **Main App**: `web/src/App.tsx` - Root component with inventory layouts
- **Drag & Drop**: `web/src/dnd/` - React DND implementation for item movement
- **Hooks**: `web/src/hooks/` - Custom React hooks for inventory logic
- **Utils**: `web/src/utils/` - Helper functions for UI calculations
- **Types**: `web/src/typings/` - TypeScript definitions for inventory data

#### Fork-Specific Implementation Areas
- **Dedicated Slots**: Create specialized slot components for weapons, wallet, backpack, armor
- **Rarity System**: Implement rarity metadata handling and visual rendering
- **Inventory Cycling**: Multi-view state management for current/backpack/ground inventories
- **Theme Implementation**: SCSS variables and mixins for "Sunset Orange, HighRise" aesthetic

### Backend Integration (Read-Only)
- **Item Data**: Modify `data/items.lua` only for adding new items/images
- **Localization**: Update `locales/*.json` for UI text changes
- **Configuration**: Use convars in server.cfg, never edit `init.lua` directly
- **NUI Callbacks**: Do NOT modify RegisterNUICallback functions in Lua files

## Critical Configuration Patterns

### Convar-Based Configuration
```lua
-- All settings via convars, not file edits
inventory:framework = 'esx'
inventory:slots = 50
inventory:weight = 30000
inventory:target = 1  # ox_target integration
```

### Security-First Design
- All item operations validated server-side
- Client sends requests, server authorizes and executes
- Distance/permission checks in `openInventory` functions
- Weapon state synchronized between client/server

### State Management
- Player inventory stored in `PlayerData.inventory` (client)
- Server maintains authoritative state in `Inventory` objects
- Real-time sync via `ox_inventory:updateSlots` events

## Common Integration Points

### Frontend UI Communication
```javascript
// NUI Messages FROM Lua to React (read existing patterns)
// These message types are already established:
SendNUIMessage({
    action = 'setupInventory',
    data = { leftInventory, rightInventory }
})

// NUI Callbacks TO Lua from React (do NOT modify)
// Work within existing callback structure:
// 'swapItems', 'useItem', 'giveItem', 'buyItem', etc.
```

### UI State Management
- **Redux Store**: Centralized state for inventory data, drag operations, UI state
- **Component State**: Local state for animations, modals, tooltips
- **NUI Focus**: Managed via `SetNuiFocus()` for input handling
- **Real-time Updates**: `ox_inventory:updateSlots` events sync UI with server
- **Inventory Views**: State management for cycling between current/backpack/ground inventories
- **Rarity Data**: Item rarity metadata integrated into Redux state

### Styling & Assets
- **Image Assets**: All item images in `web/images/` with `.png` extension
- **SCSS Architecture**: Component-scoped styles with global utilities
- **Theme Variables**: Sunset orange (#FF6B35, #FF8C42) and concrete gray (#6C7B7F, #9BA3A6) palette
- **Responsive Design**: UI adapts to different screen resolutions
- **Animation System**: CSS transitions for smooth item movements and rarity effects

## Development Commands

### Frontend Development
```powershell
# Development workflow
cd web
pnpm install              # Install dependencies
pnpm run dev             # Hot reload development server
pnpm run build           # Production build for testing
pnpm run watch           # Build with file watching

# Asset management
# Add new item images to web/images/ (PNG format)
# Image name must match item name in data/items.lua
```

### UI Testing & Debugging
- **Browser DevTools**: React DevTools work with NUI in development
- **Console Logging**: Use `console.log()` in React, visible in F8 console
- **State Inspection**: Redux DevTools available in development mode
- **Asset Validation**: Check browser network tab for missing images

## File Structure Logic
- `init.lua`: Configuration loading and dependency checks
- `client.lua`/`server.lua`: Main inventory logic entry points
- `modules/{feature}/`: Isolated feature implementations
- `data/`: Configuration files (items, shops, vehicles, etc.)
- `web/`: React UI with Redux state management
- `locales/`: Multi-language support files

## Performance Considerations
- **UI Rendering**: Minimize re-renders with proper React.memo usage
- **Asset Loading**: Lazy load images and use proper caching headers
- **Animation Performance**: Use CSS transforms over layout changes
- **State Updates**: Batch Redux actions to prevent UI flickering
- **Memory Management**: Clean up event listeners and intervals

## Common Pitfalls
- **Build frontend before testing** - changes won't appear until built
- **Image naming must match items** - missing images break UI loading  
- **NUI focus management** - improper focus handling breaks input
- **State sync timing** - UI updates must wait for server confirmation
- **CSS specificity conflicts** - use component-scoped styles when possible
- **Asset paths are case-sensitive** - ensure exact filename matches
- **Do NOT modify RegisterNUICallback** - work within existing callback structure
