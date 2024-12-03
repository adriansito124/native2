import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TextInput,
  Button,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Try } from "expo-router/build/views/Try";

interface Character {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {front_shiny: string};
}

export default function HomeScreen() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<string>("1");

  const fetchCharacters = async (pageNumber: string) => {
    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/?limit=20&offset=${20 * (Number.parseInt(pageNumber) - 1)}`
      );
      const Results = response.data.results
      let pokemon : Character[] = []
      Results.forEach((item : {url: string}) => {
        axios.get(item.url).then((response) => {
          pokemon.push(response.data);
          pokemon.sort((a: Character, b:Character) => (a.id - b.id))
        })
      });
      
      setCharacters(pokemon)
    } catch (error) {
      console.error("Erro ao buscar personagens: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacters(page);
  }, []);

  const renderCharater = ({ item }: { item: Character }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.sprites.front_shiny }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        {/* <Text style={styles.status}>{item.status}</Text> */}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#297516FF"/>
      </View>
    );
  }

  return  (
    <View style={{ flex: 1}}>
      <View style={styles.inputContainer}>
        <Text>1/42 </Text>
        <TextInput
        style={styles.input}
        value={page}
        onChangeText={(text) => setPage(text)}
        keyboardType="numeric"
        placeholder="Digite o numro da pagina"
        />
        <Button title="buscar" onPress={() => fetchCharacters(page)}/>
      </View>
      <FlatList data={characters} keyExtractor={(item) => item.id.toString()} renderItem={renderCharater} contentContainerStyle={styles.list}/>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFFFF",
    marginBottom: 12,
    borderRadius: 8,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000000FF",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },

  image: {
    width: 100,
    height: 100,
  },

  info: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },

  name: {
    fontSize: 16,
    fontWeight: "bold",
  },

  status: {
    fontSize: 14,
    color: "#66666666",
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  list: {
    padding: 16,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 16,
  },

  input: {
    flex: 1,
    height: 40,
    borderColor: "#cccccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginRight: 8,
  },
  
});
