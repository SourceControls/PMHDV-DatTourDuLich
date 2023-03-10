import React, { useState, useEffect, useContext } from 'react';
import {
    Image,
    SafeAreaView,
    ScrollView,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Alert,
    StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import stylesButton from '../../components/general/actionButton/styles';
import stylesAllTour from '../allTour/style';
import stylesTour from './styles';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import COLOR from '../../res/color';
import DatePicker from 'react-native-neat-date-picker';
import moment from 'moment';
import CheckBox from 'react-native-check-box';
import * as request from '../../services/untils';
import API from '../../res/string';
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { AppContext } from '../../../App';

let nextId = 0;
function TourScreen({ route, navigation }) {
    const { user, setListTour } = useContext(AppContext);
    const type = route.params?.type;

    const tour = route.params?.tour;

    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [name, setName] = useState(tour != undefined ? tour.name : '');
    const [tourIntro, setTourIntro] = useState(tour != undefined ? tour.tourIntro : '');
    const [tourDetail, setTourDetail] = useState(tour != undefined ? tour.tourDetail : '');
    const [pickUpPoint, setPickUpPoint] = useState(tour != undefined ? tour.pickUpPoint : '');
    const [totalDay, setTotalDay] = useState(tour != undefined ? tour.totalDay + '' : '');
    const [minQuantity, setMinQuantity] = useState(tour != undefined ? tour.minQuantity + '' : '');
    const [maxQuantity, setMaxQuantity] = useState(tour != undefined ? tour.maxQuantity + '' : '');
    const [normalPenaltyFee, setNormalPenaltyFee] = useState(tour != undefined ? tour.normalPenaltyFee + '' : '');
    const [strictPenaltyFee, setStrictPenaltyFee] = useState(tour != undefined ? tour.strictPenaltyFee + '' : '');
    const [minDate, setMinDate] = useState(tour != undefined ? tour.minDate + '' : '');
    const [tourGuide, setTourGuide] = useState(tour != undefined ? tour.tourGuide : false);
    const [price, setPrice] = useState(tour != undefined ? tour.price + '' : '');
    const [tourDestination, setTourDestination] = useState(tour != undefined ? tour.tourDestination : '');
    const [featured, setFeatured] = useState(tour != undefined ? tour.featured : false);

    const checkData = () => {
        if (name.trim().length == 0) {
            Alert.alert('Th??ng b??o!', 'Kh??ng ???????c ????? tr???ng t??n tour!', [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ]);
            return false;
        }
        if (tourIntro.trim().length == 0) {
            Alert.alert('Th??ng b??o!', 'Kh??ng ???????c ????? tr???ng gi???i thi???u tour!', [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ]);
            return false;
        }
        if (tourDetail.trim().length == 0) {
            Alert.alert('Th??ng b??o!', 'Kh??ng ???????c ????? tr???ng chi ti???t tour!', [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ]);
            return false;
        }
        if (pickUpPoint.trim().length == 0) {
            Alert.alert('Th??ng b??o!', 'Kh??ng ???????c ????? tr???ng ??i???m ????n!', [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ]);
            return false;
        }
        if (tourDestination.trim().length == 0) {
            Alert.alert('Th??ng b??o!', 'Kh??ng ???????c ????? tr???ng ??i???m ?????n!', [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ]);
            return false;
        }
        if (Number(totalDay) <= 0) {
            Alert.alert('Th??ng b??o!', 'S??? ng??y ph???i l???n h??n 0!', [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ]);
            return false;
        }
        if (Number(minQuantity) <= 0) {
            Alert.alert('Th??ng b??o!', 'S??? ng?????i t???i thi???u ph???i l???n h??n 0!', [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ]);
            return false;
        }
        if (Number(maxQuantity) <= 0) {
            Alert.alert('Th??ng b??o!', 'S??? ng?????i t???i ??a ng??y ph???i l???n h??n 0!', [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ]);
            return false;
        }
        if (Number(maxQuantity) < Number(minQuantity)) {
            Alert.alert('Th??ng b??o!', 'S??? ng?????i t???i ??a  ph???i l???n h??n ho???c b???ng s???  ng?????i t???i thi???u!', [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ]);
            return false;
        }
        if (Number(normalPenaltyFee) <= 0) {
            Alert.alert('Th??ng b??o!', 'M???c h???y 1 ph???i l???n h??n 0!', [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ]);
            return false;
        }
        if (Number(strictPenaltyFee) <= 0) {
            Alert.alert('Th??ng b??o!', 'M???c h???y 2 ph???i l???n h??n 0!', [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ]);
            return false;
        }
        if (Number(strictPenaltyFee) < Number(strictPenaltyFee)) {
            Alert.alert('Th??ng b??o!', 'M???c h???y 2 ph???i l???n h??n 0!', [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ]);
            return false;
        }
        if (Number(minDate) <= 0) {
            Alert.alert('Th??ng b??o!', 'Th???i ??i???m ??p d???ng m???c h???y 2 ph???i l???n h??n 0!', [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ]);
            return false;
        }
        if (Number(price) <= 0) {
            Alert.alert('Th??ng b??o!', 'Gi?? ph???i l???n h??n 0!', [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ]);
            return false;
        }
        return true;
    };

    const openDatePicker = () => {
        setShowDatePicker(true);
    };

    const onCancel = () => {
        // You should close the modal in here
        setShowDatePicker(false);
    };

    const onConfirm = (date) => {
        // You should close the modal in here
        setShowDatePicker(false);
        setDate(date);
        console.log('date: ', date);
    };

    // const [imgPath, setImgPath] = useState(`https://vnpi-hcm.vn/wp-content/uploads/2018/01/no-image-800x600.png`);

    // const [responseImage, setResponseImage] = useState('');

    const [listImage, setListImage] = useState([]);

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
                // console.log('source', response.assets[0].uri);

                // setImgPath(response.assets[0].uri);
                // setListImage(listTemp);
                setListImage(
                    // Replace the state
                    [
                        // with a new array
                        ...listImage, // that contains all the old items
                        { id: nextId++, uri: response.assets[0].uri }, // and one new item at the end
                    ],
                );

                // console.log('listImage: ', listImage);
                // setResponseImage(response);
            }
        });
    };

    const [listAddress, setListAddress] = useState([]);

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

        loadProvinces();
    }, []);

    function addTour() {
        request
            .postPrivate(
                API.addTour,
                {
                    name: name,
                    startDate: moment(date).format('yyyy-MM-DD HH:mm:ss'),
                    totalDay: totalDay,
                    minQuantity: minQuantity,
                    maxQuantity: maxQuantity,
                    normalPenaltyFee: normalPenaltyFee,
                    strictPenaltyFee: strictPenaltyFee,
                    minDate: minDate,
                    tourGuide: tourGuide,
                    tourIntro: tourIntro,
                    tourDetail: tourDetail,
                    pickUpPoint: pickUpPoint,
                    tourDestination: tourDestination,
                    price: price,
                    featured: featured,
                    tourPictures: [
                        'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930',
                    ],
                    // role: 'staff',
                },
                { 'Content-Type': 'application/json', authorization: user.accessToken },
            )
            .then((response) => {
                console.log(response.data);
                updateListTour();

                if (response.data.status == true) {
                    Alert.alert('Th??ng b??o!', 'Th??m th??nh c??ng!', [{ text: 'OK', onPress: () => {} }]);
                } else {
                    Alert.alert('Th??m th???t b???i!', response.data.message, [{ text: 'OK', onPress: () => {} }]);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function updateTour() {
        request
            .postPrivate(
                '/tour/' + tour.idTour + '/update',
                {
                    idTour: tour.idTour,
                    name: name,
                    startDate: moment(date).format('yyyy-MM-DD HH:mm:ss'),
                    totalDay: totalDay,
                    minQuantity: minQuantity,
                    maxQuantity: maxQuantity,
                    normalPenaltyFee: normalPenaltyFee,
                    strictPenaltyFee: strictPenaltyFee,
                    minDate: minDate,
                    tourGuide: tourGuide,
                    tourIntro: tourIntro,
                    tourDetail: tourDetail,
                    pickUpPoint: pickUpPoint,
                    tourDestination: tourDestination,
                    price: price,
                    featured: featured,
                    tourPictures: [
                        'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930',
                    ],
                    // role: 'staff',
                },
                { 'Content-Type': 'application/json', authorization: user.accessToken },
                'PUT',
            )
            .then((response) => {
                console.log(response.data);
                updateListTour();

                if (response.data.status == true) {
                    Alert.alert('Th??ng b??o!', 'C???p nh???t th??nh c??ng!', [{ text: 'OK', onPress: () => {} }]);
                } else {
                    Alert.alert('C???p nh???t th???t b???i!', response.data.message, [{ text: 'OK', onPress: () => {} }]);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function updateListTour() {
        request
            .get(API.listTour, {
                headers: { 'Content-Type': 'application/json', authorization: user.accessToken },
            })
            .then((response) => {
                console.log(response.data);

                if (response.status == true) {
                    setListTour(response.data);
                } else {
                    Alert.alert('Th??ng b??o!', response.message + '', [
                        { text: 'OK', onPress: () => console.log('OK Pressed') },
                    ]);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <ScrollView>
            <SafeAreaView style={{ justifyContent: 'center', alignItems: 'center' }}>
                <DatePicker isVisible={showDatePicker} mode={'single'} onCancel={onCancel} onConfirm={onConfirm} />
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        marginLeft: -150,
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
                    <Text style={stylesAllTour.title}>{type == 'edit' ? 'C???p nh???t tour' : 'Th??m tour'}</Text>
                </View>

                <View style={{ width: 320, marginTop: 20 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={stylesTour.title}>T??n tour</Text>
                        <Text style={{}}>#{tour?.idTour}</Text>
                    </View>
                    <TextInput
                        placeholder="Nh???p t??n tour v??o ????y"
                        style={stylesTour.input}
                        value={name}
                        onChangeText={(newText) => setName(newText)}
                    />
                </View>

                <View style={{ width: 320, marginTop: 20 }}>
                    <Text style={stylesTour.title}>Gi???i thi???u</Text>
                    <TextInput
                        placeholder="Nh???p n???i dung gi???i thi???u v??o ????y"
                        style={stylesTour.input}
                        value={tourIntro}
                        onChangeText={(newText) => setTourIntro(newText)}
                    />
                </View>
                <View style={{ width: 320, marginTop: 20 }}>
                    <Text style={stylesTour.title}>M?? t??? l???ch tr??nh</Text>
                    <TextInput
                        multiline
                        numberOfLines={20}
                        placeholder="Nh???p m?? t??? tour v??o ????y"
                        style={[stylesTour.input, { height: 200 }]}
                        value={tourDetail}
                        onChangeText={(newText) => setTourDetail(newText)}
                    />
                </View>
                <View style={{ width: 320, marginTop: 20 }}>
                    <Text style={stylesTour.title}>?????a ??i???m ?????n</Text>
                    {/* <SelectList setSelected={(val) => setSelected(val)} data={data} save="value" /> */}
                    <SelectDropdown
                        data={listAddress}
                        // defaultValueByIndex={1}
                        // defaultValue={address}
                        onSelect={(selectedItem, index) => {
                            setTourDestination(selectedItem);
                            console.log(selectedItem, index);
                        }}
                        defaultButtonText={'Ch???n t???nh/th??nh ph???'}
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
                                <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#444'} size={14} />
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
                    <TextInput
                        placeholder="Nh???p qu???n huy???n v??o ????y"
                        style={[stylesTour.input, { marginTop: 5 }]}
                        value={tourDestination}
                        onChangeText={(newText) => setTourDestination(newText)}
                    />
                </View>
                <View style={{ width: 320, marginTop: 20 }}>
                    <Text style={stylesTour.title}>?????a ??i???m ????n</Text>

                    {/* <SelectList setSelected={(val) => setSelected(val)} data={data} save="value" /> */}
                    <SelectDropdown
                        data={listAddress}
                        // defaultValueByIndex={1}
                        // defaultValue={address}
                        onSelect={(selectedItem, index) => {
                            setPickUpPoint(selectedItem);
                            console.log(selectedItem, index);
                        }}
                        defaultButtonText={'Ch???n t???nh/th??nh ph???'}
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
                                <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#444'} size={14} />
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

                    <TextInput
                        placeholder="Nh???p qu???n huy???n v??o ????y"
                        style={[stylesTour.input, { marginTop: 5 }]}
                        value={pickUpPoint}
                        onChangeText={(newText) => setPickUpPoint(newText)}
                    />
                </View>
                <View style={{ width: 320, marginTop: 20 }}>
                    <Text style={stylesTour.title}>???nh minh h???a</Text>

                    <TouchableOpacity
                        onPress={() => {
                            chooseImage();
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: COLOR.primary,
                                width: 100,
                                borderRadius: 5,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderWidth: 1,
                            }}
                        >
                            <Text style={{ color: '#FFFFFF' }}>Th??m ???nh </Text>
                        </View>
                    </TouchableOpacity>

                    <View
                        style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            flex: 1,
                        }}
                    >
                        {listImage.map((item) => (
                            // console.log('item: ', item),
                            <View
                                key={item.id}
                                style={{
                                    flexDirection: 'row',
                                    marginTop: 40,
                                    marginRight: 8,
                                }}
                            >
                                <Image
                                    source={{ uri: `${item.uri}` }}
                                    style={{ height: 85, width: 85, borderRadius: 6 }}
                                />
                                <TouchableOpacity
                                    hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                                    onPress={() => {
                                        setListImage(listImage.filter((a) => a.id !== item.id));
                                    }}
                                >
                                    <FontAwesome5
                                        name="times"
                                        size={15}
                                        color="#021A5A"
                                        style={{ marginLeft: 3, marginTop: -5 }}
                                    />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </View>
                <View style={{ width: 320, marginTop: 20, flexDirection: 'row' }}>
                    <View>
                        <Text style={stylesTour.title}>Ng??y kh???i h??nh</Text>
                        <TouchableOpacity onPress={openDatePicker}>
                            <Text style={stylesTour.input}>{moment(date.date).format('DD/MM/YYYY')}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginLeft: 50 }}>
                        <Text style={stylesTour.title}>S??? ng??y </Text>
                        <TextInput
                            keyboardType="numeric"
                            placeholder="Nh???p s??? ng??y"
                            style={stylesTour.input}
                            value={totalDay}
                            onChangeText={(newText) => setTotalDay(newText)}
                        />
                    </View>
                </View>
                <View style={{ width: 320, marginTop: 20, flexDirection: 'row' }}>
                    <View>
                        <Text style={stylesTour.title}>S??? ng?????i t???i thi???u</Text>
                        <TextInput
                            keyboardType="numeric"
                            placeholder="Nh???p s??? ng?????i t???i thi???u"
                            style={stylesTour.input}
                            value={minQuantity}
                            onChangeText={(newText) => setMinQuantity(newText)}
                        />
                    </View>
                    <View style={{ marginLeft: 30 }}>
                        <Text style={stylesTour.title}>S??? ng?????i t???i ??a </Text>
                        <TextInput
                            keyboardType="numeric"
                            placeholder="Nh???p s??? ng?????i t???i ??a"
                            style={stylesTour.input}
                            value={maxQuantity}
                            onChangeText={(newText) => setMaxQuantity(newText)}
                        />
                    </View>
                </View>
                <View
                    style={{
                        width: 320,
                        marginTop: 20,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <Text style={stylesTour.title}>M???c h???y 1 (%)</Text>
                    <TextInput
                        keyboardType="numeric"
                        placeholder="Nh???p m???c h???y 1"
                        style={[stylesTour.input, { marginLeft: 80 }]}
                        value={normalPenaltyFee}
                        onChangeText={(newText) => setNormalPenaltyFee(newText)}
                    />
                </View>
                <View
                    style={{
                        width: 320,
                        marginTop: 20,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <Text style={stylesTour.title}>M???c h???y 2 (%)</Text>
                    <TextInput
                        keyboardType="numeric"
                        placeholder="Nh???p m???c h???y 2"
                        style={[stylesTour.input, { marginLeft: 80 }]}
                        value={strictPenaltyFee}
                        onChangeText={(newText) => setStrictPenaltyFee(newText)}
                    />
                </View>
                <View
                    style={{
                        width: 320,
                        marginTop: 20,
                    }}
                >
                    <Text style={stylesTour.title}>Th???i ??i???m ??p d???ng m???c h???y 2</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TextInput
                            keyboardType="numeric"
                            placeholder="Nh???p s??? ng??y"
                            style={[stylesTour.input, { marginLeft: 80 }]}
                            value={minDate}
                            onChangeText={(newText) => setMinDate(newText)}
                        />
                        <Text style={stylesTour.txt}>ng??y tr?????c kh???i h??nh</Text>
                    </View>
                </View>
                <View
                    style={{
                        width: 320,
                        marginTop: 20,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <Text style={stylesTour.title}>H?????ng d???n vi??n du l???ch</Text>

                    <CheckBox
                        style={{ flex: 1, padding: 10 }}
                        onClick={() => {
                            setTourGuide(!tourGuide);
                        }}
                        isChecked={tourGuide}
                    />
                </View>
                <View
                    style={{
                        width: 320,
                        marginTop: 20,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <Text style={stylesTour.title}>????nh d???u tour n???i b???t</Text>

                    <CheckBox
                        style={{ flex: 1, padding: 10 }}
                        onClick={() => {
                            setFeatured(!featured);
                        }}
                        isChecked={featured}
                    />
                </View>
                <View style={{ width: 320, marginTop: 20 }}>
                    <Text style={stylesTour.title}>Gi??</Text>
                    <TextInput
                        keyboardType="numeric"
                        placeholder="Nh???p gi?? tour v??o ????y"
                        style={stylesTour.input}
                        value={price}
                        onChangeText={(newText) => setPrice(newText)}
                    />
                </View>
                {type == 'edit' ? (
                    <TouchableOpacity>
                        <View
                            style={[
                                stylesTour.btn,
                                {
                                    backgroundColor: '#FFFFFF',
                                    borderWidth: 1,
                                    borderColor: COLOR.primary,
                                },
                            ]}
                        >
                            <Text style={[stylesTour.txt_btn, { color: COLOR.primary }]}>X??a tour</Text>
                        </View>
                    </TouchableOpacity>
                ) : (
                    ''
                )}

                <TouchableOpacity
                    onPress={() => {
                        if (type == 'add') {
                            addTour();
                        } else if (type == 'edit') {
                            updateTour();
                        }
                    }}
                >
                    <View style={stylesTour.btn}>
                        <Text style={stylesTour.txt_btn}>{type == 'edit' ? 'C???p nh???t' : 'Th??m tour'}</Text>
                    </View>
                </TouchableOpacity>
            </SafeAreaView>
        </ScrollView>
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

export default TourScreen;
