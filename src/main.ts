/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from '@workadventure/scripting-api-extra';
import { addItem, getItems, removeItem, setItems } from './item/functions';
import { Item } from './item/item';
import itemsJson from './item/items.json';

const items: Array<Item> = itemsJson.items;

// Waiting for the API to be ready
WA.onInit()
  .then(() => {
    bootstrapExtra().catch((e) => console.error(e));

    // TODO remove this
    setItems(items);

    removeItem(items[0]);
    console.log(getItems());

    addItem(items[0]);
    console.log(getItems());
  })
  .catch((e) => console.error(e));
