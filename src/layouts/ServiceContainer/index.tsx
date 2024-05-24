import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Outlet, useNavigate } from 'react-router';
import ResponseDto from 'src/apis/response.dto';
import { getSignInUserRequest } from 'src/apis/user';
import { GetUserInfoResponseDto } from 'src/apis/user/dto/response';
import { MAIN_PATH } from 'src/constant';
import { useUserStore } from 'src/stores';
import { RestaurantListItem } from 'src/types';
import './style.css';

//              interface                   //


//              component                   //
function TopBar()
{
  //            state                //
  const {loginUserRole } = useUserStore();
  const[cookies,removeCookie] = useCookies();

  //            function                     //
  const navigator = useNavigate();
 
  //            event handler               //
  const onLogClickHandler = () => 
  {
      navigator(MAIN_PATH);
      removeCookie('accessToken',{path:'/'});
  };

  
   //            render              //
   return(
    <>
      <div className="top-bar-container">
          <div className="top-bar-left">☰</div>
          <div className="top-bar-title">Food Insight(푸드 인사이트)</div>
          <div className='top-bar-right'>
          {loginUserRole === '' 
              ? <div className="second-button" onClick={onLogClickHandler}>로그인/회원가입</div>
              : loginUserRole === 'ROLE_CEO' 
              ? <div className="second-button" onClick={onLogClickHandler}>사장 로그아웃</div>
              : loginUserRole === 'ROLE_USER' 
              ? <div className="second-button" onClick={onLogClickHandler}>사용자 로그아웃</div>
              : null}
          </div>
      </div>
    </>
   );
}



//              component             //
export default function ServiceContainer()
{

  //            state               //
  const { setLoginUserEmailId, setLoginUserRole } = useUserStore();
  const [searchWord, setSearchWord] = useState<string>('');
  const [cookies] = useCookies();
  const [restaurantList, SetRestaurantList] = useState<RestaurantListItem[]>([]);

  

  //                    function                    //
  const navigator = useNavigate();

  const getSignInUserResponse = (result: GetUserInfoResponseDto | ResponseDto | null) => {

    // const message = 
    //     !result ? '서버에 문제가 있습니다.' :
    //     result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    // if (!result || result.code == 'DBE') 
    // {
    //     alert(message);
    //     navigator(AUTH_PATH);
    //     return;
    // }

    const { userEmailId, userRole } = result as GetUserInfoResponseDto;
    setLoginUserEmailId(userEmailId);
    setLoginUserRole(userRole);
};

  
  //          effect              //
  useEffect(() => {
  if (!cookies.accessToken) 
  {
      return;
  }

    getSignInUserRequest(cookies.accessToken).then(getSignInUserResponse);
  }, [cookies.accessToken]);

  // path에 대한 객체를 반환

  //            render              //
  return (
    <>
    <div id="wrapper">
        <TopBar/>
    </div>
        <Outlet /> 
     </>
  )
}
