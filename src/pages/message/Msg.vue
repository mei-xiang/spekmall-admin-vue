<!--
 * @Description: 客服系统
 -->

<template>
	<div class="webTalk-container">
		<div class="webTalk-panel">
			<!-- 左侧列表 -->
			<div class="webTalk-panel-left">
				<div class="webTalk-search">
					<el-input type="text"
							  placeholder="搜索"
							  class="input-with-select"
							  v-model="keyWord">
						<el-select v-model="isOnlne"
								   slot="prepend"
								   placeholder="请选择">
							<el-option label="在线"
									   :value="1"></el-option>
							<el-option label="离线"
									   :value="0"></el-option>
						</el-select>
					</el-input>
				</div>
				<div class="webTalk-users-list">
					<div class="webTalk-users-listPanel ui-scroll">
						<div class="webTalk-users-item"
							 v-for="user in leftUserList"
							 :class="{'active': user.id === channel.id}"
							 @click="startTalk(user)"
							 :key="user.id">
							<div class="webTalk-user-avatar">
								<el-avatar :size="40"
										   icon="el-icon-user-solid"
										   :src="user.avatar"></el-avatar>
							</div>
							<div class="webTalk-user-InfoBox">
								<div class="webTalk-user-name">
									【{{user.userType | userType}}】{{user.nickname}}
									<span class="webTalk-message-time"
										  :class="{'fn-green':user.online,'fn-gray':!user.online}">{{user.online? '在线': '离线'}}</span>
								</div>
								<div class="webTalk-user-message">
									{{user.messageTime}}
									<span class="webTalk-unReaderNum"
										  v-show="user.unReaderNum > 0">{{user.unReaderNum}}</span>
								</div>
							</div>
						</div>

						<div class="webTalk-show-more"
							 @click="showMore"
							 v-show="leftUserList.length < userList[isOnlne].length && keyWord === ''">查看更多</div>
						<div class="webTalk-no-user"
							 v-show="leftUserList.length === 0">未查到相关数据</div>
					</div>
				</div>
			</div>
			<!-- 右侧信息区 -->
			<div class="webTalk-panel-right">
				<div class="webTalk-message-container">
					<div class="webTalk-title">
						<h3 class="webTalk-title-text"
							v-show="channel.id">【{{channel.userType | userType}}】{{channel.nickname}}({{channel.online === 1?'在线':'离线'}})</h3>
					</div>
					<div class="webTalk-message-box">
						<div class="webTalk-message-list ui-scroll"
							 ref="messageList">
							<div class="show-more-message"
								 v-show="messageStore[channel.id] && messageStore[channel.id].pageNum < messageStore[channel.id].pageSize"
								 @click="showHistory">查看更多</div>
							<div class="webTalk-message-item"
								 v-for="(message, index) in messageList"
								 :key="index"
								 :class="message.sendUserId === channel.id?'webTalk-message-receive':'webTalk-message-send'">
								<div class="webTalk-avatarBox">
									<el-avatar :size="40"
											   icon="el-icon-user-solid"
											   :src="message.avatar"></el-avatar>
								</div>
								<div class="webTalk-message-body">
									<div class="webTalk-from-info"
										 v-if="message.sendUserId === channel.id">
										<span>{{message.nickname}}</span>
										<span class="webTalk-time-span">{{message.messageTime}}</span>
									</div>
									<div class="webTalk-from-info"
										 v-else>
										<span class="webTalk-time-span">{{message.messageTime}}</span>
										<span>{{message.nickname}}</span>
									</div>
									<div class="webTalk-message-text"
										 v-html="parserExpression(message.message)"></div>
								</div>
							</div>
						</div>
					</div>
					<div class="webTalk-footer">
						<div class="webTalk-toolBar-box">
							<div class="webTalk-expression">
								<span class="webTalk-toolBar"
									  @click.stop="toggleShow()">
									<svg class="icon"
										 style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;"
										 viewBox="0 0 1024 1024"
										 version="1.1"
										 xmlns="http://www.w3.org/2000/svg">
										<path d="M506.282667 803.925333c1.002667 0 2.069333-0.042667 3.114667-0.042667 170.261333-2.005333 238.528-150.869333 239.189333-152.341333L274.112 651.306667C276.949333 657.6 346.069333 803.925333 506.282667 803.925333z"></path>
										<path d="M326.805333 478.506667c27.029333 0 48.789333-21.866667 48.789333-48.810667s-21.781333-48.789333-48.789333-48.789333c-26.922667-0.042667-48.746667 21.824-48.746667 48.789333C278.058667 456.618667 299.84 478.506667 326.805333 478.506667z"></path>
										<path d="M697.749333 429.717333m-48.810667 0a2.288 2.288 0 1 0 97.621333 0 2.288 2.288 0 1 0-97.621333 0Z"></path>
										<path d="M512 0C229.696 0 0 229.696 0 512c0 282.325333 229.696 512 512 512 282.325333 0 512-229.674667 512-512C1024 229.696 794.325333 0 512 0zM512 981.098667C253.333333 981.098667 42.88 770.666667 42.88 512S253.333333 42.88 512 42.88 981.077333 253.333333 981.077333 512 770.666667 981.098667 512 981.098667z"></path>
									</svg>
								</span>
								<transition name="slider">
									<div class="webTalk-expression-panel"
										 v-show="isShow">
										<div class="webTalk-expression-list">
											<div class="webTalk-expression-item"
												 v-for="item in expressionsList"
												 :key="item.url"
												 @click.stop="picker(item)">
												<img :src="item.url"
													 :title="item.title">
											</div>
										</div>
									</div>
								</transition>
							</div>
						</div>
						<div class="webTalk-message-inputBox">
							<textarea class="webTalk-message-input ui-scroll"
									  v-model="text"
									  placeholder="请输入要说的话..."
									  :maxlength="200"
									  @focus="isShow = false"
									  @keyup.enter="send(text)"></textarea>
						</div>
						<div class="webTalk-sendBtn-box">
							<button class="webTalk-sendBtn"
									@click="send(text)">发送</button>
						</div>
					</div>
				</div>
				<div class="webTalk-message-container"
					 v-show="!channel.id">
					<span class="iconfont icon-wechat"></span>
				</div>
			</div>
		</div>

	</div>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from "vuex";
