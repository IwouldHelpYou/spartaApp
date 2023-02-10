import React,{useState,useEffect} from 'react';
import { StyleSheet, Text, View, Image, ScrollView,TouchableOpacity,Alert,Share,Platform } from 'react-native';
import * as Linking from 'expo-linking';
import {firebase_db} from "../firebaseConfig"
import * as Application from 'expo-application'; //provides useful information about the native application, itself, such as the ID, app name, and build version.
const isIOS = Platform.OS === 'ios'; // 삼항연산자임 iOS이면 true 아니면 false. 안드로이드 iOS 각각 기기(?) 고유번호 가져오는 방식이 다르니까 분기처리를 해야댐!!!

export default function DetailPage({navigation,route}) {

    const [tip, setTip] = useState({
        "idx":9,
        "category":"재테크",
        "title":"렌탈 서비스 금액 비교해보기",
        "image": "https://storage.googleapis.com/sparta-image.appspot.com/lecture/money1.png",
        "desc":"요즘은 정수기, 공기 청정기, 자동차나 장난감 등 다양한 대여서비스가 활발합니다. 사는 것보다 경제적이라고 생각해 렌탈 서비스를 이용하는 분들이 늘어나고 있는데요. 다만, 이런 렌탈 서비스 이용이 하나둘 늘어나다 보면 그 금액은 겉잡을 수 없이 불어나게 됩니다. 특히, 렌탈 서비스는 빌려주는 물건의 관리비용까지 포함된 것이기에 생각만큼 저렴하지 않습니다. 직접 관리하며 사용할 수 있는 물건이 있는지 살펴보고, 렌탈 서비스 항목에서 제외해보세요. 렌탈 비용과 구매 비용, 관리 비용을 여러모로 비교해보고 고민해보는 것이 좋습니다. ",
        "date":"2020.09.09"
    })
    // 여기다가 찜한 거를 저장할 예정

    console.log('Detail Page 조짐니다')

    useEffect(()=>{
        //console.log(route)
        navigation.setOptions({

            title:route.params.title,
            headerStyle: {
                backgroundColor: '#000',
                shadowColor: "#000",
            },
            headerTintColor: "#fff",
        })
        // 작은 카드들을 클릭하면 이 페이지로 넘어옴. 
        // 원래 content 전체 다 받아오던거를, 그냥 index 만 받아서 직접 서버에 호출하기로함.
        // 넘어온 데이터(content 의 index) 는 route.params에 들어 있음
        const { idx } = route.params;
        firebase_db.ref('/tip/'+idx).once('value').then((snapshot) => {  //once Read 함수중에 하나임

        // 메인페이지에서는 일단 받아서 화면전체에 구구절절 설명하는 카드 다 띄워야 되니깐 이렇게불러왔었음
        // firebase_db.ref('/tip').once('value').then((snapshot) => { }
        // 여기선 호출할 때 해당 index 번호만 넘기고있음!
        
            let tip = snapshot.val(); // 넘어온 인덱스에 맞는 내용을 tip 변수 에 저장하고 있음.
            console.log(tip)
            setTip(tip) // 파베에서 받아왔으니까 이거를 setTip 에 넣어주면서 refresh 
        

        });
    },[])

    const like = async () => {


        let userUniqueId;
        if(isIOS){
        let iosId = await Application.getIosIdForVendorAsync();
            userUniqueId = iosId
        }else{
            userUniqueId = await Application.androidId
        }
        //누가 찜했는지 고유 ID 데이터를 따로 만드는 과정이다

	    firebase_db.ref('/like/'+userUniqueId+'/'+ tip.idx).set(tip,function(error){ //once 가 read 함수였다면 set은 Create 함수임. 데이터 덮어쓰는. 자기 id 넣고 파베에 tip을 저장하고있음 
            console.log(error)//error 는 모징?
            Alert.alert("찜 완료!")
         });
        // like 방 안에
        // 특정 사용자 방안에
        // 특정 찜 데이터 아이디 방안에(index 말하는듯)
        // 특정 찜 데이터 몽땅 저장!
        // 찜 데이터 방 > 사용자 방 > 어떤 찜인지 아이디
    }

    const share = () => {
        Share.share({
            message:`${tip.title} \n\n ${tip.desc} \n\n ${tip.image}`,
        });
    }

    const link = () => {
        Linking.openURL("https://spartacodingclub.kr")
    }
    return ( 
        // ScrollView에서의 flex 숫자는 의미가 없습니다. 정확히 보여지는 화면을 몇등분 하지 않고
        // 화면에 넣은 컨텐츠를 모두 보여주려 스크롤 기능이 존재하기 때문입니다. 
        // 여기선 내부의 컨텐츠들 영역을 결정짓기 위해서 height 값과 margin,padding 값을 적절히 잘 이용해야 합니다. 
        <ScrollView style={styles.container}>
            <Image style={styles.image} source={{uri:tip.image}}/>
            <View style={styles.textContainer}>
                <Text style={styles.title}>{tip.title}</Text>
                <Text style={styles.desc}>{tip.desc}</Text>
                <View style={styles.buttonGroup}>
                    <TouchableOpacity style={styles.button} onPress={()=>like()}><Text style={styles.buttonText}>팁 찜하기</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={()=>share()}><Text style={styles.buttonText}>팁 공유하기</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={()=>link()}><Text style={styles.buttonText}>외부 링크</Text></TouchableOpacity>
                </View>
                
            </View>
            
        </ScrollView>
    
    )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:"#000"
    },
    image:{
        height:400,
        margin:10,
        marginTop:40,
        borderRadius:20
    },
    textContainer:{
        padding:20,
        justifyContent:'center',
        alignItems:'center'
    },
    title: {
        fontSize:20,
        fontWeight:'700',
        color:"#eee"
    },
    desc:{
        marginTop:10,
        color:"#eee"
    },
    buttonGroup: {
        flexDirection:"row",
    },
    button:{
        width:90,
        marginTop:20,
        marginRight:10,
        marginLeft:10,
        padding:10,
        borderWidth:1,
        borderColor:'deeppink',
        borderRadius:7
    },
    buttonText:{
        color:'#fff',
        textAlign:'center'
    }
})