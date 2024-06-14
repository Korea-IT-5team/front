import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import "./style.css";
import { CEO_INFO_UPDATE_ABSOLUTE_PATH, CEO_PAGE_SITE_ABSOLUTE_PATH, MAIN_ABSOLUTE_PATH, USER_INFO_UPDATE_ABSOLUTE_PATH } from 'src/constant';
import { getMyInfoRequest, patchUserInfoRequest } from 'src/apis/user';
import { useNavigate, useParams } from 'react-router';
import { useCookies } from 'react-cookie';
import { GetMyInfoResponseDto, PatchUserInfoResponseDto } from 'src/apis/user/dto/response';
import ResponseDto from 'src/apis/response.dto';
import { PatchUserInfoRequestDto } from 'src/apis/user/dto/request';
import { useUserStore } from 'src/stores';
import InputBox from 'src/components/InputBox';

// component: 사장 회원정보 수정 //
export default function CeoInfoUpdate() {

  // state // 
  const [cookies] = useCookies();
  const { loginUserRole } = useUserStore();
  const [userEmailId, setEmailId] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userTelNumber, setUserTelNumber] = useState<string>('');
  const [userAddress, setUserAddress] = useState<string>('');
  const [businessRegistrationNumber, setBusinessRegistrationNumber] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('');

  // function //
  const navigation = useNavigate();

  const GetMyInfoResponse = (result : GetMyInfoResponseDto | ResponseDto | null) => {
    const message =
      !result ? '서버에 문제가 있습니다.' :
      result.code === 'AF' ? '인증에 실패했습니다.' :
      result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    if (!result || result.code !== 'SU') {
      alert(message);
      if (result?.code === 'AF') {
        navigation(MAIN_ABSOLUTE_PATH);
        return;
      }
      
      navigation(CEO_PAGE_SITE_ABSOLUTE_PATH);
      return;
    }

    if (!cookies.accessToken) return;

    const {userEmailId, nickname, userName, userTelNumber, userAddress, businessRegistrationNumber} = result as GetMyInfoResponseDto;
    setNickname(nickname);
    setEmailId(userEmailId);
    setUserName(userName);
    setUserTelNumber(userTelNumber);
    setUserAddress(userAddress);
    setBusinessRegistrationNumber(businessRegistrationNumber);
    setUserRole(userRole);

  };

  //   effect   //
  useEffect(() => {
    if (!cookies.accessToken) return;
    getMyInfoRequest(cookies.accessToken).then(GetMyInfoResponse);
  }, []);

  // function //
  const PatchUpdateUserInfoResponse = (result: PatchUserInfoResponseDto | ResponseDto | null) => {
    const message =
      !result ? '서버에 문제가 있습니다.' :
      result.code === 'AF' ? '인증에 실패했습니다.' :
      result.code === 'NU' ? '사용자 정보가 일치하지 않습니다.' :
      result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

    const isSuccess = result && result.code === 'SU';
    if (!isSuccess) {
      alert(message);
      return;
    }

    alert('정보가 성공적으로 수정되었습니다.');
    navigation(CEO_INFO_UPDATE_ABSOLUTE_PATH(userEmailId));
  };

  // event handler //
  const onNicknameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const nickname = event.target.value;
    setNickname(nickname);
  };

  const onCeoAddressChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const userAddress = event.target.value;
    setUserAddress(userAddress);
  };

  const onUpdateButtonClickHandler = () => {
    if (!cookies.accessToken || !userEmailId) return;
    if (!nickname.trim() || !userAddress.trim()) return;

    const requestBody: PatchUserInfoRequestDto = { nickname, userAddress };
    patchUserInfoRequest(userEmailId, requestBody, cookies.accessToken).then(PatchUpdateUserInfoResponse);
  };

  // useEffect //
  let effectFlag = useRef(false);
  useEffect(() => {
    if (!cookies.accessToken) return;
    if (!loginUserRole) return;
    if (effectFlag.current) return;
    effectFlag.current = true;
    if (loginUserRole !== 'ROLE_CEO') {
      navigation(CEO_PAGE_SITE_ABSOLUTE_PATH);
      return;
    }
    getMyInfoRequest(cookies.accessToken).then(GetMyInfoResponse);
  }, [loginUserRole, cookies.accessToken]);

  // render //
  return (
    <div id='my-page-wrapper'>
      <div className='my-page-container'>
        <div className='my-page-title'>사장 정보 수정</div>
        <div className='my-page-update-box'>
          <div className='my-page-info-box'>
            <InputBox type='text' value={nickname} placeholder='닉네임을 입력해주세요.' onChangeHandler={onNicknameChangeHandler} />
            <div className='my-page-info'>{userEmailId}</div>
            <div className='my-page-info'>{userName}</div>
            <div className='my-page-info'>{userTelNumber}</div>
            <InputBox type='text' value={userAddress}  placeholder='주소를 입력해주세요.' onChangeHandler={onCeoAddressChangeHandler} />
            <div className='my-page-info'>{businessRegistrationNumber}</div>
          </div>
          <div className='my-page-update' onClick={onUpdateButtonClickHandler}>수정</div>
        </div>
      </div>
    </div>
  );
}