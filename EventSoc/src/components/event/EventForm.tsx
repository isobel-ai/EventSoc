import PictureUpload from "../general/PictureUpload";
import {
  FormControl,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
  HStack,
  Icon,
  InfoIcon,
  Input,
  InputField,
  Textarea,
  TextareaInput,
  Text
} from "@gluestack-ui/themed";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ScrollView, StyleProp, ViewStyle } from "react-native";
import { endOfUniYear, setDate, setTime } from "../../helpers/DateTimeHelper";
import { EventData } from "../../../../Shared/models/Event";
import { useRef, useState } from "react";
import TagInput from "../tag/TagInput";
import { toInteger, xor } from "lodash";
import { config } from "../../config/gluestack-ui.config";
import { useScrollOnResize } from "../../hooks/useScrollOnResize";
import { useFlashScrollIndicators } from "../../hooks/useFlashScrollIndicators";

type Props = {
  event: EventData;
  setEvent: (event: EventData) => void;

  image: string;
  setImage: (url: string) => void;
};

export default function EventForm(props: Props) {
  const scrollViewRef = useRef<ScrollView>(null);
  const handleFormSizeChange = useScrollOnResize(scrollViewRef);
  useFlashScrollIndicators(scrollViewRef);

  const [rawTicketPrice, setRawTicketPrice] = useState<string>(
    props.event.ticketPrice.toFixed(2)
  );

  const dateTimePickerStyle: StyleProp<ViewStyle> = { left: -10 };

  return (
    <ScrollView
      ref={scrollViewRef}
      onContentSizeChange={handleFormSizeChange}
      automaticallyAdjustKeyboardInsets={true}
      style={{ paddingHorizontal: 20 }}
      contentContainerStyle={{
        gap: 20,
        paddingBottom: 20
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
            placeholder="Event description"
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
      <FormControl>
        <FormControlLabel>
          <FormControlLabelText>Event Capacity</FormControlLabelText>
        </FormControlLabel>
        <Input>
          <InputField
            placeholder="Event capacity"
            value={
              props.event.capacity >= 0 ? String(props.event.capacity) : ""
            }
            onChangeText={(c) =>
              props.setEvent({
                ...props.event,
                capacity: c.replaceAll(".", "") ? toInteger(c) : -1
              })
            }
            keyboardType="numeric"
          />
        </Input>
        <FormControlHelper>
          <Icon
            as={InfoIcon}
            color={config.tokens.colors.primary500}
            marginHorizontal={5}
          />
          <FormControlHelperText color={config.tokens.colors.primary500}>
            Leave blank if unlimited capacity
          </FormControlHelperText>
        </FormControlHelper>
      </FormControl>
      <FormControl>
        <FormControlLabel>
          <FormControlLabelText>Event Price</FormControlLabelText>
        </FormControlLabel>
        <HStack gap={5}>
          <Text alignSelf="flex-end">£</Text>
          <Input width="95%">
            <InputField
              placeholder="Event Price"
              value={rawTicketPrice}
              onChangeText={setRawTicketPrice}
              keyboardType="numeric"
              onEndEditing={() => {
                const numTicketPrice = Number(rawTicketPrice);
                const formattedTicketPrice = isNaN(numTicketPrice)
                  ? "0.00"
                  : numTicketPrice.toFixed(2);
                setRawTicketPrice(formattedTicketPrice);
                props.setEvent({
                  ...props.event,
                  ticketPrice: Number(formattedTicketPrice)
                });
              }}
            />
          </Input>
        </HStack>
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
