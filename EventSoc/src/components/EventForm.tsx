import PictureUpload from "./PictureUpload";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  HStack,
  Input,
  InputField,
  ScrollView,
  Textarea,
  TextareaInput
} from "@gluestack-ui/themed";
import DateTimePicker from "@react-native-community/datetimepicker";
import { StyleProp, ViewStyle } from "react-native";
import { setDate, setTime } from "../helpers/DateTimeHelper";

interface Props {
  image: string;
  setImage: React.Dispatch<React.SetStateAction<string>>;

  setName: React.Dispatch<React.SetStateAction<string>>;

  setDesc: React.Dispatch<React.SetStateAction<string>>;

  startDate: Date;
  setStartDate: React.Dispatch<React.SetStateAction<Date>>;

  endDate: Date;
  setEndDate: React.Dispatch<React.SetStateAction<Date>>;
}

export default function EventForm(props: Props) {
  const dateTimePickerStyle: StyleProp<ViewStyle> = { left: -10 };

  return (
    <ScrollView
      automaticallyAdjustKeyboardInsets={true}
      style={{ paddingHorizontal: 20 }}
      contentContainerStyle={{
        gap: 20
      }}>
      <PictureUpload
        image={props.image}
        setImage={props.setImage}
      />
      <FormControl isRequired={true}>
        <FormControlLabel>
          <FormControlLabelText>Event Name</FormControlLabelText>
        </FormControlLabel>
        <Input>
          <InputField
            placeholder="Event name"
            onChangeText={(t) => props.setName(t)}
          />
        </Input>
      </FormControl>
      <FormControl>
        <FormControlLabel>
          <FormControlLabelText>Event Description</FormControlLabelText>
        </FormControlLabel>
        <Textarea>
          <TextareaInput
            placeholder="Event Description"
            onChangeText={(t) => props.setDesc(t)}
          />
        </Textarea>
      </FormControl>
      <FormControl isRequired={true}>
        <FormControlLabel>
          <FormControlLabelText>Event Start</FormControlLabelText>
        </FormControlLabel>
        <HStack>
          <DateTimePicker
            style={dateTimePickerStyle}
            value={props.startDate}
            mode={"date"}
            minimumDate={new Date()}
            onChange={(_, date) =>
              date && props.setStartDate(setDate(props.startDate, date))
            }
          />
          <DateTimePicker
            style={dateTimePickerStyle}
            value={props.startDate}
            mode={"time"}
            minimumDate={new Date()}
            is24Hour={true}
            onChange={(_, date) =>
              date && props.setStartDate(setTime(props.startDate, date))
            }
          />
        </HStack>
      </FormControl>
      <FormControl isRequired={true}>
        <FormControlLabel>
          <FormControlLabelText>Event End</FormControlLabelText>
        </FormControlLabel>
        <HStack>
          <DateTimePicker
            style={dateTimePickerStyle}
            value={props.endDate}
            mode={"date"}
            minimumDate={new Date()}
            onChange={(_, date) =>
              date && props.setEndDate(setDate(props.endDate, date))
            }
          />
          <DateTimePicker
            style={dateTimePickerStyle}
            value={props.endDate}
            mode={"time"}
            minimumDate={new Date()}
            is24Hour={true}
            onChange={(_, date) =>
              date && props.setEndDate(setTime(props.endDate, date))
            }
          />
        </HStack>
      </FormControl>
    </ScrollView>
  );
}
