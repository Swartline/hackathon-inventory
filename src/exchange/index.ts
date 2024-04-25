const EXCHANGE_PARTNER_UUID = 'exchange_partner_uuid';

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
          },
        );

        // TODO: display exchange iframe
        console.log(`Displaying exchange iframe for player ${WA.player.uuid}`);
      }
    });

  addExchangeButton();
};
