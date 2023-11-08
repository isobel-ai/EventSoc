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
import { CreateSocEvent } from "../models/SocEvent";

interface Props {
  createSocEvent: CreateSocEvent;
  setCreateSocEvent: React.Dispatch<React.SetStateAction<CreateSocEvent>>;
}

export default function EventForm(props: Props) {
  const dateTimePickerStyle: StyleProp<ViewStyle> = { left: -10 };

  const setPictureURL = (url: string) => {
    props.setCreateSocEvent({
      ...props.createSocEvent,
      pictureURL: url,
      socEvent: { ...props.createSocEvent.socEvent, hasPicture: Boolean(url) }
    });
  };

  return (
    <ScrollView
      automaticallyAdjustKeyboardInsets={true}
      style={{ paddingHorizontal: 20 }}
      contentContainerStyle={{
        gap: 20
      }}>
      <PictureUpload
        image={props.createSocEvent.pictureURL}
        setImage={setPictureURL}
      />
      <FormControl isRequired={true}>
        <FormControlLabel>
          <FormControlLabelText>Event Name</FormControlLabelText>
        </FormControlLabel>
        <Input>
          <InputField
            placeholder="Event name"
            onChangeText={(t) =>
              props.setCreateSocEvent({
                ...props.createSocEvent,
                socEvent: { ...props.createSocEvent.socEvent, name: t }
              })
            }
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
            onChangeText={(t) =>
              props.setCreateSocEvent({
                ...props.createSocEvent,
                socEvent: { ...props.createSocEvent.socEvent, description: t }
              })
            }
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
            value={props.createSocEvent.socEvent.startDate}
            mode={"date"}
            minimumDate={new Date()}
            onChange={(_, date) =>
              date &&
              props.setCreateSocEvent({
                ...props.createSocEvent,
                socEvent: {
                  ...props.createSocEvent.socEvent,
                  startDate: setDate(
                    props.createSocEvent.socEvent.startDate,
                    date
                  )
                }
              })
            }
          />
          <DateTimePicker
            style={dateTimePickerStyle}
            value={props.createSocEvent.socEvent.startDate}
            mode={"time"}
            minimumDate={new Date()}
            is24Hour={true}
            onChange={(_, date) =>
              date &&
              props.setCreateSocEvent({
                ...props.createSocEvent,
                socEvent: {
                  ...props.createSocEvent.socEvent,
                  startDate: setTime(
                    props.createSocEvent.socEvent.startDate,
                    date
                  )
                }
              })
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
            value={props.createSocEvent.socEvent.endDate}
            mode={"date"}
            minimumDate={new Date()}
            onChange={(_, date) =>
              date &&
              props.setCreateSocEvent({
                ...props.createSocEvent,
                socEvent: {
                  ...props.createSocEvent.socEvent,
                  endDate: setDate(props.createSocEvent.socEvent.endDate, date)
                }
              })
            }
          />
          <DateTimePicker
            style={dateTimePickerStyle}
            value={props.createSocEvent.socEvent.endDate}
            mode={"time"}
            minimumDate={new Date()}
            is24Hour={true}
            onChange={(_, date) =>
              date &&
              props.setCreateSocEvent({
                ...props.createSocEvent,
                socEvent: {
                  ...props.createSocEvent.socEvent,
                  endDate: setTime(props.createSocEvent.socEvent.endDate, date)
                }
              })
            }
          />
        </HStack>
      </FormControl>
    </ScrollView>
  );
}
