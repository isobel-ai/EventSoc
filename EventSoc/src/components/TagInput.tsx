import {
  FlatList,
  Input,
  InputField,
  View,
  Text,
  Icon,
  CloseCircleIcon
} from "@gluestack-ui/themed";
import { useState } from "react";
import { config } from "../../config/gluestack-ui.config";
import { TextStyle, TouchableOpacity, ViewStyle } from "react-native";

interface Props {
  tags: string[];
  onChangeTags: (tag: string) => void;
}

export default function TagInput(props: Props) {
  const [tag, setTag] = useState<string>("");

  const addTag = () => {
    if (tag && !props.tags.includes(tag)) {
      props.onChangeTags(tag);
    }
    setTag("");
  };

  const renderTag = (tag: string) => {
    const containerStyle: ViewStyle = {
      flexDirection: "row",
      borderRadius: 20,
      paddingVertical: 5,
      paddingRight: 5,
      paddingLeft: 10,
      marginRight: 4,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: config.tokens.colors.navigationDarkPink,
      flexGrow: 1
    };

    const labelStyle: TextStyle = {
      color: "#fff",
      fontSize: config.tokens.fontSizes.sm
    };

    return (
      <View style={containerStyle}>
        <Text style={labelStyle}>{tag}</Text>
        <TouchableOpacity
          style={{ marginLeft: 15 }}
          hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
          onPress={() => props.onChangeTags(tag)}>
          <Icon
            as={CloseCircleIcon}
            fill="$navigationDarkPink"
            color="white"
            w={21}
            h={21}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View>
      <FlatList
        data={props.tags}
        extraData={props.tags}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => renderTag(String(item))}
        horizontal={true}
        marginBottom={props.tags.length > 0 ? 10 : 0}
      />
      <Input>
        <InputField
          placeholder="Event Tag"
          value={tag}
          onChangeText={(t) => setTag(t)}
          onSubmitEditing={addTag}
          blurOnSubmit={tag ? false : true}
        />
      </Input>
    </View>
  );
}
