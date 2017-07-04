<template>
    <div id="table" style="margin:30px;transition:all 2s;">
        <zdy-table :tablematedata="tableData" @get-show-data="eachPageShowMany" @addData="onAddData" @deleteData="onDeleteData" @updateData="onUpdateData" @selectData="onSelectData"></zdy-table>
    </div>
</template>	
<script>
//import ProductsPreviewTool from '@/components/productsDetailInfo/productsPreviewTool';
import axios from 'axios';
import data from '../../zdyComponents/data/data';
export default {
    name: 'table',
    data: function () {
        return {
            // 此处的 tableData 可定义 但其数据结构以及内部的属性不可改
            tableData: {
                // 控制是否显示为功能性表格
                config: {
                    ishaveCheckbox: true, //true显示多选 false 不显示
                    ishaveHandle: true, // true 显示 可操作按钮 false 不显示
                    isfunctionTablle: true,//true 显示增、删、改、查   false不显示
                    ishaveWaiting: true, // 控制组件是否存在
                    isshowWaiting: false, // 控制组件是否显示 初始化不显示
                },
                paginationconfig: {
                    eachPageShowCount: 10, //每页显示多少条记录  根据页面布局设置
                    totalPageCount: 5, // 默认为5页 此值需要在初始化页面数据时重新计算
                    totalCount: 50,// 该值需要在第一次访问接口时返回
                    currentPageCode: 1 //默认当前第一页为当前页
                },
                // 不允许改变数据结构  只需按需配置字段名即可
                theadData: [{
                    theadText: '机构编码',
                    fieldName: 'mechanismCode'
                }, {
                    theadText: '机构名', // 表头显示的文本节点
                    fieldName: 'mechanismName' // 接口中对应的字段名 
                }, {
                    theadText: '任务码',
                    fieldName: 'taskCode'
                }, {
                    theadText: '理财计划',
                    fieldName: 'taskName'
                }, {
                    theadText: '任务确保目标（万元）',
                    fieldName: 'taskSure'
                }, {
                    theadText: '目标额',
                    fieldName: 'taskTarget'
                }],
                tbodyData: [],// 异步请求 api.json 中的数据
            },
            url: '../static/data/home_table.json',
            deleteItem: [] // 记住批量删除操作的标识
        }
    },
    created() {
        let reqdata = {};
        reqdata.showMany = this.tableData.paginationconfig.eachPageShowCount;
        reqdata.pageCode = this.tableData.paginationconfig.currentPageCode;
        this.changePageCount();
        this.onSelectData(reqdata);
    },
    methods: {
        // 此处的事件处理程序照抄即可 没它的结果就是每页显示多少的下拉按钮不起作用
        eachPageShowMany: function (selectDATA) {
            this.tableData.paginationconfig.eachPageShowCount = selectDATA.showMany;
            this.tableData.paginationconfig.currentPageCode = selectDATA.pageCode;
            this.changePageCount();
            this.onSelectData(selectDATA);
            console.log('每页显示记录条数：', this.tableData.paginationconfig.eachPageShowCount);
        },
        changePageCount(){
           let count = Math.ceil(this.tableData.paginationconfig.totalCount/this.tableData.paginationconfig.eachPageShowCount);
           this.tableData.paginationconfig.totalPageCount = count;
        },
        viewNeedData(response){
            let curpage = this.tableData.paginationconfig.currentPageCode;
            let eachMany = this.tableData.paginationconfig.eachPageShowCount;
            let startpos = ( curpage- 1) * eachMany;
            this.tableData.tbodyData = response.body.tableList.slice(startpos, startpos+eachMany);
            console.log("视图数据" ,this.tableData.tbodyData);
        },
        // 新增
        onAddData(data) {
            // 此处的 data 已被证实为对象结构 所以 可以丰富上送数据
            // 如下：
            data.newFileName = 'nemname';
            // 自定义通讯工具函数
            // 此处仅做示例 具体功能自行封装
            dataInteraction('/api/search', 'POST', data);
        },
        // 删除
        onDeleteData(data) {
             console.log('<<<<<<<<<<<<<<<<<<<<<<<<<上送报文>>>>>>>>>>>>>>>>>>>>>', data);
             this.deleteItem = this.deleteItem.concat(data.deleteWhichItem);
             this.tableData.config.isshowWaiting = true;
             this.$http.get(this.url)
                .then(
                response => {
                    response.ReturnCode = response.ReturnCode == '000000' ? response.ReturnCode : response.body;
                    if (response.ReturnCode) {
                        console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<接受报文>>>>>>>>>>>>>>>>>>>>>\n', response);
                        let that = this;
                        setTimeout(() => {that.tableData.config.isshowWaiting = false;},500);
                        //this.tableData.config.isshowWaiting = false;
                        response.body.tableList.forEach((item,index) => item.ID = index);// 增加每条记录标识
                        // 过滤掉已经删除过的数据
                        this.deleteItem.forEach((item,index) => {
                             response.body.tableList.forEach((item2,index2) => {
                                 if(item == item2.ID){
                                     response.body.tableList.splice(index2,1);
                                 }
                             })
                        });
                        this.tableData.paginationconfig.totalCount = response.body.tableList.length;
                        this.changePageCount();
                        this.viewNeedData(response);
                    }
                },
                response => console.log('错误' + response)
                )
        },
        // 修改
        onUpdateData(data) {
            dataInteraction('/api/search', 'GET', data);
        },
         /**
          * 功能：查询数据 
          * @params data {Object}结构为：{pageCode:1,showMany:10}
          */ 
        onSelectData(data) {
            console.log('<<<<<<<<<<<<<<<<<<<<<<<<<上送报文>>>>>>>>>>>>>>>>>>>>>', data);
            this.tableData.config.isshowWaiting = true;
            this.$http.get(this.url)
                .then(
                response => {
                    response.ReturnCode = response.ReturnCode == '000000' ? response.ReturnCode : response.body;
                    if (response.ReturnCode) {
                        console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<接受报文>>>>>>>>>>>>>>>>>>>>>\n', response);
                        let that = this;
                        setTimeout(() => {that.tableData.config.isshowWaiting = false;},500);
                        //this.tableData.config.isshowWaiting = false;
                        let startpos = (data.pageCode - 1) * data.showMany;
                        response.body.tableList.forEach((item,index) => item.ID = index);// 增加每条记录标识
                        this.deleteItem.forEach((item,index) => {
                             response.body.tableList.forEach((item2,index2) => {
                                 if(item == item2.ID){
                                     response.body.tableList.splice(index2,1);
                                 }
                             })
                        });
                        this.tableData.paginationconfig.totalCount = response.body.tableList.length;
                        this.changePageCount();
                        this.viewNeedData(response);
                    }
                },
                response => console.log('错误' + response)
                )
        }
    }
    // components: [child]
};
</script>
<style>
@import '../style/table.css';
</style>