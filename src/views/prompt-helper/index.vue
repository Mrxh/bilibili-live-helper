<script setup lang="ts">
import { ref } from "vue";
</script>

<template>
	<div class="prompt-helper">
		<div class="title">欢迎各位观众姥爷进入直播间</div>

		<h1>直播间小彩蛋：(均在开发中...)</h1>

		<div class="contentList" ref="contentList">
			<ul ref="list">
				<li>1. 关注up可以触发左下角窗口的动画和音效！</li>
				<li>2. 直播间发送常见问题触发自动回复！</li>
				<li>
					<p>例如：</p>
					<div>
						<p>阿阳热爱前端：阿阳年龄多大了？</p>
						<p>自动回复阿阳热爱前端：18！</p>
					</div>
				</li>
				<li>3. 直播间发送以下关键词即可触发音效！</li>
				<li>
					ohhhh、whooo、nice、哦买噶、哈哈哈、饮茶先啦、表哥，我出来了、你一个人在这干嘛、拿来吧你、奥利给（可以投稿持续添加哦~）
				</li>
				<li>
					4. 直播间发送：<br />点歌 + 空格 + 歌曲名 + 空格 +
					歌手名(歌手名可忽略) 即可点歌
				</li>
				<li>例如：点歌 嘉宾 or 点歌 嘉宾 路飞文</li>
				<li>
					5. 直播间发送关键字
					"切歌"，达到指定人数，即可切换至下一首歌！
				</li>
			</ul>
		</div>
	</div>
</template>

<style scoped lang="scss">
.prompt-helper {
	height: 100vh;
	padding: 10px 0;

	cursor: pointer;
	user-select: none;

	color: #cacdd3;
	background-color: rgba(0, 0, 0, 0.7);

	font-family: cat;

	-webkit-app-region: drag;
	.title {
		padding-bottom: 10px;

		text-align: center;
		letter-spacing: 3px;

		border-bottom: 1px solid #ccc;

		font-size: 22px;
	}

	h1 {
		padding: 10px;

		font-size: 20px;
		font-weight: normal;
	}

	.contentList {
		overflow: auto;

		height: calc(100vh - 101px);
		padding: 0 10px;

		font-size: 18px;

		ul {
			list-style: none;
			li {
				display: flex;

				padding-bottom: 10px;

				div {
					p {
						&:not(:last-child) {
							margin-bottom: 10px;
						}
					}
				}
			}
		}
		&::-webkit-scrollbar {
			width: 0;
			height: 0;
		}
	}
}
</style>
