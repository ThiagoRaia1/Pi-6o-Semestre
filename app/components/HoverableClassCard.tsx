import React, { useRef, useState } from "react";
import { Animated, Text, TouchableOpacity, View, Platform } from "react-native";

type HoverableClassCardProps = {
  title: string;
  instructor?: string;
  students: { id: string; name: string }[];
  onEdit: () => void;
  onPlan: () => void;
};

export function HoverableClassCard({
  title,
  instructor,
  students,
  onEdit,
  onPlan,
}: HoverableClassCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [hovered, setHovered] = useState(false);

  const animateTo = (to: number) => {
    Animated.spring(scaleAnim, {
      toValue: to,
      useNativeDriver: true,
      friction: 5,
      tension: 80,
    }).start();
  };

  const handleMouseEnter = () => {
    setHovered(true);
    animateTo(1.20);
  };
  const handleMouseLeave = () => {
    setHovered(false);
    animateTo(1);
  };

  if (Platform.OS === "web") {
    return (
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ display: "inline-block" }}
      >
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }],
            backgroundColor: "white",
            padding: 8,
            borderRadius: 6,
            boxShadow: !hovered
              ? "0px 0px 5px rgba(0, 0, 0, 0.4)"
              : "0px 0px 20px rgba(0, 0, 0, 0.6)",
          }}
        >
          <Text style={{ fontWeight: "700" }}>{title}</Text>
          <Text style={{ color: "#666", fontSize: 12 }}>
            {instructor ?? "—"} • {students.length} alunos
          </Text>

          {/* Ações */}
          <View
            style={{
              flexDirection: "row",
              gap: 8,
              marginTop: 6,
            }}
          >
            <TouchableOpacity onPress={onEdit}>
              <Text style={{ color: "#1e90ff", fontSize: 12 }}>Gerenciar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onPlan}>
              <Text style={{ color: "#F47B20", fontSize: 12 }}>Planejar</Text>
            </TouchableOpacity>
          </View>

          {/* Lista de alunos só aparece no hover */}
          {hovered && (
            <View style={{ marginTop: 8 }}>
              {students.map((s) => (
                <Text key={s.id} style={{ fontSize: 12, color: "#333" }}>
                  • {s.name}
                </Text>
              ))}
            </View>
          )}
        </Animated.View>
      </div>
    );
  }

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
        backgroundColor: "white",
        padding: 8,
        borderRadius: 6,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <Text style={{ fontWeight: "700" }}>{title}</Text>
      <Text style={{ color: "#666", fontSize: 12 }}>
        {instructor ?? "—"} • {students.length} alunos
      </Text>

      {/* Ações */}
      <View
        style={{
          flexDirection: "row",
          gap: 8,
          marginTop: 6,
        }}
      >
        <TouchableOpacity onPress={onEdit}>
          <Text style={{ color: "#1e90ff", fontSize: 12 }}>Gerenciar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onPlan}>
          <Text style={{ color: "#F47B20", fontSize: 12 }}>Planejar</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de alunos só aparece no hover */}
      {hovered && (
        <>
          {students.map((s) => (
            <Text key={s.id} style={{ fontSize: 12, color: "#333" }}>
              • {s.name}
            </Text>
          ))}
        </>
      )}
    </Animated.View>
  );
}
