import { type Item } from './item';
import { UIWebsite } from '@workadventure/iframe-api-typings';
import itemsJson from './items.json';

export { type Item };

const INVENTORY_VARIABLE_NAME: string = 'inventory';
const items: Item[] = itemsJson.items;

function compareByName(a: Item, b: Item) {
  const nameA = a.name.toUpperCase();
  const nameB = b.name.toUpperCase();

  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  return 0;
}

export const getPlayerInventory = async (): Promise<Item[]> => {
  const inventory = (await WA.player.state.loadVariable(
    INVENTORY_VARIABLE_NAME,
  )) as Item[];

  return inventory.sort(compareByName);
};

export const initPlayerInventory = async (): Promise<void> => {
  const inventory = await getPlayerInventory();
  if (inventory === undefined) {
    await WA.player.state.saveVariable(INVENTORY_VARIABLE_NAME, [], { public: true, persist: true });
  }
};

export const clearPlayerInventory = async (): Promise<void> => {
  await WA.player.state.saveVariable(INVENTORY_VARIABLE_NAME, []);
};

export const addPlayerItem = async (item: Item): Promise<Item[]> => {
  const inventory = await getPlayerInventory();
  inventory.push(item);
  await WA.player.state.saveVariable(INVENTORY_VARIABLE_NAME, inventory);
  return inventory;
};

export const removePlayerItem = async (item: Item): Promise<Item[]> => {
  const inventory = await getPlayerInventory();

  inventory.forEach((currentItem: Item, index: number) => {
    if (currentItem.id === item.id) {
      inventory.splice(index, 1);
    }
  });

  await WA.player.state.saveVariable(INVENTORY_VARIABLE_NAME, inventory);

  return inventory;
};

export const initializeInventorySystem = async (): Promise<void> => {
  await initPlayerInventory();
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
