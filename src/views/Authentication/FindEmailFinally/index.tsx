import { useNavigate } from 'react-router';
import "./style.css";
import { FIND_EMAIL_INPUT_ABSOLUTE_PATH, PASSWORD_RESET_INPUT_ABSOLUTE_PATH, SIGN_IN_ABSOLUTE_PATH } from 'src/constant';
import { useAuthStore } from 'src/stores';
import ResponseDto from 'src/apis/response.dto';
import { FindEmailResponseDto } from 'src/apis/auth/dto/response';
import { useEffect } from 'react';

// component: 이메일 찾기 완료 //
export default function FindEmailFinally() {

    // state //
    const { userEmailId, setEmailId } = useAuthStore();

    const getFindEmailResponse = (result: FindEmailResponseDto | ResponseDto | null) => {
        if (!result) return;

        const { userEmailId } = result as FindEmailResponseDto;
        setEmailId(userEmailId);
    };

    // function //
    const navigator = useNavigate();
    
    return (
        <div id='authentication-wrapper'>
            <div className='find-email-container'>
                <div className='find-email-title'>이메일 찾기</div>
                <div className='find-email-box'>
                    <div className='find-email-finally'>{userEmailId}</div>
                    <div className='find-container'>
                        <div className='find-email-sign-button'>
                            <div className="text-link" onClick={() => {navigator(SIGN_IN_ABSOLUTE_PATH)}}>로그인 하기</div> 
                        </div>
                        <div className="find-divider">{'\|'}</div>
                        <div className='find-email-password-button'>
                            <div className="text-link" onClick={() => {navigator(PASSWORD_RESET_INPUT_ABSOLUTE_PATH)}}>비밀번호 재설정</div> 
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}