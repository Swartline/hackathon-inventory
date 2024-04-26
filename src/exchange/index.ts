import { UIWebsite } from "@workadventure/iframe-api-typings";
import { Item, openInventoryLeft } from "../inventory";
import { addItemToPlayerList, removeItemFromPlayerList } from "../utils";
import { RemotePlayer } from "@workadventure/iframe-api-typings/play/src/front/Api/Iframe/Players/RemotePlayer";

export const EXCHANGE_PARTNER_UUID = "exchange_partner_uuid";
export const EXCHANGE_LIST = "exchange_list";

const addExchangeButton = (): void => {
  WA.ui.onRemotePlayerClicked.subscribe((remotePlayer) => {
    remotePlayer.addAction("Échanger", async () => {
      await WA.player.state.saveVariable(
        EXCHANGE_PARTNER_UUID,
        remotePlayer.uuid,
        {
          public: true,
          persist: false,
        }
      );
    });
  });
};

export const addExchangeItem = async (item: Item): Promise<Item[]> => {
  const proposedItems = await addItemToPlayerList(item, EXCHANGE_LIST);
  return proposedItems;
};

export const removeExchangeItem = async (item: Item): Promise<Item[]> => {
  const newExchangeList = await removeItemFromPlayerList(item, EXCHANGE_LIST);
  return newExchangeList;
};

export const openExchange = async (): Promise<UIWebsite> => {
  const iframeExchange = await WA.ui.website.open({
    url: "./src/exchange/iframe/exchange.html",
    position: {
      vertical: "middle",
      horizontal: "right",
    },
    size: {
      height: "50vh",
      width: "50vw",
    },
    allowApi: true,
  });
  WA.player.state.exchange_id = iframeExchange.id;
  return iframeExchange;
};

export const initializeExchangeSystem = async (): Promise<void> => {
  await WA.players.configureTracking({
    players: true,
    movement: false,
  });

  WA.player.state.saveVariable(EXCHANGE_PARTNER_UUID, null);

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
          }
        );

        // TODO: display exchange iframe
        console.log(`Displaying exchange iframe for player ${WA.player.uuid}`);
        await openInventoryLeft();
        await openExchange();
      }
    });

  addExchangeButton();
};
