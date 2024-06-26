import { type Item } from '../utils/item';
import { UIWebsite } from '@workadventure/iframe-api-typings';
import itemsJson from './items.json';
import {
  addItemToPlayerList,
  getIframeById,
  getPlayerList,
  removeItemFromPlayerList,
} from '../utils';

export { type Item };

export const INVENTORY: string = 'inventory';
let items = itemsJson.items;
items = items.map((item) => {
  const newItem = { id: crypto.randomUUID(), ...item };
  return newItem;
}) as Item[];

const compareByName = (a: Item, b: Item) => {
  const nameA = a.name.toUpperCase();
  const nameB = b.name.toUpperCase();

  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  return 0;
};

export const getPlayerInventory = async (): Promise<Item[]> => {
  const inventory = await getPlayerList(INVENTORY);
  if (!inventory) {
    return [];
  }
  return inventory.sort(compareByName);
};

export const clearPlayerInventory = async (): Promise<void> => {
  await WA.player.state.saveVariable(INVENTORY, []);
};

export const addPlayerItem = async (item: Item): Promise<Item[]> => {
  const inventory = await addItemToPlayerList(item, INVENTORY);
  return inventory;
};

export const removePlayerItem = async (item: Item): Promise<Item[]> => {
  const newInventory = await removeItemFromPlayerList(item, INVENTORY);
  return newInventory;
};

export const openInventory = async (): Promise<UIWebsite> => {
  const inventoryIframe = await WA.ui.website.open({
    url: './src/inventory/iframe/inventory.html',
    position: {
      vertical: 'middle',
      horizontal: 'middle',
    },
    size: {
      height: '50vh',
      width: '50vw',
    },
    allowApi: true,
  });

  WA.player.state.inventory_open = true;
  WA.player.state.inventory_id = inventoryIframe.id;

  return inventoryIframe;
};

export const openInventoryLeft = async (): Promise<UIWebsite> => {
  const inventoryIframe = await WA.ui.website.open({
    url: './src/inventory/iframe/inventory.html',
    position: {
      vertical: 'middle',
      horizontal: 'left',
    },
    size: {
      height: '50vh',
      width: '50vw',
    },
    allowApi: true,
  });

  WA.player.state.inventory_open = true;
  WA.player.state.inventory_id = inventoryIframe.id;

  return inventoryIframe;
};

export const closeInventory = async (): Promise<void> => {
  const inventoryIframe = await getIframeById(
    String(WA.player.state.inventory_id),
  );
  inventoryIframe?.close();
  WA.player.state.inventory_open = false;
};

export const initializeInventorySystem = async (): Promise<void> => {
  await clearPlayerInventory();

  // Add sample items
  for (const item of items as Item[]) {
    await addPlayerItem(item);
  }

  let inventoryIframe: UIWebsite | undefined;

  WA.ui.actionBar.addButton({
    id: 'inventory-btn',
    type: 'action',
    imageSrc:
      'https://ryanmalonzo.github.io/workadventure-inventory-icons/backpack.png',
    toolTip: 'Inventaire',
    callback: async () => {
      if (!inventoryIframe) {
        inventoryIframe = await openInventory();
      } else {
        await closeInventory();
        inventoryIframe = undefined;
      }
    },
  });

  WA.player.state.onVariableChange('inventory_open').subscribe((value) => {
    if (!value) {
      inventoryIframe = undefined;
    }
  });
};
