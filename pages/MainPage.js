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
import * as Location from "expo-location"; //<expo 통해서 설치함> 디바이스 geolocaiton 정보 읽게 함. 권한설정. 
import axios from "axios" //npm 설치대행사인 <yarn 을 이용해서 설치함> axios 는 API 주소를 앱내에서 직접 칠 수 없으니까 주소를 코드 내에서 실행하게 해주는 역할을함. 
import {firebase_db} from "../firebaseConfig"
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import AdCard from '../components/AdCard';

const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-5579008343368676/92552776'; 
// 광고 달려면 테스트용 기기 id를 app.json에 넣어주고 배너 아이디 키값을 여기에 박아주기
// 개발환경이면? 테스트아이디로 실행하고 아니면 광고단위 키값을 적용해라!! 입니다
// adUnitId 가 결국 광고배너의 키값임니당

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
  //openWeathermap 에 위치정보넣고 받아올건데 일단 대기하셈

  const [ready,setReady] = useState(true)
  //true 면 로딩화면 뜸 false 넣으면 본화면 뜸. 
  //일단 로딩화면 띄우고 이따가 필요한거다받아오면 useffect에서 false 처리후 본화면 넘기는것임



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
      title:'나만의 꿀팁'
    })  
    //특정 활성화면 헤더를 업데이트할 때 쓰는 setOptions (화면마다 고정하고 싶을때는 StackNavigator.js 의 StackNavigator 속성으로 컨트롤)


    // useEffect. 화면 마운트 됐을 때 함수 실행됨. 
    // 즉 마운트 되고 2초 후에 파베에서 데이터 받아오고 그 데이터들을 state, CateState 저장함 
    // 그리고 그동안 Ready에 false 넣어서 

    setTimeout(()=>{
        firebase_db.ref('/tip').once('value').then((snapshot) => {
          console.log("I got firebase JSON data from DB, sir")
          let tip = snapshot.val();

          setState(tip)
          setCateState(tip)
          getLocation()
          setReady(false)

    //상태가 3번바뀜!
    //그러니까 화면 마운트 2초 후 얘네 useEffect가 실행되면 화면이 3번바뀌게 됨
    //State에 tip 넣고 화면 리랜더링 (1회) CateState에 tip 넣고 화면 리랜더링 (2회) 
    //그리고 getLocation 으로 위치정보 받아온 후 최종적으로 Ready에 false 넣고 리랜더링(3회) 하면 로딩페이지에서 메인 화면으로 교체됨

        });
        // getLocation()
        // setState(data.tip)
        // setCateState(data.tip)
        // setReady(false)
    },2000)

  },[]);

//자바스크립트 함수의 실행순서를 고정하기 위해 쓰는 async,await
  const getLocation = async () => {
//try 부분에서는 API 요청 등의 작업코드진행!
    try {
      await Location.requestForegroundPermissionsAsync(); //Check or request permissions for the foreground location.
      const locationData= await Location.getCurrentPositionAsync(); // Requests for one-time delivery of the user's current location. 
      //(Depending on given accuracy option it may take some time to resolve, especially when you're inside a building)
      //Consider using Location.getLastKnownPositionAsync if you expect to get a quick response and high accuracy is not required.


      // console.log(locationData)
      // console.log(locationData['coords']['latitude'])
      // console.log(locationData['coords']['longitude'])
      const latitude = locationData['coords']['latitude']
      const longitude = locationData['coords']['longitude']
      const API_KEY = "cfc258c75e1da2149c33daffd07a911d";
      const result = await axios.get(
        `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
      );
      //get 방식 통해서 api 요청하노!! 
      //console.log(result);
      const temp = result.data.main.temp; 
      const condition = result.data.weather[0].main
    

      //오랜만에 복습해보는 객체 리터럴 방식으로 딕셔너리 구성하기!!
      //잘 기억이 안난다면 1주차 강의 6-5를 다시 복습해보세요!
      //바뀌었으니까 setTimeout 에서 3번 포함해서 상태가 총 4번바뀌는거구나
      setWeather({
        temp,condition
      })
//catch 부분에서는 에러가 발생했을 때 실행할 코드를 작성!
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
  // console.log(cateState)

  // data.json 데이터는 state에 담기므로 상태에서 꺼내옴
  // let tip = state.tip;
  let todayWeather = 10 + 17;
  let todayCondition = "흐림"
  //return 구문 밖에서는 슬래시 두개 방식으로 주석
  return ready ? <Loading/> :  (
    /*
      return 구문 안에서는 {슬래시 + * 방식으로 주석
    */
    console.log("main page 에서 전체화면 뿌려줌"),
    
    <View>
      {__DEV__ ? null : (<BannerAd
        unitId={adUnitId}
        size={BannerAdSize.FULL_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />)} 
      {/* 광고임. adUnitId는 광고배너의 키값. 역시 개발중이 아닐 때만 배너가 보이도록 했다. expo start 했을 때 에러가 나니까 */}

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