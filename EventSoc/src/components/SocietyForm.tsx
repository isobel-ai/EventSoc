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
import { SocietyData } from "../models/Society";
import { useEffect, useState } from "react";
import { config } from "../../config/gluestack-ui.config";
import { xorBy } from "lodash";
import SelectBox, { Item } from "../../libs/multi-selectbox";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAppContext } from "../contexts/AppContext";

interface Props {
  society: SocietyData;
  setSociety: React.Dispatch<React.SetStateAction<SocietyData>>;

  editingForm?: boolean;
}

export default function SocietyForm(props: Props) {
  const { users, updateUsers, userId } = useAppContext();

  const getUserItems = () =>
    users.flatMap((user) =>
      props.editingForm || user.id !== userId
        ? [{ id: user.id, item: user.data.name }]
        : []
    );

  const [userItems, setUserItems] = useState<Item[]>(getUserItems);
  const [execItems, setExecItems] = useState<Item[]>([]);

  const [retrieveUsersErrMsg, setRetrieveUsersErrMsg] = useState<string>("");

  const [isSelectExecOpen, setIsSelectExecOpen] = useState<boolean>(false);

  useEffect(() => {
    isSelectExecOpen &&
      updateUsers()
        .then(() => {
          setUserItems(getUserItems());
          setRetrieveUsersErrMsg("");
        })
        .catch((err) => !users.length && setRetrieveUsersErrMsg(err.message));
  }, [isSelectExecOpen]);

  useEffect(() => {
    setExecItems(
      userItems.filter(
        (userItem) =>
          execItems.some((execItem) => execItem.id === userItem.id) ||
          (props.editingForm &&
            props.society.execIds.includes(String(userItem.id)))
      )
    );
  }, [userItems]);

  const handleExecItemsChange = (item: Item) => {
    setExecItems(xorBy(execItems, [item], "id"));
  };

  const setExec = () => {
    if (!retrieveUsersErrMsg) {
      const exec = execItems.map((i) => i.item);
      props.setSociety({ ...props.society, execIds: exec });
    }
    setIsSelectExecOpen(false);
  };

  return (
    <ScrollView
      automaticallyAdjustKeyboardInsets={true}
      style={{ paddingHorizontal: 20 }}
      contentContainerStyle={{ gap: 20, paddingBottom: 20 }}>
      <PictureUpload
        image={props.society.pictureUrl}
        setImage={(u) =>
          props.setSociety({
            ...props.society,
            pictureUrl: u
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
          height={retrieveUsersErrMsg ? "35%" : "45%"}
          top={-85}>
          <ModalHeader>
            <Heading>Select Exec</Heading>
            <ModalCloseButton>
              <Icon as={CloseIcon} />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody scrollEnabled={false}>
            {retrieveUsersErrMsg ? (
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
                <AlertText>{retrieveUsersErrMsg}</AlertText>
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
