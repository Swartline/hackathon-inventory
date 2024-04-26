import { Item } from "../inventory";
import { addItemToPlayerList, removeItemFromPlayerList } from "../utils";

const EXCHANGE_PARTNER_UUID = "exchange_partner_uuid";
const EXCHANGE_LIST = "exchange_list";

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
      }
    });

  addExchangeButton();
};
