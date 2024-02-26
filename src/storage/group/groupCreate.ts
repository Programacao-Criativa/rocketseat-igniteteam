import AsyncStorage from "@react-native-async-storage/async-storage";
import {GROUP_COLLECTION} from "@storage/storageConfig";
import {groupsList} from "@storage/group/groupsList";
import {AppError} from "@utils/AppError";

export async function groupCreate(newGroupName: string) {
    try {
        const storedGroups = await groupsList();

        const groupAlreadyExists = storedGroups.includes(newGroupName);

        if (groupAlreadyExists) {
            throw new AppError('Já existe um grupo cadastrado com esse nome..');
        }

        const payload = JSON.stringify([...storedGroups, newGroupName])

        await AsyncStorage.setItem(GROUP_COLLECTION, payload);
    } catch (error) {
        throw error;
    }
}