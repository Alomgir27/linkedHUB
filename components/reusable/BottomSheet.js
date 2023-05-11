import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import {
    BottomSheetModal,
    BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { FlatList } from "react-native-gesture-handler";

import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function BottomSheet(props) {
    const { users, title, handleSheetChanges, bottomSheetModalRef , navigation, fetchUsers, loading } = props;

    const snapPoints = React.useMemo(() => ['25%', '50%', '75%', '100%'], []);


    return (
            <BottomSheetModal
                ref={bottomSheetModalRef}
                index={1}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
                backdropComponent={BottomSheetBackdrop}
                backdropOpacity={0.5}
                handleComponent={() => (
                    <View style={{ backgroundColor: 'white', height: 5, width: 50, borderRadius: 5, alignSelf: 'center', marginTop: 10 }} />
                )}
                handleHeight={20}

          >
             <Text style={{ justifyContent: 'center', alignSelf: 'center', fontSize: 20, fontWeight: 'bold', marginTop: 10 }}>{title}</Text>
              <View style={{ backgroundColor: 'white', padding: 16, height: 450 }}>
                 {loading && <Text>Loading...</Text>}
                    <FlatList
                        data={users}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }} onPress={() => navigation.navigate('Profile', { userId: item?._id })}>
                                <Image source={{ uri: item?.profilePic }} style={styles.storyImage} />
                                <View style={{ flex: 1, justifyContent: 'center', position: 'absolute', right: 0, alignItems: 'center', flexDirection: 'row' }}>
                                    <MaterialCommunityIcons name="heart" size={20} color="red" />
                                </View>
                                <View style={{ marginLeft: 10 }}>
                                   <Text style={{ color: 'black', fontWeight: 'bold', marginLeft: 10 }}>{item?.name}</Text>
                                   <Text style={{ color: 'gray', fontSize: 12, marginLeft: 10 }}>{item?.userName ? `@${item?.userName}` : "Text"}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                      onEndReached={fetchUsers}

                    />
              </View>
          </BottomSheetModal>
    );
}

const styles = StyleSheet.create({
    storyImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: 'white',
    },
});
