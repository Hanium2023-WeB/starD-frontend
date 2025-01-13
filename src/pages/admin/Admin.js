import React, { useState } from "react";
import Header from "../../components/repeat_etc/Header";
import AdminCategory from "../../components/repeat_etc/AdminCategory";

import "../../css/admin_css/Admin.css"
import MemberManagement from "./MemberManagement";
import ReportManagement from "./ReportManagement";
import FAQManagement from "./FAQManagement";

const Admin = () => {
    const [currentCategory, setCurrentCategory] = useState("memberManagement");

    const handleCategoryChange = (category) => {
        setCurrentCategory(category);
    };

    // 선택된 카테고리에 따라 다른 내용 렌더링
    const renderContent = () => {
        switch (currentCategory) {
            case "memberManagement":
                return <MemberManagement />;
            case "reportManagement":
                return <ReportManagement />;
            case "faqManagement":
                return <FAQManagement />;
            default:
                return null;
        }
    };
    {renderContent()}

    return (
        <div>
            <Header showSideCenter={true}/>
            <div className="container admin_container">
                <h1 className="admin">⚠️ 관리자 페이지</h1>
                <div className="admin_body">
                    <AdminCategory onCategoryChange={handleCategoryChange}/>
                </div>
            </div>
        </div>
    );
}

export default Admin;
