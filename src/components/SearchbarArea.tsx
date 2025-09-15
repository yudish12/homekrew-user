import React, { useState } from "react";
import { View, TextInput, FlatList, Text, StyleSheet } from "react-native";

const DATA = [
  "Apple",
  "Banana",
  "Orange",
  "Mango",
  "Pineapple",
  "Strawberry",
  "Grapes",
  "Watermelon",
];

const SearchBarExample = () => {
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState(DATA);

  const handleSearch = (text: string) => {
    setSearch(text);
    if (text) {
      const newData = DATA.filter((item) =>
        item.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(newData);
    } else {
      setFilteredData(DATA);
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search..."
        value={search}
        onChangeText={handleSearch}
      />

      {/* List */}
      <FlatList
        data={filteredData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
      />
    </View>
  );
};

export default SearchBarExample;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    height: 100,
    backgroundColor: "#fff",
  },
  searchBar: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  item: {
    padding: 10,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});
