import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router';
import ResponseDto from 'src/apis/response.dto';
import { GetCeoReservationListRequest, GetUserReservationListRequest } from 'src/apis/restaurant/reservation';
import { GetReservationListResponseDto } from 'src/apis/restaurant/reservation/dto/response';
import { COUNT_PER_PAGE, COUNT_PER_SECTION, MAIN_ABSOLUTE_PATH, RESTAURANT_INFO_ABSOLUTE_PATH } from 'src/constant';
import { useUserStore } from 'src/stores';
import { RestaurantReservationListItem } from 'src/types';
import './style.css';

// component //
function ListItem ({ 
    reservationNumber,
    reservationStatus,
    reservationRestaurantId,
    reservationRestaurantName,
    reservationDate,
    reservationTime,
    reservationPeople,
    reservationUserName,
    reservationRestaurantLocation,
}: RestaurantReservationListItem) {

    // function //
    const navigation = useNavigate();

    // event handler //
    const onClickHandler = () => navigation(RESTAURANT_INFO_ABSOLUTE_PATH(reservationRestaurantId));  

    // render //
    return (
        <div className='reservation-list-table-tr' onClick={onClickHandler} >
            <div className='reservation-list-table-reservation-number'>{reservationNumber}</div>
            <div className='reservation-list-table-reservation-status'>{reservationStatus}</div>
            <div className='reservation-list-table-reservation-restaurant-name'>{reservationRestaurantName}</div>
            <div className='reservation-list-table-reservation-restaurant-location'>{reservationRestaurantLocation}</div> 
            <div className='reservation-list-table-reservation-date'>{reservationDate}</div>
            <div className='reservation-list-table-reservation-time'>{reservationTime}</div>
            <div className='reservation-list-table-reservation-people'>{reservationPeople}</div>
            <div className='reservation-list-table-reservation-user-name'>{reservationUserName}</div>
        </div>
    );
}

// component //
export default function ReservationList() {

    // state //
    const {loginUserRole} = useUserStore();
    const [cookies] = useCookies();
    const [restaurantReservationList, setRestaurantReservationList] = useState<RestaurantReservationListItem[]>([]);
    const [viewList, setViewList] = useState<RestaurantReservationListItem[]>([]);
    const [totalLenght, setTotalLength] = useState<number>(0);
    const [totalPage, setTotalPage] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageList, setPageList] = useState<number[]>([1]);
    const [totalSection, setTotalSection] = useState<number>(1);
    const [currentSection, setCurrentSection] = useState<number>(1);

    // function //
    const navigation = useNavigate();

    const changePage = (restaurantReservationList: RestaurantReservationListItem[], totalLenght: number) => {
        if(!currentPage) return;
        const startIndex = (currentPage - 1) * COUNT_PER_PAGE;
        let endIndex = currentPage * COUNT_PER_PAGE;
        if (endIndex > totalLenght - 1) endIndex = totalLenght;
        const viewList = restaurantReservationList.slice(startIndex, endIndex);
        setViewList(viewList);
    };

    const changeSection = (totalPage: number) => {
        if(!currentSection) return;
        const startPage = (currentSection * COUNT_PER_SECTION) - (COUNT_PER_SECTION - 1);
        let endPage = currentSection * COUNT_PER_SECTION;
        if (endPage > totalPage) endPage = totalPage;
        const pageList: number[] = [];
        for (let page = startPage; page <= endPage; page++) pageList.push(page);
        setPageList(pageList);
    };


    const changeRestaurantReservationList = (restaurantReservationList: RestaurantReservationListItem[]) => {
        setRestaurantReservationList(restaurantReservationList);

        const totalLenght = restaurantReservationList.length;
        setTotalLength(totalLenght);

        const totalPage = Math.floor((totalLenght - 1) / COUNT_PER_PAGE) + 1;
        setTotalPage(totalPage);
        
        const totalSection = Math.floor((totalPage - 1) / COUNT_PER_SECTION) + 1;
        setTotalSection(totalSection);

        changePage(restaurantReservationList, totalLenght);
        changeSection(totalPage);
    };

    const GetReservationListResponse = (result: GetReservationListResponseDto | ResponseDto | null) => {
        const message =
            !result ? '서버에 문제가 있습니다.' :
                result.code === 'DBE' ? '서버에 문제가 있습니다.' : '';

        if (!result || result.code !== 'SU') {
            if (result?.code === 'AF') navigation(MAIN_ABSOLUTE_PATH);
            return;
        }

        const { restaurantReservationList } = result as GetReservationListResponseDto;
        changeRestaurantReservationList(restaurantReservationList);

        setCurrentPage(!restaurantReservationList.length ? 0 : 1);
        setCurrentSection(!restaurantReservationList.length ? 0 : 1);
    };

    // event handler //
    const onPageClickHandler = (page: number) => {
        setCurrentPage(page);
    };

    const onPreSectionClickHandler = () => {
        if (currentSection <= 1) return;
        setCurrentSection(currentSection - 1);
        setCurrentPage((currentSection - 1) * COUNT_PER_SECTION);
    };

    const onNextSectionClickHandler = () => {
        if (currentSection === totalSection) return;
        setCurrentSection(currentSection + 1);
        setCurrentPage(currentSection * COUNT_PER_SECTION + 1);
    };

    // effect //
    useEffect(() => {
        loginUserRole === "ROLE_USER" ? 
        GetUserReservationListRequest(cookies.accessToken)
            .then(GetReservationListResponse):
        GetCeoReservationListRequest(cookies.accessToken)
            .then(GetReservationListResponse)
        ;
    }, []);

    useEffect(() => {
        if (!restaurantReservationList.length) return;
        changePage(restaurantReservationList, totalLenght);
    }, [currentPage]);

    useEffect(() => {
        if (!restaurantReservationList.length) return;
        changeSection(totalPage);
    }, [currentSection]);

    // render //

    return (
        <div id='reservation-list-wrapper'>
            <div className='reservation-list-top'>예약 내역</div>
            <div className='reservation-list-top-box'>
                <div className='reservation-list-size-text'>전체<span className='emphasis'> {totalLenght}건</span> | 페이지 <span className='emphasis'>{currentPage}/{totalPage}</span></div>
            </div>
            <div className='reservation-list-table'>
                <div className='reservation-list-table-top'>
                    <div className='reservation-list-table-reservation-number'>예약 번호</div>
                    <div className='reservation-list-table-reservation-status'>예약 상태</div>
                    <div className='reservation-list-table-reservation-restaurant-name'>식당 이름</div>
                    <div className='reservation-list-table-reservation-restaurant-location'>식당 위치</div> 
                    <div className='reservation-list-table-reservation-date'>예약일</div>
                    <div className='reservation-list-table-reservation-time'>예약시간</div>
                    <div className='reservation-list-table-reservation-people'>인원</div>
                    <div className='reservation-list-table-reservation-user-name'>예약자</div>
                </div>
                {viewList.map(item => <ListItem {...item} />)}
            </div>
            <div className='reservation-list-bottom'>
                <div className='reservation-list-pagenation'>
                    <div className='reservation-list-page-left' onClick={onPreSectionClickHandler}></div>
                    <div className='reservation-list-page-box'>
                        {pageList.map(page => page === currentPage ?
                            <div className='reservation-list-page-active'>{page}</div> :
                            <div className='reservation-list-page' onClick={() => onPageClickHandler(page)}>{page}</div>
                        )}
                    </div>
                    <div className='reservation-list-page-right' onClick={onNextSectionClickHandler}></div>
                </div>
            </div>
        </div>
    );
}
