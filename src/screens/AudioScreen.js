import { useState, useEffect } from "react";
import { Alert, StyleSheet, Text, TextInput, View, KeyboardAvoidingView, TouchableOpacity, TouchableWithoutFeedback, Keyboard, SafeAreaView, ScrollView } from "react-native";
import LottieView from 'lottie-react-native';
import Icon from "react-native-vector-icons/Feather";
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import OpenAI from "openai";

import { w, h } from "../utils";

const GCP_SPEECH_TO_TEXT_KEY = "" // omitido por segurança
const CHAT_GPD_API_KEY = "" // omitido por segurança
const RECORDING_OPTIONS = {
  android: {
    extension: '.m4a',
    outputFormat: Audio.AndroidOutputFormat.MPEG_4,
    audioEncoder: Audio.AndroidAudioEncoder.AAC,
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
  },
  ios: {
    extension: '.wav',
    audioQuality: Audio.IOSAudioQuality.HIGH,
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
  web: {

  }
};

export default function AudioScreen() {
  const [isPressing, setIsPressing] = useState(false);
  const [numberOfQuestions, setNumberOfQuestions] = useState(0);
  const [recording, setRecording] = useState(null);

  const [questions, setQuestions] = useState([]);

  async function handleRecordingStart() {
    const { granted } = await Audio.getPermissionsAsync();
    console.log("granted", granted)

    if (granted) {
      try {
        const { recording } = await Audio.Recording.createAsync(RECORDING_OPTIONS);
        setRecording(recording);

      } catch (error) {
        console.log(error);
      }
    };
  }

  async function handleRecordingStop() {
    try {
      await recording?.stopAndUnloadAsync();
      const recordingFileUri = recording?.getURI();

      if (recordingFileUri) {
        const base64File = await FileSystem.readAsStringAsync(recordingFileUri, { encoding: FileSystem?.EncodingType?.Base64 });
        await FileSystem.deleteAsync(recordingFileUri);

        setRecording(null);
        getTranscription(base64File);
      } else {
        Alert.alert("Audio", "Não foi possível obter a gravação.");
      }
    } catch (error) {
      console.log(error);
    }
  }

function getTranscription(base64File) {
  fetch(`https://speech.googleapis.com/v1/speech:recognize?key=${GCP_SPEECH_TO_TEXT_KEY}`, {
    method: 'POST',
    body: JSON.stringify({
      config: {
        languageCode: "pt-BR",
        encoding: "LINEAR16",
        sampleRateHertz: 41000,
      },
      audio: {
        content: base64File
      }
    })
  })
    .then(response => response.json())
    .then((data) => {
      console.log(data.results[0].alternatives[0].transcript)
      handleChatGpt(data.results[0].alternatives[0].transcript)
    })
    .catch((error) => console.log(error))
};

function handleChatGpt(question) {
  const prompt = `
    Generate keywords in Portuguese for a post about ${question.trim()}.       
    Replace the spaces in each word with the character "_".
    Return each item separated by a comma, in lowercase, and without a line break.
  `;

  fetch("https://api.openai.com/v1/engines/text-davinci-003-playground/completions", {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${CHAT_GPD_API_KEY}`
    },
    body: JSON.stringify({
      prompt,
      temperature: 0.22,
      max_tokens: 500,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    }),
  })
    .then(response => response.json())
    .then((data) => addChat(data.choices[0].text, question))
    .catch(() => addChat("Não foi possível gerar resposta", question))
    .finally(() => setIsPressing(false));
  };

  function addChat(response, question) {
    setQuestions([...questions, {
      question,
      response
    }])
  };
  
  const getAudioContainerContent = () => {
    if (isPressing) {
        return (
            <TouchableOpacity 
              style={{marginTop: 100}}
            >
              <Text style={styles.recordingText}>Recording...</Text>
              <LottieView
                source={require("../assets/animation_lnwomybg.json")}
                height={150}
                autoPlay
                loop
              />
            </TouchableOpacity>
        );
    } else if (numberOfQuestions > 0) {
        return (
            <>
                {questions.map((questionObj, index) => 
                    <View key={index}>
                            <View style={{...styles.chatElementContainer, backgroundColor: "#7377FF"}}>
                            <Text style={{ fontWeight: "bold" }}>User</Text>
                            <Text style={styles.chatBodyText}>{questionObj.question}</Text>
                        </View>
                        <View style={{...styles.chatElementContainer, backgroundColor: "#7D4CBC"}}>
                            <Text style={{ fontWeight: "bold" }}>Chat GPT</Text>
                            <Text style={styles.chatBodyText}>{questionObj.response}</Text>
                        </View>
                    </View>
                )}
            </>
        );
    } else {
        return (
            <Text style={styles.audioText}>
            Esse aplicativo foi projetado para tornar sua interação com o ChatGPT mais <Text style={{ color: "#7377FF", fontWeight: "bold" }}>fácil e conveniente</Text>!{"\n\n"}
            Agora você pode obter respostas instantâneas para o ChatGPT simplesmente <Text style={{ color: "#7377FF", fontWeight: "bold" }}>gravando suas perguntas</Text> ao invés de digitá-las{"\n\n"}
            <Text style={{ color: "#7377FF", fontWeight: "bold" }}>Pronto para experimentar?</Text>{"\n"}
            Pressione o botão de gravação e comece a conversar com o ChatGPT por áudio agora mesmo!
            </Text>
        );
    };
  };

  useEffect(() => {
    Audio
      .requestPermissionsAsync()
      .then((granted) => {
        if (granted) {
          Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            interruptionModeIOS: 1,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            interruptionModeAndroid: 1,
            playThroughEarpieceAndroid: true,
          });
        };
      });
  }, []);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerOptionContainer}>
                    <Icon name="plus" size={40} color="#fff" />
                    <Text style={styles.headerOptionText}>New Chat</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerOptionContainer}>
                    <Icon name="clock" size={40} color="#fff" />
                    <Text style={styles.headerOptionText}>History</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerOptionContainer}>
                    <Icon name="settings" size={40} color="#fff" />
                    <Text style={styles.headerOptionText}>Settings</Text>
                </TouchableOpacity>
            </View>
            <ScrollView style={{flex: 1}}>
                <View style={styles.audioContainer}>
                    {getAudioContainerContent()}
                </View>
            </ScrollView>
            <TouchableOpacity style={{...styles.audioButton}} onPressIn={() => (setIsPressing(true), handleRecordingStart())} onPressOut={() => (handleRecordingStop(), numberOfQuestions < 2 && setNumberOfQuestions(numberOfQuestions + 1))}>
                <Icon name="mic" size={40} color="#585966" />
            </TouchableOpacity>
        </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center"
  },
  header: {
    backgroundColor: "#7377FF",
    height: 100,
    width: 365,
    marginTop: 25,
    borderRadius: 16,
    paddingHorizontal: 30,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  headerOptionContainer: {
    width: 67,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  headerOptionText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5
  },
  audioContainer: {
    backgroundColor: "#D5D7FF",
    marginTop: 23,
    borderRadius: 14,
    height: 520,
    width: 365,
    display: "flex",
    alignItems: "center"
  },
  audioButton: {
    backgroundColor: "#7377FF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 40,
    padding: 20,
    marginTop: 15
  },
  audioText: {
    color: "#585966",
    textAlign: "center", 
    width: "85%",
    marginTop: 35,
    fontSize: 15
  },
  recordingText: {
    color: "#333333",
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: -28
  },
  chatElementContainer: {
    backgroundColor: "#7377FF", 
    width: "95%", 
    height: "auto", 
    paddingHorizontal: 8, 
    paddingBottom: 15, 
    paddingTop: 10, 
    borderRadius: 14, 
    marginTop: 15
  },
  chatBodyText: {
    fontSize: 13, 
    color: "#fff", 
    marginTop: 5, 
    lineHeight: 20
  }
});