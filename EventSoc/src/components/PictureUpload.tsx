import * as ImagePicker from "expo-image-picker";
import { ImageBackground, TouchableOpacity } from "react-native";
import { Button, ButtonIcon, Icon, TrashIcon } from "@gluestack-ui/themed";
import uploadPictureImage from "../assets/images/photoUpload.png";

interface Props {
  image: string;
  setImage: (url: string) => void;
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
    <>
      <TouchableOpacity
        onPress={pickImage}
        style={{
          alignSelf: "center",
          height: 250,
          width: 250
        }}>
        <ImageBackground
          style={{ height: "100%", width: "100%" }}
          source={props.image ? { uri: props.image } : uploadPictureImage}>
          <Button
            action="negative"
            size="xl"
            width="10%"
            margin={5}
            onPress={() => props.setImage("")}>
            <ButtonIcon>
              <Icon
                as={TrashIcon}
                size="lg"
              />
            </ButtonIcon>
          </Button>
        </ImageBackground>
      </TouchableOpacity>
    </>
  );
}
