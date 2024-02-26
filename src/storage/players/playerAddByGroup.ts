import AsyncStorage from "@react-native-async-storage/async-storage";

import {AppError} from '@utils/AppError';

import {PLAYER_COLLECTION} from '@storage/storageConfig'

import {PlayerStorageDTO} from './PlayerStorageDTO';
import {playersListByGroup} from "@storage/players/playersListByGroup";

export async function playerAddByGroup(newPlayer: PlayerStorageDTO, group: string) {
    try {
        const storedPlayers = await playersListByGroup(group);

        const playerAlreadyExists = storedPlayers.filter(
            player => player.name === newPlayer.name
        )

        if (playerAlreadyExists.length > 0) {
            throw new AppError('Essa pessoa já está cadastrada em outro time.');
        }

        const payload = JSON.stringify([...storedPlayers, newPlayer]);

        await AsyncStorage.setItem(`${PLAYER_COLLECTION}-${group}`, payload);
    } catch (error) {
        throw (error);
    }
}