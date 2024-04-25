/// <reference types="@workadventure/iframe-api-typings" />

import { initializeExchangeSystem } from './exchange';
import { initializeInventorySystem } from './inventory';

const main = async (): Promise<void> => {
  await WA.onInit();
  await initializeInventorySystem();
  await initializeExchangeSystem();

  WA.ui.onRemotePlayerClicked.subscribe((remotePlayer) => {
    remotePlayer.addAction('Voir inventaire', () => {
      console.log(remotePlayer.state.inventory);
    });
  });

  async function logInventories() {
    await WA.players.configureTracking();
    const players = WA.players.list();
    for (const player of players) {
      console.log(player.name, ' ', player);
    }
    console.log(WA.player.name, ' ', WA.player.state.inventory);
  }

  WA.player.onPlayerMove(logInventories);
};

main();
