import * as types from './types';

// 先序
// 深度优先
// 平级

// 规则：
// 1. 当节点类型相同时，看属性是否相同，产生一个属性的pathes包{type:'ATTRS',attrs:{calss:'listGroup}}
// 2. 新的DOM节点不存在{type:'REMOVE',index:xxx}
// 3. 节点类型不同，直接采用替换模式{type:'REPLACE',newNode:newNode}
// 4. 文本的变化{type:'TEXT',text:1}

function diff(oldTree, newTree) {
  let patches = {};
  let index = 0;
  // 递归树 比较后的结果放在补丁中
  walk(oldTree, newTree, index, patches);

  return patches;
}
function diffAttr(oldAttrs, newAttrs) {
  let patch = {};
  // 判断新老属性的异同；
  for (let key in oldAttrs) {
    if (oldAttrs[key] !== newAttrs[key]) {
      patch[key] = newAttrs[key];//可能是undefined
    }
  }
  // 新增属性
  for (let key in newAttrs) {
    // 老节点无新节点属性
    if (!oldAttrs.hasOwnProperty(key)) {
      patch[key] = newAttrs[key];
    }
  }

  return patch;
}

let Index = 0;

function diffChildren(oldChildren, newChildren, patches) {
  //比较老的第一个和新的第一个节点
  oldChildren.forEach((child, idx) => {
    // 索引不应该是index
    // index每次传递给walk时index递增
    walk(child, newChildren[idx], ++Index, patches)
  });
}
function isString(node) {
  return Object.prototype.toString.call(node) === '[object String]'
}

function walk(oldNode, newNode, index, patches) {
  // oldNode老对象
  // 先判断node，再判断属性
  let currentPath = [];//每个元素都有一个补丁对象
  // 
  if (!newNode) {
    currentPath.push({ type: types.REMOVE, index })
  } else if (isString(oldNode) && isString(newNode)) {
    // 如果nldNode是字符串
    // 判断文本是否一致
    if (oldNode !== newNode) {
      currentPath.push({ type: types.TEXT, text: newNode })
    }
  } else if (oldNode.type === newNode.type) {
    // oldNode.type 'ul' 
    // 比较属性
    let attrs = diffAttr(oldNode.props, newNode.props);
    if (Object.keys(attrs).length > 0) {
      currentPath.push({ type: types.ATTRS, attrs });
    }
    // 如果有子节点，遍历子节点
    diffChildren(oldNode.children, newNode.children, patches);
  } else {
    // 替换节点
    currentPath.push({ type: types.REPLACE, newNode })
  }

  // 确定有补丁，再更新
  if (currentPath.length > 0) {
    // 将元素和补丁对应起来，放到大补丁包中
    patches[index] = currentPath;
  }
}

export default diff;