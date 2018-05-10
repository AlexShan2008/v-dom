import { Element, render } from './element';
import * as types from './types';
import setAttr from './setAttr';

let allPatches;
let index = 0;//默认给哪个元素需要打补丁

function patch(node, patches) {
  // node是真实DOM
  // 先遍历整个树，给某个元素打补丁
  allPatches = patches;

  walk(node);
}

function doPatch(node, patches) {
  patches.forEach(patch => {
    switch (patch.type) {
      case types.ATTRS:
        for (let key in patch.attrs) {
          let value = patch.attrs[key];
          if (value) {
            setAttr(node, key, value)
          } else {
            node.removeAttribute(key);
          }
        }

        break;
      case types.TEXT:
        node.textContent = patch.text;
        break;
      case types.REPLACE:
        let newNode = (patch.newNode instanceof Element) ? render(patch.newNode) :
          document.createTextNode(patch.newNode);
        node.parentNode.replaceChild(newNode, node);
        break;
      case types.REMOVE:
        node.parentNode.removeChild(node);
        break;
      default:
        break;
    }
  })
}

function walk(node) {
  let currentPatch = allPatches[index++];
  let childNodes = node.childNodes;
  // 深度先序
  childNodes.forEach(child => (walk(child)));
  if (currentPatch) {
    // 后序打补丁，给孙子打补丁再给父亲打补丁
    doPatch(node, currentPatch);
  }
}

export default patch;