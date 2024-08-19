import { View, Text } from "react-native";
import { Link } from "expo-router";
import { globalStyles } from "../../../../styles/gobalStyles";
import { useLocalSearchParams } from "expo-router";

const cats = [
  {
    id: "1",
    name: "Ginger",
    age: 5,
  },
  {
    id: "2",
    name: "Gipsy",
    age: 5,
  },
];

export default function CatsDetailsPage() {
  const { catid } = useLocalSearchParams();

  const foundCat = cats.find((cat) => {
    return cat.id === catid;
  });

  if (!foundCat) {
    <>
      <Text>Cat not found </Text>
    </>;
  }

  return (
    <View style={globalStyles.pageContainer}>
      <Text style={globalStyles.heading}>Hi, my name is {foundCat.name}</Text>
      <Text style={globalStyles.heading}>I'm {foundCat.age} years old</Text>
    </View>
  );
}
