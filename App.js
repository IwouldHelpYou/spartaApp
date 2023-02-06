import React, { useEffect } from 'react';
//이제 모든 페이지 컴포넌트들이 끼워져있는 책갈피를 메인에 둘예정이므로
//컴포넌트를 더이상 불러오지 않아도 됩니다.
// import MainPage from './pages/MainPage';
// import DetailPage from './pages/DetailPage';

import { StatusBar } from 'expo-status-bar';

//메인에 세팅할 네비게이션 도구들을 가져옵니다.
import {NavigationContainer} from '@react-navigation/native';
import StackNavigator from './navigation/StackNavigator'
import mobileAds from 'react-native-google-mobile-ads';

export default function App() {

  console.disableYellowBox = true;
  useEffect(()=>{
    if(!__DEV__){
      mobileAds()
      .initialize()
      .then(adapterStatuses => {
        // Initialization complete!
      });
    }
  },[])


  return ( 
  <NavigationContainer>
    <StatusBar style="white" />
    <StackNavigator/>
 </NavigationContainer>);
//이렇게 NavigationContainer 컴포넌트를 만들고 StackNavigator 컴포넌트를 여기에 집어넣는 것
//그러기 위해서 StackNavigator.js 를 따로 만들었고 import 해온것을 알수가있당
//(StackNavigator 엔 Screen 컴포넌트와 Screen 컴포넌트를 관리하는 Navigator 컴포넌트가 있었다)
//(StackNavigator 속성에 screenOptions 가 있었고)
}