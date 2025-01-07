"use client";
import React, { useEffect, useState } from "react";

export const Page = () => {
  const [data, setData] = useState([]);

  const [filterStack, setFilterStack] = useState([
    { id: 0, title: "announcementType", value: "전체" },
    { id: 1, title: "announcementStatus", value: "접수중" },
    { id: 2, title: "departments", value: ["전체"] },
  ]);

  useEffect(() => {
    async function fetchData() {
      const resposne = await fetch("http://localhost:9999/data");
      const data = await resposne.json();
      console.log(data);
      setData(data);
    }
    fetchData();
  }, []);

  // console.log(data);
  return (
    <div>
      <FilterComponent
        filterStack={filterStack}
        setFilterStack={setFilterStack}
      />
      <div className="w-full h-0.5 bg-gray-300 my-6"></div>
      <h1 className="mt-6">
        <p>데이터 정보</p>
        <div className="flex flex-wrap gap-6">
          <FilteredData data={data} filterStack={filterStack} />
        </div>
      </h1>
    </div>
  );
};

export default Page;

const FilteredData = ({ data, filterStack }) => {
  const type = filterStack[0].value;
  const status = filterStack[1].value;
  const department = filterStack[2].value;

  const filteredData = data.filter((e) => {
    return typeFilter(e) && statusFilter(e) && departmentFilter(e);
  });

  function typeFilter(e) {
    if (type === "전체") return e;
    return e.type === type;
  }
  function statusFilter(e) {
    if (status === "전체") return e;
    return e.status === status;
  }
  function departmentFilter(e) {
    if (department.includes("전체")) return e;
    return department.includes(e.categories.main);
  }

  console.log(filteredData);
  return (
    <>
      {filteredData.map((e, id) => (
        <div key={e.id} className="max-w-sm rounded overflow-hidden shadow-lg">
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">{e.title}</div>
            <p className="text-gray-700 text-base">
              <strong>카테고리:</strong> {e.categories.main} {">"}{" "}
              {e.categories.sub} {">"} {e.categories.detail}
            </p>
            <p className="text-gray-700 text-base">
              <strong>위치:</strong> {e.location}
            </p>
            <p className="text-gray-700 text-base">
              <strong>가격:</strong> {e.price.toLocaleString()}원
            </p>
            <p className="text-gray-700 text-base">
              <strong>평점:</strong> {e.rating}
            </p>
            <p className="text-gray-700 text-base">
              <strong>시설:</strong> {e.facilities.join(", ")}
            </p>
            <p className="text-gray-700 text-base">
              <strong>설명:</strong> {e.description}
            </p>
            <p className="text-gray-700 text-base">
              <strong>날짜:</strong> {e.date}
            </p>
          </div>
        </div>
      ))}
    </>
  );
};

const FilterComponent = ({ filterStack, setFilterStack }) => {
  const extractTitles = (data, key) => data[0][key].map((item) => item.title);
  const filterType = extractTitles(filterData, "announcementType");
  const filterStatus = extractTitles(filterData, "announcementStatus");
  const filterDepartment = extractTitles(filterData, "departments");

  function handleFilter(e, title, type) {
    const findIndex = filterStack.findIndex((t) => t.title === type);
    if (findIndex === -1) return;
    if (e.target.checked) {
      console.log("checked");
      if (type === "departments") {
        setFilterStack((prev) => {
          return prev.map((t) => {
            if (t.title === type) {
              return { ...t, value: [...t.value, title] };
            }
            return t;
          });
        });
      } else {
        setFilterStack((prev) => {
          return prev.map((t) => {
            if (t.title === type) {
              return { ...t, value: title };
            }
            return t;
          });
        });
      }
    } else {
      console.log("not checked");
      setFilterStack((prev) => {
        return prev.map((t) => {
          if (t.title === type) {
            return { ...t, value: t.value.filter((v) => v !== title) };
          }
          return t;
        });
      });
    }
  }

  return (
    <div className="space-y-4">
      <p>공고 유형 필터</p>
      <div className="flex ">
        {filterType.map((title, index) => {
          return (
            <label key={index} className="w-full flex items-center space-x-2">
              <input
                type="radio"
                name="announcementType"
                defaultChecked={title === filterType[0]}
                value={title}
                onChange={(e) => {
                  handleFilter(e, title, "announcementType");
                }}
              />
              <span>{title}</span>
            </label>
          );
        })}
      </div>
      <p>공고 상태 필터 </p>
      <div className="flex ">
        {filterStatus.map((title, index) => {
          return (
            <label key={index} className="w-full flex items-center space-x-2">
              <input
                type="radio"
                name="announcementStatus"
                defaultChecked={title === filterStatus[2]}
                value={title}
                onChange={(e) => {
                  handleFilter(e, title, "announcementStatus");
                }}
              />
              <span>{title}</span>
            </label>
          );
        })}
      </div>
      <p>부처 필터</p>
      <div className="grid grid-cols-4 gap-2">
        {filterDepartment.map((title, index) => (
          <label key={index} className="w-full space-x-2">
            <input
              type="checkbox"
              value={title}
              defaultChecked={title === filterDepartment[0]}
              onChange={(e) => {
                handleFilter(e, title, "departments");
              }}
            />
            <span>{title}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

// export default FilterComponent;

const filterData = [
  {
    announcementType: [
      { id: 1, title: "전체" },
      { id: 2, title: "통합공고" },
      { id: 3, title: "개별공고" },
    ],
    announcementStatus: [
      { id: 1, title: "전체" },
      { id: 2, title: "접수예정" },
      { id: 3, title: "접수중" },
      { id: 4, title: "마감" },
    ],
    departments: [
      { id: 1, title: "전체" },
      { id: 2, title: "개인정보보호위원회" },
      { id: 3, title: "경찰청" },
      { id: 4, title: "고용노동부" },
      { id: 5, title: "공정거래위원회" },
      { id: 6, title: "과학기술정보통신부" },
      { id: 7, title: "교육부" },
      { id: 8, title: "국가보훈부" },
      { id: 9, title: "국가유산청" },
      { id: 10, title: "국무조정실" },
      { id: 11, title: "국방부" },
      { id: 12, title: "국토교통부" },
      { id: 13, title: "국회" },
      { id: 14, title: "기상청" },
      { id: 15, title: "기획재정부" },
      { id: 16, title: "농림축산식품부" },
      { id: 17, title: "농촌진흥청" },
      { id: 18, title: "대통령경호처" },
      { id: 19, title: "대통령비서실" },
      { id: 20, title: "문화체육관광부" },
      { id: 21, title: "방송통신위원회" },
      { id: 22, title: "방위사업청" },
      { id: 23, title: "법무부" },
      { id: 24, title: "법제처" },
      { id: 25, title: "보건복지부" },
      { id: 26, title: "산림청" },
      { id: 27, title: "산업통상자원부" },
      { id: 28, title: "소방청" },
      { id: 29, title: "식품의약품안전처" },
      { id: 30, title: "여성가족부" },
      { id: 31, title: "외교부" },
      { id: 32, title: "우주항공청" },
      { id: 33, title: "원자력안전위원회" },
      { id: 34, title: "중소벤처기업부" },
      { id: 35, title: "질병관리청" },
      { id: 36, title: "통계청" },
      { id: 37, title: "통일부" },
      { id: 38, title: "특허청" },
      { id: 39, title: "해양경찰청" },
      { id: 40, title: "해양수산부" },
      { id: 41, title: "행정안전부" },
      { id: 42, title: "환경부" },
      { id: 43, title: "다부처" },
      { id: 44, title: "기타" },
    ],
  },
];
