import { ChangeEvent, KeyboardEvent, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router';
import ResponseDto from 'src/apis/response.dto';
import { PostReviewRequest } from 'src/apis/restaurant/review';
import { PostReviewRequestDto } from 'src/apis/restaurant/review/dto/request';
import { RESTAURANT_INFO_ABSOLUTE_PATH } from 'src/constant';
import './style.css';


// component //
export default function ReviewWrite() {
    // state //
    const navigation = useNavigate();
    const contentsRef = useRef<HTMLTextAreaElement | null>(null);
    const {restaurantId} = useParams();
    const [reviewImage, setReviewImage] = useState<string>("");
    const [rating, setRating] = useState<number>(0);
    const [reviewContents, setReviewContents] = useState<string>("");
    const [cookies] = useCookies();

    // function //
    const PostReviewResponse = (result: ResponseDto | null) => {
        const message =
            !result ? '서버에 문제가 있습니다.' :
            result.code === 'VF' ? '필수 데이터를 입력하지 않았습니다.' :
            result.code === 'NR' ? '존재하지 않는 식당입니다.' :
            result.code === 'AF' ? '권한이 없습니다.' :
            result.code === 'DE' ? '이미 리뷰를 작성했습니다.' :
            result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        if (!result || result.code !== 'SU') {
            alert(message);
            return;
        }

        if(!restaurantId) return;
        navigation(RESTAURANT_INFO_ABSOLUTE_PATH(restaurantId));
    }

    // event handler //
    const onImageChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;

        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result?.toString();
                if (base64String) {
                    setReviewImage(base64String);
                }
            };
            reader.readAsDataURL(file);
        }
    }

    const onRatingChangeHandler = (event: ChangeEvent<HTMLSelectElement>) => {
        if(event.target.value==="선택")
        { setRating(0); } 

        const { value } = event.target;
        const result = Number(value);
        setRating(result);
    }

    const onContentsChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = event.target;
        setReviewContents(value);

        if(!contentsRef.current) return;
        contentsRef.current.style.height = 'auto';
        contentsRef.current.style.height = `${contentsRef.current.scrollHeight}px`;
    }

    
    const UploadClickHandler = () => {
        if (!rating) {
            return;
        }

        const requestBody: PostReviewRequestDto =
        { reviewImage: reviewImage, rating: rating, reviewContents: reviewContents }

        if(!restaurantId) return;
        PostReviewRequest(restaurantId, requestBody, cookies.accessToken)
            .then(PostReviewResponse);
    }

    const onKeyPressHandler = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter') {
            UploadClickHandler();
        }
    };

    const ButtonClass = `${rating ? 'review-primary' : 'review-disable'}-button`;
    
    // render //
    return (
        <>
            <div className="review-write-title">리뷰 작성</div>
            <div className="review-write-box">
                <input type="file" accept="image/*" onChange={onImageChangeHandler} />
                {reviewImage && (
                    <img src={reviewImage}  style={{ maxWidth: '100px', maxHeight: '100px' }} />
                )}
                <div className='review-grade'>평점</div>
                <div id="review-rating-box">
                    <select id="review-rating" name="review-rating" defaultValue={rating} onChange={onRatingChangeHandler}>
                        <option value="선택">선택</option>
                        <option value="1.0">1.0</option>
                        <option value="1.5">1.5</option>
                        <option value="2.0">2.0</option>
                        <option value="2.5">2.5</option>
                        <option value="3.0">3.0</option>
                        <option value="3.5">3.5</option>
                        <option value="4.0">4.0</option>
                        <option value="4.5">4.5</option>
                        <option value="5.0">5.0</option>
                    </select>
                </div>
                <div className='review-write-contents-box'>
                    <textarea ref={contentsRef} className='review-write-contents-textarea'
                        placeholder='내용을 입력해주세요. / 300자' maxLength={300} value={reviewContents} onChange={onContentsChangeHandler} onKeyPress={onKeyPressHandler}/>
                </div>
                <div className="review-registered-button-box">
                    <button onClick={UploadClickHandler} className={ButtonClass}>등록하기</button>
                </div>
            </div>
        </>
    )
}