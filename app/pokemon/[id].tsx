import Card from "@/components/Card";
import { PokemonSpec } from "@/components/pokemon/PokemonSpec";
import { PokemonStat } from "@/components/pokemon/PokemonStat";
import { PokemonType } from "@/components/pokemon/PokemonType";
import { RootView } from "@/components/RootView";
import { Row } from "@/components/Row";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import {
  basePokemonStats,
  formatSize,
  formatWeight,
  getPokemonArtwork,
} from "@/functions/pokemon";
import { useFetchQuery } from "@/hooks/useFetchQuery";
import { useThemeColors } from "@/hooks/useThemeColors";
import { router, useLocalSearchParams } from "expo-router";
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
// import Animated, { useSharedValue } from "react-native-reanimated";
import { useAudioPlayer } from "expo-audio";
import { useRef, useState } from "react";

const { width } = Dimensions.get("window");

export default function Pokemon() {
  const params = useLocalSearchParams() as { id: string };
  const initialId = parseInt(params.id, 10);
  const [id, setId] = useState(initialId);
  const flatListRef = useRef<FlatList>(null);

  const pokemonIds = Array.from({ length: 800 }, (_, i) => i + 1);

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
    setId(newIndex + 1);
  };

  const onPrevious = () => {
    flatListRef.current?.scrollToIndex({ index: id - 2, animated: true });
  };

  const onNext = () => {
    flatListRef.current?.scrollToIndex({ index: id, animated: true });
  };

  return (
    <FlatList
      ref={flatListRef}
      style={{ flex: 1 }}
      data={pokemonIds}
      renderItem={({ item }) => (
        <View style={{ width }}>
          <PokemonView id={item} onNext={onNext} onPrevious={onPrevious} />
        </View>
      )}
      keyExtractor={(item) => item.toString()}
      horizontal
      pagingEnabled
      initialScrollIndex={initialId - 1}
      getItemLayout={(data, index) => ({
        length: width,
        offset: width * index,
        index,
      })}
      onMomentumScrollEnd={onMomentumScrollEnd}
      showsHorizontalScrollIndicator={false}
    />
  );
}

type Props = {
  id: number;
  onPrevious: () => void;
  onNext: () => void;
};

function PokemonView({ id, onNext, onPrevious }: Props) {
  const colors = useThemeColors();

  const { data: pokemon } = useFetchQuery("/pokemon/[id]", {
    id: id.toString(),
  });
  const { data: species } = useFetchQuery("/pokemon-species/[id]", {
    id: id,
  });

  const mainType = pokemon?.types[0].type.name;
  const colorType = mainType ? Colors.type[mainType] : colors.tint;
  const types = pokemon?.types ?? [];
  const bio = species?.flavor_text_entries
    ?.find(({ language }) => language.name === "en")
    ?.flavor_text.replace(/[\n\f\r]/g, " ");

  const stats = pokemon?.stats ?? basePokemonStats;

  const cry = pokemon?.cries.latest;
  const player = useAudioPlayer(cry ? { uri: cry } : null);

  const onImagePress = async () => {
    if (player) {
      if (player.currentTime > 0) {
        await player.seekTo(0);
      }
      player.play();
    }
  };

  const isFirst = id === 1;
  const isLast = id === 800;

  return (
    <RootView backgroundColor={colorType}>
      <View>
        <Image
          style={styles.pokeball}
          source={require("@/assets/images/pokeball.png")}
        />
        <Row style={styles.header}>
          <Pressable onPress={router.back}>
            <Row gap={8}>
              <Image
                source={require("@/assets/images/arrow_back.png")}
                style={styles.arrow}
              />
              <ThemedText
                color="grayWhite"
                variant="headline"
                style={{ textTransform: "capitalize" }}
              >
                {pokemon?.name}
              </ThemedText>
            </Row>
          </Pressable>
          <ThemedText color="grayWhite" variant="subtitle2">
            #{id.toString().padStart(3, "0")}
          </ThemedText>
        </Row>

        <Card style={styles.card}>
          {/* Row absolute */}
          <Row style={styles.imageRow}>
            {isFirst ? (
              <View style={{ width: 24, height: 24 }}></View>
            ) : (
              <Pressable onPress={onPrevious}>
                <Image
                  source={require("@/assets/images/chevron_left.png")}
                  style={{ width: 24, height: 24 }}
                />
              </Pressable>
            )}
            <Pressable onPress={onImagePress}>
              <Image
                style={styles.artwork}
                source={{
                  uri: getPokemonArtwork(id),
                }}
                width={200}
                height={200}
              />
            </Pressable>
            {isLast ? (
              <View style={{ width: 24, height: 24 }}></View>
            ) : (
              <Pressable onPress={onNext}>
                <Image
                  source={require("@/assets/images/chevron_right.png")}
                  style={{ width: 24, height: 24 }}
                />
              </Pressable>
            )}
          </Row>
          {/* Types */}
          <Row gap={16} style={{ height: 20 }}>
            {types.map((type) => (
              <PokemonType name={type.type.name} key={type.type.name} />
            ))}
          </Row>

          {/* About */}
          <ThemedText variant="subtitle1" style={{ color: colorType }}>
            About
          </ThemedText>
          <Row>
            <PokemonSpec
              style={{
                borderStyle: "solid",
                borderRightWidth: 1,
                borderColor: colors.grayLight,
              }}
              title={formatWeight(pokemon?.weight)}
              description="Weight"
              image={require("@/assets/images/weight.png")}
            />
            <PokemonSpec
              style={{
                borderStyle: "solid",
                borderRightWidth: 1,
                borderColor: colors.grayLight,
              }}
              title={formatSize(pokemon?.height)}
              description="Size"
              image={require("@/assets/images/straighten.png")}
            />
            <PokemonSpec
              title={pokemon?.moves
                .slice(0, 2)
                .map((m) => m.move.name)
                .join("\n")}
              description="Moves"
            />
          </Row>
          {/* Bio */}
          <ThemedText>{bio}</ThemedText>
          <ThemedText variant="subtitle1" style={{ color: colorType }}>
            Base stats
          </ThemedText>
          {/* Stats */}
          <View style={{ alignSelf: "stretch" }}>
            {stats.map((stat) => (
              <PokemonStat
                key={stat.stat.name}
                name={stat.stat.name}
                value={stat.base_stat}
                color={colorType}
              />
            ))}
          </View>
        </Card>
      </View>
    </RootView>
  );
}

const styles = StyleSheet.create({
  arrow: {
    width: 32,
    height: 32,
  },
  artwork: {},
  header: {
    margin: 20,
    justifyContent: "space-between",
  },
  pokeball: {
    width: 208,
    height: 208,
    opacity: 0.1,
    position: "absolute",
    right: 8,
    top: 8,
  },
  card: {
    marginTop: 144,
    paddingTop: 56,
    paddingHorizontal: 20,
    gap: 16,
    alignItems: "center",
    paddingBottom: 20,
  },
  imageRow: {
    position: "absolute",
    top: -140,
    zIndex: 2,
    justifyContent: "space-between",
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
});
