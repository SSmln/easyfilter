import React, { useState, useMemo } from "react";
import { Input, Tree } from "antd";
import type { TreeDataNode, TreeProps } from "antd";
import "@ant-design/v5-patch-for-react-19";

const { Search } = Input;

// 기본 데이터
const defaultData: TreeDataNode[] = [
  {
    title: "과학기술정보통신부",
    key: "0-4",
    children: [
      { title: "국가과학기술연구회", key: "TB_0001" },
      { title: "한국과학기술연구원", key: "TB_0002" },
      { title: "국가녹색기술연구소", key: "TB_0003" },
      { title: "한국기초과학지원연구원", key: "TB_0004" },
      { title: "한국핵융합에너지연구원", key: "TB_0005" },
    ],
  },
  {
    title: "중소벤처기업부",
    key: "0-5",
    children: [
      { title: "중기부 1", key: "0-1-0-0" },
      { title: "중기부 2", key: "0-1-0-1" },
      { title: "중기부 3", key: "0-1-0-2" },
    ],
  },
];

// 부모 키 찾기
const getParentKey = (
  key: React.Key,
  tree: TreeDataNode[]
): React.Key | null => {
  let parentKey: React.Key | null = null;
  for (const node of tree) {
    if (node.children) {
      if (node.children.some((item) => item.key === key)) {
        parentKey = node.key;
      } else {
        const foundKey = getParentKey(key, node.children);
        if (foundKey) parentKey = foundKey;
      }
    }
  }
  return parentKey;
};

// 트리 검색 컴포넌트
const TreeSearch: React.FC = () => {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  console.log(checkedKeys);
  // 체크박스 선택 이벤트 핸들러
  const onCheck: TreeProps["onCheck"] = (checkedKeysValue) => {
    setCheckedKeys(checkedKeysValue as React.Key[]);
  };

  // 노드 선택 이벤트 핸들러
  const onSelect: TreeProps["onSelect"] = (selectedKeysValue, info) => {
    setSelectedKeys(selectedKeysValue);
  };

  // 트리 확장 이벤트 핸들러
  const onExpand = (newExpandedKeys: React.Key[]) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };

  // 검색 이벤트 핸들러
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchValue(value);
    setAutoExpandParent(true);
  };

  // 필터링된 트리 데이터 생성
  const filteredTreeData = useMemo(() => {
    const filterTree = (data: TreeDataNode[]): TreeDataNode[] => {
      return data
        .map((node) => {
          const match = node.title.includes(searchValue);
          if (match) return node; // 키워드 일치 노드 포함
          if (node.children) {
            const filteredChildren = filterTree(node.children);
            if (filteredChildren.length > 0) {
              // 자식이 일치하면 부모 포함
              onExpand([node.key as React.Key]);
              return { ...node, children: filteredChildren };
            }
          }
          return null;
        })
        .filter(Boolean) as TreeDataNode[]; // 빈 값 제거
    };

    return searchValue ? filterTree(defaultData) : defaultData;
  }, [searchValue]);

  return (
    <div>
      <Search
        style={{ marginBottom: 8 }}
        placeholder="Search"
        onChange={onChange}
      />
      <Tree
        checkable
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        onCheck={onCheck}
        checkedKeys={checkedKeys}
        onSelect={onSelect}
        selectedKeys={selectedKeys}
        treeData={filteredTreeData} // 필터링된 트리 데이터 적용
      />
    </div>
  );
};

export default TreeSearch;