export default {
	name: "Service",
	data() {
		return {
			// 左侧列表
			isOnlne: 1,
			keyWord: "",
			leftUserList: [],
			leftShowNum: 10,
			userList: { 0: [], 1: [] },
			// 右侧聊天框
			channel: {},
			messageList: [],
			messageStore: {},
			// 表情相关
			isShow: false,
			baseUrl: "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal",
			expressions: [
				{ "title": "[坏笑]", "url": "/50/pcmoren_huaixiao_org.png" },
				{ "title": "[舔屏]", "url": "/40/pcmoren_tian_org.png" },
				{ "title": "[污]", "url": "/3c/pcmoren_wu_org.png" },
				{ "title": "[允悲]", "url": "/2c/moren_yunbei_org.png" },
				{ "title": "[笑而不语]", "url": "/3a/moren_xiaoerbuyu_org.png" },
				{ "title": "[费解]", "url": "/3c/moren_feijie_org.png" },
				{ "title": "[憧憬]", "url": "/37/moren_chongjing_org.png" },
				{ "title": "[并不简单]", "url": "/fd/moren_bingbujiandan_org.png" },
				{ "title": "[微笑]", "url": "/5c/huanglianwx_org.gif" },
				{ "title": "[嘻嘻]", "url": "/0b/tootha_org.gif" },
				{ "title": "[哈哈]", "url": "/6a/laugh.gif" },
				{ "title": "[可爱]", "url": "/14/tza_org.gif" },
				{ "title": "[可怜]", "url": "/af/kl_org.gif" },
				{ "title": "[挖鼻]", "url": "/0b/wabi_org.gif" },
				{ "title": "[吃惊]", "url": "/f4/cj_org.gif" },
				{ "title": "[害羞]", "url": "/6e/shamea_org.gif" },
				{ "title": "[挤眼]", "url": "/c3/zy_org.gif" },
				{ "title": "[闭嘴]", "url": "/29/bz_org.gif" },
				{ "title": "[鄙视]", "url": "/71/bs2_org.gif" },
				{ "title": "[爱你]", "url": "/6d/lovea_org.gif" },
				{ "title": "[泪]", "url": "/9d/sada_org.gif" },
				{ "title": "[偷笑]", "url": "/19/heia_org.gif" },
				{ "title": "[亲亲]", "url": "/8f/qq_org.gif" },
				{ "title": "[生病]", "url": "/b6/sb_org.gif" },
				{ "title": "[太开心]", "url": "/58/mb_org.gif" },
				{ "title": "[白眼]", "url": "/d9/landeln_org.gif" },
				{ "title": "[右哼哼]", "url": "/98/yhh_org.gif" },
				{ "title": "[左哼哼]", "url": "/6d/zhh_org.gif" },
				{ "title": "[嘘]", "url": "/a6/x_org.gif" },
				{ "title": "[衰]", "url": "/af/cry.gif" },
				{ "title": "[委屈]", "url": "/73/wq_org.gif" },
				{ "title": "[吐]", "url": "/9e/t_org.gif" },
				{ "title": "[哈欠]", "url": "/cc/haqianv2_org.gif" },
				{ "title": "[抱抱_旧]", "url": "/27/bba_org.gif" },
				{ "title": "[怒]", "url": "/7c/angrya_org.gif" },
				{ "title": "[疑问]", "url": "/5c/yw_org.gif" },
				{ "title": "[馋嘴]", "url": "/a5/cza_org.gif" },
				{ "title": "[拜拜]", "url": "/70/88_org.gif" },
				{ "title": "[思考]", "url": "/e9/sk_org.gif" },
				{ "title": "[汗]", "url": "/24/sweata_org.gif" },
				{ "title": "[困]", "url": "/40/kunv2_org.gif" },
				{ "title": "[睡]", "url": "/96/huangliansj_org.gif" },
				{ "title": "[钱]", "url": "/90/money_org.gif" },
				{ "title": "[失望]", "url": "/0c/sw_org.gif" },
				{ "title": "[酷]", "url": "/40/cool_org.gif" },
				{ "title": "[色]", "url": "/20/huanglianse_org.gif" },
				{ "title": "[哼]", "url": "/49/hatea_org.gif" },
				{ "title": "[鼓掌]", "url": "/36/gza_org.gif" },
				{ "title": "[晕]", "url": "/d9/dizzya_org.gif" },
				{ "title": "[悲伤]", "url": "/1a/bs_org.gif" },
				{ "title": "[抓狂]", "url": "/62/crazya_org.gif" },
				{ "title": "[黑线]", "url": "/91/h_org.gif" },
				{ "title": "[阴险]", "url": "/6d/yx_org.gif" },
				{ "title": "[怒骂]", "url": "/60/numav2_org.gif" },
				{ "title": "[互粉]", "url": "/89/hufen_org.gif" },
				{ "title": "[心]", "url": "/40/hearta_org.gif" },
				{ "title": "[伤心]", "url": "/ea/unheart.gif" },
				{ "title": "[猪头]", "url": "/58/pig.gif" },
				{ "title": "[熊猫]", "url": "/6e/panda_org.gif" },
				{ "title": "[兔子]", "url": "/81/rabbit_org.gif" },
				{ "title": "[ok]", "url": "/d6/ok_org.gif" },
				{ "title": "[耶]", "url": "/d9/ye_org.gif" },
				{ "title": "[good]", "url": "/d8/good_org.gif" },
				{ "title": "[NO]", "url": "/ae/buyao_org.gif" },
				{ "title": "[赞]", "url": "/d0/z2_org.gif" },
				{ "title": "[来]", "url": "/40/come_org.gif" },
				{ "title": "[弱]", "url": "/d8/sad_org.gif" },
				{ "title": "[草泥马]", "url": "/7a/shenshou_org.gif" },
				{ "title": "[神马]", "url": "/60/horse2_org.gif" },
				{ "title": "[囧]", "url": "/15/j_org.gif" },
				{ "title": "[浮云]", "url": "/bc/fuyun_org.gif" },
				{ "title": "[给力]", "url": "/1e/geiliv2_org.gif" },
				{ "title": "[围观]", "url": "/f2/wg_org.gif" },
				{ "title": "[威武]", "url": "/70/vw_org.gif" },
				{ "title": "[话筒]", "url": "/9f/huatongv2_org.gif" },
				{ "title": "[蛋糕]", "url": "/3a/cakev2_thumb.gif" },
				{ "title": "[蜡烛]", "url": "/d9/lazhuv2_org.gif" },
				{ "title": "[广告]", "url": "/60/ad_new0902_org.gif" },
				{ "title": "[doge]", "url": "/b6/doge_org.gif" },
				{ "title": "[喵喵]", "url": "/4a/mm_org.gif" },
				{ "title": "[二哈]", "url": "/74/moren_hashiqi_org.png" },
				{ "title": "[哆啦A梦无奈]", "url": "/96/dora_wunai_org.png" },
				{ "title": "[哆啦A梦笑]", "url": "/54/dora_xiao_org.png" },
				{ "title": "[哆啦A梦亲亲]", "url": "/e0/dora_qinqin_org.png" },
				{ "title": "[哆啦A梦美味]", "url": "/21/dora_meiwei_org.png" },
				{ "title": "[哆啦A梦开心]", "url": "/df/dora_kaixin_org.png" },
				{ "title": "[笑cry]", "url": "/34/xiaoku_org.gif" },
				{ "title": "[摊手]", "url": "/09/pcmoren_tanshou_org.png" },
				{ "title": "[抱抱]", "url": "/70/pcmoren_baobao_org.png" },
				{ "title": "[红包飞]", "url": "/c8/../e0/hongbao1_org.gif" },
				{ "title": "[发红包]", "url": "/ca/fahongbao_org.gif" },
				{ "title": "[冰川时代希德奶奶]", "url": "/35/bhsj5_nainai_org.gif" },
				{ "title": "[快银]", "url": "/7e/xman_kuaiyin_org.gif" },
				{ "title": "[暴风女]", "url": "/7b/xman_baofengnv_org.gif" },
				{ "title": "[芒果流口水]", "url": "/64/mango_07_org.gif" },
				{ "title": "[芒果点赞]", "url": "/5c/mango_12_org.gif" },
				{ "title": "[芒果大笑]", "url": "/9f/mango_02_org.gif" },
				{ "title": "[芒果得意]", "url": "/ee/mango_03_org.gif" },
				{ "title": "[芒果萌萌哒]", "url": "/49/mango_11_org.gif" },
				{ "title": "[羊年大吉]", "url": "/cc/yangniandj_org.gif" },
				{ "title": "[西瓜]", "url": "/6b/watermelon.gif" },
				{ "title": "[足球]", "url": "/c0/football.gif" },
				{ "title": "[老妈我爱你]", "url": "/46/mothersday_org.gif" },
				{ "title": "[母亲节]", "url": "/36/carnation_org.gif" },
				{ "title": "[肥皂]", "url": "/e5/soap_org.gif" },
				{ "title": "[有钱]", "url": "/e6/youqian_org.gif" },
				{ "title": "[地球一小时]", "url": "/dc/earth1r_org.gif" },
				{ "title": "[国旗]", "url": "/dc/flag_org.gif" },
				{ "title": "[许愿]", "url": "/87/lxhxuyuan_org.gif" },
				{ "title": "[风扇]", "url": "/92/fan.gif" },
				{ "title": "[炸鸡和啤酒]", "url": "/f4/zhaji_org.gif" },
				{ "title": "[雪]", "url": "/00/snow_org.gif" },
				{ "title": "[马上有对象]", "url": "/ee/mashangyouduixiang_org.gif" },
				{ "title": "[马到成功旧]", "url": "/30/madaochenggong_org.gif" },
				{ "title": "[青啤鸿运当头]", "url": "/f8/hongyun_org.gif" },
				{ "title": "[让红包飞]", "url": "/0b/hongbaofei2014_org.gif" },
				{ "title": "[ali做鬼脸]", "url": "/20/alizuoguiliannew_org.gif" },
				{ "title": "[ali哇]", "url": "/de/aliwanew_org.gif" },
				{ "title": "[xkl转圈]", "url": "/f4/xklzhuanquan_org.gif" },
				{ "title": "[酷库熊顽皮]", "url": "/46/kxwanpi_org.gif" },
				{ "title": "[bm可爱]", "url": "/95/bmkeai_org.gif" },
				{ "title": "[BOBO爱你]", "url": "/74/boaini_org.gif" },
				{ "title": "[转发]", "url": "/02/lxhzhuanfa_org.gif" },
				{ "title": "[得意地笑]", "url": "/d4/lxhdeyidixiao_org.gif" },
				{ "title": "[ppb鼓掌]", "url": "/7e/ppbguzhang_org.gif" },
				{ "title": "[din推撞]", "url": "/dd/dintuizhuang_org.gif" },
				{ "title": "[moc转发]", "url": "/cb/moczhuanfa_org.gif" },
				{ "title": "[lt切克闹]", "url": "/73/ltqiekenao_org.gif" },
				{ "title": "[江南style]", "url": "/67/gangnamstyle_org.gif" },
				{ "title": "[笑哈哈]", "url": "/32/lxhwahaha_org.gif" }
			],
			expressionsList: [],
			text: ""
		};
	},
	methods: {
		// 表情部分 -----------------------------------------------
		toggleShow(val) {
			this.isShow = !this.isShow;
		},
		// 初始化表情数据
		initExpression() {
			this.expressionsList = this.expressions.map((item) => {
				item.url = this.baseUrl + item.url;
				return item;
			});
		},
		// 解析文本中的表情
		parserExpression(text) {
			const arr = this.expressionsList;
			const getIndex = (title) => {
				let index = -1;
				arr.forEach((item, i) => {
					if (item.title === title) {
						index = i;
					}
				});
				return index;
			}
			if (typeof (text) !== "undefined") {
				let sArr = text.match(/\[.*?\]/g);
				if (sArr && sArr.length > 0) {
					for (let i = 0; i < sArr.length; i++) {
						let index = getIndex(sArr[i]);
						if (index !== -1) {
							const reStr = "<img src=" + arr[index].url + " height='20' width='20' />";
							text = text.replace(sArr[i], reStr);
						}
					}
				}
			}
			return text;
		},
		// 选择表情
		picker: function (expression) {
			this.text += expression.title;
		},
		// 左侧用户列表部分 ----------------------------------------------
		initUserList(orginData) {
			this.userList = { 0: [], 1: [] };
			orginData.map((item) => {
				item.avatar = this.setAvatar(item.avatar);
				item.unReaderNum = 0;
				item.id = Number(item.userId);
				this.userList[item.online].push(item);
			});
			this.showLeftList();
		},
		showLeftList() {
			this.leftUserList = this.userList[this.isOnlne].slice(0, this.leftShowNum)
		},
		// 切换在线状态 或者 搜索
		searchUser(keyword, isOnlne) {
			if (keyword === '') {
				this.showLeftList();
			} else {
				this.leftUserList = this.userList[isOnlne].filter((item, index) => {
					if (item.nickname.indexOf(keyword) !== -1) {
						return item
					}
				})
			}
		},
		showMore() {
			this.leftShowNum += 10;
			this.showLeftList();
		},
		// 点击获取聊天记录
		startTalk(user) {
			user.unReaderNum = 0;
			this.channel = user;
			if (this.messageStore[user.id]) {
				this.messageList = this.messageStore[user.id].content;
				this.scrollBottom();
			} else {
				this.messageStore[user.id] = { content: [] };
				this.$socket.emit("hisMessage", { pageNum: 1, userId: user.id }, () => {
					this.scrollBottom();
				});
			}
		},
		// 右侧聊天框部分 -----------------------------------------------
		scrollBottom() {
			this.$nextTick(() => {
				let box = document.getElementsByClassName("webTalk-message-list")[0];
				let list = document.getElementsByClassName("webTalk-message-item");
				let last = list[list.length - 1];
				let scrollTop = 0;
				if (last) scrollTop = last.offsetTop;
				if (box) box.scrollTop = scrollTop;
			})
		},
		// 发送消息
		send(text) {
			// 未选择用户
			if (!this.channel.id) {
				this.$message.warning("请选择发送用户");
				return false;
			}
			// 加入所选用户离线 提示无法发送
			if (this.channel.online === 0) {
				this.$message.warning("当前用户离线，无法发送");
				return false;
			}
			this.isShow = false;
			// 发送信息为空
			const message = this.trim(text);
			if (message === '') return false;
			this.$socket.emit("sendMessage", {
				receiveUserId: this.channel.id,
				sendUserId: this.userInfo.id,
				message: message,
				msgType: 0
			});
			this.text = '';
		},
		//去除空格
		trim: function (string) {
			return string.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
		},
		// 显示更多聊天记录
		showHistory() {
			const id = this.channel.id;
			const { pageNum, pageSize, firstMessageId } = this.messageStore[id];
			if (pageNum < pageSize) {
				this.$socket.emit("hisMessage", { pageNum: 1, userId: id, id: firstMessageId });
			}
		},
		setAvatar(avatar) {
			if (this.$dataIsNull(avatar)) {
				return '/static/image/icon_top_head_user.png';
			} else {
				return this.$imageSrc(avatar);
			}
		},
		// 初始化聊天数据
		initMessage(data) {
			let pageNum = 0;
			let pageSize = 0;
			let firstMessageId = 0;
			let messageList = [];
			if (data.length === 0) {
				messageList = [];
			} else {
				messageList = data.records.map((item) => {
					item.sendUserId = Number(item.sendUserId);
					item.avatar = this.setAvatar(item.avatar);
					return item
				});
				pageNum = data.current;
				pageSize = data.pages;
				firstMessageId = data.records[0].id;
			}
			const id = this.channel.id;
			this.messageList = [...messageList, ...this.messageStore[id].content];
			this.messageStore[id] = {
				pageNum: pageNum,
				pageSize: pageSize,
				firstMessageId: firstMessageId,
				content: this.messageList
			};
		},
		// 处理新消息
		newMessage(data) {
			let id = null;
			// 判断发送人状态
			if (data.userType === 1) {
				id = Number(data.receiveUserId);
			} else {
				id = Number(data.sendUserId);
			}
			data.sendUserId = Number(data.sendUserId);
			data.avatar = this.setAvatar(data.avatar);

			// 数据写入消息库
			if (this.messageStore[id]) this.messageStore[id].content.push(data);
			if (!this.channel.id || id !== this.channel.id) {
				// 增加未读标记 并且将接收消息用户前置
				this.userList[1].some((item) => {
					if (item.id === id) {
						item.unReaderNum += 1;
						item.messageTime = data.messageTime;
						return true
					}
				})
				this.userList[1].sort((a, b) => {
					return b.unReaderNum - a.unReaderNum
				})
				if (this.isOnlne === 1) this.leftUserList = this.userList[1];
			} else {
				// 如果当前聊天窗口 直接显示当前消息
				this.channel.messageTime = data.messageTime;
				this.messageList = this.messageStore[id].content;
				this.scrollBottom();
			}
		},
		// 修改在线状态
		changeOnlineState(data) {
			let { msgType, sendUserId } = data;
			sendUserId = Number(sendUserId);
			data.sendUserId = sendUserId;
			data.id = sendUserId;
			// oldState 旧状态     newState 变化为新状态
			let [oldState, newState] = [null, null];
			if (msgType === '01') {
				oldState = 0;
				newState = 1;
			} else if (msgType === '02') {
				oldState = 1;
				newState = 0;
			} else {
				return;
			}
			let i = null;
			// 先判断是否在新状态中存在
			let isRepetition = this.userList[newState].find((item, index) => {
				if (item.id === sendUserId) {
					return true;
				}
			})
			if (isRepetition) return;
			// 如果不在新状态中 判断是否在旧状态中存在
			let user = this.userList[oldState].find((item, index) => {
				if (item.id === sendUserId) {
					i = index;
					return true;
				}
			})

			if (user) {
				// 旧状态中存在
				this.userList[oldState].splice(i, 1);
				user.online = data.online;
				user.nickName = data.nickName;
				user.massageTime = data.massageTime;
				user.avatar = this.setAvatar(data.avatar);
				this.userList[newState].push(user);
			} else if (msgType === '01') {
				// 上线的情况添加入列表
				// 下线的时候不携带信息，无法添加，此处做过滤
				data.avatar = this.setAvatar(data.avatar);
				data.unReaderNum = 0;
				this.userList[newState].push(data)
			}
			this.showLeftList();
		}

	},
	sockets: {
		connect: (data) => {
			console.log("链接成功", data)
		},
		disconnect: () => {
			console.log("断开链接")
		},
		// 监听上线/下线/异常提醒
		receiveMsg: function (data) {
			this.changeOnlineState(data)
		},
		// 获取消息
		receiveMessage: function (data) {
			this.newMessage(data)
		},
		// 获取左侧列表
		hisUsers: function (data) {
			this.initUserList(data)
		},
		// 获取历史聊天数据
		hisMessage: function (data) {
			this.initMessage(data)
		},
		// 发送消息
		// msg = { receiveUserId, sendUserId, msg }
		sendMessage: (msg) => {
			console.log("发送成功", msg)
		}
	},
	computed: {
		...mapGetters(["userInfo"])
	},
	created() {
		this.$socket.open();
		this.initExpression();
		this.$socket.emit("hisUsers");
	},
	watch: {
		keyWord: function (val) {
			this.searchUser(val, this.isOnlne)
		},
		isOnlne: function (val) {
			this.searchUser(this.keyWord, val)
		}
	},
	filters: {
		userType: function (val) {
			switch (val) {
				case 0:
					return '会员';
				case 1:
					return '客服';
				case 2:
					return '游客';
				default:
					return val; ;
			}
		}
	}
};
</script>

