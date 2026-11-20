import { useState } from 'react';
import { ITEMS } from '../data/recipes.js';

// Free CDN: Official Minecraft 1.21 textures via InventivetalentDev's GitHub repo
const BASE = 'https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.21/assets/minecraft/textures';

// Items that are in the item/ texture directory
const ITEM_TEXTURES = new Set([
  'iron_ingot','gold_ingot','diamond','emerald','coal','charcoal','stick','string',
  'flint','feather','leather','paper','book','redstone','glowstone_dust','blaze_rod',
  'blaze_powder','gunpowder','sugar_cane','wheat','bread','slimeball','brick',
  'quartz','nether_star','ender_pearl','eye_of_ender','bone_meal','ink_sac',
  'wooden_pickaxe','stone_pickaxe','iron_pickaxe','gold_pickaxe','diamond_pickaxe',
  'wooden_sword','stone_sword','iron_sword','gold_sword','diamond_sword',
  'wooden_axe','stone_axe','iron_axe','diamond_axe',
  'wooden_shovel','stone_shovel','iron_shovel','diamond_shovel',
  'wooden_hoe','stone_hoe','iron_hoe','diamond_hoe',
  'bow','arrow','fishing_rod','flint_and_steel','shears','bucket',
  'leather_helmet','leather_chestplate','leather_leggings','leather_boots',
  'iron_helmet','iron_chestplate','iron_leggings','iron_boots',
  'diamond_helmet','diamond_chestplate','diamond_leggings','diamond_boots',
  'compass','clock','map','lead',
]);

// Items that need special block texture names
const BLOCK_TEXTURE_OVERRIDES = {
  crafting_table: 'crafting_table_top',
  furnace: 'furnace_front_off',
  chest: null, // use emoji fallback
  wool: 'white_wool',
  nether_brick: 'nether_bricks',
  smooth_stone: 'stone_slab_top',
  clay: 'clay',
  piston: 'piston_top',
  sticky_piston: 'piston_top_sticky',
  dispenser: 'dispenser_front_horizontal',
  hopper: 'hopper_outside',
  redstone_torch: 'redstone_torch',
  redstone_lamp: 'redstone_lamp',
  repeater: 'repeater_off',
  comparator: 'comparator_off',
  note_block: 'note_block',
  jukebox: 'jukebox_top',
  lever: null, // emoji
  button: 'stone',
  pressure_plate: 'stone',
  anvil: 'anvil_top',
  enchanting_table: null, // complex
  brewing_stand: null,    // complex
  beacon: null,           // complex
};

function getTextureUrl(itemId, level) {
  if (level === 0) {
    // Try item/ directory first
    if (ITEM_TEXTURES.has(itemId)) {
      return `${BASE}/item/${itemId}.png`;
    }
    // Fall through to block
    return getTextureUrl(itemId, 1);
  }

  if (level === 1) {
    // Block texture
    if (BLOCK_TEXTURE_OVERRIDES[itemId] === null) return null; // force emoji
    const blockName = BLOCK_TEXTURE_OVERRIDES[itemId] || itemId;
    return `${BASE}/block/${blockName}.png`;
  }

  return null; // emoji fallback
}

/**
 * ItemIcon — renders a real Minecraft texture PNG with emoji fallback.
 * Uses InventivetalentDev/minecraft-assets on GitHub (free, no API key).
 *
 * Props:
 *   itemId   – the item key from recipes.js (e.g. 'diamond_pickaxe')
 *   size     – pixel size of the icon (default 32)
 *   style    – extra inline styles on the wrapper
 *   className
 */
export default function ItemIcon({ itemId, size = 32, style, className }) {
  const item = ITEMS[itemId];
  const [level, setLevel] = useState(0);

  if (!item) {
    return <span style={{ fontSize: size * 0.8, lineHeight: 1, ...style }}>❓</span>;
  }

  const url = getTextureUrl(itemId, level);

  // No valid URL left → show emoji
  if (!url) {
    return (
      <span
        className={className}
        style={{ fontSize: size * 0.75, lineHeight: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...style }}
        title={item.name}
      >
        {item.emoji}
      </span>
    );
  }

  return (
    <img
      src={url}
      alt={item.name}
      title={item.name}
      width={size}
      height={size}
      className={className}
      style={{
        imageRendering: 'pixelated',
        objectFit: 'contain',
        display: 'block',
        ...style,
      }}
      onError={() => {
        const nextLevel = level + 1;
        const nextUrl = getTextureUrl(itemId, nextLevel);
        if (nextUrl) {
          setLevel(nextLevel);
        } else {
          setLevel(99); // force emoji
        }
      }}
    />
  );
}
