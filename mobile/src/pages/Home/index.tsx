import React, { useState, useEffect } from "react";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { RectButton, TextInput } from "react-native-gesture-handler";
import { Feather as Icon } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select";
import background from "../../assets/home-background.png";
import logo from "../../assets/logo.png";
import axios from "axios";

interface UfData {
  sigla: string;
  nome: string;
}

interface CityData {
  nome: string;
}

const Home: React.FC = () => {
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [uf, setUf] = useState("");
  const [city, setCity] = useState("");

  const navigation = useNavigation();

  useEffect(() => {
    axios
      .get<UfData[]>(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados/"
      )
      .then((response) => {
        const ufs = response.data;
        const ufInitials = ufs.map((uf) => uf.sigla);
        setUfs(ufInitials);
      });
  }, []);

  useEffect(() => {
    if (uf === "0") return;

    axios
      .get<CityData[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`
      )
      .then((response) => {
        const cities = response.data;
        setCities(cities.map((city) => city.nome));
      });
  }, [uf]);

  function handleNavigateToPoints() {
    navigation.navigate("Points", {
      uf,
      city,
    });
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ImageBackground
        source={background}
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={logo}></Image>
          <View>
            <Text style={styles.title}>
              Seu marketplace de coleta de resíduos
            </Text>
            <Text style={styles.description}>
              Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <RNPickerSelect
            placeholder={{
              label: "Digite uma UF",
              value: null,
              color: "#9EA0A4",
            }}
            style={{
              inputIOS: {
                fontSize: 16,
                color: "black",
                height: 56,
                backgroundColor: "#FFF",
                borderRadius: 10,
                marginBottom: 8,
                paddingHorizontal: 24,
              },
              iconContainer: {
                top: 15,
                right: 15,
              },
            }}
            onValueChange={(value) => {
              setUf(value);
            }}
            items={ufs.map((uf) => {
              return {
                label: uf,
                value: uf,
              };
            })}
            Icon={() => {
              return <Icon size={20} color="gray" name="arrow-down" />;
            }}
          />
          <RNPickerSelect
            placeholder={{
              label: "Digite uma cidade",
              value: null,
              color: "#9EA0A4",
            }}
            style={{
              inputIOS: {
                fontSize: 16,
                color: "black",
                height: 56,
                backgroundColor: "#FFF",
                borderRadius: 10,
                marginBottom: 8,
                paddingHorizontal: 24,
              },
              iconContainer: {
                top: 15,
                right: 15,
              },
            }}
            onValueChange={(value) => {
              setCity(value);
            }}
            items={cities.map((city) => {
              return {
                label: city,
                value: city,
              };
            })}
            Icon={() => {
              return <Icon size={20} color="gray" name="arrow-down" />;
            }}
          />

          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#fff" size={24}></Icon>
              </Text>
            </View>
            <Text style={styles.buttonText}>Entrar</Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    color: "#322153",
    fontSize: 32,
    fontFamily: "Ubuntu_700Bold",
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: "#6C6C80",
    fontSize: 16,
    marginTop: 16,
    fontFamily: "Roboto_400Regular",
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {
    width: 295,
    height: 56,
    backgroundColor: "#FFF",
    borderRadius: 10,
  },

  input: {
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#34CB79",
    height: 60,
    flexDirection: "row",
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
    marginRight: 30,
    color: "#FFF",
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
  },
});