<style lang="stylus" scoped>
.webTalk-container
	height 100%
	background #FFFFFF

.webTalk-panel
	display block
	width 100%
	height 100%

.webTalk-panel-left
	height 100%
	width 300px
	border-right 1px solid #d1d1d1
	float left
	position relative

.webTalk-search
	height 40px
	padding 0 10px 10px 10px
	box-sizing border-box

.webTalk-users-list
	width 100%
	box-sizing border-box
	position absolute
	top 50px
	bottom 10px
	left 0

.webTalk-users-listPanel
	width 100%
	height 100%
	overflow-y auto

.webTalk-panel-right
	height 100%
	position relative
	margin-left 301px

.webTalk-message-container
	height 100%
	background #eeeeee
	position relative

.webTalk-message-container .icon-wechat
	display block
	width 80px
	height 60px
	top 50%
	left 50%
	position absolute
	margin-top -40px
	margin-left -40px
	text-align center
	line-height 80px
	font-size 80px
	color #d1d1d1

.webTalk-connect-status
	display block
	position absolute
	width 20px
	height 20px
	line-height 20px
	text-align center
	right 10px
	top 5px
	font-size 14px
	color #999a9e

.webTalk-connect-status.webTalk-connect-fail
	color #cbced3

.webTalk-title
	height 35px
	width 100%

