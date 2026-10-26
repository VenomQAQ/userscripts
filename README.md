# 油猴脚本

个人用的 Tampermonkey（油猴）脚本。每个脚本只改网页外观，点赞、评论、关注仍走网站原来的按钮。

安装：浏览器先装好 [Tampermonkey](https://www.tampermonkey.net/)，再点下面的安装链接。油猴会打开确认页，点一次「安装」即可，不用自己下载文件。

已经装过的人会按脚本里的版本号收到更新。改完脚本后把文件头的 `@version` 加大再推送，例如 `1.5.0` 改成 `1.5.1`。对方的油猴会隔一段时间自动检查（默认大约每天一次，可在油猴设置里改成更勤），发现新版本后在扩展图标上提示更新。

## 脚本一览

| 脚本 | 一键安装 | 作用 | 匹配网站 |
| --- | --- | --- | --- |
| 小红书 · IM 三合一样式 | [安装](https://raw.githubusercontent.com/VenomQAQ/userscripts/main/%E5%B0%8F%E7%BA%A2%E4%B9%A6/xhs-dingding.user.js) | 把小红书换成钉钉 / 飞书 / 企业微信三栏聊天壳。笔记列表和详情、评论收成会话；可切换皮肤、深浅色、纯文本摸鱼、百家姓脱敏。 | `xiaohongshu.com` |
| 知乎 · 钉钉样式 | [安装](https://raw.githubusercontent.com/VenomQAQ/userscripts/main/%E7%9F%A5%E4%B9%8E/zhihu-dingding.user.js) | 按钉钉三栏重绘知乎：左栏导航、中栏会话、右栏气泡。可一键隐藏图片。 | `zhihu.com`、`zhuanlan.zhihu.com` |

## 小红书 · IM 三合一样式

一套脚本三种 IM 皮肤（钉钉、飞书、企业微信）。中栏是笔记列表（推荐 / 搜索 / 频道），右栏把笔记详情和树状评论收成聊天抽屉。只换皮，不改小红书里的数据。

![小红书 IM 三合一样式效果](screenshots/xhs-dingding.jpg)

## 知乎 · 钉钉样式

用钉钉的三栏会话布局盖住知乎页面。赞同、评论、打开详情仍然点击知乎自己的按钮。右上角可以切换是否显示图片。

![知乎钉钉样式效果](screenshots/zhihu-dingding.jpg)
