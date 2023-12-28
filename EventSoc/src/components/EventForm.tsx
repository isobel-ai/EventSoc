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
import { CreateEvent } from "../models/Event";

interface Props {
  createEvent: CreateEvent;
  setCreateEvent: React.Dispatch<React.SetStateAction<CreateEvent>>;
}

export default function EventForm(props: Props) {
  const dateTimePickerStyle: StyleProp<ViewStyle> = { left: -10 };

  const setPictureURL = (url: string) => {
    props.setCreateEvent({
      ...props.createEvent,
      localPictureUrl: url
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
        image={props.createEvent.localPictureUrl}
        setImage={setPictureURL}
      />
      <FormControl isRequired={true}>
        <FormControlLabel>
          <FormControlLabelText>Event Name</FormControlLabelText>
        </FormControlLabel>
        <Input>
          <InputField
            placeholder="Event name"
            value={props.createEvent.name ? props.createEvent.name : undefined}
            onChangeText={(t) =>
              props.setCreateEvent({
                ...props.createEvent,
                name: t
              })
            }
          />
        </Input>
      </FormControl>
      <FormControl isRequired={true}>
        <FormControlLabel>
          <FormControlLabelText>Event Location</FormControlLabelText>
        </FormControlLabel>
        <Input>
          <InputField
            placeholder="Event location"
            value={
              props.createEvent.location
                ? props.createEvent.location
                : undefined
            }
            onChangeText={(l) =>
              props.setCreateEvent({
                ...props.createEvent,
                location: l
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
            value={
              props.createEvent.description
                ? props.createEvent.description
                : undefined
            }
            onChangeText={(t) =>
              props.setCreateEvent({
                ...props.createEvent,
                description: t
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
            value={props.createEvent.startDate}
            mode={"date"}
            minimumDate={new Date()}
            onChange={(_, date) =>
              date &&
              props.setCreateEvent({
                ...props.createEvent,
                startDate: setDate(props.createEvent.startDate, date)
              })
            }
          />
          <DateTimePicker
            style={dateTimePickerStyle}
            value={props.createEvent.startDate}
            mode={"time"}
            minimumDate={new Date()}
            is24Hour={true}
            onChange={(_, date) =>
              date &&
              props.setCreateEvent({
                ...props.createEvent,
                startDate: setTime(props.createEvent.startDate, date)
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
            value={props.createEvent.endDate}
            mode={"date"}
            minimumDate={new Date()}
            onChange={(_, date) =>
              date &&
              props.setCreateEvent({
                ...props.createEvent,
                endDate: setDate(props.createEvent.endDate, date)
              })
            }
          />
          <DateTimePicker
            style={dateTimePickerStyle}
            value={props.createEvent.endDate}
            mode={"time"}
            minimumDate={new Date()}
            is24Hour={true}
            onChange={(_, date) =>
              date &&
              props.setCreateEvent({
                ...props.createEvent,
                endDate: setTime(props.createEvent.endDate, date)
              })
            }
          />
        </HStack>
      </FormControl>
    </ScrollView>
  );
}
