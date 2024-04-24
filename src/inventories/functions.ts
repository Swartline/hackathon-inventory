import { Item } from '../items/item';

export const getInventory = (): Array<Item> => {
    const inventory: Array<Item> = WA.player.state.loadVariable("inventory") as Array<Item>

    function compareByName(a: Item, b: Item) {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
    
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    }

    inventory.sort(compareByName)

    return inventory
};

export const initInventory = () =>{
    if (getInventory() === undefined) {
        WA.player.state.saveVariable("inventory", []);
    }
};

export const addInInventory = (item: Item) => {
    const playerInventory = getInventory()
    playerInventory.push(item)
    WA.player.state.saveVariable("inventory", playerInventory);

    return playerInventory
};

export const removeInventory = (item_id: number) => {
    const playerInventory = getInventory()
    playerInventory.forEach((currentItem: Item, index: number) => {
        if (currentItem.id === item_id) {
            playerInventory.splice(index, 1 )
        }}
    );
    WA.player.state.saveVariable("inventory", playerInventory);

    return playerInventory;
  };