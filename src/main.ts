/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from '@workadventure/scripting-api-extra';
import { addItem, getItems, removeItem, setItems } from './items/functions';
import { Item } from './items/item';
import itemsJson from './items/items.json';
<<<<<<< HEAD
import { addInInventory, initInventory, getInventory, removeInventory } from "./inventories/functions";

=======
>>>>>>> 93b1b24 (fix import)

const items: Array<Item> = itemsJson.items;

// Waiting for the API to be ready
WA.onInit()
  .then(() => {
    initInventory()
    bootstrapExtra().catch((e) => console.error(e));

  })
  .catch((e) => console.error(e));
