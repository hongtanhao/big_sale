<template>
    <div id="table" style="margin:30px;transition:all 2s;">
        <zdy-table :tablematedata="tableData" :urladdress="url" :deleteItems="deleteItem"></zdy-table>
    </div>
</template> 
<script>

import zdyTable from '@/components/table/table';
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
        zdyTable
    }
};
</script>
<style>
* {
    padding: 0;
    margin: 0;
}


/*定义表格基本样式*/

.zdy-table {
    border-collapse: collapse; 
    width: 100%; 
    border: 1px solid #e6e6e6;
    margin-top: 15px; 
}
.zdy-table thead th{
    background:#f2f2f2;
    font-weight: normal;
}
.zdy-table td,.zdy-table th{
    padding: 8px;
    text-align: left;
}
a.td-button-delete,a.td-button-examine{
    padding: 2px 8px;
}
.zdy-table tbody tr:nth-child(even){
   background: #f9f9f9; 
}
.zdy-table tbody tr:hover{
    background: #ddd;
}
.table_page{
    height:30px;
    line-height:30px;
    margin-top: 10px;
}
/**
   * 定义表格按钮样式
   */

.table-button {
    padding: 0;
    margin: 0;
}

.table_btn {
    display: inline-block;
    padding: 6px 12px;
    color: #fff;
    background: #ff5c5c;
    border: 1px solid #ff5c5c;
    cursor: pointer;
    border-radius: 4px;
}
.table_btn:hover{
    background: #ff5c5c;
    opacity: 0.7;
    color: #fff;
    border: 1px solid #ff5c5c;
}

/*定义分页器样式*/

ul.pagination {
    font-size: 0;
    margin:0;
}

.pagination li{
    display: inline-block;
    height: 30px;
    font-size:12px;
    padding:0 12px;
    text-align: center;
    border:1px solid #e6e6e6;
    color: #999;
    margin-right:5px;
    cursor: pointer;
}
.pagination li:hover{
    background: #f9f9f9; 
}
.pagination li.current-page {
    background-color: #ff5c5c;
    color: #fff;
    border-color:#ff5c5c;
}
/*.prev:after,
.next:after {
    display: table;
    content: '';
    height: .5rem;
    width: 1rem;
    box-sizing: border-box;
    border-top: transparent solid .25rem;
    border-bottom: transparent solid .25rem;
    border-left: transparent solid .5rem;
    border-right: #000 solid .5rem;
}*/

/*.next:after {
    border-right: transparent solid .5rem;
    border-left: #000 solid .5rem;
}*/

/*定义新增弹框样式*/

.dialogbox {
    position: absolute;
    z-index: 100;
    top: 100px;
    left: 100px;
    background-color: rgba(255, 255, 255, .86);
    padding: 2rem 3rem;
    text-align: left;
    box-shadow: 0 0 1rem rgba(0, 0, 0, .7);
}
.dialogbox p{
    text-align: right;
}
.dialogbox input {
    float: right;
}

.dialog-btn-close {
    position: absolute;
    top: 0;
    right: 0;
    display: inline-block;
    line-height: 2rem;
    width: 2rem;
    text-align: center;
    background-color: red;
    color: #fff;
}

.dialog-btn-cancel,
.dialog-btn-submit {
    display: inline-block;
    line-height: 1rem;
    padding: .5rem 1rem;
    text-align: center;
    background-color: red;
    position: relative;
    /*left: 80px;*/
    top: 20px;
    color: #fff;
}

.dialog-btn-submit {
    background-color: green;
}

.waiting{
   position:absolute;
   top:25%;
   transform:translateY(-50%);
   text-align: center;
   animation:waiting 1s linear  infinite;   
   animation-play-state:running;
   left: 28%;  
}
.waiting svg{
    left: 200px;
}
@keyframes waiting /*定义动画名*/  
    {   
    0%   {transform:rotate(0)} /*定义起始帧样式，0%可以换成from*/  
    
    100% {transform:rotate(360deg)} /*定义结束帧样式，100%可以换成to*/  
    }   

</style>

