import { ChangeEvent, useState } from 'react';
import { findEmailRequest, telNumberAuthCheckRequest, telNumberAuthRequest } from 'src/apis/auth';
import { FindEmailRequestDto, TelNumberAuthCheckRequestDto, TelNumberAuthRequestDto } from 'src/apis/auth/dto/request';
import ResponseDto from 'src/apis/response.dto';
import "./style.css";

// component: 이메일 찾기 // 
export default function FindEmailInput() {

    // state //
    const [userName, setUserName] = useState<string>('');
    const [userTelNumber, setUserTelNumber] = useState<string>('');
    const [authNumber, setAuthNumber] = useState<string>('');

    const [userTelNumberButtonStatus, setUserTelNumberButtonStatus] = useState<boolean>(false);
    const [authNumberButtonStatus, setAuthNumberButtonStatus] = useState<boolean>(false);

    const [isUserTelNumberCheck, setUserTelNumberCheck] = useState<boolean>(false);
    const [isUserTelNumberPattern, setUserTelNumberPattern] = useState<boolean>(false);
    const [isAuthNumberCheck, setAuthNumberCheck] = useState<boolean>(false);

    const [UserNameMessage, setUserNameMessage] = useState<string>('');
    const [userTelNumberMessage, setUserTelNumberMessage] = useState<string>('');
    const [authNumberMessage, setAuthNumberMessage] = useState<string>('');

    const [isUserTelNumberError, setUserTelNumberError] = useState<boolean>(false);
    const [isAuthNumberError, setAuthNumberError] = useState<boolean>(false);

    const isFindEmailActive = isUserTelNumberError && isAuthNumberError;
    const findEmailButtonClass = `${isFindEmailActive ? 'primary' : 'disable'}-button full-width`;

  // function // 
    const userTelNumberResponse = (result: ResponseDto | null) => {

        const userTelNumberMessage =
            !result ? '서버에 문제가 있습니다.' :
                result.code === 'VF' ? '인증번호를 입력해주세요.' :
                    result.code === 'SF' ? '인증번호 전송이 실패하였습니다.' :
                        result.code === 'DBE' ? '서버에 문제가 있습니다.' :
                            result.code === 'SU' ? '인증번호가 확인되었습니다.' : '';
        const userTelNumberCheck = result !== null && result.code === 'SU';
        const UserTelNumberError = !userTelNumberCheck;

        setUserTelNumberMessage(userTelNumberMessage);
        setUserTelNumberCheck(userTelNumberCheck);
        setUserTelNumberError(UserTelNumberError);
    };

    const userTelNumberCheckResponse = (result: ResponseDto | null) => {

        const authNumberMessage =
            !result ? '서버에 문제가 있습니다.' :
                result.code === 'VF' ? '인증번호를 입력해주세요.' :
                    result.code === 'AF' ? '인증번호가 일치하지 않습니다.' :
                        result.code === 'DBE' ? '서버에 문제가 있습니다.' :
                            result.code === 'SU' ? '인증번호가 확인되었습니다.' : '';
        const authNumberCheck = result !== null && result.code === 'SU';
        const authNumberError = !authNumberCheck;

        setAuthNumberMessage(authNumberMessage);
        setAuthNumberCheck(authNumberCheck);
        setAuthNumberError(authNumberError);
    };

    const findEmailResponse = (result: ResponseDto | null) => {

        const message = 
            !result ? '서버에 문제가 있습니다.' :
            result.code === 'NF' ? '사용자 정보 불일치합니다.' : 
            result.code === 'AF' ? '인증번호가 일치하지 않습니다.' :
            result.code === 'DBE' ? '서버에 문제가 있습니다.' : ''
    
        const isSuccess = result && result.code === 'SU';
        if (!isSuccess) {
            alert(message);
            return;
        }
    };

    // event handler // 
    const onUserNameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setUserName(value);
        setUserNameMessage('');
    };

    const onUserTelNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setUserTelNumber(value);
        setUserTelNumberButtonStatus(value !== '');
        setUserTelNumberCheck(false);
        setAuthNumberCheck(false);
        setUserTelNumberMessage('');
    };

    const onAuthNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setAuthNumber(value);
        setAuthNumberButtonStatus(value !== '');
        setAuthNumberCheck(false);
        setAuthNumberMessage('');
    };

    const onUserTelNumberButtonClickHandler = () => {
        if (!userTelNumberButtonStatus) return;

        const userTelNumberPattern = /^01(?:0|1|[6-9])-(?:\d{3}|\d{4})-\d{4}$/;
        const isUserTelNumberPattern = userTelNumberPattern.test(userTelNumber);
        setUserTelNumberPattern(isUserTelNumberPattern);

        if (!isUserTelNumberPattern) {
            setUserTelNumberMessage('전화번호 형식이 아닙니다.');
            setUserTelNumberError(true);
            setUserTelNumberCheck(false);
            return;
        }

        const requestBody: TelNumberAuthRequestDto = { userTelNumber: userTelNumber };
        telNumberAuthRequest(requestBody).then(userTelNumberResponse);
    };

    const onAuthNumberButtonClickHandler = () => {
        if (!authNumberButtonStatus) return;
        if (!authNumber) return;

        const requestBody: TelNumberAuthCheckRequestDto = {
            userTelNumber: userTelNumber,
            authNumber
        };
        telNumberAuthCheckRequest(requestBody).then(userTelNumberCheckResponse);
    };

    const onSignUpButtonClickHandler = () => {
        if (!isFindEmailActive) return;
        if (!userName || !userTelNumber || !authNumber) {
            alert('모든 내용을 입력해주세요.');
            return;
        }

        const requestBody: FindEmailRequestDto = {
            userName: userName,
            userTelNumber: userTelNumber,
            authNumber: authNumber
        }
        findEmailRequest(requestBody).then(findEmailResponse);
    };
    
    return (
        <div className='find-email-container'>
            <div className='find-email-title'>이메일 찾기</div>
            <div className='find-email-box'>
                <div className='find-email-search'>email@email.com</div>
                <div className='find-email-button'>
                    <div className='find-email-login'>로그인하기</div>
                    <div className='find-email-password'>비밀번호 재설정</div>
                </div>
            </div>
        </div>
    )
}
