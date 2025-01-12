"use client";
import React, { useEffect, useState } from "react";
import { useMemo } from "react";
import { Input, Tree, TreeProps } from "antd";

export const TreeSearchN = ({ filterStack, setFilterStack }) => {
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [checkedKeys, setCheckedKeys] = useState([]);
  console.log(checkedKeys, "checkedKeys");
  // const { Input, Tree } = antd;
  const { Search } = Input;
  // useEffect(() => {
  //   if (checkedKeys.length === 0) {
  //     setFilterStack((prev) => {
  //       return prev.map((t) => {
  //         if (t.title === "departments") {
  //           return { ...t, value: [] }; // 모든 데이터를 포함하도록 설정
  //         }
  //         return t;
  //       });
  //     });
  //   }
  // }, [checkedKeys]);

  const defaultData = [
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

  const generateList = (data) => {
    const result = [];
    const traverse = (nodes) => {
      nodes.forEach((node) => {
        result.push({ key: node.key, title: node.title });
        if (node.children) {
          traverse(node.children);
        }
      });
    };
    traverse(data);
    return result;
  };

  const dataList = generateList(defaultData);

  const getParentKey = (key, tree) => {
    let parentKey;
    tree.forEach((node) => {
      if (node.children) {
        if (node.children.some((item) => item.key === key)) {
          parentKey = node.key;
        } else {
          const result = getParentKey(key, node.children);
          if (result) parentKey = result;
        }
      }
    });
    return parentKey;
  };

  const normalizeText = (text) => text.normalize("NFC").toLowerCase();

  const onSearchChange = (e) => {
    const { value } = e.target;
    const normalizedValue = normalizeText(value);

    const newExpandedKeys = dataList
      .map((item) => {
        if (normalizeText(item.title).includes(normalizedValue)) {
          return getParentKey(item.key, defaultData);
        }
        return null;
      })
      .filter((key, index, self) => key && self.indexOf(key) === index);

    setExpandedKeys(newExpandedKeys);
    setSearchValue(value);
    setAutoExpandParent(true);
  };

  const reorderTreeData = useMemo(() => {
    if (!searchValue) return defaultData; // 검색어가 없으면 기본 데이터 반환

    const normalizedSearch = normalizeText(searchValue);

    const reorder = (nodes) => {
      const matchedParents = [];
      const unmatchedParents = [];

      nodes.forEach((node) => {
        const isMatchedParent = normalizeText(node.title).includes(
          normalizedSearch
        );

        const children = node.children
          ? reorder(node.children) // 자식 노드 재배열
          : [];

        const isMatchedChildren = children.some((child) =>
          normalizeText(child.title).includes(normalizedSearch)
        );

        if (isMatchedParent || isMatchedChildren) {
          matchedParents.push({ ...node, children });
        } else {
          unmatchedParents.push({ ...node, children });
        }
      });

      // 매칭된 부모를 먼저, 매칭되지 않은 부모를 나중에 반환
      return [...matchedParents, ...unmatchedParents];
    };

    return reorder(defaultData);
  }, [searchValue]);

  const treeData = useMemo(() => {
    const loop = (data) =>
      data.map((item) => {
        const normalizedTitle = normalizeText(item.title);
        const normalizedSearch = normalizeText(searchValue);

        const index = normalizedSearch
          ? normalizedTitle.indexOf(normalizedSearch)
          : -1;
        const beforeStr = item.title.substring(0, index);
        const afterStr = item.title.slice(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span
                style={{
                  backgroundColor: "yellow",
                  borderRadius: "4px",
                  padding: "0 2px",
                }}
              >
                {item.title.substring(index, index + searchValue.length)}
              </span>
              {afterStr}
            </span>
          ) : (
            <span>{item.title}</span>
          );
        if (item.children) {
          return { title, key: item.key, children: loop(item.children) };
        }
        return { title, key: item.key };
      });
    return loop(reorderTreeData);
  }, [reorderTreeData, searchValue]);

  const onCheck: TreeProps["onCheck"] = (checkedKeysValue) => {
    setCheckedKeys(checkedKeysValue);

    setFilterStack((prev) => {
      return prev.map((t) => {
        if (t.title === "departments") {
          return { ...t, value: checkedKeysValue };
        }
        return t;
      });
    });
    // }
  };

  const onSelect = (selectedKeys, { node }) => {
    const { key } = node;

    const isChecked = checkedKeys.includes(key);
    const newCheckedKeys = isChecked
      ? checkedKeys.filter((k) => k !== key)
      : [...checkedKeys, key];

    setCheckedKeys(newCheckedKeys);
  };

  return (
    <div>
      <Search
        style={{ marginBottom: 8 }}
        placeholder="검색"
        onChange={onSearchChange}
      />
      <div style={{}}>
        <Tree
          checkable
          treeData={treeData}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          onExpand={(keys) => {
            setExpandedKeys(keys);
            setAutoExpandParent(false);
          }}
          checkedKeys={checkedKeys}
          onCheck={onCheck}
          onSelect={onSelect}
        />
      </div>
    </div>
  );
};

export default TreeSearchN;
