import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image, ImageBackground, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import stylesCard from '../../components/home/card/style';
import stylesButton from '../../components/general/actionButton/styles';
import COLOR from '../../res/color';
import stylesDetailTour from './styles';
import ModalOrder from '../../components/general/form/ModalOrder';
import { FlatList } from 'react-native-gesture-handler';
import { formatDate, formatMoney } from '../../res/untils';

function DetailTourScreen({ route, navigation }) {
    const tour = route.params.tour;
    const [modalVisible, setModalVisible] = useState(false);
    const listImage = tour.tourpictures;
    const [selectImage, setSelectImage] = useState(listImage[0]);
    return (
        <ScrollView>
            <SafeAreaView style={{ justifyContent: 'center', alignItems: 'center' }}>
                <ModalOrder modalVisible={modalVisible} setModalVisible={setModalVisible} DATA={tour} />
                <ImageBackground
                    source={{ uri: `${selectImage.imageUrl}` }}
                    style={{
                        borderRadius: 20,
                        height: 320,
                        width: 350,
                        margin: 10,
                        overflow: 'hidden',
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

                    <View style={{ flexDirection: 'row', marginTop: 150, justifyContent: 'space-between' }}>
                        <View>
                            <Text style={[stylesCard.txt1, { fontSize: 24 }]}>{tour.name}</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <MaterialIcons
                                    name="place"
                                    size={18}
                                    color="#FFFF"
                                    style={{ marginLeft: 10, marginTop: 3 }}
                                />
                                <Text style={[stylesCard.txt2, { fontSize: 18 }]}>{tour.tourDestination}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', marginRight: 10, marginTop: 10 }}>
                            <Icon name="star" size={30} color="#FFFFFF" style={{ marginTop: 2 }} />
                            <Text style={[stylesCard.txt2, { fontSize: 18, marginTop: 5 }]}>5.0</Text>
                        </View>
                    </View>
                </ImageBackground>

                <FlatList
                    style={{ backgroundColor: '#C4C4C4', borderRadius: 10 }}
                    horizontal
                    data={listImage}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => {
                                setSelectImage(item);
                            }}
                        >
                            <Image
                                source={{ uri: `${item.imageUrl}` }}
                                style={{ height: 50, width: 50, margin: 5, borderRadius: 6 }}
                            />
                        </TouchableOpacity>
                    )}
                    // keyExtractor={(item) => item.id}
                />
                <View
                    style={{
                        width: 320,
                    }}
                >
                    <Text style={stylesDetailTour.title}>T??m t???t chuy???n ??i</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialIcons name="date-range" size={30} color={COLOR.primary} style={{ marginTop: 2 }} />
                            <View style={{ marginLeft: 5 }}>
                                <Text style={stylesDetailTour.title2}>Ng??y kh???i h??nh</Text>
                                <Text style={stylesDetailTour.txt}>{formatDate(tour.startDate)}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Fontisto name="clock" size={25} color={COLOR.primary} />
                            <View style={{ marginLeft: 5 }}>
                                <Text style={stylesDetailTour.title2}>Th???i gian</Text>
                                <Text style={stylesDetailTour.txt}>{tour.totalDay} ng??y</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialIcons name="place" size={30} color={COLOR.primary} style={{ marginTop: 2 }} />
                            <View style={{ marginLeft: 5 }}>
                                <Text style={stylesDetailTour.title2}>?????a ??i???m ????n</Text>
                                <Text style={stylesDetailTour.txt}>{tour.pickUpPoint}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Fontisto name="ticket" size={25} color={COLOR.primary} />
                            <View style={{ marginLeft: 5 }}>
                                <Text style={stylesDetailTour.title2}>S??? v?? c??n l???i</Text>
                                <Text style={stylesDetailTour.txt}>{tour.quantity}</Text>
                            </View>
                        </View>
                    </View>
                    <View>
                        <Text style={[stylesDetailTour.title, { marginTop: 30 }]}>M?? t???</Text>
                        <Text>{tour.descript}</Text>
                    </View>

                    <View
                        style={{
                            flexDirection: 'row',
                            marginTop: 30,
                            justifyContent: 'space-between',
                        }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={[stylesDetailTour.txt, { fontSize: 24 }]}>{formatMoney(tour.price)}</Text>
                            <Text style={{ marginTop: 10 }}>/ chuy???n</Text>
                        </View>
                        <TouchableOpacity onPress={() => setModalVisible(true)}>
                            <View style={stylesDetailTour.btn}>
                                <Text style={stylesDetailTour.txt_btn}>?????t ngay</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </ScrollView>
    );
}

export default DetailTourScreen;
