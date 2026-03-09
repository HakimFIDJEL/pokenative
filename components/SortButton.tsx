import { Shadows } from "@/constants/Shadows";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import Card from "./Card";
import { Radio } from "./Radio";
import { Row } from "./Row";
import { ThemedText } from "./ThemedText";

type Props = {
  value: "id" | "name";
  onChange: (v: Props["value"]) => void;
};

const options = [
  {
    label: "Number",
    value: "id",
  },
  {
    label: "Name",
    value: "name",
  },
] as const;

export function SortButton({ value, onChange }: Props) {
  const colors = useThemeColors();

  const [isModalVisible, setModalVisibility] = useState(false);
  const [position, setPosition] = useState<null | {
    top: number;
    right: number;
  }>(null);
  const buttonRef = useRef<View>(null);

  const onButtonPress = () => {
    buttonRef?.current?.measureInWindow((x, y, width, height) => {
      setPosition({
        top: y + height,
        right: Dimensions.get("window").width - x - width,
      });
      setModalVisibility(true);
    });
  };
  const onClose = () => {
    setModalVisibility(false);
  };

  return (
    <>
      <Pressable onPress={onButtonPress}>
        <View
          ref={buttonRef}
          style={[styles.button, { backgroundColor: colors.grayWhite }]}
        >
          <Image
            source={
              value === "id"
                ? require("@/assets/images/tag.png")
                : require("@/assets/images/text_format.png")
            }
            width={16}
            height={16}
            style={styles.image}
          />
        </View>
      </Pressable>
      <Modal
        transparent
        visible={isModalVisible}
        onRequestClose={onClose}
        animationType="fade"
      >
        <Pressable style={styles.backdrop} onPress={onClose}>
          {/* <Text>Hello world</Text> */}
          <View
            style={[
              styles.popup,
              { backgroundColor: colors.tint, ...position },
            ]}
          >
            <ThemedText
              variant="subtitle2"
              color="grayWhite"
              style={styles.title}
            >
              Sort by:
            </ThemedText>
            <Card style={styles.card}>
              {options.map((option) => (
                <Pressable
                  key={option.value}
                  onPress={() => onChange(option.value)}
                >
                  <Row gap={8}>
                    <Radio checked={value === option.value} />
                    <ThemedText>{option.label}</ThemedText>
                  </Row>
                </Pressable>
              ))}
            </Card>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 32,
    width: 32,
    borderRadius: 32,
    flex: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    height: 16,
    width: 16,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  popup: {
    position: "absolute",
    width: 113,
    padding: 4,
    paddingTop: 16,
    gap: 16,
    borderRadius: 12,
    ...Shadows.dp2,
  },
  title: {
    paddingLeft: 20,
  },
  card: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 16,
  },
});
