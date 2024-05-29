import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Outlet, useLocation, useNavigate } from 'react-router';
import ResponseDto from 'src/apis/response.dto';
import { getSignInUserRequest } from 'src/apis/user';
import { GetUserInfoResponseDto } from 'src/apis/user/dto/response';
import { MAIN_PATH } from 'src/constant';
import { useUserStore } from 'src/stores';
import './style.css';


//   component: Restaurant 공통부분   //
export default function Restaurant()
{

  //            state               //
  const { setLoginUserEmailId, setLoginUserRole } = useUserStore();
  const[cookies, removeCookie] = useCookies();
  const { loginUserRole } = useUserStore();
  const navigator = useNavigate();
  const location = useLocation();

  //            function                     //
  const getSignInUserResponse = (result: GetUserInfoResponseDto | ResponseDto | null) => {

    const message = 
        !result ? '서버에 문제가 있습니다.' :
        result.code === 'AF' ? '인증에 실패했습니다.' :
        result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    if (!result || result.code !== 'SU') 
    {
        alert(message);
        // navigator(MAIN_ABSOLUTE_PATH);
        return;
    }

    const { userEmailId, userRole } = result as GetUserInfoResponseDto;
    setLoginUserEmailId(userEmailId);
    setLoginUserRole(userRole);
};


  //            event handler               //
  const onLogClickHandler = () => 
  {
      navigator(MAIN_PATH);
      removeCookie('accessToken', {path:'/'});
  };

  
  let effectFlag = false;

  //          effect              //
  useEffect(() => {
  if (!cookies.accessToken) 
  {
      return;
  }
  if(effectFlag) return;
  effectFlag = true;

    getSignInUserRequest(cookies.accessToken).then(getSignInUserResponse);
  }, [location]);

  // path에 대한 객체를 반환

  //            render              //
  return (
    <>
      <div id="restaurant-wrapper">
          <div className='restaurant-head-box'>
              <div className='restaurant-icon-image'></div>
              <div className='restaurant-title'>{"Food Insight"}</div>
              {loginUserRole === '' 
               ? <div className="restaurant-sign-in" onClick={onLogClickHandler}>로그인/회원가입</div>
               : loginUserRole === 'ROLE_CEO'
               ? <div className="restaurant-sign-in" onClick={onLogClickHandler}>사장 로그아웃</div>
               : loginUserRole === 'ROLE_USER' 
               ? <div className="restaurant-sign-in" onClick={onLogClickHandler}>사용자 로그아웃</div>
               : null}
          </div>
          <Outlet />
      </div> 
    </>
  )
}