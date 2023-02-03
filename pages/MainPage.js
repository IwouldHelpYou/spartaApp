import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView} from 'react-native';
//태그 사용을 위한 것들 

import React,{useState,useEffect} from 'react';
//브라우저는 HTML,CSS,JS만 읽을 수 있고 리액트는 읽지 못함.
//따라서 React로 작성한 코드를 브라우저가 읽을 수 있도록 변환해야함.
//즉 React 에서 JSX 문법을 사용하는데 이 JSX 문법을 JS로 변환시켜 브라우저가 읽을 수 있도록 하기위해 쓰는것. 

//JSX transformer 를 사용해 JSX로 작성된 React 메소드를 변환시키게 되는데 
//이 때 객체인 React를 가져오기 위해서 import React 를 작성해
//React를 불러오게 되면 객체 React를 통해 React 메소드를 작성할 수 있게 된다

//만약 상위 컴포넌트에 작성되었따면 하위에서는 생략해도 작동이 된다.
//생략되어도 추후 '웹팩'을 통해 최적화된 코드로 작성된다
//게다가 React 버전 17 (2020.10.22)부터는 React 내부적으로 JSX transformer가 JSX를 React 요소로 변환하므로 작성하지 않아도 된다.

const main = 'https://storage.googleapis.com/sparta-image.appspot.com/lecture/main.png'
// 제일 위에 쓰기 위한 이미지

import data from '../data.json';
// 데이터

import Card from '../components/Card';
import Loading from '../components/Loading';
import { StatusBar } from 'expo-status-bar';
import * as Location from "expo-location";
import axios from "axios"
import {firebase_db} from "../firebaseConfig"
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import AdCard from '../components/AdCard';

const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-5579008343368676/92552776';


