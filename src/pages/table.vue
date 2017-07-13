<template>
    <div id="table" style="margin:30px;transition:all 2s;">
        <table :tablematedata="tableData" :urladdress="url" :deleteItems="deleteItem"></table>
    </div>
</template> 
<script>

import table from '@/components/table/table';
// import axios from 'axios';
// import data from '../../zdyComponents/data/data';
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
                    hasAddBtn: true, //true 显示添加按钮 false不显示
                    hasDelBtn: true, //true 显示删除按钮 false不显示
                    hasUpdBtn: true, //true 显示修改按钮 false不显示
                    hasExaBtn: true, //true 显示查看按钮 false不显示
                    hasPagination: true //true 显示分页 false不显示
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
                    fieldName: 'mechanismCode',
                    class: 'code_class'
                }, {
                    theadText: '机构名', // 表头显示的文本节点
                    fieldName: 'mechanismName', // 接口中对应的字段名 
                    class: 'name_class'
                }, {
                    theadText: '联系电话',
                    fieldName: 'contactTel',
                    class: 'tel_class'
                }, {
                    theadText: '理财计划',
                    fieldName: 'taskName',
                    class: 'task_class'
                }, {
                    theadText: '任务确保目标（万元）',
                    fieldName: 'taskSure',
                    class: 'sure_class'
                }, {
                    theadText: '目标额',
                    fieldName: 'taskTarget',
                    class: 'target_class'
                }],
                tbodyData: [],// 异步请求 api.json 中的数据
                telClass: '.tel_class'
            },

            url: '../static/data/home_table.json',
            deleteItem: [] // 记住批量删除操作的标识
        }
    },
    components:{
        table
    }
};
</script>
<style>
@import '../style/table.css';
</style>