import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Image,
  Alert,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  Button,
  Text,
  TextInput,
  Snackbar,
  Banner,
  Colors,
} from "react-native-paper";
import { auth, db } from "../../firebase";
import styles from "./styles";

import { baseURL } from "../config/baseURL";
import axios from "axios";

import LottieView from "lottie-react-native";



export default function Signup({ navigation }) {


  const [Name, setName] = useState("");
  const [securedpassword, setSecuredpassword] = useState(true);
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [color, setColor] = useState("#9d9d9d");

  //SnackBar manage
  const [label, setLabel] = useState("");
  const [visible, setVisible] = useState(false);

  
  

  const onSignUp = () => {
    if (Name == "" || Email == "" || Password == "") {
      setLabel("Please fill all the fields");
      setVisible(true);
    } else {
      auth.createUserWithEmailAndPassword(Email, Password)
        .then(async (result) => {
          await axios.post(`${baseURL}/api/users/register`, {
            name: Name,
            email: Email,
            password: Password,
            profilePic: "https://firebasestorage.googleapis.com/v0/b/linkedhub-9b776.appspot.com/o/istockphoto-1316420668-612x612.jpg?alt=media&token=e3e329a7-f40a-4d0e-b3e8-bc7570d31d52",
            uuid: result.user.uid,
          })
            .then((res) => {
              console.log(res);
              navigation.navigate("Login");
            })
            .catch((error) => {
              console.error(error);
              setLabel(error.message);
              setVisible(true);
            });
         
        })
        .catch((error) => {
          console.log(error);
          setLabel(error.message);
          setVisible(true);
        });
    }
  };

  const eyeColor = () => {
    if (!securedpassword) {
      setColor("#9d9d9d");
    } else {
      setColor("#3d3d3d");
    }
  };
  return (
    <View style={{ backgroundColor: "#fff", flex: 1 }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <LottieView
          source={require("../../assets/lottie/login.json")}
          autoPlay
          loop
          style={{ width: 300, height: 300 }}
        />
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1, justifyContent: "center", padding: 20 }}
      >
        <TextInput
          label="Name"
          value={Name}
          onChangeText={(text) => setName(text)}
          style={styles.input}
          mode="outlined"
        />

        <TextInput
          label="Email"
          value={Email}
          onChangeText={(email) => setEmail(email)}
          type="email"
          style={styles.input}
          mode="outlined"
          keyboardType="email-address"
        />

        <TextInput
          Password
          label="Password"
          value={Password}
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
          mode="outlined"
          secureTextEntry={securedpassword}
          right={
            <TextInput.Icon
              icon={"eye"}
              size={30}
              color={color}
              onPress={() => {
                setSecuredpassword(!securedpassword);
                eyeColor();
              }}
            />
          }
        />

        <Button style={styles.button} mode="contained" onPress={onSignUp}>
          Sign up
        </Button>
        <Button
          uppercase={false}
          style={styles.button}
          onPress={() => navigation.navigate("Login")}
        >
          already have an account? Login here
        </Button>
        <Banner
          visible={visible}
          actions={[
            {
              label: "Ok",
              onPress: () => setVisible(false),
            },
          ]}
          contentStyle={{
            backgroundColor: Colors.red100,
            borderRadius: 9,
          }}
          style={{
            margin: 10,
            borderRadius: 9,
            marginBottom: 20,
          }}
        >
          <Text style={{ fontSize: 15, color: "#000" }}>{label}</Text>
        </Banner>
      </KeyboardAvoidingView>
    </View>
  );
}
