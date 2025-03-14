import React, { useState } from 'react';
import { Modal, View, Text, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useMensa } from "@/context/MensaContext";
import { Linking } from 'react-native';
import {useNavigation} from "@react-navigation/native";

const MensaHeader = ({ mensaParam }: MensaHeaderProps) => {
    const {colors} = useTheme();
    const navigation = useNavigation();

    const [visible, setVisible] = useState(false);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const { mensaData } = useMensa();

    const filteredMensa = Array.isArray(mensaData)
        ? mensaData.find((mensa) => mensa.id === mensaParam.id)
        : null;

    const filteredBusinessDays = filteredMensa
        ? filteredMensa.businessDays.filter(day => day.day !== "Sa" && day.day !== "So")
        : [];


    const openURL = (url: string) => {
        Linking.openURL('https://www.stw.berlin/' + url).catch(err => console.error("Failed to open URL", err));
    };

    const openGoogleMaps = (latitude: number, longitude: number) => {
        const googleMapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
        Linking.openURL(googleMapsLink).catch(err => console.error("Failed to open Google Maps", err));
    };

    return (
        <>
            <Appbar.Header elevated={true}>
                <Appbar.Action
                    icon={({ color }) => <MaterialIcons name="arrow-back" size={24} color={color} />}
                    onPress={() => navigation.goBack()}
                    animated={false}
                />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
                    <Text style={{ fontSize: 22, flexWrap: 'wrap', width: '100%', color: colors.onSurface }}>
                        {mensaParam.name}
                    </Text>
                </View>
                <Appbar.Action
                    icon={({ size, color }) => <MaterialIcons name="info" size={size} color={color} />}
                    onPress={showModal}
                    animated={false}
                />
            </Appbar.Header>
            <Modal
                transparent={true}
                visible={visible}
                onRequestClose={hideModal}
            >
                <TouchableWithoutFeedback onPress={hideModal}>
                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <TouchableWithoutFeedback>
                            <View style={{
                                margin: 50,
                                backgroundColor: colors.background,
                                padding: 20,
                                borderRadius: 10,
                                justifyContent: 'flex-start',
                                alignItems: 'flex-start',
                            }}>
                                {/* Close Button */}
                                <TouchableOpacity
                                    onPress={hideModal}
                                    style={{
                                        position: 'absolute',
                                        top: 20,
                                        right: 20,
                                        zIndex: 10,
                                    }}
                                >
                                    <MaterialIcons name="close" size={24} color={colors.onSurface} />
                                </TouchableOpacity>
                                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: colors.onSurface }}>Infos zur Mensa</Text>
                                {filteredMensa ? (
                                    <>
                                        <Text style={{ fontWeight: 'bold', color: colors.onSurface }}>Adresse: </Text>
                                        <Text style={{ marginBottom: 10, color: colors.onSurface }}>{filteredMensa.address.street}</Text>
                                        <Text style={{ fontWeight: 'bold', color: colors.onSurface }}>E-Mail:</Text>
                                        <Text style={{ marginBottom: 10, color: colors.onSurface }}>{filteredMensa.contactInfo?.email}</Text>
                                        <Text style={{ fontWeight: 'bold', color: colors.onSurface }}>URL:</Text>
                                        <TouchableOpacity
                                            style={{ marginBottom: 10 }}
                                            onPress={() => filteredMensa.url && openURL(filteredMensa.url)}
                                        >
                                            <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>
                                                {filteredMensa.url || "Keine URL verfügbar"}
                                            </Text>
                                        </TouchableOpacity>
                                        <Text style={{ fontWeight: 'bold', color: colors.onSurface }}>Öffnungszeiten:</Text>
                                        {filteredBusinessDays.map((day, idx) => (
                                            <View key={idx}>
                                                <Text style={{ fontWeight: 'bold', marginBottom: 5, color: colors.onSurface }}>{day.day}</Text>
                                                {day.businessHours.filter((hour) => hour.businessHourType === "Mensa").map((hour, hourIndex) => (
                                                    <Text style={{color: colors.onSurface, marginBottom: 5}} key={hourIndex}>
                                                        {hour.openAt} - {hour.closeAt}
                                                    </Text>
                                                ))}
                                            </View>
                                        ))}
                                        {filteredMensa.address.geoLocation && (
                                            <TouchableOpacity onPress={() => openGoogleMaps(filteredMensa.address.geoLocation.latitude, filteredMensa.address.geoLocation.longitude)} style={{ marginTop: 20, padding: 10, backgroundColor: '#4CAF50' }}>
                                                <Text style={{ color: 'white' }}>Standort der Mensa auf Google Maps anzeigen</Text>
                                            </TouchableOpacity>
                                        )}
                                    </>
                                ) : (
                                    <Text>Keine Daten für diese Mensa gefunden.</Text>
                                )}
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </>
    );
};

export default MensaHeader;
