import {useEffect} from "react";
import Pagination from "react-js-pagination";
import "./../../css/study_css/Pagination.css"

const Paging = ({page, totalItemCount, totalPages, itemsPerPage, handlePageChange}) => {

  useEffect(() => {
    console.log("현재 페이지:", page);
  }, [page]);

  const handleLocalPageChange = (selectedPage) => {
    handlePageChange(selectedPage);
  };

  return (
      <Pagination
          activePage={page} // 현재 페이지
          itemsCountPerPage={itemsPerPage} // 한 페이지에 표시할 아이템 수
          totalItemsCount={totalItemCount} // 총 아이템 수
          pageRangeDisplayed={totalPages} // 화면에 표시할 페이지 버튼 수
          prevPageText={"‹"} // 이전 버튼 텍스트
          nextPageText={"›"} // 다음 버튼 텍스트
          hideDisabled={false}
          onChange={handleLocalPageChange}/> // 페이지 변경 핸들러
  );
};
export default Paging;