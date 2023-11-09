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
        image={props.createSocEvent.localPictureUrl}
        setImage={setPictureURL}
      />
      <FormControl isRequired={true}>
        <FormControlLabel>
          <FormControlLabelText>Event Name</FormControlLabelText>
        </FormControlLabel>
        <Input>
          <InputField
            placeholder="Event name"
            value={
              props.createSocEvent.name ? props.createSocEvent.name : undefined
            }
            onChangeText={(t) =>
              props.setCreateSocEvent({
                ...props.createSocEvent,
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
              props.createSocEvent.location
                ? props.createSocEvent.location
                : undefined
            }
            onChangeText={(l) =>
              props.setCreateSocEvent({
                ...props.createSocEvent,
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
              props.createSocEvent.description
                ? props.createSocEvent.description
                : undefined
            }
            onChangeText={(t) =>
              props.setCreateSocEvent({
                ...props.createSocEvent,
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
            value={props.createSocEvent.startDate}
            mode={"date"}
            minimumDate={new Date()}
            onChange={(_, date) =>
              date &&
              props.setCreateSocEvent({
                ...props.createSocEvent,
                startDate: setDate(props.createSocEvent.startDate, date)
              })
            }
          />
          <DateTimePicker
            style={dateTimePickerStyle}
            value={props.createSocEvent.startDate}
            mode={"time"}
            minimumDate={new Date()}
            is24Hour={true}
            onChange={(_, date) =>
              date &&
              props.setCreateSocEvent({
                ...props.createSocEvent,
                startDate: setTime(props.createSocEvent.startDate, date)
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
            value={props.createSocEvent.endDate}
            mode={"date"}
            minimumDate={new Date()}
            onChange={(_, date) =>
              date &&
              props.setCreateSocEvent({
                ...props.createSocEvent,
                endDate: setDate(props.createSocEvent.endDate, date)
              })
            }
          />
          <DateTimePicker
            style={dateTimePickerStyle}
            value={props.createSocEvent.endDate}
            mode={"time"}
            minimumDate={new Date()}
            is24Hour={true}
            onChange={(_, date) =>
              date &&
              props.setCreateSocEvent({
                ...props.createSocEvent,
                endDate: setTime(props.createSocEvent.endDate, date)
              })
            }
          />
        </HStack>
      </FormControl>
    </ScrollView>
  );
}
