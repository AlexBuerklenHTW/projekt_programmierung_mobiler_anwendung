import { View, ScrollView, StyleSheet, Image } from "react-native";
import { useTheme, Text, Card } from 'react-native-paper';
import KIDescriptionComponent from './KIDescriptionComponent';
import React, { useContext } from "react";
import { RoleContext } from "@/context/RoleContext";

type Additive = {
    text: string;
};

type Badge = {
    name: string;
    description: string;
};

type Review = {
    author: string;
    content: string;
};

export default function FoodDetail({ route }: any) {
    const { colors } = useTheme();
    const { meal } = route.params;
    const { role } = useContext(RoleContext);
    
    const badgeIcons: Record<string, any> = {
        "Gelber Ampelpunkt": require('../assets/badges/Punkt_gelb.png'),
        "Grüner Ampelpunkt": require('../assets/badges/Punkt_grün.png'),
        "Roter Ampelpunkt": require('../assets/badges/Punkt_rot.png'),
        "Vegan": require('../assets/badges/Vegan.png'),
        "CO2 bewertung A": require('../assets/badges/CO2.png'),
        "CO2 bewertung B": require('../assets/badges/CO2.png'),
        "CO2 bewertung C": require('../assets/badges/CO2.png'),
        "H2O bewertung A": require('../assets/badges/H2O.png'),
        "H2O bewertung B": require('../assets/badges/H2O.png'),
        "H2O bewertung C": require('../assets/badges/H2O.png'),
        "Fairtrade": require('../assets/badges/Fairtrade.png'),
        "Nachhaltige Landwirtschaft": require('../assets/badges/Nachhaltige_Landwirtschaft.png'),
        "Nachhaltige Fischerei": require('../assets/badges/Nachhaltige_Fischerei.png'),
        "Vegetarisch": require('../assets/badges/Vegetarisch.png'),
        "Klimaessen": require('../assets/badges/Klimaessen.png')
    };
    const getBadgeIcon = (name: string) => {
        return badgeIcons[name] || null;
    };

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: colors.background
            }}
        >
            <ScrollView
                style={{
                    flex: 1,
                }}
                contentContainerStyle={{
                    paddingVertical: 20,
                    paddingHorizontal: 20,
                }}
            >
                <Text style={{ margin: 10, fontSize: 24 }}>
                    Preis: {meal.prices?.find((p: any) => p.priceType === role)?.price
                    ? `${new Intl.NumberFormat('de-DE', {
                        style: 'currency',
                        currency: 'EUR',
                    }).format(meal.prices.find((p: any) => p.priceType === role)?.price)}`
                    : 'Keine Preisangabe vorhanden'}
                </Text>
                <KIDescriptionComponent dish={meal.name} />

                <Text style={{margin: 10, fontSize: 24}}>Zusatzstoffe</Text>

                <View style={styles.containerAdditives}>
                    {meal.additives.map((additive: Additive, index: number) => (
                        <View style={styles.cardWrapperAdditives} key={index}>
                            <Card style={styles.card}>
                                <Card.Content>
                                    <Text>{additive.text}</Text>
                                </Card.Content>
                            </Card>
                        </View>
                    ))}
                </View>

                <Text style={{margin: 10, fontSize: 24}}>Abzeichen</Text>

                <View style={styles.containerBadge}>
                    {meal.badges.map((badge: Badge, index: number) => (
                        <View style={styles.cardWrapperBadge} key={index}>
                            <Card style={styles.card}>
                                <Card.Content>
                                <Image
                                    source={getBadgeIcon(badge.name.replace(/_/g, ' '))}
                                    style={styles.icon}
                                    resizeMode="contain"
                                />
                                    <Text style={{ fontWeight: 'bold' }}>{badge.name.replace(/_/g, ' ')}</Text>
                                    <Text>{badge.description}</Text>
                                </Card.Content>
                            </Card>
                        </View>
                    ))}
                </View>

                <Text style={{ margin: 10, fontSize: 24 }}>Bewertungen</Text>
                <View style={styles.containerReviews}>
                    {Array.isArray(meal.mealReviews) && meal.mealReviews.length > 0 ? (
                        meal.mealReviews.map((review: Review, index: number) => (
                            <View style={styles.cardWrapperReviews} key={index}>
                                <Card style={styles.card}>
                                    <Card.Content>
                                        <Text style={{ fontWeight: 'bold' }}>{review.author}</Text>
                                        <Text>{review.content}</Text>
                                    </Card.Content>
                                </Card>
                            </View>
                        ))
                    ) : (
                        <Text style={{ margin: 10 }}>Keine Bewertungen vorhanden.</Text>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    containerAdditives: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        margin: 10,
    },
    containerBadge: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        margin: 10,
    },
    cardWrapperAdditives: {
        width: '48%',
        marginBottom: 10,
    },
    cardWrapperBadge: {
        width: '100%',
        marginBottom: 10,
    },
    containerReviews: {
        marginTop: 10,
    },
    cardWrapperReviews: {
        marginBottom: 10,
    },
    card: {
        padding: 10,
    },
    icon: {
        width: 24,
        height: 24,
        marginBottom:10
    },
});
