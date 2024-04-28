import { UIWebsite } from '@workadventure/iframe-api-typings';
import { Item, addPlayerItem, openInventoryLeft } from '../inventory';
import {
  addItemToPlayerList,
  clearPlayerList,
  getIframeById,
  removeItemFromPlayerList,
} from '../utils';

export const EXCHANGE_PARTNER_UUID = 'exchange_partner_uuid';
export const EXCHANGE_LIST = 'exchange_list';

const addExchangeButton = (): void => {
  WA.ui.onRemotePlayerClicked.subscribe((remotePlayer) => {
    remotePlayer.addAction('Échanger', async () => {
      await WA.player.state.saveVariable(
        EXCHANGE_PARTNER_UUID,
        remotePlayer.uuid,
        {
          public: true,
          persist: false,
        },
      );
    });
  });
};

export const addExchangeItem = async (item: Item): Promise<Item[]> => {
  const proposedItems = await addItemToPlayerList(item, EXCHANGE_LIST);
  console.log(proposedItems);
  return proposedItems;
};

export const removeExchangeItem = async (item: Item): Promise<Item[]> => {
  const newExchangeList = await removeItemFromPlayerList(item, EXCHANGE_LIST);
  return newExchangeList;
};

export const openExchange = async (): Promise<UIWebsite> => {
  const iframeExchange = await WA.ui.website.open({
    url: './src/exchange/iframe/exchange.html',
    position: {
      vertical: 'middle',
      horizontal: 'right',
    },
    size: {
      height: '50vh',
      width: '50vw',
    },
    allowApi: true,
  });
  WA.player.state.exchange_id = iframeExchange.id;
  await openInventoryLeft();
  return iframeExchange;
};

// Return items to the player
export const returnItemsToPlayer = async () => {
  const localItemsForExchange = WA.player.state[EXCHANGE_LIST] as Item[];

  for (const item of localItemsForExchange) {
    await addPlayerItem(item);
  }

  await clearPlayerList(EXCHANGE_LIST);
};

export async function closeInventoryAndExchangeIframes(): Promise<void> {
  const inventoryIframe = await getIframeById(
    String(WA.player.state.inventory_id),
  );
  const exchangeIframe = await getIframeById(
    String(WA.player.state.exchange_id),
  );

  await returnItemsToPlayer();

  if (inventoryIframe) {
    inventoryIframe.close();
  }
  if (exchangeIframe) {
    exchangeIframe.close();
  }
}

export const initializeExchangeSystem = async (): Promise<void> => {
  await WA.players.configureTracking({ players: true });

  WA.player.state.saveVariable(EXCHANGE_PARTNER_UUID, null, { public: true });
  WA.player.state.saveVariable(EXCHANGE_LIST, [], { public: true });

  WA.players
    .onVariableChange(EXCHANGE_PARTNER_UUID)
    .subscribe(async (event) => {
      if (event.value === WA.player.uuid) {
        await WA.player.state.saveVariable(
          EXCHANGE_PARTNER_UUID,
          event.player.uuid,
          {
            public: true,
            persist: false,
          },
        );
        await openExchange();
      }
    });

  addExchangeButton();
};
