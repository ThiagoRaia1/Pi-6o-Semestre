import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { getGlobalStyles } from "../../../globalStyles";
import React, { useEffect, useState } from "react";
import { IPlanoDeAula } from "../../../interfaces/planoDeAula";
import { getPlanosDeAula } from "../../../services/planoDeAula";
import { colors } from "../../../utils/colors";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import EditPlanoDeAula from "./EditPlanoDeAula";
import ViewPlanoDeAula from "./ViewPlanoDeAula";
import ConfirmationModal from "../../../components/ConfirmationModal";
import MenuButton from "../../../components/MenuButton";
import TopBar from "../../../components/TopBar";
import CreatePlanoDeAula from "./CreatePlanoDeAula";
import { useFadeSlide } from "../../../hooks/useFadeSlide";

export default function PlanosDeAula() {
  const globalStyles = getGlobalStyles();
  const actionsIconsSize: number = 40;

  const { fadeAnim, slideAnim, fadeIn, fadeOut } = useFadeSlide();

  const [isCreateRegisterVisible, setIsCreateRegisterVisible] =
    useState<boolean>(false);

  const [planosDeAula, setPlanosDeAula] = useState<IPlanoDeAula[]>([]);
  const [selectedPlano, setSelectedPlano] = useState<IPlanoDeAula>();
  const [isViewVisible, setIsViewVisible] = useState<boolean>(false);
  const [isEditVisible, setIsEditVisible] = useState<boolean>(false);

  const [isConfirmationModalVisible, setIsConfirmationModalVisible] =
    useState<boolean>(false);

  const openCloseCreateRegister = () => {
    setIsCreateRegisterVisible(!isCreateRegisterVisible);
  };

  const openCloseViewRegister = (plano?: IPlanoDeAula) => {
    if (plano) setSelectedPlano(plano);
    setIsViewVisible(!isViewVisible);
  };

  const openCloseEditRegister = (plano?: IPlanoDeAula) => {
    if (plano) setSelectedPlano(plano);
    setIsEditVisible(!isEditVisible);
  };

  const openCloseConfirmationModal = (plano: IPlanoDeAula) => {
    setSelectedPlano(plano); // seta o plano selecionado
    setIsConfirmationModalVisible(!isConfirmationModalVisible);
  };

  useEffect(() => {
    const fetchPlanosDeAula = async () => {
      const resultado: IPlanoDeAula[] = await getPlanosDeAula();
      setPlanosDeAula(resultado);
    };

    fetchPlanosDeAula();

    fadeIn();
  }, []);

  const renderEditDeleteContainer = (plano: IPlanoDeAula) => {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            openCloseViewRegister(plano);
          }}
        >
          <Feather
            name="eye"
            size={actionsIconsSize}
            color="white"
            style={[
              globalStyles.actionButton,
              {
                backgroundColor: colors.main,
                borderWidth: 3,
                borderColor: "white",
              },
            ]}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            openCloseEditRegister(plano);
          }}
        >
          <Feather
            name="edit"
            size={actionsIconsSize}
            color="white"
            style={[
              globalStyles.actionButton,
              {
                backgroundColor: colors.buttonMainColor,
                borderWidth: 3,
                borderColor: "white",
              },
            ]}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            openCloseConfirmationModal(plano);
          }}
        >
          <Ionicons
            name="trash-outline"
            size={actionsIconsSize}
            color="white"
            style={[
              globalStyles.actionButton,
              {
                backgroundColor: colors.cancelColor,
                borderWidth: 3,
                borderColor: "white",
              },
            ]}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={globalStyles.container}>
      <TopBar
        menuButtons={[
          <MenuButton
            label={`Registrar`}
            onPress={() => setIsCreateRegisterVisible(!isCreateRegisterVisible)}
          />,
        ]}
      />
      <Animated.View
        style={[
          {
            flex: 1,
            width: "100%",
            padding: 36,
          },
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <ScrollView
          style={{
            flex: 1,
            height: "100%",
          }}
          contentContainerStyle={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: 20,
          }}
        >
          {planosDeAula.map(
            (planoDeAula) =>
              planoDeAula.salvo && (
                <View
                  key={planoDeAula.id}
                  style={{
                    backgroundColor: colors.main,
                    width: 260,
                    height: 200,
                    borderRadius: 20,
                    padding: 20,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{ color: "white", fontWeight: 600, fontSize: 24 }}
                  >
                    {`ID: ${planoDeAula.id}`}
                  </Text>
                  <Text
                    style={{
                      color: "white",
                      fontWeight: 600,
                      fontSize: 18,
                      textAlign: "center",
                    }}
                  >
                    {planoDeAula.titulo}
                  </Text>
                  {renderEditDeleteContainer(planoDeAula)}
                </View>
              )
          )}
        </ScrollView>
      </Animated.View>

      {isCreateRegisterVisible && (
        <CreatePlanoDeAula openCloseModal={openCloseCreateRegister} />
      )}

      {isEditVisible && selectedPlano && (
        <EditPlanoDeAula
          openCloseModal={openCloseEditRegister}
          planoDeAula={selectedPlano}
        />
      )}

      {isViewVisible && selectedPlano && (
        <ViewPlanoDeAula
          openCloseModal={openCloseViewRegister}
          planoDeAula={selectedPlano}
        />
      )}

      {isConfirmationModalVisible && selectedPlano && (
        <ConfirmationModal
          openCloseModal={() => openCloseConfirmationModal(selectedPlano)}
          planoDeAula={selectedPlano}
        />
      )}
    </View>
  );
}
