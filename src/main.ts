/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from '@workadventure/scripting-api-extra';
import { initInventory } from './inventories/functions';

// Waiting for the API to be ready
WA.onInit()
  .then(() => {
    initInventory();
    bootstrapExtra().catch((e) => console.error(e));
  })
  .catch((e) => console.error(e));
