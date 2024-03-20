import {
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
import { useEffect, useState } from "react";
import { config } from "../../config/gluestack-ui.config";
import { isUndefined, xorBy } from "lodash";
import SelectBox, { Item } from "../../../libs/multi-selectbox";
import { useUserContext } from "../../contexts/UserContext";
import { UserOverview } from "../../../../Shared/models/User";
import { useIsFocused } from "@react-navigation/native";
import ErrorAlert from "../error/ErrorAlert";
import { retrieveUserNames } from "../../services/namesService";

type Props = {
  exec: UserOverview[];
  setExec: (newExec: UserOverview[]) => void;

  editingForm?: boolean;
};

export default function SocietyExecSelector(props: Props) {
  const { userId } = useUserContext();

  const [isSelectExecOpen, setIsSelectExecOpen] = useState<boolean>(false);

  const [userItems, setUserItems] = useState<Item[]>();
  const [execItems, setExecItems] = useState<Item[]>();

  const [showRetrieveUsersErr, setShowRetrieveUsersErr] =
    useState<boolean>(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    (isFocused || isSelectExecOpen) &&
      isUndefined(userItems) &&
      retrieveUserNames()
        .then((newUserItems) => {
          props.editingForm
            ? setUserItems(newUserItems)
            : setUserItems(newUserItems.filter((item) => item.id !== userId));

          setExecItems(
            newUserItems.filter((item) =>
              props.exec.some((member) => member.id === item.id)
            )
          );

          setShowRetrieveUsersErr(false);
        })
        .catch((err) => {
          console.error(err.message);
          setShowRetrieveUsersErr(true);
        });
  }, [isFocused, isSelectExecOpen]);

  const handleExecItemsChange = (item: Item) => {
    setExecItems(xorBy(execItems, [item], "id"));
  };

  const handleSelectExec = () => {
    !showRetrieveUsersErr && props.setExec(execItems as UserOverview[]);
    setIsSelectExecOpen(false);
  };

  return (
    <>
      <Button
        size="lg"
        onPress={() => setIsSelectExecOpen(true)}>
        <ButtonText>Select Exec</ButtonText>
      </Button>
      <Modal
        isOpen={isSelectExecOpen}
        onClose={handleSelectExec}>
        <ModalBackdrop />
        <ModalContent
          height={showRetrieveUsersErr ? "35%" : "45%"}
          top={-85}
          bgColor={config.tokens.colors.defaultBackgroundLight}>
          <ModalHeader>
            <Heading>Select Exec</Heading>
            <ModalCloseButton>
              <Icon as={CloseIcon} />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody scrollEnabled={false}>
            {showRetrieveUsersErr ? (
              <ErrorAlert
                message={"Couldn't retrieve users. Try again later."}
                width="90%"
              />
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
              onPress={handleSelectExec}>
              <ButtonText>Continue</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
