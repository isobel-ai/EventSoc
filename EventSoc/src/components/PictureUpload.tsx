import * as ImagePicker from "expo-image-picker";
import { TouchableOpacity } from "react-native";
import { Image, View } from "@gluestack-ui/themed";

import uploadPictureImage = require("../assets/images/photoUpload.png");

interface Props {
  image: string;
  setImage: React.Dispatch<React.SetStateAction<string>>;
}

export default function PictureUpload(props: Props) {
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1
    });
    const source = result.assets ? result.assets[0].uri : props.image;
    props.setImage(source);
  };

  return (
    <View>
      <TouchableOpacity
        onPress={pickImage}
        style={{ alignSelf: "center" }}>
        <Image
          size="2xl"
          source={props.image || uploadPictureImage}
          alt=""
        />
      </TouchableOpacity>
    </View>
  );
}
