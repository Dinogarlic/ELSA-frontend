import React, { useState, useEffect, useRef } from "react";
import NonmemberResultAPI from "../apis/NonmemberResultAPI";
import HomepageLayout from "../components/HomepageLayout";
import Menu from "../components/Menu";
import { Header, Title, Content } from "../components/Header";
import BlueCurve from "../components/BlueCurve";
import OrangeLinkButton from "../components/OrangeLinkButton";
import Footer from "../components/Footer";
import styled from "styled-components";
import { color } from "../color";

import { Chart, registerables } from "chart.js";
import { Doughnut, Bar, Radar } from "react-chartjs-2";
Chart.register(...registerables);

// Doughnut 차트 컴포넌트
const ScoreDoughnutChart = ({ correctAnswer }) => {
  const score = parseInt(correctAnswer.split("/")[0], 10); // 정답 수
  const total = parseInt(correctAnswer.split("/")[1], 10); // 전체 문제 수
  const incorrect = total - score; // 틀린 문제 수

  const data = {
    labels: ["정답 수", "점검이 필요한 문제 수"],
    datasets: [
      {
        data: [score, incorrect],
        backgroundColor: [color.primary, color.accent],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // 비율 유지 안 함
  };

  return (
    <div style={{ position: "relative", width: "20rem", height: "20rem" }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

// 누적 막대 차트 컴포넌트 (Stacked Bar Chart)
const StackedBarChart = ({ standardScoreList }) => {
  const labels = standardScoreList.map((item) => item.standardName);
  const scores = standardScoreList.map((item) => item.score);
  const maxScores = standardScoreList.map((item) => item.maxScore || 5); // 각 항목의 만점

  // 비율 계산
  const normalizedScores = scores.map(
    (score, index) => (score / maxScores[index]) * 100
  );

  const data = {
    labels,
    datasets: [
      {
        label: "점수 비율",
        data: normalizedScores,
        backgroundColor: "#FF6384",
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        max: 100, // 최대 100%로 설정
        ticks: {
          callback: function (value) {
            return value + "%"; // 백분율 표시
          },
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

// 레이더 차트 컴포넌트 (Normalized Radar Chart)
const NormalizedRadarChart = ({ standardScoreList }) => {
  const labels = standardScoreList.map((item) => item.standardName);
  const scores = standardScoreList.map((item) => item.score);
  const maxScores = standardScoreList.map((item) => item.maxScore || 5); // 각 항목의 만점

  // 비율 계산
  const normalizedScores = scores.map(
    (score, index) => (score / maxScores[index]) * 100
  );

  const data = {
    labels,
    datasets: [
      {
        label: "점수 비율",
        data: normalizedScores,
        backgroundColor: "rgba(54, 162, 235, 0.5)", // 차트의 배경색
        borderColor: "rgba(54, 162, 235, 1)", // 선 색
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      r: {
        min: 0,
        max: 100, // 최대 점수 100으로 설정
        ticks: {
          stepSize: 20,
        },
      },
    },
  };

  return <Radar data={data} options={options} />;
};

// 질문 결과 바 차트 컴포넌트
const QuestionsBarChart = ({ noOrNotApplicableList }) => {
  const labels = noOrNotApplicableList.map((item) => item.standardName);
  const noAnswers = noOrNotApplicableList.map(
    (item) => item.qnaPairDtoList.filter((q) => q.answer === "NO").length
  );
  const notApplicableAnswers = noOrNotApplicableList.map(
    (item) =>
      item.qnaPairDtoList.filter((q) => q.answer === "NOT_APPLICABLE").length
  );

  const data = {
    labels,
    datasets: [
      {
        label: "NO 응답",
        data: noAnswers,
        backgroundColor: "#FF6384",
      },
      {
        label: "NOT APPLICABLE 응답",
        data: notApplicableAnswers,
        backgroundColor: "#36A2EB",
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={data} options={options} />;
};

const AITestResult = () => {
  const [resultData, setResultData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await NonmemberResultAPI();
      return response.data.data;
    } catch (error) {
      console.error(
        "비회원의 인공지능 개발 윤리 검사 결과 데이터를 가져오는 중 오류가 발생했습니다.",
        error
      );
      throw error;
    }
  };

  const getResultData = async () => {
    const localStorageData = localStorage.getItem("resultData");

    if (localStorageData) {
      console.log("로컬 스토리지에서 데이터를 가져왔습니다.");
      setResultData(JSON.parse(localStorageData));
    } else {
      try {
        const apiData = await fetchData();
        setResultData(apiData);
        localStorage.setItem("resultData", JSON.stringify(apiData));
      } catch (error) {
        console.error("데이터를 가져오는 중 오류가 발생했습니다.", error);
      }
    }
  };

  useEffect(() => {
    getResultData();
  }, []);

  const totalScore = resultData?.totalScoreDto.scoreRatio; // 총점
  const correctAnswer = resultData?.totalScoreDto.scoreRatioString;
  const noOrNotApplicableList = resultData?.noOrNotApplicableList; // 질문 리스트

  return (
    <HomepageLayout>
      <Menu />
      <Header>
        <Title>인공지능 개발 윤리 검사 결과</Title>
      </Header>
      <BlueCurve />
      <BlueContainer>
        <InnerContainer>
          <SubTitle>인공지능 개발 윤리 검사 점수</SubTitle>
          <ScoreContainer>
            <Score>
              {totalScore}점 ({correctAnswer})
            </Score>
            {correctAnswer && (
              <ScoreDoughnutChart correctAnswer={correctAnswer} />
            )}
          </ScoreContainer>

          <SubTitle>인공지능 윤리기준 점검항목 당 점수</SubTitle>
          <Table>
            <TableRow>
              <TableHeader>핵심요건</TableHeader>
              {resultData?.standardScoreList.map((item) => (
                <TableHeader key={item.standardName}>
                  {item.standardName}
                </TableHeader>
              ))}
            </TableRow>
            <TableRow>
              <TableData>점수</TableData>
              {resultData?.standardScoreList.map((item) => (
                <TableData key={item.standardName}>{item.score}</TableData>
              ))}
            </TableRow>
          </Table>
          {/* {resultData?.standardScoreList && (
            <div>
              <StackedBarChart
                standardScoreList={resultData.standardScoreList}
              />
              <NormalizedRadarChart
                standardScoreList={resultData.standardScoreList}
              />
            </div>
          )} */}
        </InnerContainer>
      </BlueContainer>
      <BlueCurveReverse />

      <WhiteContainer>
        <InnerContainer>
          <SubTitle>점검해보아야 할 문항</SubTitle>
          {noOrNotApplicableList &&
            noOrNotApplicableList.map((item) => (
              <StandardAndQuestion key={item.standardName}>
                <StandardContainer>
                  <Standard>{item.standardName}</Standard>
                </StandardContainer>
                <QuestionContainer>
                  {item.qnaPairDtoList.map((qna, index) => (
                    <Question key={index}>{qna.question}</Question>
                  ))}
                </QuestionContainer>
              </StandardAndQuestion>
            ))}
          {/* {noOrNotApplicableList && (
            <QuestionsBarChart noOrNotApplicableList={noOrNotApplicableList} />
          )} */}
        </InnerContainer>
      </WhiteContainer>
      <Footer />
    </HomepageLayout>
  );
};

export default AITestResult;

const BlueCurveReverse = styled.div`
  height: 2rem;
  width: 100%;
  border-radius: 0 0 50% 50%;
  background-color: ${color.primary};
`;

const BlueContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 2rem 0;
  background-color: ${color.primary};
`;

const InnerContainer = styled.div`
  width: 70%;
  padding: 3rem;
  box-sizing: border-box;
  background-color: white;
  border-radius: 3rem;
`;

const SubTitle = styled.h2`
  margin-top: 0;
`;

const ScoreContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  margin: 3rem 0;
`;

const Score = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;

  // 가로 너비에 따라 가로스크롤이 생기도록 함
  // 근데 왜 안 됨?
  //   overflow-x: auto;

  //   @media (max-width: 70vw) {
  //     display: block;
  //     overflow-x: auto;
  //     white-space: nowrap;
  //   }
`;

const TableRow = styled.tr``;

const TableHeader = styled.th`
  border: 0.1rem solid #ddd;
  padding: 0.8rem;
  background-color: #f4f4f4;
  font-weight: bold;
  text-align: center;
  word-break: keep-all;
`;

const TableData = styled.td`
  background-color: white;
  border: 0.1rem solid #ddd;
  padding: 0.8rem;
  text-align: center;
`;

const WhiteContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1rem 0;
`;

const StandardAndQuestion = styled.div`
  margin: 2rem 0;
  border: solid 0.1rem ${color.primary};
  border-radius: 2rem;
`;

const StandardContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem 2rem;
  box-sizing: border-box;
  background-color: ${color.primary};
  border-radius: 1.8rem;
`;

const Standard = styled.h3`
  color: white;
`;

const QuestionContainer = styled.div`
  width: 100%;
  padding: 1rem 2rem;
  box-sizing: border-box;
`;

const Question = styled.p`
  padding-bottom: 1rem;
  border-bottom: solid 0.05rem #ddd;
`;
