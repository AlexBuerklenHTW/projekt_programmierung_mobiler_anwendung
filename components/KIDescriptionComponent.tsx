import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Button, ActivityIndicator, useTheme } from 'react-native-paper';
import axios from 'axios';

const KIDescriptionComponent = ({dish}:any) => {
  const [isTextVisible, setTextVisible] = useState(false);
  const [kiDescription, setKIDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const {colors} = useTheme();

  const ARLIAI_API_KEY = process.env.EXPO_PUBLIC_ARLIAI_API_KEY;
  const API_URL = 'https://api.arliai.com/v1/chat/completions';

  const generateDescription = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        API_URL,
        {
          model: 'Mistral-Nemo-12B-Instruct-2407',
          messages: [
            { role: 'system', content: 'Du bist ein KI Feature in einer Mensa App. Dein Aufgabe ist es Beschreibungen für Gerichte zu erstellen.' },
            { role: 'system', content: 'Deine Antworten sind endgültig und du darfst keine Rückfragen stellen.' },
            { role: 'user', content: dish }
          ],
          repetition_penalty: 1.1,
          temperature: 0.7,
          top_p: 0.9,
          top_k: 40,
          max_tokens: 1024,
          stream: false
        },
        {
          headers: {
            Authorization: `Bearer ${ARLIAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setKIDescription(response.data.choices[0].message.content);
    } catch (error: any) {
      setKIDescription(`Fehler: ${error.message || 'Unbekannter Fehler'}`);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
      <View style={[styles.textContainer, {borderColor: colors.outline}]}>
          {!isTextVisible ? (
            <Button
              style={styles.button}
              icon="auto-fix"
              mode="contained"
              onPress={() => {
                setTextVisible(true);
                generateDescription();
              }}
            >
              Generiere KI Beschreibung
            </Button>
          ) : (
            <>
              {loading ? (
                <ActivityIndicator animating={true} size='large'/>
              ) : (
                <ScrollView contentContainerStyle={styles.textScroll}>
                  <Text style={styles.text}>{kiDescription}</Text>
                </ScrollView>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  scrollView: {
    width: '100%',
    paddingHorizontal: 10,
  },
  textContainer: {
    borderWidth: 1,
    borderRadius: 10,
    width: '100%',
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    alignSelf: 'center',
  },
  textScroll: {
    paddingBottom: 20,
    margin: 20,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default KIDescriptionComponent;