export default function MainPage({navigation,route}) {

  //[state,setState]=useState 사용법
	//state는 이 컴포넌트에서 관리될 상태 데이터를 담고 있는 변수
  //setState는 state를 '변경'시킬때 사용해야하는 함수
  //둘 다 useState가 선물해줌 (react 에서 import 해옴)
  //useState()안에 전달되는 값은 state 초기값

  const [state,setState] = useState([])
  //내부에서 data.json으로 부터 가져온 데이터를 state 상태에 담고 있음

  const [cateState,setCateState] = useState([])
  //날씨 데이터 상태관리 상태 생성!
  
  const [weather, setWeather] = useState({
    temp : 0,
    condition : ''
  })

  const [ready,setReady] = useState(true)
  



  //UseEffect 사용법 

  //= React Native 화면이 일단 사용자에게 보여지고 동시에 데이터를 준비시키고 다시 데이터를 그려준다
  //(React Native 는 프레임워크)
  //(React Native 는 JS 와 JSX 문법을 쓴다)
  //(React Native는 JS언어로 구동 -> 나중에 JS로 컴파일 되고 향후 안드로이드 iOS가 JS Engine (인터프리터)로 실행하게됨)
  //(return 문 안은 JSX 인데 나중에 JS로 변환된다고 했고)

  //React Native 화면이 보여진다 = 하단의 return 문까지 실행된다 = 화면에 컴포넌트가 그려진다
  //그 다음 실행되는게 useEffect 함수

  useEffect(()=>{
    navigation.setOptions({
      title:'나만의 꿀꿀이팁'
    })  
		//뒤의 1000 숫자는 1초를 뜻함
    //1초 뒤에 실행되는 코드들이 담겨 있는 함수
    setTimeout(()=>{
        firebase_db.ref('/tip').once('value').then((snapshot) => {
          console.log("파이어베이스에서 데이터 가져왔습니다!!")
          let tip = snapshot.val();
          
          setState(tip)
          setCateState(tip)
          getLocation()
          setReady(false)
        });
        // getLocation()
        // setState(data.tip)
        // setCateState(data.tip)
        // setReady(false)
    },1000)
 
    
  },[])

  const getLocation = async () => {
    //수많은 로직중에 에러가 발생하면
    //해당 에러를 포착하여 로직을 멈추고,에러를 해결하기 위한 catch 영역 로직이 실행
    try {
      //자바스크립트 함수의 실행순서를 고정하기 위해 쓰는 async,await
      await Location.requestForegroundPermissionsAsync();
      const locationData= await Location.getCurrentPositionAsync();
      // console.log(locationData)
      // console.log(locationData['coords']['latitude'])
      // console.log(locationData['coords']['longitude'])
      const latitude = locationData['coords']['latitude']
      const longitude = locationData['coords']['longitude']
      const API_KEY = "cfc258c75e1da2149c33daffd07a911d";
      const result = await axios.get(
        `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
      );

      const temp = result.data.main.temp; 
      const condition = result.data.weather[0].main
    

      //오랜만에 복습해보는 객체 리터럴 방식으로 딕셔너리 구성하기!!
      //잘 기억이 안난다면 1주차 강의 6-5를 다시 복습해보세요!
      setWeather({
        temp,condition
      })

    } catch (error) {
      //혹시나 위치를 못가져올 경우를 대비해서, 안내를 준비합니다
      Alert.alert("위치를 찾을 수가 없습니다.", "앱을 껏다 켜볼까요?");
    }
  }

  const category = (cate) => {
    if(cate == "전체보기"){
        //전체보기면 원래 꿀팁 데이터를 담고 있는 상태값으로 다시 초기화
        setCateState(state)
    }else{
        setCateState(state.filter((d)=>{
            return d.category == cate
        }))
    }
}

  //data.json 데이터는 state에 담기므로 상태에서 꺼내옴
  // let tip = state.tip;
  let todayWeather = 10 + 17;
  let todayCondition = "흐림"
  //return 구문 밖에서는 슬래시 두개 방식으로 주석
  return ready ? <Loading/> :  (
    /*
      return 구문 안에서는 {슬래시 + * 방식으로 주석
    */

    <View>
      {__DEV__ ? null : (<BannerAd
        unitId={adUnitId}
        size={BannerAdSize.FULL_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />)}
      
    <ScrollView style={styles.container}>
      <StatusBar style="light" />
      {/* <Text style={styles.title}>나만의 꿀팁</Text> */}
      <Text style={styles.weather}>오늘의 날씨: {weather.temp + '°C   ' + weather.condition} </Text>
      <TouchableOpacity style={styles.aboutButton} onPress={()=>{navigation.navigate('AboutPage')}}>
          <Text style={styles.aboutButtonText}>소개 페이지</Text>
        </TouchableOpacity>
      <Image style={styles.mainImage} source={{uri:main}}/>
      <ScrollView style={styles.middleContainer} horizontal indicatorStyle={"white"}>
      <TouchableOpacity style={styles.middleButtonAll} onPress={()=>{category('전체보기')}}><Text style={styles.middleButtonTextAll}>전체보기</Text></TouchableOpacity>
        <TouchableOpacity style={styles.middleButton01} onPress={()=>{category('생활')}}><Text style={styles.middleButtonText}>생활</Text></TouchableOpacity>
        <TouchableOpacity style={styles.middleButton02} onPress={()=>{category('재테크')}}><Text style={styles.middleButtonText}>재테크</Text></TouchableOpacity>
        <TouchableOpacity style={styles.middleButton03} onPress={()=>{category('반려견')}}><Text style={styles.middleButtonText}>반려견</Text></TouchableOpacity>
        <TouchableOpacity style={styles.middleButton04} onPress={()=>{navigation.navigate('LikePage')}}><Text style={styles.middleButtonText}>꿀팁 찜</Text></TouchableOpacity>
      </ScrollView>
      <View style={styles.cardContainer}>
        {/* 하나의 카드 영역을 나타내는 View */}
        {
          cateState.map((content,i)=>{
            return __DEV__ ? (<Card content={content} key={i} navigation={navigation}/>) : (<AdCard content={content} key={i} navigation={navigation}/>)
          })
        }
        
      </View>
  
    </ScrollView>
    </View>
    )
}

const styles = StyleSheet.create({
  container: {
    //앱의 배경 색
    backgroundColor: '#fff',
  },
  title: {
    //폰트 사이즈
    fontSize: 20,
    //폰트 두께
    fontWeight: '700',
    //위 공간으로 부터 이격
    marginTop:50,
    //왼쪽 공간으로 부터 이격
    marginLeft:20
  },
weather:{
    alignSelf:"flex-end",
    paddingRight:20
  },
  mainImage: {
    //컨텐츠의 넓이 값
    width:'90%',
    //컨텐츠의 높이 값
    height:200,
    //컨텐츠의 모서리 구부리기
    borderRadius:10,
    marginTop:20,
    //컨텐츠 자체가 앱에서 어떤 곳에 위치시킬지 결정(정렬기능)
    //각 속성의 값들은 공식문서에 고대로~ 나와 있음
    alignSelf:"center"
  },
  middleContainer:{
    marginTop:20,
    marginLeft:10,
    height:60
  },
  middleButtonAll: {
    width:100,
    height:50,
    padding:15,
    backgroundColor:"#20b2aa",
    borderColor:"deeppink",
    borderRadius:15,
    margin:7
  },
  middleButton01: {
    width:100,
    height:50,
    padding:15,
    backgroundColor:"#fdc453",
    borderColor:"deeppink",
    borderRadius:15,
    margin:7
  },
  middleButton02: {
    width:100,
    height:50,
    padding:15,
    backgroundColor:"#fe8d6f",
    borderRadius:15,
    margin:7
  },
  middleButton03: {
    width:100,
    height:50,
    padding:15,
    backgroundColor:"#9adbc5",
    borderRadius:15,
    margin:7
  },
  middleButton04: {
    width:100,
    height:50,
    padding:15,
    backgroundColor:"#f886a8",
    borderRadius:15,
    margin:7
  },
  middleButtonText: {
    color:"#fff",
    fontWeight:"700",
    //텍스트의 현재 위치에서의 정렬 
    textAlign:"center"
  },
  middleButtonTextAll: {
    color:"#fff",
    fontWeight:"700",
    //텍스트의 현재 위치에서의 정렬 
    textAlign:"center"
  },
  cardContainer: {
    marginTop:10,
    marginLeft:10
  },
  aboutButton: {
    backgroundColor:"pink",
    width:100,
    height:40,
    borderRadius:10,
    alignSelf:"flex-end",
    marginRight:20,
    marginTop:10
  },
  aboutButtonText: {
    color:"#fff",
    textAlign:"center",
    marginTop:10
  }


});