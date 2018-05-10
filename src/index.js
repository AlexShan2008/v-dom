import { createElement, render, renderDom } from './element';
import diff from './diff';
import patch from './patch';

let vertualDOM1 = createElement('ul', { class: 'list' }, [
  createElement('li', { class: 'item' }, ['a']),
  createElement('li', { class: 'item' }, ['b']),
  createElement('li', { class: 'item' }, ['c']),
]);

let vertualDOM2 = createElement('ul', { class: 'list-group' }, [
  createElement('li', { class: 'item' }, ['1']),
  createElement('li', { class: 'item' }, ['b']),
  createElement('div', { class: 'item' }, ['3']),
]);

// DOM Diff 比较两个虚拟DOM的对比
// JS层面的计算
// 作用：更具两个虚拟对象创建出补丁patch对象；描述改变的内容。
// 补丁用来更新DOM节点，完成页面的重新渲染
// 优化策略：
// 1 更新时候只平级比较，不会跨级对比
// 2 同级位置交换，通过key的交换

// 差异计算
// 先序深度优先遍历


// 如果是平级元素有互换，那会导致重新渲染
// 新增节点也不会被更新
// index 

let el = render(vertualDOM1);
renderDom(el, window.root);

// 比较1和2的不同
let patches = diff(vertualDOM1, vertualDOM2);

// 给元素打补丁，重新更新视图；
patch(el,patches)