.webTalk-title-text
	text-align center
	line-height 34px
	border-bottom 1px solid #d1d1d1
	font-weight normal
	font-size 14px
	color #606266
	margin 0 10px

.webTalk-message-box
	position absolute
	top 35px
	bottom 140px
	width 100%
	left 0

.webTalk-message-list
	display block
	padding 10px
	box-sizing border-box
	overflow-y auto
	height 100%
	width 100%

.webTalk-footer
	height 140px
	width 100%
	position absolute
	bottom 0
	left 0

.webTalk-toolBar-box
	border-top 1px solid #d1d1d1
	height 30px
	line-height 30px
	margin 0 10px
	vertical-align middle

.webTalk-toolBar
	display block
	width 30px
	height 30px
	position relative
	font-size 20px
	color #535a62
	cursor pointer

.webTalk-message-inputBox
	margin 0 10px

.webTalk-message-input
	display block
	background transparent
	width 100%
	height 60px
	outline none
	resize none
	margin 0
	padding 5px 10px
	border none
	box-sizing border-box
	color #666666

.webTalk-toolBar .icon
	position absolute
	left 50%
	top 50%
	margin-left -0.5em
	margin-top -0.5em

.webTalk-login-avatar
	width 40px
	height 40px
	padding 10px
	text-align center

