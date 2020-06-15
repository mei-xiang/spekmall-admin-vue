/*
 * @Description: 表单验证规则
 * @Author: jiaxin
 * @Date: 2018-12-15 14:45:11
 * @LastEditors: jiaxin
 * @LastEditTime: 2019-12-10 11:12:32
 */

export default {
	install(Vue) {
		Vue.prototype.$rules = { //常量
			/**
			* @description: 设置必选内容
			* @param text {string}  验证提示内容
			* @param trigger {string}  触发类型 默认 blur
			* @return: 无
			*/
			setRequired: (text, trigger) => {
				trigger = trigger || 'blur';
				return {
					required: true,
					message: text,
					trigger: trigger
				}
			},
			// 设置文本长度
			setLength: (min, max) => {
				min = Number(min);
				max = Number(max);
				return {
					min: min,
					max: max,
					message: `长度在 ${min} 到 ${max} 个字符`,
					trigger: 'blur'
				}
			},
			// 设置账号 编码
			setCode: (min, max) => {
				let text = `长度${min}-${max}以字母开头，只包含字母、数字和下划线`;
				min = Number(min) - 1;
				max = Number(max) - 1;
				let reg = new RegExp(`^[a-zA-Z][0-9a-zA-Z_]{${min},${max}}$`);
				return {
					pattern: reg,
					message: text,
					trigger: 'blur'
				}
			},
			// 设置普通密码
			setPassword: (min, max) => {
				let text = `只能输入 ${min} - ${max} 个字母、数字、下划线！`;
				min = Number(min);
				max = Number(max);
				let reg = new RegExp(`^[0-9a-zA-Z_]{${min},${max}}$`);
				return {
					pattern: reg,
					message: text,
					trigger: 'blur'
				}
			},
			/**
    		* @description: 设置新密码  与下面的确认密码一起使用
    		* @param {Object} vm [当前组件的实例指针this]
    		* @param {String} formRef [from的ref属性名称]
    		* @param {String} dataName [confirmPassword属性所在对象的名称]
    		* @param {String} confirmPassword [confirmPassword属性的名称]
    		* @return:
    		*/
			setNewPassword: (vm, formRef, dataName, confirmPassword, isRequired = true, min = 6, max = 16) => {
				let text = `只能输入 ${min} - ${max} 个字母、数字、下划线！`;
				min = Number(min);
				max = Number(max);
				let reg = new RegExp(`^[0-9a-zA-Z_]{${min},${max}}$`);
				const rule = (rule, value, callback) => {
					if (vm.$dataIsNull(value)) {
						if (isRequired) {
							callback(new Error('请输入密码'));
						} else {
							callback();
						}
					} else if (!reg.test(value)) {
						callback(new Error(text));
					} else {
						if (!vm.$dataIsNull(vm[dataName][confirmPassword])) {
							vm.$refs[formRef].validateField(confirmPassword);
						}
						callback();
					}
				}
				return {
					required: isRequired,
					validator: rule,
					trigger: 'blur'
				}
			},
			// 设置确认密码
			/**
    		* @description: 设置确认密码  与上面设置新密码一起使用
    		* @param {Object} vm [当前组件的实例指针this]
    		* @param {String} dataName [newPassword属性所在对象的名称]
    		* @param {String} newPassword [newPassword属性的名称]
    		* @return:
    		*/
			setConfirmPassword: (vm, dataName, newPassword, isRequired = true) => {
				const rule = (rule, value, callback) => {
					if (vm.$dataIsNull(value)) {
						if (isRequired) {
							callback(new Error('请再次输入密码'));
						} else {
							callback();
						}
					} else if (value !== vm[dataName][newPassword]) {
						callback(new Error('两次输入密码不一致!'));
					} else {
						callback();
					}
				}
				return {
					required: isRequired,
					validator: rule,
					trigger: 'blur'
				}
			},
			/**
			* @description: 设置数字验证（用于数字密码或者数字编号，可以0开头）
			* @param {Number} min [最小位数]
			* @param {Number} max [最大位数] 不填时限制为满足最小位数的
			* @return:
			*/
			setNumber: (min, max) => {
				let [text, reg] = [null, null];
				min = Number(min);
				if (max) {
					text = `由 ${min} - ${max} 位数字组成`;
					max = Number(max);
					reg = new RegExp(`^[0-9]{${min},${max}}$`);
				} else {
					text = `由 ${min} 位数字组成`;
					reg = new RegExp(`^[0-9]{${min}}$`);
				}
				return {
					pattern: reg,
					message: text,
					trigger: 'blur'
				}
			},
			// 设置以数字开头数字结尾，逗号链接的字符串
			setNumberList: () => {
				return {
					pattern: /^[1-9]([0-9]*,)([0-9]+,)*[0-9]+$/,
					message: "非0数字开头，数字结尾，必须逗号连接",
					trigger: 'blur'
				}
			},
			// 设置不能包含特殊符号和空格的字符串
			setNoSpaceOrSpecial: () => {
				return {
					pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
					message: "不能由特殊符号和空格组成",
					trigger: 'blur'
				}
			},
			// 设置不能包含空格的字符串
			setNoSpace: () => {
				return {
					pattern: /^[^\s]*$/,
					message: "不能由空格组成",
					trigger: 'blur'
				}
			},

			// 设置以数字开头+,+ture/false
			setNumberFormat: () => {
				return {
					pattern: /^([0-9]*,)(true|false){1}$/,
					message: "保留小数点个数,true/fasle（是否千位分隔）",
					trigger: 'blur'
				}
			},
			//统一社会信用代码
			checkUnCreditCode: (rule, value, callback) => {
				const firstarray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
				const firstkeys = [3, 7, 9, 10, 5, 8, 4, 2];
				// 验证码计算后获得结果 转化的映射关系
				const secondarray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'T', 'U', 'W', 'X', 'Y'];
				// 加权因子
				const secondkeys = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28];
				const calc = function (code, array1, array2, b) {
					var count = 0;
					for (var i = 0; i < array2.length; i++) {
						var a = code[i];
						count += array2[i] * array1.indexOf(a);
					}
					return b - count % b;
				}
				const verify = function (str) {
					var code = str.toUpperCase();

					// 统一代码由十八位的阿拉伯数字或大写英文字母（ 不使用I、 O、 Z、 S、 V） 组成。
					// 第1位: 登记管理部门代码（ 共一位字符）
					// 第2位: 机构类别代码（ 共一位字符）
					// 第3位~第8位: 登记管理机关行政区划码（ 共六位阿拉伯数字）
					// 第9位~第17位: 主体标识码（ 组织机构代码）（ 共九位字符）
					// 第18位: 验证码共一位字符
					// eslint-disable-next-line eqeqeq
					if (code.length != 18) {
						return false;
					}
					var reg = /^\w\w\d{6}\w{9}\w$/;
					if (!reg.test(code)) {
						return false;
					}
					// 登记管理部门代码:使用阿拉伯数字或大写英文字母表示。
					// 机构编制:1
					// 民政: 2
					// 工商:9
					// 其他: Y
					reg = /^[1,5,9,Y]\w\d{6}\w{9}\w$/;
					if (!reg.test(code)) {
						return false;
					}

					// 机构类别代码: 使用阿拉伯数字或大写英文字母表示。
					// 机构编制机关: 11 打头
					// 机构编制事业单位: 12打头
					// 机构编制中央编办直接管理机构编制的群众团体: 13打头
					// 机构编制其他: 19打头
					// 民政社会团体: 51 打头
					// 民政民办非企业单位: 52 打头
					// 民政基金会: 53 打头
					// 民政其他: 59 打头
					// 工商企业: 91 打头
					// 工商个体工商户: 92 打头
					// 工商农民专业合作社: 93 打头
					// 其他: Y1打头

					reg = /^(11|12|13|19|51|52|53|59|91|92|93|Y1)\d{6}\w{9}\w$/;
					if (!reg.test(code)) {
						return false;
					}

					// 登记管理机关行政区划码: 只能使用阿拉伯数字表示。 按照GB / T 2260 编码
					// 例如: 四川省成都市本级就是510100； 四川省自贡市自流井区就是510302

					reg = /^(11|12|13|19|51|52|53|59|91|92|93|Y1)\d{6}\w{9}\w$/;
					if (!reg.test(code)) {
						return false;
					}

					// 主体标识码（ 组织机构代码）: 使用阿拉伯数字或英文大写字母表示。 按照GB 11714 编码。

					// 在实行统一社会信用代码之前， 以前的组织机构代码证上的组织机构代码由九位字符组成。 格式为XXXXXXXX - Y。 前面八位被称为“ 本体代码”； 最后一位被称为“ 校验码”。 校验码和本体代码由一个连字号（ - ）连接起来。 以便让人很容易的看出校验码。 但是三证合一后， 组织机构的九位字符全部被纳入统一社会信用代码的第9位至第17位， 其原有组织机构代码上的连字号不带入统一社会信用代码。

					// 原有组织机构代码上的“ 校验码” 的计算规则是:

					// 例如: 某公司的组织机构代码是: 59467239 - 9。 那其最后一位的组织机构代码校验码9是如何计算出来的呢？

					// 第一步: 取组织机构代码的前八位本体代码为基数。 5 9 4 6 7 2 3 9
					// 提示: 如果本体代码中含有英文大写字母。 则A的基数是10， B的基数是11， C的基数是12， 依此类推， 直到Z的基数是35。
					// 第二步: 取加权因子数值，因为组织机构代码的本体代码一共是八位字符。 则这八位的加权因子数值从左到右分别是: 3、 7、 9、 10、 5、 8、 4、 2。
					// 第三步: 本体代码基数与对应位数的因子数值相乘
					// 5× 3＝ 15， 9× 7＝ 63， 4× 9＝ 36， 6× 10＝ 60，
					// 7× 5＝ 35， 2× 8＝ 16， 3× 4 = 12， 9× 2＝ 18
					// 第四步: 将乘积求和相加
					// 15 + 63 + 36 + 60 + 35 + 16 + 12 + 18 = 255
					// 第五步: 将和数除以11， 求余数。
					// 255÷ 11 = 33， 余数是2。

					var firstkey = calc(code.substr(8), firstarray, firstkeys, 11);
                    /*
					第六步:用阿拉伯数字11减去余数，得求校验码的数值。当校验码的数值为10时，校验码用英文大写字母X来表示；当校验码的数值为11时，校验码用0来表示；其余求出的校验码数值就用其本身的阿拉伯数字来表示。
                     11-2＝9，因此此公司完整的组织机构代码为 59467239-9。
                    */
					// 主题识别码 在主题验证码最后一位（index 8 - 16） 在整体的倒数第二位
					var firstword;
					if (firstkey < 10) {
						firstword = firstkey;
					}
					// eslint-disable-next-line eqeqeq
					if (firstkey == 10) {
						firstword = 'X';
						// eslint-disable-next-line eqeqeq
					} else if (firstkey == 11) {
						firstword = '0';
					}
					// eslint-disable-next-line eqeqeq
					if (firstword != code.substr(16, 1)) {
						return false;
					}
                    /*
                         校验码:使用阿拉伯数字或大写英文字母来表示。校验码的计算方法参照 GB/T 17710。
                         例如:某公司的统一社会信用代码为91512081MA62K0260E，那其最后一位的校验码E是如何计算出来的呢？
						 第一步:取统一社会信用代码的前十七位为基数。9 1 5 1 2 0 8 1 21 10 6 2 19 0 2 6 0提示:如果前十七位统一社会信用代码含有英文大写字母（不使用I、O、Z、S、V这五个英文字母）。
						 则英文字母对应的基数分别为:A=10、B=11、C=12、D=13、E=14、F=15、G=16、H=17、J=18、K=19、L=20、M=21、N=22、P=23、Q=24、R=25、T=26、U=27、W=28、X=29、Y=30
						 第二步: 取加权因子数值。 因为统一社会信用代码前面前面有十七位字符。 则这十七位的加权因子数值从左到右分别是， 1、 3、 9、 27、 19、 26、 16、 17、 20、 29、 25、 13、 8、 24、 10、30 、28
                         第三步:基数与对应位数的因子数值相乘。
                         9×1=9，1×3=3，5×9=45，1×27=27，2×19=38，0×26=0，8×16=128
                         1×17=17，21×20=420，10×29=290，6×25=150，2×13=26，19×8=152
                         0×23=0，2×10=20，6×30=180，0×28=0
                         第四步:将乘积求和相加。9+3+45+27+38+0+128+17+420+290+150+26+152+0+20+180+0=1495
                         第五步:将和数除以31，求余数
                         1495÷31=48，余数是17。
                    */
					// 校验码 在整体的最后一位
					var secondkey = calc(code, secondarray, secondkeys, 31);
					// 当数值等31的时候 将值设置为 0
					secondkey = secondkey === 31 ? 0 : secondkey;
                    /*
					 第六步:用阿拉伯数字31减去余数，得求校验码的数值。当校验码的数值为0~9时，就直接用该校验码的数值作为最终的统一社会信用代码的校验码；如果校验码的数值是10~30，
					 则校验码转换为对应的大写英文字母。对应关系为:A=10、B=11、C=12、D=13、E=14、F=15、G=16、H=17、J=18、K=19、L=20、M=21、N=22、P=23、Q=24、R=25、T=26、U=27、W=28、X=29、Y=30
                     因为，31-17＝14，所以该公司完整的统一社会信用代码为 91512081MA62K0260E.
                    */
					var secondword = secondarray[secondkey];
					// eslint-disable-next-line eqeqeq
					if (!secondword || secondword != code.substr(17, 1)) {
						return false;
					}
					var word = code.substr(0, 16) + firstword + secondword;
					// eslint-disable-next-line eqeqeq
					if (code != word) {
						return false;
					}
					return true;
				}
				if (!value) {
					return callback(new Error('请填写统一社会信用代码'))
				} else if (!verify(value)) {
					return callback(new Error('格式不正确'))
				} else {
					callback()
				}
			},
			// 国内手机号
			checkPhone: (rule, value, callback) => {
				const reg = /^1[3|4|5|7|8][0-9]{9}$/
				if (!value) {
					return callback()
				} else if (!reg.test(value)) {
					return callback(new Error('手机号格式不正确'))
				} else {
					callback()
				}
			},
			/**
    		* @description: 电话或者手机号的验证
			* 匹配格式：
			*   11位手机号码
			*   3-4位区号，7-8位直播号码，1－4位分机号
			*   如：12345678901、1234-12345678-1234
    		*/
			checkTel: (isRequired = true) => {
				const validator = (rule, value, callback) => {
					const reg = /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/
					if (!value) {
						if (isRequired) {
							return callback(new Error('不能为空'))
						} else {
							return callback()
						}
					} else if (!reg.test(value)) {
						return callback(new Error('电话或者手机号格式不正确'))
					} else {
						callback()
					}
				};
				return { required: isRequired, validator: validator, trigger: 'blur' }
			},
			// email邮箱
			checkEmail: (isRequired = true) => {
				const validator = (rule, value, callback) => {
					const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
					if (!value) {
						if (isRequired) {
							return callback(new Error('不能为空'))
						} else {
							return callback()
						}
					} else if (!reg.test(value)) {
						return callback(new Error('邮箱格式不正确'))
					} else {
						callback()
					}
				};
				return { required: isRequired, validator: validator, trigger: 'blur' }
			},
			// 正整数(默认不包含0)
			checkInterNum: (isRequired = true, text = '请输入', maxLength = 8, includeZero = false) => {
				const validator = (rule, value, callback) => {
					const reg = /^[1-9][0-9]*$/;
					const max = Math.pow(10, maxLength);
					if (!value) {
						if (isRequired) {
							return callback(new Error(text))
						} else {
							return callback()
						}
						// eslint-disable-next-line eqeqeq
					} else if (value == 0 && includeZero) {
						// 允许输入 0
						return callback()
						// eslint-disable-next-line eqeqeq
					} else if (value == 0 && !includeZero) {
						// 不允许输入 0
						return callback(new Error(`不能为0`))
					} else if (!reg.test(value) || Number(value) > max) {
						return callback(new Error(`请输入一个小于等于${max}的正整数`))
					} else {
						callback()
					}
				}
				return { required: isRequired, validator: validator, trigger: 'blur' }
			},
			// 验证浮点数   主要用于税率 税率（包含0）
			checkFloatNum: (isRequired = true, text = '请输入', maxLength = 5, includeZero = true) => {
				const max = Math.pow(10, maxLength);
				const validator = (rule, value, callback) => {
					const reg = /(^[1-9](\d+)?(\.\d{1,5})?$)|(^\d\.\d{1,5}$)/;
					if (!value) {
						if (isRequired) {
							return callback(new Error(text))
						} else {
							return callback()
						}
						// eslint-disable-next-line eqeqeq
					} else if (value == 0 && includeZero) {
						// 允许输入 0
						return callback()
						// eslint-disable-next-line eqeqeq
					} else if (value == 0 && !includeZero) {
						// 不允许输入 0
						return callback(new Error(`不能为0`))
					} else if (!reg.test(value) || Number(value) > max) {
						return callback(new Error(`请输入小于${max}的数，最多为5位小数`))
					} else {
						callback()
					}
				}
				return { required: isRequired, validator: validator, trigger: 'blur' }
			},
			// 身份证
			checkIdNum: (isRequired = true) => {
				const validator = (rule, value, callback) => {
					const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
					if (!value) {
						if (isRequired) {
							return callback(new Error('证件号码不能为空'))
						} else {
							return callback()
						}
					} else if (!reg.test(value)) {
						return callback(new Error('证件号码格式不正确'))
					} else {
						callback()
					}
				};
				return { required: isRequired, validator: validator, trigger: 'blur' }
			},
			// 类似金钱,首位不为0,最多2位小数
			checkMoney: (rule, value, callback) => {
				const reg = /(^[1-9]([0-9]{1,10})?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
				return {
					pattern: reg,
					message: '整数位应小于等于11位,小数位为2位',
					trigger: 'blur'
				}
			},
			// 4位数验证码
			checkVerificationCode: (rule, value, callback) => {
				const reg = /^\d{4}$/
				if (!value) {
					return callback(new Error('请输入验证码'))
				} else if (!reg.test(value)) {
					return callback(new Error('请输入正确的验证码'))
				} else {
					callback()
				}
			}

		}
	}
}
