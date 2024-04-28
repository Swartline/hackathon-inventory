/// <reference types="@workadventure/iframe-api-typings" />

import { initializeExchangeSystem } from './exchange';
import { initializeInventorySystem } from './inventory';

const main = async (): Promise<void> => {
  await WA.onInit();
  await initializeInventorySystem();

  WA.ui.onRemotePlayerClicked.subscribe((remotePlayer) => {
    remotePlayer.addAction('Voir inventaire', () => {
      console.warn('Not implemented');
      console.warn(remotePlayer.state.inventory);
    });
  });

  await initializeExchangeSystem();
};

main();
