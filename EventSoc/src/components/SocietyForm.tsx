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
import SelectBox, { Item } from "../../libs/multi-selectbox";
import { LogBox } from "react-native";
import { retrieveOtherUsers, retrieveUsers } from "../services/usersService";
import { useSocietiesContext } from "../contexts/SocietiesContext";
import { useIsFocused } from "@react-navigation/native";

interface Props {
  createSociety: CreateSociety;
  setCreateSociety: React.Dispatch<React.SetStateAction<CreateSociety>>;
  editingForm?: boolean;
}

export default function SocietyForm(props: Props) {
  const { selectedSoc } = useSocietiesContext();

  const [isSelectExecOpen, setIsSelectExecOpen] = useState<boolean>(false);

  const [userItems, setUserItems] = useState<Item[]>([]);
  const [execItems, setExecItems] = useState<Item[]>([]);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (props.editingForm) {
      retrieveUsers().then((users) => {
        if (users) {
          const items = users.map((i) => {
            return { id: i.id, item: i.name };
          });
          setUserItems(items);
        }
      });
    } else {
      retrieveOtherUsers().then((users) => {
        const items = users.map((i) => {
          return { id: i.id, item: i.name };
        });
        setUserItems(items);
      });
    }
  }, [isFocused]);

  useEffect(() => {
    props.editingForm &&
      setExecItems(
        userItems.filter((item) => selectedSoc.exec.includes(item.item))
      );
  }, [userItems]);

  const handleExecItemsChange = (item: Item) => {
    setExecItems(xorBy(execItems, [item], "id"));
  };

  const setExec = () => {
    const exec = execItems.map((i) => i.item);
    props.setCreateSociety({ ...props.createSociety, exec: exec });
    setIsSelectExecOpen(false);
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
        onClose={setExec}>
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
          <ModalBody scrollEnabled={false}>
            <HStack
              gap={5}
              alignItems="center">
              <Icon
                as={InfoIcon}
                size="xl"
                color={
                  props.editingForm
                    ? "transparent"
                    : config.tokens.colors.infoBlue
                }
              />
              <Text
                fontSize={"$sm"}
                color={config.tokens.colors.infoBlue}>
                {props.editingForm ? "" : "You are already on the exec."}
              </Text>
            </HStack>
            <SelectBox
              isMulti
              options={userItems}
              selectedValues={execItems}
              showAllOptions={false}
              onMultiSelect={handleExecItemsChange}
              onTapClose={handleExecItemsChange}
              inputPlaceholder="No exec chosen"
              listEmptyText="No users found"
            />
          </ModalBody>
          <ModalFooter>
            <Button
              size="lg"
              onPress={setExec}>
              <ButtonText>Continue</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ScrollView>
  );
}
