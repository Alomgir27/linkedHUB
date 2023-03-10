import React from "react";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Constants from "expo-constants";
import Navigation from "./Navigation";
import { StyleSheet, LogBox } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import rootReducer from "./components/redux/reducers";
import thunk from "redux-thunk";
import 'react-native-gesture-handler';




console.disableYellowBox = true;
const theme = {
  ...DefaultTheme,
  roundness: 9,
  version: 3,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: "#1f1f1f",
    accent: "#84a59d",
    light: "#fff",
  },
};

const store = createStore(rootReducer, applyMiddleware(thunk));


export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PaperProvider theme={theme}>
          <Navigation style={styles.droidSafeArea} />
          <StatusBar style="dark" />
        </PaperProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
const styles = StyleSheet.create({
  droidSafeArea: {
    paddingTop: Constants.statusBarHeight,
  },
});
