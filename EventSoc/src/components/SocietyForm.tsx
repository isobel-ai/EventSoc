import PictureUpload from "./PictureUpload";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  Input,
  InputField,
  Textarea,
  TextareaInput,
  ScrollView,
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Heading,
  CloseIcon,
  Icon,
  Button,
  ButtonText,
  Text,
  HStack,
  InfoIcon
} from "@gluestack-ui/themed";
import { CreateSociety } from "../models/Society";
import { useEffect, useState } from "react";
import { config } from "../../config/gluestack-ui.config";
import { xorBy } from "lodash";
import SelectBox, { Item } from "react-native-multi-selectbox-typescript";
import { LogBox } from "react-native";

interface Props {
  createSociety: CreateSociety;
  setCreateSociety: React.Dispatch<React.SetStateAction<CreateSociety>>;
}

export default function EventForm(props: Props) {
  const [isSelectExecOpen, setIsSelectExecOpen] = useState<boolean>(false);

  const [userItems] = useState<Item[]>([
    { id: "1", item: "1" },
    { id: "2", item: "2" },
    { id: "3", item: "3" },
    { id: "4", item: "4" },
    { id: "5", item: "5" },
    { id: "6", item: "6" },
    { id: "7", item: "7" },
    { id: "8", item: "8" },
    { id: "9", item: "9" }
  ]);
  const [execItems, setExecItems] = useState<Item[]>([]);

  // remove current user from users in useeffect

  const setExec = () => {
    const exec = execItems.map((i) => i.item);
    props.setCreateSociety({ ...props.createSociety, exec: exec });
  };

  // Suppress error for scrollable modal within scrollview
  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);

  return (
    <ScrollView
      automaticallyAdjustKeyboardInsets={true}
      style={{ paddingHorizontal: 20 }}
      contentContainerStyle={{ gap: 20 }}>
      <PictureUpload
        image={props.createSociety.localPictureUrl}
        setImage={(u) =>
          props.setCreateSociety({
            ...props.createSociety,
            localPictureUrl: u
          })
        }
      />
      <FormControl isRequired={true}>
        <FormControlLabel>
          <FormControlLabelText>Society Name</FormControlLabelText>
        </FormControlLabel>
        <Input>
          <InputField
            placeholder="Society Name"
            value={
              props.createSociety.name ? props.createSociety.name : undefined
            }
            onChangeText={(t) =>
              props.setCreateSociety({
                ...props.createSociety,
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
              props.createSociety.description
                ? props.createSociety.description
                : undefined
            }
            onChangeText={(t) =>
              props.setCreateSociety({
                ...props.createSociety,
                description: t
              })
            }
          />
        </Textarea>
      </FormControl>
      <Button
        size="lg"
        onPress={() => setIsSelectExecOpen(true)}>
        <ButtonText>Select Exec</ButtonText>
      </Button>
      <Modal
        isOpen={isSelectExecOpen}
        onClose={() => {
          setIsSelectExecOpen(false);
          setExec();
        }}>
        <ModalBackdrop />
        <ModalContent
          height="55%"
          top={-45}>
          <ModalHeader>
            <Heading>Select Exec</Heading>
            <ModalCloseButton>
              <Icon as={CloseIcon} />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <HStack
              gap={5}
              flex={1}
              alignItems="center">
              <Icon
                as={InfoIcon}
                size="xl"
                color={config.tokens.colors.infoBlue}
              />
              <Text
                fontSize={"$sm"}
                color={config.tokens.colors.infoBlue}>
                You are already on the exec.
              </Text>
            </HStack>
            <SelectBox
              isMulti
              options={userItems}
              selectedValues={execItems}
              onMultiSelect={(item: any) =>
                setExecItems(xorBy(execItems, [item], "id"))
              }
              onTapClose={(item: any) =>
                setExecItems(xorBy(execItems, [item], "id"))
              }
              label=""
              inputPlaceholder="No exec chosen"
              listEmptyText="No users found"
              searchInputProps={{
                placeholder: "Search",
                placeholderTextColor: config.tokens.colors.placeholderGray
              }}
              listOptionProps={{
                stickyHeaderIndices: [0]
              }}
              inputFilterStyle={{
                fontSize: config.tokens.fontSizes.sm
              }}
              inputFilterContainerStyle={{
                backgroundColor: config.tokens.colors.modalBackgroundLight
              }}
              optionsLabelStyle={{
                fontSize: config.tokens.fontSizes.sm,
                color: config.tokens.colors.black,
                paddingLeft: 5
              }}
              multiOptionContainerStyle={{
                backgroundColor: config.tokens.colors.navigationDarkPink
              }}
              multiOptionsLabelStyle={{
                fontSize: config.tokens.fontSizes.sm
              }}
              multiListEmptyLabelStyle={{
                color: config.tokens.colors.placeholderGray
              }}
              arrowIconColor={config.tokens.colors.black}
              searchIconColor={config.tokens.colors.black}
              toggleIconColor={config.tokens.colors.navigationDarkPink}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              size="lg"
              onPress={() => setIsSelectExecOpen(false)}>
              <ButtonText>Continue</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ScrollView>
  );
}
