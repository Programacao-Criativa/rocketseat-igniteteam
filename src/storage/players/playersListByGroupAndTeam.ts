import AsyncStorage from "@react-native-async-storage/async-storage";
import {playersListByGroup} from './playersListByGroup'

export async function playersListByGroupAndTeam(group: string, team: string) {
    try {
        const storage = await playersListByGroup(group);

        const players = storage.filter(player => player.team === team);

        return players;
    } catch(error) {
        throw error;
    }
}