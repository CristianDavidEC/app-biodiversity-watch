import ObservationsFilters from "@/components/observations/ObservationsFilters";
import { Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View>
      <ObservationsFilters />
      <Text className='text-2xl text-red-500'>Pagina de inicio donde van las observaciones</Text>
    </View>
  );
}
