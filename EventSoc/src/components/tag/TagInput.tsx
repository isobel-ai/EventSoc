import { Input, InputField, View } from "@gluestack-ui/themed";
import { useState } from "react";
import Tag from "./Tag";
import { FlatList } from "react-native";

type Props = {
  tags: string[];
  onChangeTags: (tag: string) => void;
};

export default function TagInput(props: Props) {
  const [tag, setTag] = useState<string>("");

  const addTag = () => {
    if (tag && !props.tags.includes(tag)) {
      props.onChangeTags(tag);
    }
    setTag("");
  };

  return (
    <View>
      <FlatList
        data={props.tags}
        extraData={props.tags}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <Tag
            label={item}
            onCancel={() => props.onChangeTags(item)}
          />
        )}
        horizontal={true}
        style={{ marginBottom: props.tags.length > 0 ? 10 : 0 }}
      />
      <Input>
        <InputField
          placeholder="Press enter to create a tag"
          value={tag}
          onChangeText={(t) => setTag(t)}
          onSubmitEditing={addTag}
          blurOnSubmit={tag ? false : true}
        />
      </Input>
    </View>
  );
}
