import * as ImagePicker from "expo-image-picker";
import { ImageBackground, TouchableOpacity } from "react-native";
import { Button, ButtonIcon, Icon, TrashIcon } from "@gluestack-ui/themed";
import uploadPictureImage from "../../assets/images/photoUpload.png";

type Props = {
  image: string;
  setImage: (url: string) => void;
  circular?: boolean;
};

export default function PictureUpload(props: Props) {
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [1, 1],
      quality: 0
    });
    const source = result.assets ? result.assets[0].uri : props.image;
    props.setImage(source);
  };

  const borderRadius = props.circular ? 500 : undefined;

  return (
    <>
      <TouchableOpacity
        onPress={pickImage}
        style={{
          alignSelf: "center",
          height: 250,
          width: 250,
          borderRadius: borderRadius
        }}>
        <ImageBackground
          style={{ height: "100%", width: "100%" }}
          imageStyle={{ borderRadius: borderRadius }}
          source={props.image ? { uri: props.image } : uploadPictureImage}>
          <Button
            action="negative"
            size="xl"
            width="10%"
            margin={5}
            left={props.circular ? -40 : undefined}
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
