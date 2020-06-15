//异步处理

const actions = {
	/* GET_ORGTREE({ commit }) {
		vm.axios.get(`/api/common-service/orgs`, {
			pageNum: 1,
			pageSize: 999999999
		}).then((res) => {
			let data = res.data.records;
			data.sort((a, b) => {
				return a.orderNum - b.orderNum
			})
			const tree = vm.$treeFn.toTree(data, 0, {
				name: "orgName",
				pId: "parentId",
				pName: "pName",
				children: "children",
				originNode: "根节点"
			});
			commit('SET_ORGTREE', tree);
		});
	}, */
}

export default actions
