import { useState } from "react";
import { StyleSheet, Text, TextInput, View, KeyboardAvoidingView, TouchableOpacity, TouchableWithoutFeedback, Keyboard, SafeAreaView, ScrollView } from "react-native";
import LottieView from 'lottie-react-native';
import Icon from "react-native-vector-icons/Feather";

import { w, h } from "../utils";

export default function AudioScreen() {
  const [isPressing, setIsPressing] = useState(false);
  const [numberOfQuestions, setNumberOfQuestions] = useState(0);

  const questions = [
    {
        question: "Como faço para tirar 10 na prova de processamento de voz?",
        response: `Primeiro estude os conceitos fundamentais, como filtragem, espectrogramas e técnicas de processamento. Esteja atento aos detalhes e demonstre compreensão das aplicações práticas. Por fim, participe ativamente das aulas e busque ajuda quando necessário.`
    },
    {
        question: "Entendi, obrigado pelas reomendações!",
        response: `De nada! Boa sorte nos seus estudos e na prova de processamento de voz. Se precisar de mais ajuda, estou aqui para responder às suas perguntas. Estude com dedicação e confiança!`
    }
  ];
  
  const getAudioContainerContent = () => {
    if (isPressing) {
        return (
            <View style={{marginTop: 100}}>
                <Text style={styles.recordingText}>Recording...</Text>
                <LottieView
                    source={require("../assets/animation_lnwomybg.json")}
                    height={150}
                    autoPlay
                    loop
                />
            </View>
        );
    } else if (numberOfQuestions > 0) {
        return (
            <>
                {questions.slice(0, numberOfQuestions).map((questionObj, index) => 
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
            <TouchableOpacity style={{...styles.audioButton}} onPressIn={() => setIsPressing(true)} onPressOut={() => (setIsPressing(false), numberOfQuestions < 2 && setNumberOfQuestions(numberOfQuestions + 1))}>
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