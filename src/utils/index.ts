import { UIWebsite } from '@workadventure/iframe-api-typings';
import { Item } from '../inventory';
import { RemotePlayerInterface } from '@workadventure/iframe-api-typings/play/src/front/Api/Iframe/Players/RemotePlayer';
import { EXCHANGE_LIST } from '../exchange';

// Utilitary functions to handle adding and removing items in lists
export const getPlayerList = async (
  listVariableName: string,
): Promise<Item[]> => {
  const list = (await WA.player.state.loadVariable(listVariableName)) as Item[];
  return list ?? [];
};

export const clearPlayerList = async (
  listVariableName: string,
  options?: { public?: boolean; persist?: boolean },
): Promise<void> => {
  await WA.player.state.saveVariable(listVariableName, [], {
    public: true,
    ...options,
  });
};

export const addItemToPlayerList = async (
  item: Item,
  listVariableName: string,
  options?: { public?: boolean; persist?: boolean },
): Promise<Item[]> => {
  const list = await getPlayerList(listVariableName);
  list.push(item);
  await WA.player.state.saveVariable(listVariableName, list, {
    public: true,
    ...options,
  });
  return list;
};

export const removeItemFromPlayerList = async (
  item: Item,
  listVariableName: string,
  options?: { public?: boolean; persist?: boolean },
): Promise<Item[]> => {
  const list = await getPlayerList(listVariableName);

  list.forEach((currentItem: Item, index: number) => {
    if (currentItem.id === item.id) {
      list.splice(index, 1);
    }
  });

  await WA.player.state.saveVariable(listVariableName, list, {
    public: true,
    ...options,
  });

  return list;
};

export const clearItemsFromPlayerList = async (
  listVariableName: string,
  options?: { public?: boolean; persist?: boolean },
): Promise<void> => {
  await WA.player.state.saveVariable(listVariableName, [], options);
};

export async function getItemByIdFromPlayerList(
  id: string,
): Promise<Item | undefined> {
  return (await getPlayerList(EXCHANGE_LIST)).find((item) => item.id === id);
}

export async function getItemById(id: string): Promise<Item | undefined> {
  return (await getPlayerList('inventory')).find((item) => item.id === id);
}

export async function getIframeById(
  id: string,
): Promise<UIWebsite | undefined> {
  return WA.ui.website.getById(id);
}

export const getRemotePlayerByUuid = async (
  uuid: string,
): Promise<RemotePlayerInterface | null> => {
  await WA.players.configureTracking({ players: true });
  const allPlayers = WA.players.list();

  for (const player of allPlayers) {
    if (player.uuid === uuid) {
      return player;
    }
  }
  return null;
};
