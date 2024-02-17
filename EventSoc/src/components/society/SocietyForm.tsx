import PictureUpload from "../general/PictureUpload";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  Input,
  InputField,
  Textarea,
  TextareaInput,
  ScrollView
} from "@gluestack-ui/themed";
import { SocietyData } from "../../../../Shared/models/Society";
import { UserOverview } from "../../../../Shared/models/User";
import SocietyExecSelector from "./SocietyExecSelector";

type Props = {
  society: SocietyData;
  setSociety: (newSoc: SocietyData) => void;

  exec: UserOverview[];
  setExec: (newExec: UserOverview[]) => void;

  image: string;
  setImage: (url: string) => void;

  editingForm?: boolean;
};

export default function SocietyForm(props: Props) {
  return (
    <ScrollView
      automaticallyAdjustKeyboardInsets={true}
      style={{ paddingHorizontal: 20 }}
      contentContainerStyle={{ gap: 15, height: "100%" }}>
      <PictureUpload
        image={props.image}
        setImage={props.setImage}
        circular
      />
      <FormControl isRequired={true}>
        <FormControlLabel>
          <FormControlLabelText>Society Name</FormControlLabelText>
        </FormControlLabel>
        <Input>
          <InputField
            placeholder="Society Name"
            value={props.society.name ? props.society.name : undefined}
            onChangeText={(t) =>
              props.setSociety({
                ...props.society,
                name: t
              })
            }
          />
        </Input>
      </FormControl>
      <FormControl>
        <FormControlLabel>
          <FormControlLabelText>Society Description</FormControlLabelText>
        </FormControlLabel>
        <Textarea>
          <TextareaInput
            placeholder="Society Description"
            value={
              props.society.description ? props.society.description : undefined
            }
            onChangeText={(t) =>
              props.setSociety({
                ...props.society,
                description: t
              })
            }
          />
        </Textarea>
      </FormControl>
      <SocietyExecSelector
        exec={props.exec}
        setExec={props.setExec}
        editingForm={props.editingForm}
      />
    </ScrollView>
  );
}
