import PictureUpload from "./PictureUpload";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  HStack,
  Input,
  InputField,
  Textarea,
  TextareaInput
} from "@gluestack-ui/themed";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ScrollView, StyleProp, ViewStyle } from "react-native";
import { endOfUniYear, setDate, setTime } from "../helpers/DateTimeHelper";
import { EventData } from "../models/Event";
import { useRef, useState } from "react";
import TagInput from "./TagInput";
import { xor } from "lodash";

interface Props {
  event: EventData;
  setEvent: React.Dispatch<React.SetStateAction<EventData>>;
}

export default function EventForm(props: Props) {
  const [isFirstScrollSizeChange, setIsFirstScrollSizeChange] =
    useState<boolean>(true);

  const scrollViewRef = useRef<ScrollView>(null);

  const dateTimePickerStyle: StyleProp<ViewStyle> = { left: -10 };

  const setPictureURL = (url: string) => {
    props.setCreateEvent({
      ...props.createEvent,
      localPictureUrl: url
    });
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      onContentSizeChange={() => {
        if (isFirstScrollSizeChange) {
          setIsFirstScrollSizeChange(false);
        } else {
          scrollViewRef.current?.scrollToEnd();
        }
      }}
      automaticallyAdjustKeyboardInsets={true}
      style={{ paddingHorizontal: 20 }}
      contentContainerStyle={{
        gap: 20,
        paddingBottom: 20
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
            value={props.event.name ? props.event.name : undefined}
            onChangeText={(t) =>
              props.setEvent({
                ...props.event,
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
            value={props.event.location ? props.event.location : undefined}
            onChangeText={(l) =>
              props.setEvent({
                ...props.event,
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
              props.event.description ? props.event.description : undefined
            }
            onChangeText={(t) =>
              props.setEvent({
                ...props.event,
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
            value={props.event.startDate}
            mode={"date"}
            minimumDate={new Date()}
            maximumDate={endOfUniYear()}
            onChange={(_, date) =>
              date &&
              props.setEvent({
                ...props.event,
                startDate: setDate(props.event.startDate, date)
              })
            }
          />
          <DateTimePicker
            style={dateTimePickerStyle}
            value={props.event.startDate}
            mode={"time"}
            minimumDate={new Date()}
            is24Hour={true}
            onChange={(_, date) =>
              date &&
              props.setEvent({
                ...props.event,
                startDate: setTime(props.event.startDate, date)
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
            value={props.event.endDate}
            mode={"date"}
            minimumDate={new Date()}
            maximumDate={endOfUniYear()}
            onChange={(_, date) =>
              date &&
              props.setEvent({
                ...props.event,
                endDate: setDate(props.event.endDate, date)
              })
            }
          />
          <DateTimePicker
            style={dateTimePickerStyle}
            value={props.event.endDate}
            mode={"time"}
            minimumDate={new Date()}
            is24Hour={true}
            onChange={(_, date) =>
              date &&
              props.setEvent({
                ...props.event,
                endDate: setTime(props.event.endDate, date)
              })
            }
          />
        </HStack>
      </FormControl>
      <FormControl>
        <FormControlLabel>
          <FormControlLabelText>Event Tags</FormControlLabelText>
        </FormControlLabel>
        <TagInput
          tags={props.event.tags}
          onChangeTags={(tag) =>
            props.setEvent({
              ...props.event,
              tags: xor(props.event.tags, [tag])
            })
          }
        />
      </FormControl>
    </ScrollView>
  );
}
