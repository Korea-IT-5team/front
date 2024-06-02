import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useLocation, useNavigate, useParams } from 'react-router';
import ResponseDto from 'src/apis/response.dto';
import { GetRestaurantInfoRequest } from 'src/apis/restaurant';
import { GetRestaurantInfoResponseDto } from 'src/apis/restaurant/dto/response';
import { DeleteRestaurantFavoriteRequest, GetFavoriteCheckStatusRequest, PostRestaurantFavoriteRequest } from 'src/apis/restaurant/favorite';
import { DeleteReservationRequest, GetReservationCheckStatusRequest } from 'src/apis/restaurant/reservation';
import { RESTAURANT_DO_RESERVATION_ABSOLUTE_PATH, RESTAURANT_INFO_UPDATE_ABSOLUTE_PATH } from 'src/constant';
import { useUserStore } from 'src/stores';
import { RestaurantReviewListItem } from 'src/types';
import ReviewList from '../Review/ReviewList';
import './style.css';

//              interface                   //


//            component : 특정 식당 정보                 //
export default function RestaurantInfo() {

    //            state               //
    const { loginUserEmailId, loginUserRole, userReservationStatus, userFavoriteStatus, setUserReservationStatus, setUserFavoriteStatus } = useUserStore();
    const [cookies] = useCookies();
    const { restaurantId } = useParams();
    const [restaurantImage, setRestaurantImage] = useState('');
    const [restaurantName, setRestaurantName] = useState('');
    const [restaurantFoodCategory, setRestaurantFoodCategory] = useState('');
    const [restaurantPostalCode, setRestaurantPostalCode] = useState('');
    const [restaurantLocation, setRestaurantLocation] = useState('');
    const [restaurantTelNumber, setRestaurantTelNumber] = useState('');
    const [restaurantSnsAddress, setRestaurantSnsAddress] = useState('');
    const [restaurantOperationHours, setRestaurantOperationHours] = useState('');
    const [restaurantFeatures, setRestaurantFeatures] = useState('');
    const [restaurantNotice, setRestaurantNotice] = useState('');
    const [restaurantRepresentativeMenu, setRestaurantRepresentativeMenu] = useState('');
    const [restaurantBusinessRegistrationNumber, setRestaurantBusinessRegistrationNumber] = useState('');
    const [restaurantWriterId, setRestaurantWriterId] = useState('');
    const [restaurantReviewList, setRestaurantReviewList] = useState<RestaurantReviewListItem[]>([]);
    const [grade, setGrade] = useState<number>();


    //                    function                    //
    const navigator = useNavigate();

    const GetRestaurantInfoResponse = (result: GetRestaurantInfoResponseDto | ResponseDto | null) => {
        const message =
            !result ? '서버에 문제가 있습니다.' :
                result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        if (!result || result.code !== 'SU') {
            alert(message);
            return;
        }

        const { restaurantImage, restaurantName, restaurantFoodCategory,
            restaurantPostalCode, restaurantLocation, restaurantTelNumber,
            restaurantSnsAddress, restaurantOperationHours, restaurantFeatures,
            restaurantNotice, restaurantRepresentativeMenu, restaurantBusinessRegistrationNumber,
            restaurantWriterId, restaurantReviewList
        } = result as GetRestaurantInfoResponseDto;
        setRestaurantImage(restaurantImage);
        setRestaurantName(restaurantName);
        setRestaurantFoodCategory(restaurantFoodCategory);
        setRestaurantPostalCode(restaurantPostalCode);
        setRestaurantLocation(restaurantLocation);
        setRestaurantTelNumber(restaurantTelNumber);
        setRestaurantSnsAddress(restaurantSnsAddress);
        setRestaurantOperationHours(restaurantOperationHours);
        setRestaurantFeatures(restaurantFeatures);
        setRestaurantNotice(restaurantNotice);
        setRestaurantRepresentativeMenu(restaurantRepresentativeMenu);
        setRestaurantBusinessRegistrationNumber(restaurantBusinessRegistrationNumber);
        setRestaurantWriterId(restaurantWriterId);
        setRestaurantReviewList(restaurantReviewList);
    }

    const DeleteReservationResponse = (result: ResponseDto | null) => {
        const message =
            !result ? '서버에 문제가 있습니다.' :
                result.code === 'VF' ? '필수 데이터를 입력하지 않았습니다.' :
                    result.code === 'NR' ? '존재하지 않는 식당입니다.' :
                        result.code === 'NU' ? '존재하지 않는 사용자입니다.' :
                            result.code === 'AF' ? '권한이 없습니다.' :
                                result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        if (!result || result.code !== 'SU') {
            alert(message);
            return;
        }

        alert("예약이 취소되었습니다.");
        setUserReservationStatus(false);
    }


    const PostRestaurantFavoriteResponse = (result: ResponseDto | null) => {
        const message =
            !result ? '서버에 문제가 있습니다.' :
                result.code === 'VF' ? '필수 데이터를 입력하지 않았습니다.' :
                    result.code === 'NR' ? '존재하지 않는 식당입니다.' :
                        result.code === 'AF' ? '권한이 없습니다.' :
                            result.code === 'NU' ? '존재하지 않는 사용자입니다.' :
                                result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        if (!result || result.code !== 'SU') {
            alert(message);
            return;
        }

        setUserFavoriteStatus(true);
    }


    const DeleteRestaurantFavoriteResponse = (result: ResponseDto | null) => {
        const message =
            !result ? '서버에 문제가 있습니다.' :
                result.code === 'VF' ? '필수 데이터를 입력하지 않았습니다.' :
                    result.code === 'NR' ? '존재하지 않는 식당입니다.' :
                        result.code === 'AF' ? '권한이 없습니다.' :
                            result.code === 'NU' ? '존재하지 않는 사용자입니다.' :
                                result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        if (!result || result.code !== 'SU') {
            alert(message);
            return;
        }

        setUserFavoriteStatus(false);
    }

    //!!!
    const GetFavoriteCheckStatusResponse = (result: ResponseDto | null) => {

        const message = 
            !result ? '서버에 문제가 있습니다.' :
                result.code === 'AF' ? '인증에 실패했습니다.' :
                    result.code === 'DBE' ? '서버에 문제가 있습니다.':
                        result.code === 'NU'? '존재하지 않는 사용자입니다.': '';
    
        if (!result || result.code !== 'SU') 
        {
            if(!result || result.code !== 'NU')
            {
                // alert(message);
            }

            return;
        }
    
        setUserFavoriteStatus(true);
    };

    const GetReservationCheckStatusResponse = (result: ResponseDto | null) => {

        const message = 
            !result ? '서버에 문제가 있습니다.' :
                result.code === 'AF' ? '인증에 실패했습니다.' :
                    result.code === 'DBE' ? '서버에 문제가 있습니다.':
                        result.code === 'NU'? '존재하지 않는 사용자입니다.': '';
    
        if (!result || result.code !== 'SU') 
        {
            if(!result || result.code !== 'NU')
            {
                // alert(message);
            }

            return;
        }
    
        setUserReservationStatus(true);
    };
    //!!!

    //!!!
    //          effect              //
    useEffect(() => {
        if (!cookies.accessToken || !restaurantId) {
            return;
        }

        GetRestaurantInfoRequest(restaurantId, cookies.accessToken)
            .then(GetRestaurantInfoResponse);
    }, []);
    //!!!


    useEffect(() => {
        if (!cookies.accessToken || !restaurantId) {
            return;
        }

        const total = restaurantReviewList.reduce((sum, restaurantReviewList) => sum + restaurantReviewList.rating, 0);
        setGrade(total / restaurantReviewList.length);
    }, []);

    //!!!
    let effectFlag = false;
    useEffect(() => {
    if (!cookies.accessToken || !restaurantId) {
            return;
    }
    if(effectFlag) return;
    effectFlag = true;

    GetFavoriteCheckStatusRequest(restaurantId,cookies.accessToken)
        .then(GetFavoriteCheckStatusResponse);
    GetReservationCheckStatusRequest(restaurantId,cookies.accessToken)
        .then(GetReservationCheckStatusResponse)
    }, []);
    //!!!

    //               constant                     //



    //                event handler               //

    const onSetRestIdNumberHandler = () => {
        if(!restaurantId) return;
        navigator(RESTAURANT_INFO_UPDATE_ABSOLUTE_PATH(restaurantId))
    }

    const onReservationClickHandler = () => {

        if(!restaurantId) return;
        navigator(RESTAURANT_DO_RESERVATION_ABSOLUTE_PATH(restaurantId));
    };

//!!!
const onReservationCancelClickHandler = () => 
{
    const confirmed = window.confirm("정말로 취소하시겠습니까?");
    if (confirmed) 
    {

        if(!restaurantId) return;
        DeleteReservationRequest(restaurantId,cookies.accessToken)
        .then(DeleteReservationResponse)


    } 
    else 
    {
        return;
    }
};
//!!!

   
//!!!
const onFavoriteClickHandler = () => {
    if(!loginUserEmailId || !restaurantId || !cookies.accessToken) return;

    PostRestaurantFavoriteRequest(restaurantId,cookies.accessToken)
    .then(PostRestaurantFavoriteResponse)
}
//!!!
//!!!
const onCancleFavoriteClickHandler = () => {
    if(!loginUserEmailId || !restaurantId || !cookies.accessToken) return;

    DeleteRestaurantFavoriteRequest(restaurantId,cookies.accessToken)
    .then(DeleteRestaurantFavoriteResponse)
}
//!!!
    //                      render                      //
    return (
        <>
            <div id="restaurant-info">
                    {loginUserRole === "ROLE_CEO" && loginUserEmailId === restaurantWriterId && (
                        <button onClick={onSetRestIdNumberHandler}>수정</button>)}
                    <div id="restaurant_image">{restaurantImage}</div>
                    <div>
                        <div>{restaurantName}</div>
                        {loginUserRole === "ROLE_USER" && userReservationStatus ? 
                            (<button onClick={onReservationCancelClickHandler}>예약취소</button>):
                            (<button onClick={onReservationClickHandler}>예약</button>)
                        }

                    </div>
                        <div>{restaurantFoodCategory}</div>
                        <div>{grade}</div>
                        {loginUserRole === "ROLE_USER" && userFavoriteStatus ?
                            (<button onClick={onCancleFavoriteClickHandler}>찜클릭해제</button>):
                            (<button onClick={onFavoriteClickHandler}>찜클릭</button>)
                        }

                    <div>{restaurantLocation}</div>
                    <div>{restaurantSnsAddress}</div>
                    <div>{restaurantPostalCode}</div>
                    <div>{restaurantTelNumber}</div>

                    <div>{restaurantOperationHours}</div>
                    <div>{restaurantFeatures}</div>
                    <div>{restaurantNotice}</div>
                    <div>{restaurantRepresentativeMenu}</div>
                    <ReviewList value={restaurantReviewList} restaurantId={restaurantId}/>   
            </div>   
        </>
  )
}