"use client";
import React, { useEffect, useState } from "react";
import { Tree } from "antd";
import type { TreeDataNode, TreeProps } from "antd";

const treeData: TreeDataNode[] = [
  {
    title: "과학기술정보통신부",
    key: "M01",
    children: [
      { title: "국가과학기술연구회", key: "A001" },
      { title: "한국과학기술연구원", key: "A002" },
      { title: "국가녹색기술연구소", key: "A003" },
      { title: "한국기초과학지원연구원", key: "A004" },
      { title: "한국핵융합에너지연구원", key: "A005" },
    ],
  },
  {
    title: "중소벤처기업부",
    key: "M02",
    children: [
      { title: "중기부 1", key: "B001" },
      { title: "중기부 2", key: "B002" },
      { title: "중기부 3", key: "B003" },
    ],
  },
];

export const TreeView: React.FC = () => {
  // 상태 관리
  const [tree, setTree] = useState<TreeDataNode[]>(treeData);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [input, setInput] = useState<string>("");

  const [tempCheckKeys, setTempCheckKeys] = useState([]);
  const [prevCheckedKeys, setPrevCheckedKeys] = useState([]);

  console.log(tempCheckKeys, "tempCheckKeys");
  console.log(checkedKeys, "checkedKeys");
  console.log(prevCheckedKeys, "prevCheckedKeys");

  // 트리 확장 이벤트 핸들러
  const onExpand: TreeProps["onExpand"] = (expandedKeysValue) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  // 체크박스 선택 이벤트 핸들러
  const onCheck: TreeProps["onCheck"] = (checkedKeysValue) => {
    setCheckedKeys(checkedKeysValue as React.Key[]);
    const lastIndex = checkedKeysValue.length - 1;
    setTempCheckKeys((prev) => [...prev, checkedKeysValue[lastIndex]]);
    setPrevCheckedKeys(checkedKeysValue[lastIndex]);
  };

  // 노드 선택 이벤트 핸들러
  const onSelect: TreeProps["onSelect"] = (selectedKeysValue, info) => {
    setSelectedKeys(selectedKeysValue);

    console.log(selectedKeysValue, "selectedKeysValue");
  };

  // 필터링 함수
  const handleFilter = (nodes: TreeDataNode[], query: string) => {
    return nodes
      .map((node) => {
        // 자식 필터링
        const filteredChildren = node.children
          ? handleFilter(node.children, query)
          : [];

        // 현재 노드가 검색어와 일치하거나 자식 노드가 존재하면 포함
        if (node.title.includes(query) || filteredChildren.length > 0) {
          return { ...node, children: filteredChildren };
        }
        return null; // 제외
      })
      .filter(Boolean) as TreeDataNode[]; // null 값 제거
  };

  // 검색 처리 및 상태 반영
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (input.trim() === "") {
        // 입력값 없을 때 전체 트리 복구
        setTree(treeData);
      } else {
        const filteredTree = handleFilter(treeData, input);
        setTree(filteredTree); // 필터링 결과 반영
      }
    }, 300); // 디바운싱 적용 (300ms)

    return () => clearTimeout(delaySearch); // 클린업
  }, [input]); // input 변경 시 동작

  return (
    <div className="p-4">
      <label className="block mb-2">
        <p className="font-medium mb-1">검색</p>
        <input
          placeholder="검색어 입력"
          onChange={(e) => setInput(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </label>

      <Tree
        checkable
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        onCheck={onCheck}
        checkedKeys={checkedKeys}
        onSelect={onSelect}
        selectedKeys={selectedKeys}
        treeData={tree} // 필터링된 트리 데이터 적용
      />
    </div>
  );
};

export default TreeView;
