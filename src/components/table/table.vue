<template>
    <div>
        <waiting :waiting="tablemateData" v-if="ishaveWaiting"></waiting>
        <table-button :tablebutton="tablemateData" @addDATA="onAddData" @deleteDATA="onDeleteData" @updateDATA="onUpdateData" @selectDATA="onSelectData"></table-button>
        <my-table :tabledata="tablemateData"></my-table>
        <pagination class="table_page" :paginationconfig="tablemateData" @get-show-data="eachPageShowMany" v-if="tablemateData.config.hasPagination"></pagination>
    </div>
</template>

<script>
import waiting from './childcomponents/waiting';
import TableButton from './childcomponents/TableButton';
import myTable from './childcomponents/myTable';
import pagination from './childcomponents/pagination';
export default {
    props: ['tablematedata', 'urladdress', 'deleteItems'],
    data() {
        return {
            tablemateData: this.tablematedata,
            urlAddress: this.urladdress,
            deleteItemArr: this.deleteItems,
            eventUpData: null,
            ishaveWaiting: false
        }
    },
    created() {
        this.ishaveWaiting = this.tablemateData.config.ishaveWaiting;
        let reqdata = {};
        reqdata.showMany = this.tablemateData.paginationconfig.eachPageShowCount;
        reqdata.pageCode = this.tablemateData.paginationconfig.currentPageCode;
        this.changePageCount();
        this.onSelectData(reqdata);
        // this.getTelElement(this.tablemateData.telClass)
    },
    mounted() {
        //传参 调用方法
        let myclass = this.tablemateData.theadData[2].class;
        this.getTelElement(myclass);

    },
    methods: {
        eachPageShowMany: function (selectDATA) {
            this.tablemateData.paginationconfig.eachPageShowCount = selectDATA.showMany;
            this.tablemateData.paginationconfig.currentPageCode = selectDATA.pageCode;
            this.changePageCount();
            this.onSelectData(selectDATA);
            console.log('每页显示记录条数：', this.tablemateData.paginationconfig.eachPageShowCount);
        },
        changePageCount() {
            let count = Math.ceil(this.tablemateData.paginationconfig.totalCount / this.tablemateData.paginationconfig.eachPageShowCount);
            this.tablemateData.paginationconfig.totalPageCount = count;
        },
        viewNeedData(response) {
            let curpage = this.tablemateData.paginationconfig.currentPageCode;
            let eachMany = this.tablemateData.paginationconfig.eachPageShowCount;
            let startpos = (curpage - 1) * eachMany;
            this.tablemateData.tbodyData = response.body.tableList.slice(startpos, startpos + eachMany);
            console.log("视图数据", this.tablemateData.tbodyData);
        },
        // 增加
        onAddData(data) {
            data.newFileName = 'nemname';
            // 自定义通讯工具函数
            // 此处仅做示例 具体功能自行封装
            dataInteraction('/api/search', 'POST', data);
        },

        // 删除
        onDeleteData(data) {
            console.log('<<<<<<<<<<<<<<<<<<<<<<<<<上送报文>>>>>>>>>>>>>>>>>>>>>', data);
            this.deleteItemArr = this.deleteItemArr.concat(data.deleteWhichItem);
            this.tablemateData.config.isshowWaiting = true;
            this.$http.get(this.urlAddress)
                .then(
                response => {
                    response.ReturnCode = response.ReturnCode == '000000' ? response.ReturnCode : response.body;
                    if (response.ReturnCode) {
                        // console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<接受报文>>>>>>>>>>>>>>>>>>>>>\n', response);
                        let that = this;
                        setTimeout(() => { that.tablemateData.config.isshowWaiting = false; }, 500);
                        //this.tableData.config.isshowWaiting = false;
                        response.body.tableList.forEach((item, index) => item.ID = index);// 增加每条记录标识
                        // 过滤掉已经删除过的数据
                        this.deleteItemArr.forEach((item, index) => {
                            response.body.tableList.forEach((item2, index2) => {
                                if (item == item2.ID) {
                                    response.body.tableList.splice(index2, 1);
                                }
                            })
                        });
                        this.tablemateData.paginationconfig.totalCount = response.body.tableList.length;
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
        // 查询
        onSelectData(data) {
            // console.log('<<<<<<<<<<<<<<<<<<<<<<<<<上送报文>>>>>>>>>>>>>>>>>>>>>', data);
            this.tablemateData.config.isshowWaiting = true;
            this.$http.get(this.urlAddress)
                .then(
                response => {
                    response.ReturnCode = response.ReturnCode == '000000' ? response.ReturnCode : response.body;
                    if (response.ReturnCode) {
                        // console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<接受报文>>>>>>>>>>>>>>>>>>>>>\n', response);
                        let that = this;
                        setTimeout(() => { that.tablemateData.config.isshowWaiting = false; }, 500);
                        //this.tableData.config.isshowWaiting = false;
                        let startpos = (data.pageCode - 1) * data.showMany;
                        response.body.tableList.forEach((item, index) => item.ID = index);// 增加每条记录标识
                        this.deleteItemArr.forEach((item, index) => {
                            response.body.tableList.forEach((item2, index2) => {
                                if (item == item2.ID) {
                                    response.body.tableList.splice(index2, 1);
                                }
                            })
                        });
                        this.tablemateData.paginationconfig.totalCount = response.body.tableList.length;
                        this.changePageCount();
                        this.viewNeedData(response);
                    }
                },
                response => console.log('错误' + response)
                )
        },

        // 手机号码3-4-4格式
        emptyAll: function (str, global) {
            var telre;
            telre = str.replace(/(^\s+)|(\s+$)/g, "");
            if (global.toLowerCase() == "g") {
                telre = telre.replace(/\s/g, "");
            }
            return telre;
        },

        // 将格式化的电话号码绑定在页面上   
        getTelElement: function (name) {
            setTimeout(() => {
                var telArr = document.getElementsByClassName(name);
                console.log(telArr);
                for (var i = 0; i < telArr.length; i++) {
                    let txt = telArr[i].innerHTML;
                    telArr[i].innerHTML = txt.substr(0, 3) + " " + txt.substr(3, 4) + " " + txt.substr(7, 4);
                };
            }, 1000)

            // var newTelCon;
            // console.log('我的数据：', telArr instanceof Array);
            // telArr.forEach(item =>{
            //     console.log('手机号',item.innerText);
            // })
            // for (var i = 0; i < telArr.length; i++) {
            //     console.log('hello');
            //     // var telHtml = telArr[i].innerHTML.trim(); //清除空格后的电话号码
            //     // console.log('清除空格后的电话号码',telHtml);
            //     // var newTel = telHtml.substr(0, 3) + " " + telHtml.substr(3, 4) + " " + telHtml.substr(7, 4);

            //     // telArr[i].innerHTML = newTel;
            //     // newTelCon = telArr[i].innerHTML

            // }

            // return newTelCon;

        }

    },
    components:{
        waiting,
        TableButton,
        myTable,
        pagination
    }

} 
</script>

