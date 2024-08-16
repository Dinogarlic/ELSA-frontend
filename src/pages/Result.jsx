import React, { useState } from "react";
import ProjectTitle from "../components/ProjectTitle";
import Sidebar from "../components/Sidebar";
import styled from "styled-components";
import Dashboard from "../components/Dashboard";
import StyledSubtitle from "../components/Subtitle";

const Result = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // 사이드바 열림 상태를 관리하는

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // 사이드바 열림 상태를 토글
  };

  return (
    <MainContainer isSidebarOpen={isSidebarOpen}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <ProjectTitle />
      <Dashboard />
      <DataTable />
    </MainContainer>
  );
};

const DataTable = () => {
  const headers = [
    {
      text: "핵심요건",
      value: "requirements",
    },
    {
      text: "인권보장",
      value: "humanRights",
    },
    {
      text: "프라이버시 보호",
      value: "privacy",
    },
    {
      text: "다양성 존중",
      value: "diversity",
    },
    {
      text: "침해금지",
      value: "infringement",
    },
    {
      text: "공공성",
      value: "publicity",
    },
    {
      text: "연대성",
      value: "solidarity",
    },
    {
      text: "데이터 관리",
      value: "dataManagement",
    },
    {
      text: "책임성",
      value: "responsibility",
    },
    {
      text: "안전성",
      value: "safety",
    },
    {
      text: "투명성",
      value: "transparency",
    },
  ];

  const items = [
    {
      requirements: "문항수",
      humanRights: "1/2",
      privacy: "4/5",
      diversity: "4/5",
      infringement: "3/5",
      publicity: "2/5",
      solidarity: "5/5",
      dataManagement: "4/5",
      responsibility: "5/5",
      safety: "4/5",
      transparency: "5/5",
    },
  ];

  if (!headers || !headers.length) {
    throw new Error("<DataTable /> headers is required.");
  }

  const headerKey = headers.map((header) => header.value);

  return (
    <div>
      <StyledSubtitle>윤리 핵심요건별 점검항목 수</StyledSubtitle>
      <StyledTable>
        <StyledThead>
          <tr>
            {headers.map((header, columnIndex) => (
              <StyledTh key={header.text} isFirstColumn={columnIndex === 0}>
                {header.text}
              </StyledTh>
            ))}
          </tr>
        </StyledThead>
        <StyledTbody>
          {items.map((item, index) => (
            <StyledTr key={index}>
              {headerKey.map((key, columnIndex) => (
                <StyledTd key={key + index} isFirstColumn={columnIndex === 0}>
                  {item[key]}
                </StyledTd>
              ))}
            </StyledTr>
          ))}
        </StyledTbody>
      </StyledTable>
    </div>
  );
};

export default Result;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: ${({ isSidebarOpen }) =>
    isSidebarOpen
      ? "350px"
      : "0"}; /* 사이드바가 열리면 MainContainer가 오른쪽으로 이동 */
  transition: margin-left 0.3s ease;
  margin-bottom: 2rem;
`;

// 스타일드 컴포넌트들
const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const StyledThead = styled.thead`
  background-color: #f4f4f4;
`;

const StyledTbody = styled.tbody`
  tr:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const StyledTr = styled.tr`
  &:hover {
    background-color: #f4f4f4;
  }
`;

const StyledTh = styled.th`
  padding: 12px;
  border: 1px solid #ddd;
  text-align: center;
  word-break: keep-all;
  background-color: ${({ isFirstColumn }) =>
    isFirstColumn ? "#3333bb" : "white"};
  color: ${({ isFirstColumn }) => (isFirstColumn ? "white" : "black")};
`;

const StyledTd = styled.td`
  padding: 12px;
  border: 1px solid #ddd;
  text-align: center;
  background-color: ${({ isFirstColumn }) =>
    isFirstColumn ? "#3333bb" : "white"};
  color: ${({ isFirstColumn }) => (isFirstColumn ? "white" : "black")};
`;
