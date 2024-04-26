import { type Item } from '../utils/item';
import { UIWebsite } from '@workadventure/iframe-api-typings';
import itemsJson from './items.json';
import {
  addItemToPlayerList,
  clearPlayerList,
  getPlayerList,
  removeItemFromPlayerList,
} from '../utils';

export { type Item };

const INVENTORY: string = 'inventory';
const items: Item[] = itemsJson.items;

export const getPlayerInventory = async (): Promise<Item[]> => {
  const inventory = await getPlayerList(INVENTORY);
  return inventory;
};

export const clearPlayerInventory = async (): Promise<void> => {
  await clearPlayerList(INVENTORY);
};

export const addPlayerItem = async (item: Item): Promise<Item[]> => {
  const newInventory = await addItemToPlayerList(item, INVENTORY);
  return newInventory;
};

export const removePlayerItem = async (item: Item): Promise<Item[]> => {
  const newInventory = await removeItemFromPlayerList(item, INVENTORY);
  return newInventory;
};

export const initializeInventorySystem = async (): Promise<void> => {
  // TODO: remove
  // Load sample items
  await clearPlayerInventory();
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