.webTalk-login-avatar img
	display block
	width 100%
	height 100%
	border-radius 4px
	border none

.webTalk-menu-list
	list-style none
	padding 0
	margin 0

.webTalk-menu-item
	line-height 40px
	text-align center
	font-size 18px
	color #f2f2f2
	cursor pointer

.webTalk-menu-item:hover, .webTalk-menu-item.active
	color #b2e281

.webTalk-sendBtn-box
	text-align right
	padding 0 10px

.webTalk-sendBtn
	display inline-block
	border 1px solid #c1c1c1
	border-radius 4px
	-moz-border-radius 4px
	-webkit-border-radius 4px
	padding 3px 30px
	font-size 14px
	text-decoration none
	background-color #fff
	color #222
	cursor pointer
	outline none

/* ******消息气泡样式****** */
.webTalk-message-item:after
	display block
	content ''
	clear both

.webTalk-message-item
	margin-top 10px

.webTalk-message-item:first-child
	margin-top 0

.show-more-message
	text-align center
	color #0099CC
	cursor pointer

.webTalk-avatarBox
	display block
	width 40px
	height 40px
	border-radius 4px

.webTalk-avatarBox img
	display block
	border none
	width 100%
	height 100%
	border-radius 4px

.webTalk-from-info
	line-height 20px
	font-size 12px
	color #6d6d6d

