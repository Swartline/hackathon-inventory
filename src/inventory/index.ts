import { type Item } from '../utils/item';
import { UIWebsite } from '@workadventure/iframe-api-typings';
import itemsJson from './items.json';
import {
  addItemToPlayerList,
  getPlayerList,
  removeItemFromPlayerList,
} from '../utils';

export { type Item };

const INVENTORY: string = 'inventory';
const items: Item[] = itemsJson.items;

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

export const initializeInventorySystem = async (): Promise<void> => {
  await clearPlayerInventory();

  // Add sample items
  for (const item of items) {
    await addPlayerItem(item);
  }

  let inventoryIframe: UIWebsite | undefined;

  WA.ui.actionBar.addButton({
    id: 'inventory-btn',
    type: 'action',
    imageSrc: 'https://cdn-icons-png.flaticon.com/512/4138/4138061.png',
    toolTip: 'Inventaire',
    callback: async () => {
      if (!inventoryIframe) {
        inventoryIframe = await WA.ui.website.open({
          url: '/src/inventory/iframe/inventory.html',
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
        inventoryIframe.position.vertical = 'top';

        WA.player.state.inventory_open = true;
        WA.player.state.inventory_id = inventoryIframe.id;
      } else {
        inventoryIframe.close();
        inventoryIframe = undefined;
        WA.player.state.inventory_open = false;
      }
    },
  });

  WA.player.state.onVariableChange('inventory_open').subscribe((value) => {
    if (!value) {
      inventoryIframe = undefined;
    }
  });
};
