/// <reference types="@workadventure/iframe-api-typings" />

import { UIWebsite } from '@workadventure/iframe-api-typings';
import {
  Item,
  addPlayerItem,
  clearPlayerInventory,
  initPlayerInventory,
} from './inventory';
import itemsJson from './inventory/items.json';
import { RemotePlayer } from "@workadventure/iframe-api-typings/play/src/front/Api/Iframe/Players/RemotePlayer";

const items: Item[] = itemsJson.items;

// Waiting for the API to be ready
(async () => {
  await WA.onInit();

  await initPlayerInventory();

  await clearPlayerInventory();
  for (const item of items) {
    await addPlayerItem(item);
  }

  WA.ui.onRemotePlayerClicked.subscribe((remotePlayer: RemotePlayer) => {
    remotePlayer.addAction('voir invetaire', () => {
      console.log(remotePlayer.state.inventory);
    });
  })

  async function logInventories() {
    await WA.players.configureTracking();
    const players = WA.players.list();
    for (const player of players) {
      console.log(player.name, ' ', player);
    }
    console.log(WA.player.name, ' ', WA.player.state.inventory);

  }

  WA.player.onPlayerMove(logInventories);

  let inventoryIframe: UIWebsite | undefined;

  WA.ui.actionBar.addButton({
    id: 'inventory-btn',
    type: 'action',
    imageSrc: 'https://cdn-icons-png.flaticon.com/512/4138/4138061.png',
    toolTip: 'Inventaire',
    callback: async () => {
      if (!inventoryIframe) {
        inventoryIframe = await WA.ui.website.open({
          url: '/src/test.html',
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
})();
