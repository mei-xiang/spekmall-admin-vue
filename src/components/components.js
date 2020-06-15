/*
 * @Description: 全局组件注册
 * @Author: jiaxin
 * @Date: 2019-06-29 15:35:01
 * @LastEditors: jiaxin
 * @LastEditTime: 2019-06-29 16:10:39
 */

import MainTable from './MainTable';
import MainPage from './MainPage';
import BtnList from './BtnList';
import MainTabs from './tabs/MainTabs';
import MainForm from './form/MainForm';
import FileUploadDialog from './dialog/FileUploadDialog';
import ImportDialog from './dialog/ImportDialog';
import FileList from './file/FileList';
import DragY from './layout/DragY';


export default (Vue) => {
	Vue.component("MainTable", MainTable);
	Vue.component("MainPage", MainPage);
	Vue.component("BtnList", BtnList);
	Vue.component("MainTabs", MainTabs);
	Vue.component("MainForm", MainForm);
	Vue.component("FileUploadDialog", FileUploadDialog);
	Vue.component("ImportDialog", ImportDialog);
	Vue.component("FileList", FileList);
	Vue.component("DragY", DragY);
}
