/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from '@workadventure/scripting-api-extra';
import { addItem, getItems, removeItem, setItems } from './item/functions';
import { Item } from './item/item';
import { addInInventory, initInventory, getInventory, removeInventory } from "./inventory/functions";
import itemsJson from './item/items.json';

const items: Array<Item> = itemsJson.items;

// Waiting for the API to be ready
WA.onInit()
  .then(() => {
    initInventory()
    bootstrapExtra().catch((e) => console.error(e));

  })
  .catch((e) => console.error(e));
