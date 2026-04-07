// App.tsx

import React, { useEffect } from "react";
import { StatusBar, View } from "react-native";
import Navigation from "./src/navigation";
import { useGameState } from "./src/store/useGameState";

export default function App() {
  const checkStreak = useGameState((s) => s.checkStreak);

  // Check streak status on app launch
  useEffect(() => {
    checkStreak();
  }, [checkStreak]);

  return (
    <View style={{ flex: 1, backgroundColor: "#12100D" }}>
      <StatusBar barStyle="light-content" backgroundColor="#12100D" />
      <Navigation />
    </View>
  );
}
