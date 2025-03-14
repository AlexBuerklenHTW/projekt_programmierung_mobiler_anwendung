import React, { useContext, useState, useEffect } from "react";
import { View, ScrollView } from "react-native";
import { useTheme, Text, Button, Card, IconButton, Snackbar } from 'react-native-paper';
import { de, registerTranslation } from 'react-native-paper-dates';
import { DatePickerModal } from 'react-native-paper-dates';
import { useMensa } from '@/context/MensaContext';
import { RoleContext } from '@/context/RoleContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RouteProp, useNavigation} from "@react-navigation/native";
import {MensaParamList} from "@/constants/MensaNavigationType";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {MealParamList} from "@/constants/MealNavigationType";

type MensaRouteProp = RouteProp<MensaParamList, 'Mensa'>;

export default function Mensa({ route }: { route: MensaRouteProp }) {
    const { colors } = useTheme();
    const { mensa } = route.params;
    const navigation = useNavigation<MealScreenNavigationProp>();
    const { loadMenuForMensa } = useMensa();
    const { role } = useContext(RoleContext);

    type MealScreenNavigationProp = NativeStackNavigationProp<MealParamList, 'FoodDetail'>;

    registerTranslation('de', de);
    const today = new Date();
    const [date, setDate] = useState<Date | undefined>(today);
    const [open, setOpen] = useState(false);
    const [filteredMenu, setFilteredMenu] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const onDismissSingle = () => setOpen(false);
    const onConfirmSingle = (params: any) => {
        setOpen(false);
        setDate(params.date);
    };

    const getLocalDateString = (date: Date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        const loadFavorites = async () => {
            try {
                const storedFavorites = await AsyncStorage.getItem('MealFavorites');
                if (storedFavorites) {
                    setFavorites(JSON.parse(storedFavorites));
                }
            } catch (error) {
                console.error("Fehler beim Laden der Favoriten:", error);
            }
        };

        loadFavorites();
    }, []);

    const saveFavorites = async (updatedFavorites: { [key: string]: boolean }) => {
        try {
            await AsyncStorage.setItem('MealFavorites', JSON.stringify(updatedFavorites));
        } catch (error) {
            console.error("Fehler beim Speichern der Favoriten:", error);
        }
    };

    const toggleFavorite = (mealId: string, name: string) => {
        const updatedFavorites = { ...favorites, [mealId]: !favorites[mealId] };
        setFavorites(updatedFavorites);
        saveFavorites(updatedFavorites);

        setSnackbarMessage(favorites[mealId] ? `${name} als Favorit entfernt` : `${name} als Favorit hinzugefügt`);
        setSnackbarVisible(true);
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            if (date) {
                const menu = loadMenuForMensa(mensa.id) || [];
                const filtered = menu.filter((meal) =>
                    getLocalDateString(new Date(meal.date)) === getLocalDateString(date)
                );
                setFilteredMenu(filtered);
            }
            setIsLoading(false);
        };
        fetchData();
    }, [date, mensa.id, loadMenuForMensa]);

    const groupedMenu = filteredMenu.reduce((groups: any, mealData: any) => {
        mealData.meals.forEach((meal: any) => {
            const category = meal.category || "Unkategorisiert";
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push(meal);
        });
        return groups;
    }, {});

    const formattedDate = date
        ? new Intl.DateTimeFormat('de-DE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(date)
        : "Datum auswählen";

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingVertical: 40, paddingHorizontal: 20 }}
            >
                <Button
                    style={{ margin: 10 }}
                    icon="calendar"
                    onPress={() => setOpen(true)}
                    uppercase={false}
                    mode="elevated"
                >
                    {formattedDate}
                </Button>
                <DatePickerModal
                    locale="de"
                    mode="single"
                    visible={open}
                    onDismiss={onDismissSingle}
                    date={date}
                    onConfirm={onConfirmSingle}
                />

                {isLoading ? (
                    <Text style={{ margin: 10, fontSize: 18, textAlign: 'center' }}>
                        Daten werden geladen...
                    </Text>
                ) : Object.keys(groupedMenu).length === 0 ? (
                    <Text style={{ margin: 10, fontSize: 18, textAlign: 'center' }}>
                        Am ausgewählten Tag wurden keine Speisen gefunden.
                    </Text>
                ) : (
                    Object.keys(groupedMenu as Record<string, any[]>).map((category) => (
                        <React.Fragment key={`category-${category}`}>
                            <Text style={{ margin: 10, fontSize: 24 }}>
                                {category}
                            </Text>

                            {groupedMenu[category].map((meal: any) => (
                                <Card key={meal.id} style={{ margin: 10 }} onPress={() => navigation.navigate('FoodDetail', { meal })}>
                                    <Card.Content>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 5 }}>
                                                    {meal.name}
                                                </Text>
                                                <View
                                                    style={{
                                                        borderBottomWidth: 1,
                                                        borderBottomColor: colors.onSurface,
                                                        marginBottom: 5,
                                                    }}
                                                />
                                                <Text style={{ fontSize: 14 }}>
                                                    {meal.prices?.find((p: any) => p.priceType === role)?.price
                                                        ? `${new Intl.NumberFormat('de-DE', {
                                                            style: 'currency',
                                                            currency: 'EUR',
                                                        }).format(meal.prices.find((p: any) => p.priceType === role)?.price)}`
                                                        : 'Keine Preisangabe vorhanden'}
                                                </Text>
                                            </View>
                                            <Card.Actions>
                                                <IconButton
                                                    icon={favorites[meal.id] ? "star" : "star-outline"}
                                                    size={24}
                                                    onPress={() => toggleFavorite(meal.id, meal.name)}
                                                />
                                            </Card.Actions>
                                        </View>
                                    </Card.Content>
                                </Card>
                            ))}
                        </React.Fragment>
                    ))
                )}
            </ScrollView>

            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={2000}
            >
                {snackbarMessage}
            </Snackbar>
        </View>
    );
}
