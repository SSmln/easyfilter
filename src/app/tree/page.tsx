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
  const [input, setInput] = useState<string>("");
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [tempCheckKeys, setTempCheckKeys] = useState<TreeDataNode[]>([]);
  const [prevCheckedKeys, setPrevCheckedKeys] = useState("");

  // console.log(prevCheckedKeys, "prevCheckedKeys");
  console.log(tempCheckKeys, "tempCheckKeys1");
  console.log(checkedKeys, "checkedKeys");
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (input.trim() === "") {
        setTree(treeData);
      } else {
        const filteredTree = handleFilter(treeData, input);
        setTree(filteredTree);
      }
    }, 150);

    if (input.length > 0) {
      setAutoExpandParent(true);
    }
    // if (prevCheckedKeys !== "" && tempCheckKeys.length > 0) {
    //   const currentAllKeys = getCurrentAllKeys(tempCheckKeys);

    //   setCheckedKeys(currentAllKeys);
    // }
    return () => clearTimeout(delaySearch);
  }, [input]); // input 변경 시 동작

  // console.log(tempCheckKeys, "tempCheckKeys-root");
  const getCurrentAllKeys = (tempCheckKeys) => {
    let allKeys = [];
    const lastIndex = tempCheckKeys.length - 1;
    if (lastIndex < 0) return [];
    if (lastIndex === 0) {
      const allKeys = tempCheckKeys.map((keys) => {
        return keys;
      });
      return allKeys;
    } else {
      // let allKeys = [];
      for (let i = 0; i < tempCheckKeys.length; i++) {
        console.log(tempCheckKeys[i], "tempCheckKeys[i]");
        allKeys = allKeys.concat(tempCheckKeys[i]);
      }
      return allKeys;
    }
  };

  const onExpand: TreeProps["onExpand"] = (expandedKeysValue) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  // 체크박스 선택 이벤트 핸들러
  const onCheck: TreeProps["onCheck"] = (checkedKeysValue) => {
    const lastIndex = checkedKeysValue.length - 1;
    // if (
    //   checkedKeysValue[lastIndex].includes("M") &&
    //   checkedKeysValue.length > 0

    // ) {
    //   checkedKeysValue.pop();
    //   setCheckedKeys(checkedKeysValue as React.Key[]);
    //   setTempCheckKeys(checkedKeysValue as React.Key[]);
    // }
    // setTempCheckKeys(checkedKeysValue as React.Key[]);
    setCheckedKeys(checkedKeysValue as React.Key[]);
  };

  // // 체크박스 선택 이벤트 핸들러
  // const onCheck: TreeProps["onCheck"] = (checkedKeysValue) => {
  //   setCheckedKeys(checkedKeysValue as React.Key[]);

  // const currentAllKeys = getCurrentAllKeys(tempCheckKeys);
  // setPrevCheckedKeys("");
  // const lastIndex = checkedKeysValue.length - 1;
  // if (
  //   checkedKeysValue[lastIndex].includes("M") &&
  //   checkedKeysValue.length > 1
  // ) {
  //   checkedKeysValue.pop();
  //   setData(checkedKeysValue);
  // } else {
  //   setData(checkedKeysValue);
  // }
  // function setData(checkedKeysValue) {
  //   if (checkedKeysValue.length > 0) {
  //     setPrevCheckedKeys(checkedKeysValue as React.Key[]);
  //   } else {
  //     setPrevCheckedKeys(checkedKeysValue[lastIndex]);
  //   }
  //   setTempCheckKeys((prev) => [...prev, checkedKeysValue as React.Key[]]);
  // }
  // };

  // 노드 선택 이벤트 핸들러
  const onSelect: TreeProps["onSelect"] = (selectedKeysValue, info) => {
    setSelectedKeys(selectedKeysValue);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setInput(value);

    if (value.length > 0) {
      const keysToExpand = findKeysStartingWithM(treeData);
      setExpandedKeys(keysToExpand);
    } else {
      setExpandedKeys([]);
    }
    setAutoExpandParent(true);
  };

  const findKeysStartingWithM = (data: any[]): React.Key[] => {
    let keys: React.Key[] = [];
    data.forEach((node) => {
      if (node.key.startsWith("M")) {
        keys.push(node.key);
      }
      if (node.children) {
        keys = keys.concat(findKeysStartingWithM(node.children));
      }
    });
    return keys;
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

  return (
    <div className="p-4">
      <label className="block mb-2">
        <p className="font-medium mb-1">검색</p>
        <input
          placeholder="검색어 입력"
          onChange={onChange}
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
