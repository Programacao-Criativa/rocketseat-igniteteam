import { useState, useEffect, useRef } from "react";

import {Alert, FlatList, TextInput} from "react-native";
import { Container, Form, HeaderList, NumberOfPlayers } from './styles';

import {Header} from "@components/Header";
import {Highlight} from "@components/Highlight";
import {ButtonIcon} from "@components/ButtonIcon";
import {Input} from "@components/Input";
import {Filter} from "@components/Filter";
import {PlayerCard} from "@components/PlayerCard";
import {ListEmpty} from "@components/ListEmpty";
import {Button} from "@components/Button";
import {useNavigation, useRoute} from "@react-navigation/native";
import {AppError} from "@utils/AppError";
import {playerAddByGroup} from "@storage/players/playerAddByGroup";
import {playersListByGroupAndTeam} from "@storage/players/playersListByGroupAndTeam";
import {PlayerStorageDTO} from "@storage/players/PlayerStorageDTO";
import {playerRemoveByGroup} from "@storage/players/playerRemoveByGroup";
import {groupRemoveByName} from "@storage/group/groupRemoveByName";
import {Loading} from "@components/Loading";

type RouteParams = {
    group: string;
}

export default function Players() {
    const [isLoading, setIsLoading] = useState(true);
    const [playerName, setPlayerName] = useState('');
    const [team, setTeam] = useState('Time A');
    const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);

    const route = useRoute();
    const { group } = route.params as RouteParams;

    const navigation = useNavigation();

    const playerNameInputRef = useRef<TextInput>(null);

    async function handleAddPlayer() {
        if (playerName.trim().length === 0) {
            return Alert.alert('Nova pessoa', 'Informe o nome da pessoa que será adicionada.');
        }

        const newPlayer = {
            name: playerName,
            team
        }

        try {
            await playerAddByGroup(newPlayer, group);

            playerNameInputRef.current?.blur();

            setPlayerName('');

            fetchPlayersByTeam();
        } catch (error) {
            if (error instanceof AppError) {
                Alert.alert('Nova pessoa', error.message);
            } else {
                Alert.alert('Nova pessoa', 'Não foi possível adicionar a nova pessoa.');
                console.log(error);
            }
        }
    }

    async function fetchPlayersByTeam() {
        try {
            setIsLoading(true);

            const playersByTeam = await playersListByGroupAndTeam(group, team);

            setPlayers(playersByTeam);
        } catch (error) {
            Alert.alert('Pessoas', 'Não foi possível carregar as pessoas filtradas do time selecionado.');

            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleRemovePlayer(name: string) {
        try {
            await playerRemoveByGroup(name, group);

            fetchPlayersByTeam();
        } catch(error) {
            Alert.alert('Remover pessoa', 'Não foi possível remover a pessoa selecionada.');

            console.log(error);
        }
    }

    async function groupRemove() {
        try {
            await groupRemoveByName(group);

            navigation.navigate('groups');
        } catch (error) {
            Alert.alert('Remover grupo', 'Não foi possível remover o grupo.')

            console.log(error);
        }
    }

    async function handleRemoveGroup() {
        Alert.alert(
            'Remover',
            'Deseja mesmo remover este grupo?',
            [
                {text: 'Não', style: 'cancel'},
                {text: 'Sim', onPress: () => groupRemove()}
            ]
        );

        try {

        } catch (error) {

        }
    }

    useEffect(() => {
        fetchPlayersByTeam();
    }, [team]);

    return(
        <Container>
            <Header
                showBackButton
            />

            <Highlight
                title={group}
                subtitle='adicione a galera e separe os times'
            />

            <Form>
                <Input
                    inputRef={playerNameInputRef}
                    onChangeText={setPlayerName}
                    value={playerName}
                    placeholder='Nome da pessoa'
                    autoCorrect={false}
                    onSubmitEditing={handleAddPlayer}
                    returnKeyType="done"
                />
                <ButtonIcon
                    icon='add'
                    onPress={handleAddPlayer}
                />
            </Form>

            <HeaderList>
                <FlatList
                    data={[
                        'Time A',
                        'Time B',
                    ]}
                    keyExtractor={item => item}
                    renderItem={({ item }: any) => (
                        <Filter
                            title={item}
                            isActive={item === team}
                            onPress={() => setTeam(item)}
                        />
                    )}
                    horizontal
                />

                <NumberOfPlayers>
                    {players.length}
                </NumberOfPlayers>
            </HeaderList>

            {
                isLoading ?
                    <Loading /> :

                <FlatList
                    data={players}
                    keyExtractor={item => item.name}
                    renderItem={({ item }: any) => (
                        <PlayerCard
                            name={item.name}
                            onRemove={() => handleRemovePlayer(item.name)}
                        />
                    )}
                    ListEmptyComponent={() => (
                        <ListEmpty
                            message='Não há pessoas nesse time'
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[
                        { paddingBottom: 100 },
                        players.length === 0 && { flex: 1 }
                    ]}
                />
            }

            <Button
                title='Remover turma'
                type='SECONDARY'
                onPress={handleRemoveGroup}
            />
        </Container>
    );
}
