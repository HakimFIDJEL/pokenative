import { View, ViewProps, ViewStyle } from "react-native";

type Props = ViewProps & {
  gap?: number;
};

export function Row({ style, gap, ...rest }: Props) {
  return (
    <View
      {...rest}
      style={[rowStyle, style, gap ? { gap: gap } : undefined]}
    ></View>
  );
}

const rowStyle = {
  flex: 0,
  flexDirection: "row",
  alignItems: "center",
} satisfies ViewStyle;
