import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, Image, View, Text, TouchableOpacity, TextInput, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import stylesButton from '../../components/general/actionButton/styles';
import stylesAllTour from '../allTour/style';
import stylesManage from './styles';
import { ScrollView } from 'react-native-gesture-handler';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import stylesTour from '../tourScreen/styles';
import { AppContext } from '../../../App';
import API from '../../res/string';
import * as request from '../../services/untils';
import SelectDropdown from 'react-native-select-dropdown';
import { uploadImage, deleteImage } from '../../services/untils/uploadImage';

const FormData = require('form-data');

function ManageInforPersonScreen({ route, navigation }) {
    const { user, setUser } = useContext(AppContext);
    const [listAddress, setListAddress] = useState([]);
    const [name, setName] = useState(user != undefined ? user.name : '');
    const [email, setEmail] = useState(user != undefined ? user.email : '1');
    const [address, setAddress] = useState(user != undefined ? user.address : '');
    const [phone, setPhone] = useState(user != undefined ? user.phoneNumber : '');
    const [imgPath, setImgPath] = useState(
        user != undefined
            ? user.imageUrl
            : `https://img.freepik.com/free-photo/smiley-little-boy-isolated-pink_23-2148984798.jpg`,
    );

    // const [selected, setSelected] = useState('');

    const [responseImage, setResponseImage] = useState('');
    const chooseImage = () => {
        let options = {
            title: 'Select Image',
            customButtons: [{ name: 'customOptionKey', title: 'Choose Photo from Custom Option' }],
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        launchImageLibrary(options, (response) => {
            // console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
                Alert.alert(response.customButton);
            } else {
                // console.log('source', response);
                const formData = new FormData();
                formData.append('image', {
                    uri: response.uri,
                    type: response.type,
                    name: response.fileName || 'image.jpg',
                });

                setImgPath(response.assets[0].uri);
                setResponseImage(response);
            }
        });
    };

    const checkValue = () => {
        if (name.trim().length == 0) {
            Alert.alert('Th??ng b??o!', 'Kh??ng ???????c ????? tr???ng h??? t??n!', [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ]);
            return false;
        }
        if (email.trim().length == 0) {
            Alert.alert('Th??ng b??o!', 'Kh??ng ???????c ????? tr???ng email!', [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ]);
            return false;
        }
        if (user.role == 'customer') {
            if (address.trim().length == 0) {
                Alert.alert('Th??ng b??o!', 'Kh??ng ???????c ????? tr???ng ?????a ch???!', [
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ]);
                return false;
            }
            if (phone.trim().length == 0) {
                Alert.alert('Th??ng b??o!', 'Kh??ng ???????c ????? tr???ng s??? ??i???n tho???i!', [
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ]);
                return false;
            }
        }
        return true;
    };
    const update = async () => {
        if (checkValue()) {
            const url = await uploadImage(imgPath);
            console.log('url: ', url);
            await deleteImage('nM0hvJF');

            request
                .postPrivate(
                    API.updateInfoPersonal,
                    { name, address, phoneNumber: phone, imageUrl: url },
                    { 'Content-Type': 'application/json', authorization: user.accessToken },
                )
                .then((response) => {
                    console.log(response.data);
                    console.log('response.data.data: ' + response.data.data[0]);
                    if (response.data.status == true) {
                        const newUser = {
                            id: user.id,
                            name: response.data.data[0].name,
                            imageUrl: response.data.data[0].imageUrl,
                            role: user.role,
                            phoneNumber: response.data.data[0].phoneNumber,
                            email: response.data.data[0].email,
                            address: response.data.data[0].address,
                            accessToken: user.accessToken,
                        };
                        console.log('user: ', newUser);

                        //update user in side client
                        setUser(newUser);

                        //delete old user
                        AsyncStorage.removeItem('user')
                            .then(() => {
                                console.log('user removed from AsyncStorage');
                            })
                            .catch((error) => {
                                console.error(error);
                            });
                        AsyncStorage.setItem('user', JSON.stringify(newUser))
                            .then(() => console.log('Object stored successfully'))
                            .catch((error) => console.log('Error storing object: ', error));
                        Alert.alert('Th??ng b??o!', 'C???p nh???t th??nh c??ng!', [
                            { text: 'OK', onPress: () => console.log('OK Pressed') },
                        ]);
                    } else {
                        Alert.alert('C???p nh???t th???t b???i!', response.data.message + '', [
                            { text: 'OK', onPress: () => console.log('OK Pressed') },
                        ]);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    const updateStaff = () => {
        if (checkValue()) {
            request
                .postPrivate(
                    '/staff/' + user.id + '/update',
                    { name, imageUrl: user.imageUrl },
                    { 'Content-Type': 'application/json', authorization: user.accessToken },
                    'PUT',
                )
                .then((response) => {
                    console.log(response.data);

                    if (response.data.status == true) {
                        const newUser = {
                            id: user.id,
                            name: name,
                            imageUrl: user.imageUrl,
                            role: user.role,
                            email: user.email,
                            accessToken: user.accessToken,
                        };
                        console.log('user: ', newUser);

                        //update user in side client
                        setUser(newUser);

                        //delete old user
                        AsyncStorage.removeItem('user')
                            .then(() => {
                                console.log('user removed from AsyncStorage');
                            })
                            .catch((error) => {
                                console.error(error);
                            });
                        AsyncStorage.setItem('user', JSON.stringify(newUser))
                            .then(() => console.log('Object stored successfully'))
                            .catch((error) => console.log('Error storing object: ', error));
                        Alert.alert('Th??ng b??o!', response.data.message, [
                            { text: 'OK', onPress: () => console.log('OK Pressed') },
                        ]);
                    } else {
                        Alert.alert('C???p nh???t th???t b???i!', response.data.message + '', [
                            { text: 'OK', onPress: () => console.log('OK Pressed') },
                        ]);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    const addInfo = () => {
        if (checkValue()) {
            navigation.navigate('Register', { name: name, address: address, phone: phone });
        }
    };

    useEffect(() => {
        async function loadProvinces() {
            await request
                .get(API.listAddress)
                .then((response) => {
                    console.log(response);

                    if (response.status == true) {
                        setListAddress(response.data);
                    } else {
                        Alert.alert('Th???t b???i!', response.message + '', [
                            { text: 'OK', onPress: () => console.log('OK Pressed') },
                        ]);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        if (user.role != 'staff') {
            loadProvinces();
        }
    }, []);

    return (
        <SafeAreaView style={{ justifyContent: 'center', alignItems: 'center' }}>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    marginLeft: -90,
                }}
            >
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack();
                    }}
                >
                    <View style={stylesButton.btn_back}>
                        <Icon name="chevron-back" size={25} color="#021A5A" />
                    </View>
                </TouchableOpacity>
                <Text style={stylesAllTour.title}>
                    {user != undefined ? 'S???a th??ng tin c?? nh??n' : 'Nh???p th??ng tin c?? nh??n'}
                </Text>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                <Image
                    source={{
                        uri: `${imgPath}`,
                    }}
                    style={stylesManage.img}
                />

                <Text style={stylesManage.txt_name}>{name}</Text>
                <TouchableOpacity
                    onPress={() => {
                        chooseImage();
                    }}
                >
                    <Text style={[stylesManage.txt_name, { fontSize: 16, fontWeight: 'normal' }]}>
                        {user != undefined ? '?????i ???nh' : 'Ch???n ???nh'}
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={{ marginTop: 20 }}>
                <Text style={stylesManage.title}>H??? t??n</Text>
                <View
                    style={[
                        stylesManage.input,
                        {
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: 5,
                        },
                    ]}
                >
                    <TextInput
                        placeholder="Nh???p h??? t??n c???a b???n"
                        onChangeText={(newText) => setName(newText)}
                        defaultValue={name}
                    />
                    <AntDesign name="check" size={20} color="#0D6EFD" />
                </View>
            </View>
            {user != undefined ? (
                <View style={{ marginTop: 20 }}>
                    <Text style={stylesManage.title}>Email</Text>
                    <View
                        style={[
                            stylesManage.input,
                            {
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: 5,
                            },
                        ]}
                    >
                        <TextInput
                            editable={false}
                            placeholder="Nh???p email c???a b???n"
                            onChangeText={(newText) => setEmail(newText)}
                            defaultValue={email}
                        />
                        <AntDesign name="check" size={20} color="#0D6EFD" />
                    </View>
                </View>
            ) : (
                ''
            )}
            {user.role == 'customer' ? (
                <View style={{ marginTop: 20 }}>
                    <Text style={stylesManage.title}>?????a ch???</Text>
                    <View
                        style={[
                            stylesManage.input,
                            {
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: 5,
                            },
                        ]}
                    >
                        {/* <TextInput
                            placeholder="Nh???p ?????a ch??? c???a b???n"
                            onChangeText={(newText) => setAddress(newText)}
                            defaultValue={address}
                        />
                        <AntDesign name="check" size={20} color="#0D6EFD" /> */}
                        <SelectDropdown
                            data={listAddress}
                            // defaultValueByIndex={1}
                            defaultValue={address}
                            onSelect={(selectedItem, index) => {
                                setAddress(selectedItem);
                                console.log(selectedItem, index);
                            }}
                            defaultButtonText={address}
                            buttonTextAfterSelection={(selectedItem, index) => {
                                return selectedItem;
                            }}
                            rowTextForSelection={(item, index) => {
                                return item;
                            }}
                            buttonStyle={styles.dropdown1BtnStyle}
                            buttonTextStyle={styles.dropdown1BtnTxtStyle}
                            renderDropdownIcon={(isOpened) => {
                                return (
                                    <FontAwesome
                                        name={isOpened ? 'chevron-up' : 'chevron-down'}
                                        color={'#444'}
                                        size={14}
                                    />
                                );
                            }}
                            dropdownIconPosition={'right'}
                            dropdownStyle={styles.dropdown1DropdownStyle}
                            rowStyle={styles.dropdown1RowStyle}
                            rowTextStyle={styles.dropdown1RowTxtStyle}
                            selectedRowStyle={styles.dropdown1SelectedRowStyle}
                            search
                            searchInputStyle={styles.dropdown1searchInputStyleStyle}
                            searchPlaceHolder={'T??m ki???m ??? ????y'}
                            searchPlaceHolderColor={'darkgrey'}
                            renderSearchInputLeftIcon={() => {
                                return <FontAwesome name={'search'} color={'#444'} size={14} />;
                            }}
                        />
                    </View>
                </View>
            ) : (
                ''
            )}
            {user.role == 'customer' ? (
                <View style={{ marginTop: 20 }}>
                    <Text style={stylesManage.title}>S??? ??i???n tho???i</Text>
                    <View
                        style={[
                            stylesManage.input,
                            {
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: 5,
                            },
                        ]}
                    >
                        <TextInput
                            placeholder="Nh???p s??? ??i???n tho???i c???a b???n"
                            onChangeText={(newText) => setPhone(newText)}
                            value={phone}
                            keyboardType={'numeric'}
                            maxLength={10}
                        />
                        <AntDesign name="check" size={20} color="#0D6EFD" />
                    </View>
                </View>
            ) : (
                ''
            )}
            <TouchableOpacity
                onPress={() => {
                    if (user != undefined) {
                        if (user.role == 'customer') update();
                        else updateStaff();
                    } else addInfo();
                }}
            >
                <View style={stylesTour.btn}>
                    <Text style={stylesTour.txt_btn}>{user != undefined ? 'L??u l???i' : 'Ti???p t???c'}</Text>
                </View>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    dropdown1BtnStyle: {
        width: 330,
        height: 50,
        backgroundColor: '#FFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#444',
    },
    dropdown1BtnTxtStyle: { color: '#444', textAlign: 'left', fontSize: 14 },
    dropdown1DropdownStyle: { backgroundColor: '#EFEFEF' },
    dropdown1RowStyle: { backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5' },
    dropdown1RowTxtStyle: { color: '#444', textAlign: 'left', fontSize: 14 },
    dropdown1SelectedRowStyle: { backgroundColor: 'rgba(0,0,0,0.1)' },
    dropdown1searchInputStyleStyle: {
        backgroundColor: '#EFEFEF',
        borderRadius: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#444',
    },
});

export default ManageInforPersonScreen;
