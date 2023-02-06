import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
//설치한 스택 네비게이션 라이브러리를 가져오는 것이다.


import DetailPage from '../pages/DetailPage';
import MainPage from '../pages/MainPage';
import AboutPage from '../pages/AboutPage';
import LikePage from '../pages/LikePage';
//페이지로 만든 컴포넌트들을 불러온다

const Stack = createStackNavigator();
//스택 네비게이션 라이브러리가 제공해주는 여러 기능이 담겨있는 '객체' 를 반환하는 함수임
//다시말해 Navigator, Screen 같은 속성을 포함하는 객체를 반환한다는 얘기임
//그래서 이렇게 항상 상단에 선언하고 시작한다
//스택 네비게이션이 생성됨

const StackNavigator = () => {
    //외부에 전달해서 쓰게할, 컴포넌트들을 페이지처럼 여기게끔 해주는 기능을 하는 네비게이터 '태그'를 선언중
   
   

    return (

        <Stack.Navigator
        //위에서 선언한 const Stack = createStackNavigator(); Stack 변수에 들어있는 태그를 꺼내 사용하는중.
        //App.js 에서 이 Stack.Navigator 를 가져와가지구 쓸거임.딱 꽂아넣으면 이 안에서 왔다리 갔다리 
        //Stack.Navigator 태그 내부엔 페이지(화면)를 스타일링 할 수 있는 다양한 옵션들이 담겨 있음.
        
        //Stack.Navigator 속성으로 screenOptions 를 놓고 있네

            screenOptions={{
                headerStyle: {
                    backgroundColor: "white",
                    borderBottomColor: "white",
                    shadowColor: "white",
                    height:100
                },
                //헤더의 텍스트를 왼쪽에 둘지 가운데에 둘지를 결정
                headerTitleAlign:'left',
                headerTintColor: "#000",
                headerBackTitleVisible: false
            }}
            //navigation 의 setOptions 랑 다름여!!
            
        >
            <Stack.Screen name="MainPage" component={MainPage}/>      

            <Stack.Screen name="AboutPage" component={AboutPage}/>
            <Stack.Screen name="DetailPage" component={DetailPage}/>

            <Stack.Screen name="LikePage" component={LikePage}/>
            {/* 컴포넌트를 페이지로 만들어주는 엘리먼트에 끼워 넣습니다. 이 자체로 이제 페이지 기능을 합니다*/}
            {/* Navigator 컴포넌트 안에 3개의 Screen 컴포넌트를 자식 컴포넌트로 두었다 */}
            {/* Screen 컴포넌트들은 앞에서 만든 페이지들의 컴포넌트를 지정한거다? */}


        </Stack.Navigator>
    )
}

export default StackNavigator;