/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from '@workadventure/scripting-api-extra';
import {items} from './items/items.json'
import { initInventory, getInventory, addInInventory, removeInventory, getOthersInventory } from './inventories/functions';
import { RemotePlayer } from "@workadventure/iframe-api-typings/play/src/front/Api/Iframe/Players/RemotePlayer";

// Waiting for the API to be ready
WA.onInit()
  .then(() => {
    initInventory()


    WA.ui.onRemotePlayerClicked.subscribe((remotePlayer: RemotePlayer) => {
        remotePlayer.addAction('voir invetaire', () => {
            console.log(remotePlayer.state.inventory);
        });
    })

    bootstrapExtra().catch((e) => console.error(e));
    
    if (getInventory().length === 0) {
      items.forEach(item => {
        addInInventory(item)
        console.log('add')
      });
      removeInventory(2)
      removeInventory(4)
      removeInventory(6)
    }

    // console.log(WA.player.name, getInventory());

    async function logInventories() {
      await WA.players.configureTracking();
      const players = WA.players.list();
      for (const player of players) {
          console.log(player.name, ' ', player);
      }
      console.log(WA.player.name, ' ', WA.player.state.inventory);

    }

    WA.player.onPlayerMove(logInventories);
    

  })
  .catch((e) => console.error(e));