.webTalk-message-body
	margin 0 55px

.webTalk-message-text
	display inline-block
	line-height 20px
	min-height 20px
	padding 10px
	position relative
	border-radius 4px
	background #FFFFFF
	font-size 12px
	color #6d6d6d
	word-wrap break-word
	text-align left
	max-width 100%
	box-sizing border-box

.webTalk-message-text img
	margin 2px
	border 0
	vertical-align bottom

.webTalk-time-span
	margin 0 5px

.webTalk-message-send .webTalk-avatarBox
	float right

.webTalk-message-send .webTalk-from-info
	text-align right

.webTalk-message-send .webTalk-message-text
	background #b2e281

.webTalk-message-send .webTalk-message-text:after
	display block
	width 0
	height 0
	content ''
	position absolute
	left 100%
	border-top 5px solid transparent
	border-left 5px solid #b2e281
	border-bottom 5px solid transparent
	top 15px

.webTalk-message-send .webTalk-message-body
	text-align right

.webTalk-message-receive .webTalk-avatarBox
	float left

.webTalk-message-receive .webTalk-from-info
	text-align left

.webTalk-message-receive .webTalk-message-text:after
	display block
	width 0
	height 0
	content ''
	position absolute
	right 100%
	border-top 5px solid transparent
	border-right 5px solid #FFFFFF
	border-bottom 5px solid transparent
	top 15px

