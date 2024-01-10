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
  InfoIcon,
  Alert,
  AlertText
} from "@gluestack-ui/themed";
import { CreateSociety } from "../models/Society";
import { useEffect, useState } from "react";
import { config } from "../../config/gluestack-ui.config";
import { xorBy } from "lodash";
import SelectBox, { Item } from "../../libs/multi-selectbox";
import { LogBox } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAppContext } from "../contexts/AppContext";

interface Props {
  createSociety: CreateSociety;
  setCreateSociety: React.Dispatch<React.SetStateAction<CreateSociety>>;
  editingForm?: boolean;
}

export default function SocietyForm(props: Props) {
  const { users, updateUsers, getUser } = useAppContext();

  const [isSelectExecOpen, setIsSelectExecOpen] = useState<boolean>(false);

  const [errMsg, setErrMsg] = useState<string>("");

  const [userItems, setUserItems] = useState<Item[]>([]);
  const [execItems, setExecItems] = useState<Item[]>([]);

  const isFocused = useIsFocused();

  useEffect(() => {
    updateUsers().then((result) => {
      if (result instanceof Error) {
        setErrMsg(result.message);
      } else {
        const userId = getUser()?.id;
        setUserItems(
          users.flatMap((user) =>
            props.editingForm || user.id !== userId
              ? [{ id: user.id, item: user.data.name }]
              : []
          )
        );
        setErrMsg("");
      }
    });
  }, [isFocused]);

  useEffect(() => {
    props.editingForm &&
      setExecItems(
        userItems.filter((item) => props.createSociety.exec.includes(item.item))
      );
  }, [userItems]);

  const handleExecItemsChange = (item: Item) => {
    setExecItems(xorBy(execItems, [item], "id"));
  };

  const setExec = () => {
    if (!errMsg) {
      const exec = execItems.map((i) => i.item);
      props.setCreateSociety({ ...props.createSociety, exec: exec });
    }
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
      contentContainerStyle={{ gap: 20, paddingBottom: 20 }}>
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
          height={errMsg ? "35%" : "45%"}
          top={-85}>
          <ModalHeader>
            <Heading>Select Exec</Heading>
            <ModalCloseButton>
              <Icon as={CloseIcon} />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody scrollEnabled={false}>
            {errMsg ? (
              <Alert
                action="error"
                variant="outline"
                width="90%"
                alignSelf="center"
                marginTop={15}>
                <MaterialIcons
                  name="error-outline"
                  size={40}
                  color={config.tokens.colors.error}
                  style={{ paddingRight: 15 }}
                />
                <AlertText>{errMsg}</AlertText>
              </Alert>
            ) : (
              <>
                {!props.editingForm && (
                  <HStack
                    gap={5}
                    alignItems="center">
                    <Icon
                      as={InfoIcon}
                      size="xl"
                      color={config.tokens.colors.infoBlue}
                    />
                    <Text
                      fontSize={"$sm"}
                      color={config.tokens.colors.infoBlue}>
                      {"You are already on the exec."}
                    </Text>
                  </HStack>
                )}
                <SelectBox
                  isMulti
                  options={userItems}
                  selectedValues={execItems}
                  showAllOptions={false}
                  onMultiSelect={handleExecItemsChange}
                  onTapClose={handleExecItemsChange}
                  inputPlaceholder="No exec chosen"
                  listEmptyText="No users found"
                  maxHeight={props.editingForm ? "100%" : "90%"}
                />
              </>
            )}
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
