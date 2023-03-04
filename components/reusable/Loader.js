import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import Lottie from 'lottie-react-native';

import animation from '../../assets/lottie/loading.json';


export default function Loader() {
    return (
        <View style={styles.container}>
        <Lottie
            source={animation}
            autoPlay
            loop
            style={styles.animation}
        />
        </View>
    );
    }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    animation: {
        width: 200,
        height: 200,
    },
});