/* ******用户列表样式******** */
>>>.el-input-group__prepend
	width 44px

.webTalk-users-item
	padding 10px
	cursor pointer
	position relative

.webTalk-users-item.active
	background #eee

.webTalk-users-item.active:after, .webTalk-users-item:hover:after
	display block
	content ''
	position absolute
	right 0
	top 2px
	bottom 2px
	width 2px
	background #b2e281

.webTalk-users-item:after
	display block
	content ''
	clear both

.webTalk-user-avatar
	display block
	width 40px
	height 40px
	border-radius 4px
	float left
	position relative

.webTalk-user-avatar i
	position absolute
	right 0
	bottom 0
	font-size 12px
	line-height 1
	color #f2f2f2
	background rgba(51, 51, 51, 0.61)
	border-radius 2px 0 0 0

.webTalk-user-avatar img
	display block
	width 100%
	height 100%
	border-radius 4px

.webTalk-user-InfoBox
	margin-left 50px

.webTalk-user-name
	font-size 12px
	color #333333
	line-height 20px
	height 20px
	position relative

.webTalk-user-message
	line-height 20px
	height 20px
	color #999
	font-size 12px
	vertical-align middle
	overflow hidden
	text-overflow ellipsis
	white-space nowrap
	position relative

.webTalk-unReaderNum
	font-size 12px
	height 18px
	line-height 18px
	padding 0 6px
	text-align center
	white-space nowrap
	border-radius 10px
	background #f56c6c
	position absolute
	color #FFFFFF
	right 0
	top 0
	transform scale(0.8)

