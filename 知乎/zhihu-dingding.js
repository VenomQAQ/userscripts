// ==UserScript==
// @name         知乎 · 钉钉样式
// @namespace    https://www.zhihu.com/
// @version      1.5.0
// @description  按钉钉三栏会话重绘知乎：左栏导航、中栏会话、右栏气泡。赞同/评论/打开详情仍点击知乎原按钮。可一键隐藏图片。
// @match        https://www.zhihu.com/*
// @match        https://zhihu.com/*
// @match        https://zhuanlan.zhihu.com/*
// @icon         https://www.zhihu.com/favicon.ico
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  const ROOT = 'zh-dd';
  const HIDE_CLASS = 'zh-dd-hide-img';
  const STYLE_ID = 'zh-dd-style';
  const HIDE_KEY = 'zh-dd-hide-img';
  const MASK_KEY = 'zh-dd-mask-title';
  const COLORS = ['#1A87FF', '#00B578', '#FF8F1F', '#FF4D4F', '#7C5CFF', '#13C2C2', '#EB2F96', '#2F54EB'];

  const FAKE = [
    ['产品需求评审群', '周方杰：收到，但不处理。', '09:32', 3],
    ['采购重构产研测群', '周方杰：这个需求不做，想都别想。', '昨天', 0],
    ['WMS2.0 - 产研测沟通群', '周方杰：我是笨比。', '昨天', 5],
    ['生产环境系统资源监控', '周方杰：KTE没了我可怎么办啊', '周一', 0],
    ['中央库存小分队', '赵敏：[链接] 排期表 v2.3', '上周', 0],
    ['SOM 销售运营系统_产研沟通群', '陈静：@所有人 下午三点对齐', '09:12', 2],
    ['回归范围确认', '刘洋：灰度比例先调到 10%', '08:45', 0],
    ['设计走查', '孙悦：图片 2 张', '周日', 0],
    ['踩坑备忘录', '周杰：这个坑我踩过，别走老路', '周六', 0],
    ['文档更新中心', '吴迪：文档已更新', '周五', 1],
    ['发版窗口确认', '郑爽：明天发版窗口确认一下', '周四', 0],
    ['故障复盘', '冯刚：告警已恢复，复盘跟进中', '周三', 0],
    ['方案选型', '何娟：方案 B 整体成本更低', '周二', 0],
    ['测试用例补充', '罗强：测试用例已补完，可回归', '10:03', 0],
    ['Merge 合并', '林琳：PR 已合并，主干绿了', '周一', 0],
    ['需求回溯', '许峰：回溯会安排在下周一', '上周五', 0]
  ];

  const ICONS = {
    msg: '<svg viewBox="0 0 24 24" fill="none"><path d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v7A2.5 2.5 0 0 1 16.5 16H10l-4.2 3.2A.8.8 0 0 1 4.5 18.6V6.5Z" stroke="currentColor" stroke-width="1.7"/></svg>',
    doc: '<svg viewBox="0 0 24 24" fill="none"><path d="M7 4.5h7l4 4V19a1.5 1.5 0 0 1-1.5 1.5h-9.5A1.5 1.5 0 0 1 5.5 19V6A1.5 1.5 0 0 1 7 4.5Z" stroke="currentColor" stroke-width="1.7"/><path d="M14 4.5V9h4.5" stroke="currentColor" stroke-width="1.7"/></svg>',
    aitable: '<svg viewBox="0 0 24 24" fill="none"><rect x="4" y="4.5" width="16" height="15" rx="2" stroke="currentColor" stroke-width="1.7"/><path d="M4 9.5h16M9.6 9.5v10M15.4 9.5v10" stroke="currentColor" stroke-width="1.7"/></svg>',
    aimic: '<svg viewBox="0 0 24 24" fill="none"><rect x="9" y="3.5" width="6" height="11" rx="3" stroke="currentColor" stroke-width="1.7"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v2.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    work: '<svg viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="7" height="7" rx="1.4" stroke="currentColor" stroke-width="1.7"/><rect x="13" y="4" width="7" height="7" rx="1.4" stroke="currentColor" stroke-width="1.7"/><rect x="4" y="13" width="7" height="7" rx="1.4" stroke="currentColor" stroke-width="1.7"/><rect x="13" y="13" width="7" height="7" rx="1.4" stroke="currentColor" stroke-width="1.7"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none"><rect x="5" y="4" width="14" height="16" rx="2" stroke="currentColor" stroke-width="1.7"/><path d="M9 9h6M9 13h6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    meet: '<svg viewBox="0 0 24 24" fill="none"><path d="M4.5 8.5A2.5 2.5 0 0 1 7 6h6.5A2.5 2.5 0 0 1 16 8.5v7A2.5 2.5 0 0 1 13.5 18H7A2.5 2.5 0 0 1 4.5 15.5v-7Z" stroke="currentColor" stroke-width="1.7"/><path d="M16 10.2l4-2.2v8l-4-2.2" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
    cal: '<svg viewBox="0 0 24 24" fill="none"><rect x="4.5" y="5.5" width="15" height="14" rx="2" stroke="currentColor" stroke-width="1.7"/><path d="M8 4v3M16 4v3M4.5 10h15" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    todo: '<svg viewBox="0 0 24 24" fill="none"><rect x="5" y="4" width="14" height="16" rx="2" stroke="currentColor" stroke-width="1.7"/><path d="M8 9h8M8 13h5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="5" width="16" height="14" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="m6 17 4-4 3 3 3-4 4 5"/></svg>',
    imageOff: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 3l18 18"/><path d="M10.4 10.4a2 2 0 0 0 2.8 2.8"/><path d="M14 14.5 6 21h12a2 2 0 0 0 2-2V9.5"/><path d="M4 16V5a2 2 0 0 1 2-2h10.5"/></svg>',
    mask: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="4" y="4" width="16" height="16" rx="4"/><path d="M8 14c1.2 1.4 2.5 2 4 2s2.8-.6 4-2" stroke-linecap="round"/><circle cx="9" cy="10" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="10" r="1" fill="currentColor" stroke="none"/></svg>',
    refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M20 12a8 8 0 1 1-2.3-5.6"/><path d="M20 4v5h-5"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="1.8"/><path d="M16 16l4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'
  };

  const RAIL = [
    { key: 'msg', label: '消息', icon: 'msg', href: 'https://www.zhihu.com/' },
    { key: 'doc', label: '文档', icon: 'doc', href: 'https://zhuanlan.zhihu.com/' },
    { key: 'table', label: 'AI表格', icon: 'aitable', deco: true },
    { key: 'mic', label: 'AI听记', icon: 'aimic', deco: true },
    { key: 'hot', label: '工作台', icon: 'work', href: 'https://www.zhihu.com/hot' },
    { key: 'follow', label: '通讯录', icon: 'book', href: 'https://www.zhihu.com/follow' },
    { key: 'meet', label: '会议', icon: 'meet', deco: true },
    { key: 'cal', label: '日历', icon: 'cal', deco: true },
    { key: 'todo', label: '待办', icon: 'todo', href: 'https://www.zhihu.com/notifications' }
  ];

  const CSS = `
    html.${ROOT} {
      color-scheme: light !important;
      --dd-blue: #1A87FF;
      --dd-text: #1A1D24;
      --dd-text-2: #4A4F5C;
      --dd-text-3: #8A8F99;
      --dd-bg: #F5F7FB;
      --dd-line: #E6E8EB;
      --dd-hover: #ECF0F7;
      --dd-active: #E4EAF5;
      --dd-header: 0px;
      --dd-rail: 72px;
      --dd-list: 300px;
      --dd-font: "PingFang SC", "Microsoft YaHei", "Helvetica Neue", -apple-system, BlinkMacSystemFont, sans-serif;
    }
    html.${ROOT}, html.${ROOT} body {
      background: #DCE4F9 !important;
      color: var(--dd-text) !important;
      font-family: var(--dd-font) !important;
      color-scheme: light !important;
    }
    html.${ROOT} {
      scrollbar-width: none;
    }
    html.${ROOT}::-webkit-scrollbar { width: 0; height: 0; }
    html.${ROOT} #root {
      z-index: 0 !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }
    html.${ROOT} .zh-dd-lift {
      z-index: 30000 !important;
      opacity: 1 !important;
      pointer-events: auto !important;
      visibility: visible !important;
    }

    .zh-dd-shell, .zh-dd-shell * { box-sizing: border-box; }
    .zh-dd-shell { font-family: var(--dd-font); color: var(--dd-text); }
    /* 知乎会把没写宽高的 svg 拉成整栏大圆，搜索图标会盖住聊天区 */
    html.${ROOT} .zh-dd-shell svg {
      width: 22px !important;
      height: 22px !important;
      max-width: 22px !important;
      max-height: 22px !important;
      flex: 0 0 auto !important;
      position: static !important;
      overflow: hidden !important;
    }
    html.${ROOT} .zh-dd-icon-btn svg,
    html.${ROOT} .zh-dd-composer svg,
    html.${ROOT} .zh-dd-titlebar svg {
      width: 16px !important;
      height: 16px !important;
      max-width: 16px !important;
      max-height: 16px !important;
    }

    .zh-dd-titlebar { display: none !important; }
    .zh-dd-me {
      width: 26px; height: 26px; border: 0; border-radius: 6px;
      background: #1A87FF; color: #fff; font-weight: 700; font-size: 12px;
      cursor: pointer;
    }
    .zh-dd-titlebar-gap { flex: 1; }
    .zh-dd-icon-btn {
      width: 28px; height: 28px; border: 0; border-radius: 6px;
      background: transparent; color: var(--dd-text-2);
      display: grid; place-items: center; cursor: pointer; padding: 0;
    }
    .zh-dd-icon-btn:hover { background: rgba(255,255,255,.7); }
    .zh-dd-icon-btn svg { width: 16px; height: 16px; }
    .zh-dd-icon-btn.is-on { color: var(--dd-blue); background: #E8F3FF; }

    .zh-dd-rail {
      position: fixed; left: 0; top: var(--dd-header); bottom: 0; width: var(--dd-rail);
      z-index: 8500;
      display: flex; flex-direction: column; align-items: center;
      gap: 2px; padding: 8px 0 10px;
      background: linear-gradient(180deg, #D5E0F8 0%, #DCE4F9 100%);
      overflow: auto;
    }
    .zh-dd-rail::-webkit-scrollbar { width: 0; }
    .zh-dd-logo {
      width: 28px; height: 28px; border-radius: 8px; margin-bottom: 6px;
      background: #2F88FF; color: #fff; display: grid; place-items: center;
      font-size: 14px; font-weight: 700; flex-shrink: 0;
    }
    .zh-dd-rail-item {
      width: 60px; min-height: 52px; border: 0; border-radius: 10px;
      background: transparent; color: var(--dd-text-2);
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: 2px; text-decoration: none; cursor: pointer;
      font: 10px/1.15 var(--dd-font); padding: 4px 0;
    }
    .zh-dd-rail-item svg { width: 22px; height: 22px; color: #5B616C; }
    .zh-dd-rail-item:hover { background: rgba(255,255,255,.65); }
    .zh-dd-rail-item.active { background: #fff; color: var(--dd-blue); box-shadow: 0 1px 4px rgba(31,35,41,.06); }
    .zh-dd-rail-item.active svg { color: var(--dd-blue); }

    .zh-dd-list {
      position: fixed; top: var(--dd-header); bottom: 0; left: var(--dd-rail);
      width: var(--dd-list); z-index: 8700;
      background: var(--dd-bg); border-right: 1px solid var(--dd-line);
      display: flex; flex-direction: column;
    }
    .zh-dd-list-head {
      height: 48px; flex-shrink: 0;
      display: flex; align-items: center; gap: 8px;
      padding: 0 8px 0 10px;
    }
    .zh-dd-chips {
      display: inline-flex; align-items: center; gap: 2px;
      background: #E7EAF1; border-radius: 14px; padding: 2px;
    }
    .zh-dd-chip {
      height: 24px; padding: 0 12px; border: 0; border-radius: 12px;
      background: transparent; color: var(--dd-text-2); font: 13px/1 var(--dd-font); cursor: pointer;
    }
    .zh-dd-chip.active { background: #fff; color: var(--dd-text); font-weight: 600; box-shadow: 0 1px 3px rgba(31,35,41,.12); }
    .zh-dd-list-actions { margin-left: auto; display: flex; align-items: center; gap: 2px; }
    .zh-dd-list-body { flex: 1; overflow: auto; }
    .zh-dd-list-body::-webkit-scrollbar { width: 6px; }
    .zh-dd-list-body::-webkit-scrollbar-thumb { background: #D5D8DE; border-radius: 3px; }

    .zh-dd-conv {
      width: 100%; border: 0; background: transparent; text-align: left;
      display: flex; gap: 8px; padding: 8px 10px; cursor: pointer; position: relative;
      font: 13px/1.3 var(--dd-font); color: inherit;
    }
    .zh-dd-conv:hover { background: var(--dd-hover); }
    .zh-dd-conv.active { background: var(--dd-active); }
    .zh-dd-ava {
      width: 44px; height: 44px; border-radius: 8px; flex-shrink: 0; overflow: hidden;
      display: grid; place-items: center; color: #fff; font-size: 16px; font-weight: 700;
    }
    .zh-dd-ava img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .zh-dd-conv-main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
    .zh-dd-conv-top, .zh-dd-conv-bot { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
    .zh-dd-conv-name {
      font-size: 14px; font-weight: 500; color: var(--dd-text);
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .zh-dd-conv-time { font-size: 12px; color: var(--dd-text-3); flex-shrink: 0; }
    .zh-dd-conv-preview {
      font-size: 12px; color: var(--dd-text-3);
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .zh-dd-badge {
      position: absolute; top: 6px; left: 42px;
      min-width: 16px; height: 16px; padding: 0 4px;
      border-radius: 8px; background: #FF4D4F; color: #fff;
      font-size: 10px; font-weight: 700; line-height: 16px; text-align: center;
    }

    .zh-dd-chat {
      position: fixed; top: var(--dd-header); right: 0; bottom: 0;
      left: calc(var(--dd-rail) + var(--dd-list));
      z-index: 8800; background: var(--dd-bg);
      display: flex; flex-direction: column;
    }
    .zh-dd-chat-head {
      height: 56px; flex-shrink: 0;
      display: flex; align-items: center; gap: 10px;
      padding: 0 16px; border-bottom: 1px solid var(--dd-line); background: var(--dd-bg);
    }
    .zh-dd-chat-head.is-hidden { display: none !important; }
    .zh-dd-chat-ava { width: 32px; height: 32px; border-radius: 8px; font-size: 14px; }
    .zh-dd-chat-titles { min-width: 0; flex: 1; }
    .zh-dd-chat-name {
      font-size: 16px; font-weight: 600;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .zh-dd-chat-sub { font-size: 12px; color: var(--dd-text-3); margin-top: 2px; }
    .zh-dd-chat-actions { display: flex; gap: 2px; }
    .zh-dd-feed {
      flex: 1; overflow: auto; padding: 16px 22px 8px;
      display: flex; flex-direction: column; gap: 16px;
    }
    .zh-dd-feed::-webkit-scrollbar { width: 6px; }
    .zh-dd-feed::-webkit-scrollbar-thumb { background: #D5D8DE; border-radius: 3px; }
    .zh-dd-empty { margin: auto; color: var(--dd-text-3); font-size: 13px; text-align: center; }

    .zh-dd-msg { display: flex; gap: 10px; max-width: min(680px, 92%); align-self: flex-start; }
    .zh-dd-msg .zh-dd-ava { width: 36px; height: 36px; border-radius: 8px; font-size: 14px; }
    .zh-dd-msg-col { min-width: 0; display: flex; flex-direction: column; align-items: flex-start; }
    .zh-dd-msg-head { display: flex; align-items: baseline; gap: 8px; margin-bottom: 4px; }
    .zh-dd-msg-name { font-size: 12px; color: var(--dd-text-3); }
    .zh-dd-msg-time { font-size: 11px; color: #B0B4BE; margin-top: 4px; }
    .zh-dd-bubble-row { display: flex; align-items: flex-end; gap: 8px; max-width: 100%; }
    .zh-dd-bubble {
      background: #fff; border-radius: 8px; padding: 10px 12px;
      box-shadow: 0 1px 0 rgba(0,0,0,.03);
      font-size: 14px; line-height: 1.65; color: var(--dd-text);
      word-break: break-word;
    }
    .zh-dd-thumb {
      flex: 0 0 auto;
      display: flex; flex-direction: column; align-items: center; gap: 2px;
      border: 0; background: transparent; padding: 0 0 2px; cursor: pointer;
      color: var(--dd-text-3); font: 11px/1 var(--dd-font);
    }
    html.${ROOT} .zh-dd-shell .zh-dd-thumb svg {
      width: 16px !important; height: 16px !important;
      max-width: 16px !important; max-height: 16px !important;
    }
    .zh-dd-thumb.is-on { color: var(--dd-blue); }
    .zh-dd-thumb[hidden] { display: none !important; }
    .zh-dd-msg.is-active .zh-dd-bubble { box-shadow: 0 0 0 1px var(--dd-blue); }
    .zh-dd-bubble-title {
      display: block; width: 100%; border: 0; background: transparent; padding: 0;
      text-align: left; font: 600 14px/1.5 var(--dd-font); color: var(--dd-text); cursor: pointer;
    }
    .zh-dd-bubble-title:hover { color: var(--dd-blue); }
    .zh-dd-bubble-text { margin-top: 4px; white-space: pre-wrap; }
    .zh-dd-photos { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
    .zh-dd-photos img {
      width: 168px; height: 126px; object-fit: cover; border-radius: 6px;
      cursor: zoom-in; background: #EEF1F6;
    }
    .zh-dd-meta { display: flex; gap: 12px; margin-top: 6px; }
    .zh-dd-meta button {
      border: 0; background: transparent; padding: 0; cursor: pointer;
      font: 12px/1 var(--dd-font); color: var(--dd-text-3);
    }
    .zh-dd-meta button:hover, .zh-dd-meta button.is-on { color: var(--dd-blue); }

    .zh-dd-back {
      border: 0; background: transparent; color: var(--dd-text-2);
      font: 700 18px/1 var(--dd-font); cursor: pointer; padding: 0 2px 0 0;
    }
    .zh-dd-back[hidden] { display: none !important; }
    .zh-dd-detail { display: flex; flex-direction: column; gap: 18px; align-items: flex-start; width: 100%; }
    .zh-dd-pin {
      width: min(720px, 100%);
      background: #fff; border-radius: 8px; padding: 14px 16px 8px;
    }
    .zh-dd-pin-head { display: flex; align-items: center; gap: 10px; }
    .zh-dd-pin-name { font-size: 15px; font-weight: 600; }
    .zh-dd-pin-sub { margin-top: 2px; font-size: 12px; color: var(--dd-text-3); }
    .zh-dd-pin-title { margin-top: 12px; font-size: 16px; font-weight: 600; line-height: 1.5; }
    .zh-dd-pin-body { margin-top: 8px; font-size: 14px; line-height: 1.7; white-space: pre-wrap; }
    .zh-dd-pin-actions {
      margin-top: 12px; padding-top: 10px; border-top: 1px solid var(--dd-line);
      display: flex; gap: 22px;
    }
    .zh-dd-pin-actions button {
      border: 0; background: transparent; padding: 0; cursor: pointer;
      font: 13px/1 var(--dd-font); color: var(--dd-text-3);
    }
    .zh-dd-pin-actions button:hover, .zh-dd-pin-actions button.is-on { color: var(--dd-blue); }
    .zh-dd-comments,
    .zh-dd-answer-comments { background: transparent; }
    .zh-dd-comments { display: flex; flex-direction: column; gap: 14px; width: 100%; }
    .zh-dd-reply {
      margin: 0 0 8px; padding: 2px 8px 2px 8px;
      background: #F2F3F5; border-left: 3px solid var(--dd-blue);
      border-radius: 2px;
      color: var(--dd-text-3); font-size: 13px; line-height: 1.5;
    }
    .zh-dd-reply-tag { color: var(--dd-blue); margin-right: 4px; }
    .zh-dd-reply b { color: var(--dd-text); font-weight: 600; }
    .zh-dd-msg.is-sub { margin-left: 40px; }
    .zh-dd-msg.is-sub .zh-dd-ava { width: 28px; height: 28px; border-radius: 6px; font-size: 12px; }
    .zh-dd-expand {
      display: flex; align-items: center; gap: 8px;
      align-self: flex-start; margin: 2px 0 4px 46px;
      border: 0; background: transparent; cursor: pointer;
      color: var(--dd-text-3); font: 13px/1 var(--dd-font); padding: 0;
    }
    .zh-dd-expand::before {
      content: "";
      width: 22px; height: 1px; background: #D0D3D9; flex-shrink: 0;
    }
    .zh-dd-fold {
      border: 0;
      background: transparent;
      padding: 0;
      cursor: pointer;
      color: var(--dd-text-3);
      font: 13px/1 var(--dd-font);
    }
    .zh-dd-fold:hover { color: var(--dd-blue); }
    .zh-dd-answer-comments { margin-top: 4px; display: flex; flex-direction: column; gap: 14px; background: transparent; }

    .zh-dd-composer {
      flex-shrink: 0; margin: 0 16px 14px; background: #fff; border-radius: 8px;
      border: 1px solid var(--dd-line); display: flex; align-items: center; gap: 8px;
      padding: 8px 8px 8px 12px; overflow: hidden;
    }
    .zh-dd-composer input {
      flex: 1; border: 0; outline: 0; background: transparent;
      font: 14px/1.4 var(--dd-font); color: var(--dd-text);
    }
    .zh-dd-send {
      height: 32px; padding: 0 14px; border: 0; border-radius: 6px;
      background: var(--dd-blue); color: #fff; font: 13px/1 var(--dd-font); cursor: pointer;
    }
    .zh-dd-send:hover { background: #0A6FE0; }

    .zh-dd-toast {
      position: fixed; left: 50%; bottom: 28px; transform: translateX(-50%);
      z-index: 9500; background: rgba(26,29,36,.9); color: #fff;
      font: 13px/1 var(--dd-font); padding: 8px 14px; border-radius: 8px; pointer-events: none;
    }
    .zh-dd-lightbox {
      position: fixed; inset: 0; z-index: 40000;
      background: rgba(0,0,0,.72); display: grid; place-items: center; cursor: zoom-out;
    }
    .zh-dd-lightbox img { max-width: 86vw; max-height: 86vh; border-radius: 8px; cursor: default; }

    html.${ROOT}.${HIDE_CLASS} .zh-dd-photos { display: none !important; }
  `;

  const DEFAULT_GROUP = '产品需求评审群';
  const DEFAULT_MEMBER = '群成员';
  const readIds = new Set();
  const state = {
    chip: 'all',
    activeId: 'channel',
    items: [],
    pin: null,
    openReplies: new Set(),
    comments: [],
    commentKey: '',
    commentStatus: '',
    commentNext: '',
    commentPaging: false,
    showAllAnswers: false,
    focusAnswerId: '',
    answers: [],
    answerKey: '',
    answerStatus: '',
    answerNext: '',
    answerPaging: false,
    inlineAnswerId: '',
    inlineComments: [],
    inlineStatus: '',
    inlineKey: '',
    inlineNext: ''
  };
  let toastTimer = 0;
  let pumpAt = 0;

  function readStorage(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value == null ? fallback : value;
    } catch (err) {
      return fallback;
    }
  }

  function writeStorage(key, value) {
    try { localStorage.setItem(key, value); } catch (err) { /* 无痕模式忽略 */ }
  }

  function imagesHidden() { return readStorage(HIDE_KEY, '1') !== '0'; }
  function maskOn() { return readStorage(MASK_KEY, '1') !== '0'; }

  function escapeHtml(text) {
    return String(text == null ? '' : text).replace(/[&<>"']/g, (ch) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[ch]));
  }

  function hash(text) {
    let n = 0;
    const s = String(text || '');
    for (let i = 0; i < s.length; i++) n = Math.imul(n ^ s.charCodeAt(i), 16777619);
    return n >>> 0;
  }

  function textOf(el) {
    return ((el && (el.innerText || el.textContent)) || '').replace(/\s+/g, ' ').trim();
  }

  function pageKind() {
    const host = location.hostname;
    const path = location.pathname || '/';
    if (host.indexOf('zhuanlan') !== -1) return 'doc';
    if (path.indexOf('/hot') === 0) return 'hot';
    if (path.indexOf('/follow') === 0) return 'follow';
    if (path.indexOf('/notifications') === 0) return 'todo';
    if (path.indexOf('/search') === 0) return 'search';
    return 'msg';
  }

  function pageLabel() {
    const kind = pageKind();
    if (kind === 'doc') return '文档';
    if (kind === 'hot') return '热榜';
    if (kind === 'follow') return '关注';
    if (kind === 'todo') return '通知';
    if (kind === 'search') return '搜索';
    if ((location.pathname || '').indexOf('/question/') === 0) return '帖子详情';
    return '推荐';
  }

  function isDetailPage() {
    const path = location.pathname || '';
    return /\/question\/|\/answer\/|\/pin\/|\/p\//.test(path) || location.hostname.indexOf('zhuanlan') !== -1;
  }

  function channelName() {
    return maskOn() ? DEFAULT_GROUP : pageLabel();
  }

  function questionId() {
    const fromPath = ((location.pathname || '').match(/\/question\/(\d+)/) || [])[1];
    if (fromPath) return fromPath;
    const link = document.querySelector('#root a[href*="/question/"]');
    const matched = link && String(link.href).match(/\/question\/(\d+)/);
    return matched ? matched[1] : '';
  }

  function displayMember(name) {
    const text = String(name || '').trim();
    return !text || text === '知乎用户' ? DEFAULT_MEMBER : text;
  }

  function stripPublishLine(text) {
    return String(text || '')
      .replace(/(^|\n)\s*发布于\s*\d{4}[-/]\d{1,2}[-/]\d{1,2}[^\n]*/g, '$1')
      .trim();
  }

  function countLabel(n) {
    const num = Number(n) || 0;
    if (num >= 10000) {
      const wan = (num / 10000).toFixed(1).replace(/\.0$/, '');
      return wan + ' 万';
    }
    return String(num);
  }

  function injectStyle() {
    let style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement('style');
      style.id = STYLE_ID;
      (document.head || document.documentElement).appendChild(style);
    }
    if (style.textContent !== CSS) style.textContent = CSS;
    document.documentElement.classList.add(ROOT);
    document.documentElement.classList.toggle(HIDE_CLASS, imagesHidden());
  }

  function toast(message) {
    let el = document.querySelector('.zh-dd-toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'zh-dd-toast';
      document.body.appendChild(el);
    }
    el.textContent = message;
    clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => el.remove(), 1600);
  }

  function setFavicon() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#1A87FF';
    ctx.beginPath();
    ctx.moveTo(8, 0);
    ctx.arcTo(32, 0, 32, 32, 8);
    ctx.arcTo(32, 32, 0, 32, 8);
    ctx.arcTo(0, 32, 0, 0, 8);
    ctx.arcTo(0, 0, 32, 0, 8);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('钉', 16, 17);
    let link = document.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      (document.head || document.documentElement).appendChild(link);
    }
    link.href = canvas.toDataURL('image/png');
  }

  function avatarHtml(name, src, small) {
    const ch = (name || '知').trim().slice(0, 1) || '知';
    const bg = COLORS[hash(name) % COLORS.length];
    const cls = small ? 'zh-dd-ava zh-dd-chat-ava' : 'zh-dd-ava';
    if (src && !imagesHidden()) {
      return `<span class="${cls}" style="background:${bg}"><img src="${escapeHtml(src)}" alt="" referrerpolicy="no-referrer"></span>`;
    }
    return `<span class="${cls}" style="background:${bg}">${escapeHtml(ch)}</span>`;
  }

  function cardFromLink(link) {
    let node = link.parentElement;
    let best = null;
    while (node && node.id !== 'root') {
      const count = node.querySelectorAll('a[href*="/question/"], a[href*="/answer/"], a[href*="/pin/"], a[href*="zhuanlan.zhihu.com/p/"]').length;
      if (count > 2) break;
      if ((node.innerText || '').trim().length > 12) best = node;
      node = node.parentElement;
    }
    return best;
  }

  function collectItems() {
    const root = document.getElementById('root') || document.body;
    const links = Array.from(root.querySelectorAll('a[href*="/question/"], a[href*="/answer/"], a[href*="/pin/"], a[href*="zhuanlan.zhihu.com/p/"]'));
    const items = [];
    const seen = new Set();
    links.forEach((link) => {
      if (link.closest('.zh-dd-shell, header, [class*="AppHeader"], [class*="ColumnPageHeader"]')) return;
      const href = (link.href || '').split('#')[0];
      if (!href || seen.has(href)) return;
      const card = cardFromLink(link);
      if (!card) return;
      const item = extractCard(card);
      if (!item) return;
      item.href = link.href;
      item.id = href;
      seen.add(href);
      items.push(item);
    });
    return items;
  }

  function extractCard(el) {
    const cls = String(el.className || '');
    if (/Publish|WriteIndex|Compose|Editor|RichInput|QuestionAsk|TopstoryItem--compose/.test(cls)) return null;
    const link = el.querySelector('a[href*="/question/"], a[href*="/answer/"], a[href*="/p/"], a[href*="/pin/"], a[href*="zhuanlan.zhihu.com"]');
    const titleEl = el.querySelector('h1, h2, [class*="ContentItem-title"], [class*="HotItem-title"], [class*="QuestionHeader-title"], .Post-Title');
    let title = textOf(titleEl) || textOf(link);
    const raw = (el.innerText || '').trim();
    if (!title) {
      title = raw.split('\n').map((line) => line.trim()).filter(Boolean)[0] || '';
    }
    if (!title || title.length < 2) return null;
    const authorEl = el.querySelector('[class*="AuthorInfo-name"], [class*="AuthorInfo"] a, [class*="UserLink"]');
    const author = textOf(authorEl) || '知乎用户';
    const bodyEl = el.querySelector('[class*="RichText"], [class*="RichContent-inner"], [class*="ContentItem-excerpt"], [class*="HotItem-excerpt"], .Post-RichText');
    let body = textOf(bodyEl);
    if (!body) {
      const lines = raw.split('\n').map((line) => line.trim()).filter(Boolean);
      body = lines.slice(1, 6).join('\n');
    }
    if (body === title) body = '';
    const avatar = el.querySelector('[class*="Avatar"] img, img[class*="Avatar"]');
    const avatarSrc = avatar ? (avatar.currentSrc || avatar.src || '') : '';
    const imgs = [];
    el.querySelectorAll('img').forEach((img) => {
      if (img.closest('[class*="Avatar"], [class*="avatar"]')) return;
      const src = img.currentSrc || img.src || '';
      if (!src || src.indexOf('data:') === 0 || /avatar|emoticon/i.test(src)) return;
      const width = img.naturalWidth || img.clientWidth || 0;
      if (width && width < 64) return;
      if (imgs.indexOf(src) === -1) imgs.push(src);
    });
    const video = el.querySelector('video');
    if (video && video.poster && imgs.indexOf(video.poster) === -1) imgs.unshift(video.poster);
    const voteBtn = el.querySelector('[class*="VoteButton"]')
      || Array.from(el.querySelectorAll('button')).find((btn) => /赞同|喜欢/.test(btn.innerText || ''));
    const commentBtn = Array.from(el.querySelectorAll('button')).find((btn) => /评论/.test(btn.innerText || ''));
    const time = textOf(el.querySelector('time, [class*="ContentItem-time"]')).slice(0, 24);
    const href = link ? link.href : '';
    const id = href || ('t' + hash(title + author).toString(36));
    const voted = !!(voteBtn && (/is-active/.test(String(voteBtn.className || '')) || voteBtn.getAttribute('aria-pressed') === 'true'));
    return {
      id, href, title: title.slice(0, 80), author, body: body.slice(0, 1800),
      avatarSrc, imgs: imgs.slice(0, 4), time,
      voteText: textOf(voteBtn) || '赞同',
      commentText: textOf(commentBtn) || '评论',
      voted, el
    };
  }

  function findItem(id) {
    return state.items.find((item) => item.id === id) || null;
  }

  function convHtml(row) {
    const active = row.id === state.activeId ? ' active' : '';
    const badge = row.unread ? `<span class="zh-dd-badge">${row.unread > 99 ? '99+' : row.unread}</span>` : '';
    return `<button type="button" class="zh-dd-conv${active}" data-id="${escapeHtml(row.id)}">
      ${avatarHtml(row.letter || row.name, row.avatar || '')}
      <span class="zh-dd-conv-main">
        <span class="zh-dd-conv-top"><span class="zh-dd-conv-name">${escapeHtml(row.name)}</span><span class="zh-dd-conv-time">${escapeHtml(row.time || '')}</span></span>
        <span class="zh-dd-conv-bot"><span class="zh-dd-conv-preview">${escapeHtml(row.preview || '')}</span></span>
      </span>
      ${badge}
    </button>`;
  }

  function listRows() {
    const rows = [{
      id: 'channel',
      name: channelName(),
      preview: state.items[0] ? (state.items[0].author + '：' + (state.items[0].body || state.items[0].title)).replace(/\s+/g, ' ').slice(0, 42) : '消息同步中',
      time: '现在',
      unread: 0,
      letter: maskOn() ? '需' : pageLabel()
    }];
    if (maskOn()) {
      FAKE.forEach((row, index) => {
        const id = 'fake:' + index;
        if (state.chip === 'unread' && (readIds.has(id) || !row[3])) return;
        rows.push({
          id, name: row[0], preview: row[1], time: row[2],
          unread: readIds.has(id) ? 0 : row[3],
          letter: row[0].slice(0, 1)
        });
      });
      return rows;
    }
    state.items.forEach((item) => {
      const unread = readIds.has(item.id) ? 0 : 1;
      if (state.chip === 'unread' && !unread) return;
      rows.push({
        id: item.id,
        name: item.title,
        preview: (item.author + '：' + (item.body || item.title)).replace(/\s+/g, ' ').slice(0, 42),
        time: item.time,
        unread,
        letter: item.author,
        avatar: item.avatarSrc
      });
    });
    return rows;
  }

  function msgHtml(item) {
    const photos = item.imgs.map((src) => `<img src="${escapeHtml(src)}" alt="" loading="lazy" referrerpolicy="no-referrer" data-act="photo">`).join('');
    const active = item.id === state.activeId ? ' is-active' : '';
    return `<article class="zh-dd-msg${active}" data-id="${escapeHtml(item.id)}">
      ${avatarHtml(item.author, item.avatarSrc)}
      <div class="zh-dd-msg-col">
        <div class="zh-dd-msg-head"><span class="zh-dd-msg-name">${escapeHtml(item.author)}</span><span class="zh-dd-msg-time">${escapeHtml(item.time || '')}</span></div>
        <div class="zh-dd-bubble">
          <button type="button" class="zh-dd-bubble-title" data-act="open">${escapeHtml(item.title)}</button>
          ${item.body ? `<div class="zh-dd-bubble-text">${escapeHtml(item.body)}</div>` : ''}
          ${photos ? `<div class="zh-dd-photos">${photos}</div>` : ''}
        </div>
        <div class="zh-dd-meta">
          <button type="button" data-act="like" class="${item.voted ? 'is-on' : ''}">${escapeHtml(item.voteText || '赞同')}</button>
          <button type="button" data-act="comment">${escapeHtml(item.commentText || '评论')}</button>
          <button type="button" data-act="open">查看详情</button>
        </div>
      </div>
    </article>`;
  }

  function paint(el, html) {
    if (!el || el.dataset.sig === html) return;
    const top = el.scrollTop;
    el.dataset.sig = html;
    el.innerHTML = html;
    el.scrollTop = top;
  }

  function renderList() {
    const body = document.querySelector('.zh-dd-list-body');
    paint(body, listRows().map(convHtml).join(''));
  }

  function renderFeed() {
    const feed = document.querySelector('.zh-dd-feed');
    if (!feed) return;
    if (isDetailPage()) {
      const qid = questionId();
      if (state.answerKey && state.answerKey !== 'q:' + qid) {
        state.showAllAnswers = false;
        state.focusAnswerId = '';
        state.inlineAnswerId = '';
        state.inlineComments = [];
        state.answers = [];
        state.answerStatus = '';
        state.answerNext = '';
      }
      if (state.showAllAnswers) {
        loadAnswers(false);
        paint(feed, answersHtml());
      } else {
        loadRootComments(false);
        paint(feed, detailHtml());
      }
      return;
    }
    state.showAllAnswers = false;
    state.inlineAnswerId = '';
    state.pin = null;
    if (!state.items.length) {
      paint(feed, '<div class="zh-dd-empty">正在同步消息…</div>');
      return;
    }
    paint(feed, state.items.map(msgHtml).join(''));
  }

  function focusContent() {
    const root = document.getElementById('root');
    if (!root) return null;
    const answerId = (location.pathname.match(/\/answer\/(\d+)/) || [])[1];
    if (answerId) {
      const link = root.querySelector('a[href*="/answer/' + answerId + '"]');
      if (link) return cardFromLink(link) || link.parentElement;
    }
    if (location.hostname.indexOf('zhuanlan') !== -1) {
      return root.querySelector('.Post-content, [class*="Post-RichText"]') || root.querySelector('article');
    }
    const answer = root.querySelector('[class*="AnswerItem"] a[href*="/answer/"], [class*="List-item"] a[href*="/answer/"]');
    if (answer) return cardFromLink(answer) || answer.parentElement;
    const pin = root.querySelector('[class*="PinItem"], [class*="Post-content"]');
    return pin || null;
  }

  function commentTarget() {
    if (state.focusAnswerId) return { type: 'answers', id: String(state.focusAnswerId) };
    const path = location.pathname || '';
    const answerInPath = path.match(/\/answer\/(\d+)/);
    if (answerInPath) return { type: 'answers', id: answerInPath[1] };
    const article = path.match(/\/p\/(\d+)/);
    if (article) return { type: 'articles', id: article[1] };
    const pin = path.match(/\/pin\/(\d+)/);
    if (pin) return { type: 'pins', id: pin[1] };
    const root = document.getElementById('root');
    if (root) {
      const link = root.querySelector('a[href*="/answer/"]');
      const fromDom = link && String(link.href).match(/\/answer\/(\d+)/);
      if (fromDom) return { type: 'answers', id: fromDom[1] };
    }
    const question = path.match(/\/question\/(\d+)/);
    if (question) return { type: 'questions', id: question[1] };
    return null;
  }

  function xsrf() {
    const matched = document.cookie.match(/(?:^|; )_xsrf=([^;]*)/);
    return matched ? decodeURIComponent(matched[1]) : '';
  }

  function htmlBits(html) {
    const box = document.createElement('div');
    box.innerHTML = String(html || '');
    const imgs = [];
    box.querySelectorAll('img').forEach((img) => {
      const src = img.src || img.getAttribute('src') || '';
      if (src && imgs.indexOf(src) === -1) imgs.push(src);
    });
    return { text: (box.textContent || '').replace(/\s+/g, ' ').trim(), imgs: imgs.slice(0, 4) };
  }

  function formatCommentTime(stamp) {
    const num = Number(stamp);
    if (!num) return '';
    const ms = num > 1e12 ? num : num * 1000;
    const date = new Date(ms);
    if (Number.isNaN(date.getTime())) return '';
    const pad = (n) => (n < 10 ? '0' + n : String(n));
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + ' ' + pad(date.getHours()) + ':' + pad(date.getMinutes());
  }

  function mapApiComment(raw) {
    const row = raw && raw.comment ? raw.comment : raw;
    if (!row) return null;
    const author = (row.author && (row.author.member || row.author.user || row.author)) || {};
    const bits = htmlBits(row.content || row.hot_text || '');
    const kids = (row.child_comments || []).map(mapApiComment).filter(Boolean);
    return {
      id: String(row.id),
      author: author.name || '知乎用户',
      avatarSrc: author.avatar_url || '',
      body: bits.text,
      imgs: bits.imgs,
      time: formatCommentTime(row.created_time || row.created),
      likeText: row.like_count ? ('赞 ' + row.like_count) : '赞',
      likeCount: Number(row.like_count || 0) || 0,
      liked: !!row.liked || !!row.voting,
      moreCount: Number(row.child_comment_count || row.child_comments_count || kids.length) || 0,
      kids: kids
    };
  }

  function findComment(id, list) {
    const rows = list || (state.showAllAnswers ? state.inlineComments : state.comments);
    for (let i = 0; i < rows.length; i++) {
      if (String(rows[i].id) === String(id)) return rows[i];
      const kid = findComment(id, rows[i].kids || []);
      if (kid) return kid;
    }
    return null;
  }

  function applyCommentPage(json, append) {
    const rows = (json && (json.data || json.root_comments) || []).map(mapApiComment).filter((item) => item && (item.body || (item.imgs && item.imgs.length)));
    state.comments = append ? state.comments.concat(rows) : rows;
    const paging = json && json.paging;
    state.commentNext = paging && paging.next && !paging.is_end ? paging.next : '';
    state.commentStatus = state.comments.length ? 'ready' : 'empty';
  }

  function loadRootComments(force) {
    if (!isDetailPage()) return;
    const target = commentTarget();
    if (!target) {
      state.commentStatus = 'empty';
      return;
    }
    const key = target.type + ':' + target.id;
    if (!force && state.commentKey === key && (state.commentStatus === 'loading' || state.commentStatus === 'ready' || state.commentStatus === 'empty' || state.commentStatus === 'error')) return;
    const same = state.commentKey === key;
    state.commentKey = key;
    state.commentStatus = 'loading';
    state.commentNext = '';
    if (force || !same) state.comments = [];
    const primary = 'https://www.zhihu.com/api/v4/comment_v5/' + target.type + '/' + target.id + '/root_comment?order_by=score&limit=20&offset=';
    const legacy = 'https://www.zhihu.com/api/v4/' + target.type + '/' + target.id + '/root_comments?order=normal&limit=20&offset=0&status=open';
    fetch(primary, { credentials: 'include', headers: { accept: 'application/json' } })
      .then((res) => {
        if (!res.ok) throw new Error('primary');
        return res.json();
      })
      .catch(() => fetch(legacy, { credentials: 'include', headers: { accept: 'application/json' } }).then((res) => {
        if (!res.ok) throw new Error('legacy');
        return res.json();
      }))
      .then((json) => {
        if (state.commentKey !== key) return;
        applyCommentPage(json, false);
        renderFeed();
        renderChrome();
      })
      .catch(() => {
        if (state.commentKey !== key) return;
        state.commentStatus = 'error';
        renderFeed();
      });
  }

  function commentBubble(item, sub, parent) {
    const photos = item.imgs.map((src) => `<img src="${escapeHtml(src)}" alt="" loading="lazy" referrerpolicy="no-referrer" data-act="photo">`).join('');
    const quote = sub && parent
      ? `<div class="zh-dd-reply"><span class="zh-dd-reply-tag">回复</span> <b>@${escapeHtml(parent.author)}</b> ${escapeHtml((parent.body || '').replace(/\s+/g, ' ').slice(0, 48))}</div>`
      : '';
    const text = sub ? item.body.replace(/^回复\s*@?\S+\s*/, '') : item.body;
    const THUMB = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M8 11V20H6a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h2Zm0 0 3.2-6.2A2 2 0 0 1 13 3.6V8h5.2a2 2 0 0 1 1.96 2.4l-1.2 6A2 2 0 0 1 17 18h-9"/></svg>';
    const likeBtn = state.hideCommentLike ? '' : `<button type="button" class="zh-dd-thumb${item.liked ? ' is-on' : ''}" data-act="cmt-like" data-cmt="${escapeHtml(item.id)}" title="点赞">${THUMB}${item.likeCount ? `<span>${escapeHtml(String(item.likeCount))}</span>` : ''}</button>`;
    return `<article class="zh-dd-msg${sub ? ' is-sub' : ''}" data-cmt="${escapeHtml(item.id)}">
      ${avatarHtml(item.author, item.avatarSrc)}
      <div class="zh-dd-msg-col">
        <div class="zh-dd-msg-head"><span class="zh-dd-msg-name">${escapeHtml(item.author)}</span></div>
        <div class="zh-dd-bubble-row">
          <div class="zh-dd-bubble">${quote}<div class="zh-dd-bubble-text">${escapeHtml(text)}</div>${photos ? `<div class="zh-dd-photos">${photos}</div>` : ''}</div>
          ${likeBtn}
        </div>
        <div class="zh-dd-msg-time">${escapeHtml(item.time || '')}</div>
      </div>
    </article>`;
  }

  function commentsHtml(list, status) {
    const st = status || state.commentStatus;
    if (st === 'error') {
      return '<button type="button" class="zh-dd-expand" data-act="retry-cmt">评论加载失败，点击重试</button>';
    }
    if (!list.length) {
      return '<div class="zh-dd-empty">' + (st === 'empty' ? '这条暂时没有评论' : '正在加载评论…') + '</div>';
    }
    return list.map((item) => {
      const open = state.openReplies.has(item.id);
      const kids = item.kids || [];
      const visible = open ? kids : kids.slice(0, 1);
      const shown = visible.length;
      const total = Math.max(item.moreCount || 0, kids.length);
      const hidden = Math.max(0, total - shown);
      let html = commentBubble(item, false) + visible.map((kid) => commentBubble(kid, true, item)).join('');
      if (!open && hidden > 0) {
        html += `<button type="button" class="zh-dd-expand" data-act="expand" data-cmt="${escapeHtml(item.id)}">展开 ${hidden} 条回复</button>`;
      }
      return html;
    }).join('');
  }

  function mapAnswer(raw) {
    const row = raw && raw.target ? raw.target : raw;
    if (!row) return null;
    const author = row.author || {};
    const bits = htmlBits(row.excerpt || row.content || '');
    return {
      id: String(row.id),
      author: author.name || DEFAULT_MEMBER,
      avatarSrc: author.avatar_url || '',
      body: bits.text.slice(0, 360),
      imgs: bits.imgs,
      vote: row.voteup_count || 0,
      comments: row.comment_count || 0
    };
  }

  function loadAnswers(force) {
    const qid = questionId();
    if (!qid) {
      state.answerStatus = 'empty';
      return;
    }
    const key = 'q:' + qid;
    if (!force && state.answerKey === key && (state.answerStatus === 'loading' || state.answerStatus === 'ready' || state.answerStatus === 'empty' || state.answerStatus === 'error')) return;
    const same = state.answerKey === key;
    state.answerKey = key;
    state.answerStatus = 'loading';
    state.answerNext = '';
    if (force || !same) state.answers = [];
    const url = 'https://www.zhihu.com/api/v4/questions/' + qid + '/answers?include=data%5B*%5D.content,excerpt,voteup_count,comment_count,author&limit=10&offset=0&platform=desktop&sort_by=default';
    fetch(url, { credentials: 'include', headers: { accept: 'application/json' } })
      .then((res) => {
        if (!res.ok) throw new Error('answers');
        return res.json();
      })
      .then((json) => {
        if (state.answerKey !== key) return;
        const rows = (json.data || []).map(mapAnswer).filter((item) => item && (item.body || item.author));
        state.answers = rows;
        const paging = json.paging;
        state.answerNext = paging && paging.next && !paging.is_end ? paging.next : '';
        state.answerStatus = rows.length ? 'ready' : 'empty';
        renderFeed();
      })
      .catch(() => {
        if (state.answerKey !== key) return;
        state.answerStatus = 'error';
        renderFeed();
      });
  }

  function loadMoreAnswers() {
    if (!state.answerNext || state.answerPaging) return;
    state.answerPaging = true;
    fetch(state.answerNext, { credentials: 'include', headers: { accept: 'application/json' } })
      .then((res) => res.json())
      .then((json) => {
        const rows = (json.data || []).map(mapAnswer).filter((item) => item && (item.body || item.author));
        state.answers = state.answers.concat(rows);
        const paging = json.paging;
        state.answerNext = paging && paging.next && !paging.is_end ? paging.next : '';
        state.answerPaging = false;
        state.answerStatus = state.answers.length ? 'ready' : 'empty';
        renderFeed();
      })
      .catch(() => {
        state.answerPaging = false;
      });
  }

  function loadInlineComments(id, force) {
    const key = 'a:' + id;
    if (!force && state.inlineKey === key && (state.inlineStatus === 'loading' || state.inlineStatus === 'ready' || state.inlineStatus === 'empty' || state.inlineStatus === 'error')) return;
    state.inlineAnswerId = String(id);
    state.inlineKey = key;
    state.inlineStatus = 'loading';
    state.inlineNext = '';
    state.inlineComments = [];
    state.openReplies = new Set();
    renderFeed();
    const primary = 'https://www.zhihu.com/api/v4/comment_v5/answers/' + id + '/root_comment?order_by=score&limit=20&offset=';
    const legacy = 'https://www.zhihu.com/api/v4/answers/' + id + '/root_comments?order=normal&limit=20&offset=0&status=open';
    fetch(primary, { credentials: 'include', headers: { accept: 'application/json' } })
      .then((res) => {
        if (!res.ok) throw new Error('primary');
        return res.json();
      })
      .catch(() => fetch(legacy, { credentials: 'include', headers: { accept: 'application/json' } }).then((res) => {
        if (!res.ok) throw new Error('legacy');
        return res.json();
      }))
      .then((json) => {
        if (state.inlineKey !== key) return;
        const rows = (json.data || json.root_comments || []).map(mapApiComment).filter((item) => item && (item.body || (item.imgs && item.imgs.length)));
        state.inlineComments = rows;
        const paging = json.paging;
        state.inlineNext = paging && paging.next && !paging.is_end ? paging.next : '';
        state.inlineStatus = rows.length ? 'ready' : 'empty';
        renderFeed();
      })
      .catch(() => {
        if (state.inlineKey !== key) return;
        state.inlineStatus = 'error';
        renderFeed();
      });
  }

  function loadMoreInline() {
    if (!state.inlineNext || state.commentPaging) return;
    state.commentPaging = true;
    const key = state.inlineKey;
    fetch(state.inlineNext, { credentials: 'include', headers: { accept: 'application/json' } })
      .then((res) => res.json())
      .then((json) => {
        if (state.inlineKey !== key) return;
        const rows = (json.data || []).map(mapApiComment).filter((item) => item && (item.body || (item.imgs && item.imgs.length)));
        state.inlineComments = state.inlineComments.concat(rows);
        const paging = json.paging;
        state.inlineNext = paging && paging.next && !paging.is_end ? paging.next : '';
        state.commentPaging = false;
        renderFeed();
      })
      .catch(() => {
        state.commentPaging = false;
      });
  }

  function answerCard(item) {
    const photos = (item.imgs || []).map((src) => `<img src="${escapeHtml(src)}" alt="" loading="lazy" referrerpolicy="no-referrer" data-act="photo">`).join('');
    return `<div class="zh-dd-answer-block">
    <article class="zh-dd-pin">
      <div class="zh-dd-pin-head">
        ${avatarHtml(item.author, item.avatarSrc)}
        <div class="zh-dd-pin-name">${escapeHtml(displayMember(item.author))}</div>
      </div>
      ${item.body ? `<div class="zh-dd-pin-body">${escapeHtml(item.body)}</div>` : ''}
      ${photos ? `<div class="zh-dd-photos">${photos}</div>` : ''}
      <div class="zh-dd-pin-actions">
        <button type="button" data-act="answer-like" data-answer="${escapeHtml(item.id)}">赞同 ${escapeHtml(countLabel(item.vote))}</button>
        <button type="button" data-act="answer-open" data-answer="${escapeHtml(item.id)}">${escapeHtml(countLabel(item.comments))} 条评论</button>
        ${state.inlineAnswerId === String(item.id) ? '<button type="button" class="zh-dd-fold" data-act="fold-comments">收起评论</button>' : ''}
      </div>
    </article>
    ${state.inlineAnswerId === String(item.id) ? `<div class="zh-dd-answer-comments">${commentsHtml(state.inlineComments, state.inlineStatus)}</div>` : ''}
  </div>`;
  }

  function answersHtml() {
    if (state.answerStatus === 'error') {
      return '<button type="button" class="zh-dd-expand" data-act="retry-answers">回答加载失败，点击重试</button>';
    }
    if (!state.answers.length) {
      return '<div class="zh-dd-empty">' + (state.answerStatus === 'empty' ? '这个问题还没有回答' : '正在加载全部回答…') + '</div>';
    }
    const title = textOf(document.querySelector('h1, [class*="QuestionHeader-title"]'));
    return `<div class="zh-dd-detail">
      ${title ? `<div class="zh-dd-pin-title">${escapeHtml(title)}</div>` : ''}
      ${state.answers.map(answerCard).join('')}
    </div>`;
  }

  function openAnswerComments(id) {
    state.showAllAnswers = true;
    loadInlineComments(id, state.inlineAnswerId !== String(id));
  }

  function detailHtml() {
    const card = focusContent();
    const pin = card ? extractCard(card) : null;
    const question = textOf(document.querySelector('h1, [class*="QuestionHeader-title"], .Post-Title'));
    if (pin && question && pin.title !== question) {
      pin.body = (pin.body && pin.body.indexOf(pin.title) === 0 ? pin.body : (pin.title + (pin.body ? '\n' + pin.body : '')));
      pin.title = question;
    }
    if (pin) pin.body = stripPublishLine(pin.body);
    state.pin = pin;
    if (!pin) return '<div class="zh-dd-empty">正在打开帖子…</div>';
    const photos = (pin.imgs || []).map((src) => `<img src="${escapeHtml(src)}" alt="" loading="lazy" referrerpolicy="no-referrer" data-act="photo">`).join('');
    const more = questionId()
      ? '<button type="button" data-act="all-answers">查看全部问答</button>'
      : '<button type="button" data-act="open">查看原文</button>';
    return `<div class="zh-dd-detail">
      <section class="zh-dd-pin">
        <div class="zh-dd-pin-head">
          ${avatarHtml(displayMember(pin.author), pin.avatarSrc)}
          <div class="zh-dd-pin-name">${escapeHtml(displayMember(pin.author))}</div>
        </div>
        <div class="zh-dd-pin-title">${escapeHtml(pin.title)}</div>
        ${pin.body ? `<div class="zh-dd-pin-body">${escapeHtml(pin.body)}</div>` : ''}
        ${photos ? `<div class="zh-dd-photos">${photos}</div>` : ''}
        <div class="zh-dd-pin-actions">
          <button type="button" data-act="pin-like" class="${pin.voted ? 'is-on' : ''}">${escapeHtml(pin.voteText || '赞同')}</button>
          <button type="button" data-act="pin-comment">${escapeHtml(pin.commentText || '评论')}</button>
          ${more}
        </div>
      </section>
      <div class="zh-dd-comments">${commentsHtml(state.comments)}</div>
    </div>`;
  }

  function renderChrome() {
    document.querySelectorAll('.zh-dd-rail-item').forEach((item) => {
      item.classList.toggle('active', item.dataset.key === pageKind());
    });
    const head = document.querySelector('.zh-dd-chat-head');
    if (head) head.classList.toggle('is-hidden', !isDetailPage());
    const name = document.querySelector('.zh-dd-chat-name');
    const sub = document.querySelector('.zh-dd-chat-sub');
    const selected = isDetailPage() ? state.pin : findItem(state.activeId);
    if (name) {
      name.textContent = isDetailPage()
        ? (state.showAllAnswers ? '全部回答' : DEFAULT_GROUP)
        : (selected && !maskOn() ? selected.title : channelName());
    }
    if (sub) {
      sub.hidden = !!isDetailPage();
      if (!isDetailPage()) {
        sub.textContent = imagesHidden() ? '图片已隐藏' : (selected ? selected.author : '知乎');
      }
    }
    const back = document.querySelector('.zh-dd-back');
    if (back) back.hidden = !isDetailPage();
    const letter = maskOn() ? '需' : (selected ? selected.author : pageLabel());
    const avaHtml = avatarHtml(letter, selected && !imagesHidden() ? selected.avatarSrc : '', true);
    const holder = document.querySelector('.zh-dd-chat-ava');
    if (holder && holder.dataset.sig !== avaHtml) {
      const wrap = document.createElement('div');
      wrap.innerHTML = avaHtml;
      const next = wrap.firstElementChild;
      if (next) {
        next.dataset.sig = avaHtml;
        holder.replaceWith(next);
      }
    }
    document.querySelectorAll('.zh-dd-chip').forEach((chip) => {
      chip.classList.toggle('active', chip.dataset.chip === state.chip);
    });
    document.querySelectorAll('[data-act="hide"]').forEach((btn) => {
      const hidden = imagesHidden();
      btn.classList.toggle('is-on', hidden);
      btn.innerHTML = hidden ? ICONS.imageOff : ICONS.image;
      btn.title = hidden ? '显示图片' : '隐藏图片';
    });
    const maskBtn = document.querySelector('[data-act="mask"]');
    if (maskBtn) {
      maskBtn.classList.toggle('is-on', maskOn());
      maskBtn.title = maskOn() ? '显示真实标题' : '会话名伪装成工作群';
    }
    const raw = (document.title || '消息').replace(/^钉钉\s*-\s*/, '');
    const next = '钉钉 - ' + (raw || '消息');
    if (document.title !== next) document.title = next;
  }

  function renderAll() {
    state.items = collectItems();
    renderList();
    renderFeed();
    renderChrome();
  }

  function clickNative(el) {
    if (!el) return false;
    el.click();
    return true;
  }

  function openItem(item) {
    if (!item) return;
    const link = item.el && item.el.querySelector('a[href*="/question/"], a[href*="/answer/"], a[href*="/p/"], a[href*="/pin/"], a[href*="zhuanlan.zhihu.com"]');
    if (clickNative(link)) return;
    if (item.href) location.href = item.href;
    else toast('这条没有详情页');
  }

  function likeItem(item) {
    if (!item || !item.el) {
      toast('原页面还没加载出赞同按钮');
      return;
    }
    const btn = item.el.querySelector('[class*="VoteButton--up"], [class*="VoteButton"]')
      || Array.from(item.el.querySelectorAll('button')).find((node) => /赞同|喜欢/.test(node.innerText || ''));
    if (!clickNative(btn)) {
      toast('没有找到赞同按钮');
      return;
    }
    window.setTimeout(renderAll, 350);
  }

  function commentItem(item) {
    if (isDetailPage()) {
      const box = document.querySelector('.zh-dd-comments');
      if (box) box.scrollIntoView({ block: 'start' });
      return;
    }
    openItem(item);
  }

  function expandReplies(id) {
    state.openReplies.add(id);
    const item = findComment(id);
    renderFeed();
    if (!item || item.kids.length >= item.moreCount || item.loadingKids) return;
    item.loadingKids = true;
    fetch('https://www.zhihu.com/api/v4/comment_v5/comment/' + id + '/child_comment?order_by=ts&limit=20&offset=', {
      credentials: 'include',
      headers: { accept: 'application/json' }
    }).then((res) => res.json()).then((json) => {
      item.kids = (json.data || []).map(mapApiComment).filter((row) => row && row.body);
      item.loadingKids = false;
      renderFeed();
    }).catch(() => {
      item.loadingKids = false;
      toast('回复加载失败');
    });
  }

  function likeAnswer(id) {
    fetch('https://www.zhihu.com/api/v4/answers/' + id + '/voters', {
      method: 'POST',
      credentials: 'include',
      headers: { 'content-type': 'application/json', 'x-xsrftoken': xsrf(), accept: 'application/json' },
      body: JSON.stringify({ type: 'up' })
    }).then((res) => {
      if (!res.ok) throw new Error('vote');
      toast('已赞同');
    }).catch(() => toast('赞同失败'));
  }

  function likeComment(id) {
    if (state.hideCommentLike) return;
    const item = findComment(id);
    const liked = !!(item && item.liked);
    const headers = {
      accept: 'application/json',
      'x-requested-with': 'fetch',
      'x-xsrftoken': xsrf()
    };
    const reaction = 'https://www.zhihu.com/api/v4/comment_v5/comment/' + id + '/reaction/like';
    const classic = 'https://www.zhihu.com/api/v4/comments/' + id + '/like';
    fetch(reaction, { method: liked ? 'DELETE' : 'PUT', credentials: 'include', headers })
      .then((res) => {
        if (res.ok) return res;
        return fetch(classic, { method: 'POST', credentials: 'include', headers });
      })
      .then((res) => {
        if (!res || !res.ok) throw new Error('like');
        if (item) {
          item.liked = !liked;
          item.likeCount = Math.max(0, (item.likeCount || 0) + (item.liked ? 1 : -1));
        }
        renderFeed();
      })
      .catch(() => {
        state.hideCommentLike = true;
        renderFeed();
      });
  }

  function selectId(id) {
    state.activeId = id;
    readIds.add(id);
    renderList();
    renderFeed();
    renderChrome();
    const feed = document.querySelector('.zh-dd-feed');
    if (!feed) return;
    if (id === 'channel') {
      feed.scrollTop = 0;
      return;
    }
    const safe = window.CSS && window.CSS.escape ? window.CSS.escape(id) : id.replace(/"/g, '');
    const msg = feed.querySelector('.zh-dd-msg[data-id="' + safe + '"]');
    if (msg) msg.scrollIntoView({ block: 'center' });
  }

  function openPhoto(src) {
    const box = document.createElement('div');
    box.className = 'zh-dd-lightbox';
    box.innerHTML = `<img src="${escapeHtml(src)}" alt="">`;
    box.addEventListener('click', (event) => {
      if (event.target === box) box.remove();
    });
    document.body.appendChild(box);
  }

  function go(href) {
    if (!href) return;
    if (location.href.split('#')[0] === href) {
      state.activeId = 'channel';
      renderAll();
      return;
    }
    location.href = href;
  }

  function search(keyword) {
    const q = (keyword || '').trim();
    if (!q) return;
    location.href = 'https://www.zhihu.com/search?type=content&q=' + encodeURIComponent(q);
  }

  function loadMoreComments() {
    if (!state.commentNext || state.commentPaging) return;
    state.commentPaging = true;
    fetch(state.commentNext, { credentials: 'include', headers: { accept: 'application/json' } })
      .then((res) => res.json())
      .then((json) => {
        applyCommentPage(json, true);
        state.commentPaging = false;
        renderFeed();
      })
      .catch(() => {
        state.commentPaging = false;
      });
  }

  function pumpFeed() {
    const now = Date.now();
    if (now - pumpAt < 900) return;
    pumpAt = now;
    const root = document.scrollingElement || document.documentElement;
    const top = root.scrollHeight;
    root.scrollTop = top;
    window.scrollTo(0, top);
    const host = document.getElementById('root');
    if (host) host.scrollTop = host.scrollHeight;
  }

  function liftModals() {
    document.querySelectorAll('[class*="Modal-wrapper"], [class*="Modal-portal"], [role="dialog"]').forEach((el) => {
      if (el.closest('.zh-dd-shell')) return;
      if (!(el.innerText || '').trim()) return;
      el.classList.add('zh-dd-lift');
      if (el.parentElement !== document.body) document.body.appendChild(el);
    });
  }

  function profileHref() {
    const link = document.querySelector('#root a[href*="/people/"]');
    return link ? link.href : 'https://www.zhihu.com/';
  }

  function ensureShell() {
    if (!document.body || document.querySelector('.zh-dd-shell')) return;
    const shell = document.createElement('div');
    shell.className = 'zh-dd-shell';
    const rail = RAIL.map((item) => {
      const icon = ICONS[item.icon] || '';
      if (item.deco) {
        return `<button type="button" class="zh-dd-rail-item" data-key="${item.key}" data-deco="1">${icon}<span>${item.label}</span></button>`;
      }
      return `<a class="zh-dd-rail-item" data-key="${item.key}" href="${item.href}">${icon}<span>${item.label}</span></a>`;
    }).join('');
    shell.innerHTML = `
      <header class="zh-dd-titlebar">
        <button type="button" class="zh-dd-me" title="我的">我</button>
        <div class="zh-dd-titlebar-gap"></div>
        <button type="button" class="zh-dd-icon-btn" data-act="hide" title="隐藏图片">${ICONS.image}</button>
      </header>
      <nav class="zh-dd-rail" aria-label="钉钉导航"><div class="zh-dd-logo">钉</div>${rail}</nav>
      <section class="zh-dd-list">
        <div class="zh-dd-list-head">
          <div class="zh-dd-chips">
            <button type="button" class="zh-dd-chip active" data-chip="all">消息</button>
            <button type="button" class="zh-dd-chip" data-chip="unread">未读</button>
          </div>
          <div class="zh-dd-list-actions">
            <button type="button" class="zh-dd-icon-btn" data-act="mask" title="会话名伪装成工作群">${ICONS.mask}</button>
            <button type="button" class="zh-dd-icon-btn" data-act="hide" title="隐藏图片">${ICONS.image}</button>
            <button type="button" class="zh-dd-icon-btn" data-act="refresh" title="刷新">${ICONS.refresh}</button>
          </div>
        </div>
        <div class="zh-dd-list-body"></div>
      </section>
      <section class="zh-dd-chat">
        <div class="zh-dd-chat-head">
          <button type="button" class="zh-dd-back" data-act="back" hidden title="返回">‹</button>
          <span class="zh-dd-ava zh-dd-chat-ava" style="background:#1A87FF">知</span>
          <div class="zh-dd-chat-titles">
            <div class="zh-dd-chat-name">消息</div>
            <div class="zh-dd-chat-sub">知乎</div>
          </div>
          <div class="zh-dd-chat-actions">
            <button type="button" class="zh-dd-icon-btn" data-act="refresh" title="刷新">${ICONS.refresh}</button>
            <button type="button" class="zh-dd-icon-btn" data-act="hide" title="隐藏图片">${ICONS.image}</button>
          </div>
        </div>
        <div class="zh-dd-feed"></div>
        <form class="zh-dd-composer">
          ${ICONS.search}
          <input type="search" placeholder="搜索问题、文章" autocomplete="off">
          <button type="submit" class="zh-dd-send">搜索</button>
        </form>
      </section>
    `;
    document.body.appendChild(shell);

    shell.querySelector('.zh-dd-me').addEventListener('click', () => go(profileHref()));
    shell.querySelector('.zh-dd-rail').addEventListener('click', (event) => {
      const deco = event.target.closest('[data-deco]');
      if (deco) {
        event.preventDefault();
        toast('这是钉钉外观，没有对应页面');
        return;
      }
      const link = event.target.closest('a[href]');
      if (!link) return;
      event.preventDefault();
      go(link.href);
    });
    shell.querySelector('.zh-dd-chips').addEventListener('click', (event) => {
      const chip = event.target.closest('[data-chip]');
      if (!chip) return;
      state.chip = chip.dataset.chip;
      renderList();
      renderChrome();
    });
    shell.addEventListener('click', (event) => {
      const act = event.target.closest('[data-act]');
      if (!act || !shell.contains(act)) return;
      const name = act.dataset.act;
      if (name === 'hide') {
        const hidden = !imagesHidden();
        writeStorage(HIDE_KEY, hidden ? '1' : '0');
        document.documentElement.classList.toggle(HIDE_CLASS, hidden);
        renderAll();
        toast(hidden ? '已隐藏图片' : '已显示图片');
        return;
      }
      if (name === 'mask') {
        const on = !maskOn();
        writeStorage(MASK_KEY, on ? '1' : '0');
        state.activeId = 'channel';
        renderAll();
        toast(on ? '会话列表已伪装成工作群' : '会话列表显示真实标题');
        return;
      }
      if (name === 'refresh') {
        state.activeId = 'channel';
        pumpFeed();
        renderAll();
        const feed = document.querySelector('.zh-dd-feed');
        if (feed) feed.scrollTop = 0;
        return;
      }
      if (name === 'back') {
        if (state.showAllAnswers) {
          state.showAllAnswers = false;
          state.inlineAnswerId = '';
          state.inlineComments = [];
          renderAll();
          return;
        }
        if (history.length > 1) history.back();
        else go('https://www.zhihu.com/');
      }
    });
    shell.querySelector('.zh-dd-list-body').addEventListener('click', (event) => {
      const row = event.target.closest('.zh-dd-conv');
      if (!row) return;
      const id = row.dataset.id;
      if (id.indexOf('fake:') === 0) {
        readIds.add(id);
        state.activeId = id;
        renderList();
        renderChrome();
        return;
      }
      selectId(id);
      if (event.detail === 2) openItem(findItem(id));
    });
    shell.querySelector('.zh-dd-feed').addEventListener('click', (event) => {
      const photo = event.target.closest('[data-act="photo"]');
      if (photo && photo.getAttribute('src')) {
        openPhoto(photo.getAttribute('src'));
        return;
      }
      const act = event.target.closest('[data-act]');
      if (!act) return;
      if (act.dataset.act === 'expand') {
        expandReplies(act.dataset.cmt);
        return;
      }
      if (act.dataset.act === 'retry-cmt') {
        if (state.showAllAnswers && state.inlineAnswerId) loadInlineComments(state.inlineAnswerId, true);
        else loadRootComments(true);
        return;
      }
      if (act.dataset.act === 'fold-comments') {
        state.inlineAnswerId = '';
        state.inlineComments = [];
        state.inlineStatus = '';
        state.inlineNext = '';
        renderFeed();
        return;
      }
      if (act.dataset.act === 'all-answers') {
        state.showAllAnswers = true;
        const box = document.querySelector('.zh-dd-feed');
        if (box) box.scrollTop = 0;
        renderAll();
        return;
      }
      if (act.dataset.act === 'retry-answers') {
        loadAnswers(true);
        return;
      }
      if (act.dataset.act === 'answer-open') {
        openAnswerComments(act.dataset.answer);
        return;
      }
      if (act.dataset.act === 'answer-like') {
        likeAnswer(act.dataset.answer);
        return;
      }
      if (act.dataset.act === 'cmt-like') {
        likeComment(act.dataset.cmt);
        return;
      }
      if (act.dataset.act === 'pin-like') {
        likeItem(state.pin);
        return;
      }
      if (act.dataset.act === 'pin-comment') {
        commentItem(state.pin);
        return;
      }
      const msg = event.target.closest('.zh-dd-msg');
      if (!msg) {
        if (act.dataset.act === 'open') openItem(state.pin);
        return;
      }
      const item = findItem(msg.dataset.id);
      if (act.dataset.act === 'like') likeItem(item);
      else if (act.dataset.act === 'comment') commentItem(item);
      else if (act.dataset.act === 'open') openItem(item);
    });
    shell.querySelector('.zh-dd-feed').addEventListener('scroll', (event) => {
      const el = event.currentTarget;
      if (el.scrollHeight - el.scrollTop - el.clientHeight < 240) {
        if (isDetailPage() && state.showAllAnswers) {
          if (state.inlineAnswerId && state.inlineNext) loadMoreInline();
          else loadMoreAnswers();
        } else if (isDetailPage()) loadMoreComments();
        else pumpFeed();
      }
    });
    shell.querySelector('.zh-dd-composer').addEventListener('submit', (event) => {
      event.preventDefault();
      const input = event.currentTarget.querySelector('input');
      search(input.value);
    });
  }

  function watch() {
    let timer = 0;
    const observer = new MutationObserver(() => {
      if (timer) return;
      timer = window.setTimeout(() => {
        timer = 0;
        liftModals();
        renderAll();
      }, 400);
    });
    const start = () => {
      const host = document.getElementById('root') || document.body;
      if (!host) {
        requestAnimationFrame(start);
        return;
      }
      observer.observe(host, { childList: true, subtree: true });
    };
    start();
  }

  function patchHistory() {
    if (patchHistory.done) return;
    patchHistory.done = true;
    ['pushState', 'replaceState'].forEach((name) => {
      const raw = history[name];
      history[name] = function () {
        const result = raw.apply(this, arguments);
        window.setTimeout(renderAll, 50);
        return result;
      };
    });
    window.addEventListener('popstate', () => window.setTimeout(renderAll, 50));
  }

  function boot() {
    injectStyle();
    setFavicon();
    patchHistory();
    if (!document.body) return;
    ensureShell();
    liftModals();
    renderAll();
    if (!boot.watched) {
      boot.watched = true;
      watch();
    }
  }

  injectStyle();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
