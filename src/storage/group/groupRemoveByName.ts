import AsyncStorage from "@react-native-async-storage/async-storage";

import {GROUP_COLLECTION, PLAYER_COLLECTION} from '@storage/storageConfig';

import {groupsList} from './groupsList';

export async function groupRemoveByName(groupToRemove: string) {
    try {
        const storedGroups = await groupsList();
        const groups = storedGroups.filter(group => group !== groupToRemove);

        await AsyncStorage.setItem(GROUP_COLLECTION, JSON.stringify(groups));
        await AsyncStorage.removeItem(`${PLAYER_COLLECTION}-${groupToRemove}`);
    } catch (error) {
        throw error;
    }
}