.webTalk-message-time
	position absolute
	right 0
	height 20px
	line-height 20px
	font-size 12px
	top 0

.webTalk-show-more
	text-align center
	font-size 12px
	color #666
	line-height 30px
	cursor pointer

.webTalk-no-user
	text-align center
	font-size 12px
	color #a2adb9
	line-height 30px

/* *******表情插件样式********** */
.webTalk-expression
	display block
	width 30px
	height 30px
	float left
	position relative

.webTalk-expression-panel
	background #ffffff
	border-radius 4px
	width 405px
	box-shadow 0 0 7px #ccc
	position absolute
	bottom 100%
	left -40px
	margin-bottom 10px
	padding 10px

.webTalk-expression-list:after
	clear both
	display block
	content ''

.webTalk-expression-item
	display block
	width 20px
	height 20px
	float left
	padding 3px
	cursor pointer
	border 1px solid #e8e8e8
	margin -1px 0 0 -1px
	position relative

.webTalk-expression-item:hover
	border 1px solid #3a8ee6
	z-index 99

.webTalk-expression-item img
	display block
	width 100%
	height 100%
	user-select none

/* 定义滚动条宽高及背景，宽高分别对应横竖滚动条的尺寸 */
.ui-scroll::-webkit-scrollbar
	width 5px
	height 5px
	background-color rgba(255, 255, 255, 0)

/* 定义滚动条的轨道，内阴影及圆角 */
.ui-scroll::-webkit-scrollbar-track
	-webkit-box-shadow inset 0 0 6px rgba(240, 240, 240, 0)
	border-radius 10px
	background-color rgba(0, 89, 255, 0)

/* 定义滑块，内阴影及圆角 */
.ui-scroll:hover::-webkit-scrollbar-thumb
	/* width: 10px; */
	height 20px
	border-radius 10px
	-webkit-box-shadow inset 0 0 6px rgba(236, 236, 236, 0.3)
	background-color rgba(203, 203, 203, 0.54)
	transition all 0.5s
</style>
