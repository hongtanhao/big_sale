import Vue from 'vue';
// import $ from 'jquery';
export default function () {
    var mine;
    var opts = {
        props: ['tablematedata','urladdress','deleteItems'],
        template: `<div>
            <waiting :waiting="tablemateData" v-if="ishaveWaiting"></waiting>  
             <my-table-button :tablebutton="tablemateData" 
                @addDATA="onAddData"
                @deleteDATA="onDeleteData"
                @updateDATA="onUpdateData"
                @selectDATA="onSelectData"
                ></my-table-button>  
            <my-table :tabledata="tablemateData"></my-table>
            <my-pagination class="table_page" :paginationconfig="tablemateData" @get-show-data="eachPageShowMany" v-if="tablemateData.config.hasPagination"></my-pagination>
        </div>`,
        data() {
            return {
                tablemateData: this.tablematedata,
                urlAddress: this.urladdress,
                deleteItemArr: this.deleteItems,
                eventUpData: null,
                ishaveWaiting:false
            }
        },
        created(){
            this.ishaveWaiting = this.tablemateData.config.ishaveWaiting;
            let reqdata = {};
            reqdata.showMany = this.tablemateData.paginationconfig.eachPageShowCount;
            reqdata.pageCode = this.tablemateData.paginationconfig.currentPageCode;
            this.changePageCount();
            this.onSelectData(reqdata);
        },
        methods: {
            eachPageShowMany: function (selectDATA) {
                this.tablemateData.paginationconfig.eachPageShowCount = selectDATA.showMany;
                this.tablemateData.paginationconfig.currentPageCode = selectDATA.pageCode;
                this.changePageCount();
                this.onSelectData(selectDATA);
                console.log('每页显示记录条数：', this.tablemateData.paginationconfig.eachPageShowCount);
            },
            changePageCount(){
               let count = Math.ceil(this.tablemateData.paginationconfig.totalCount/this.tablemateData.paginationconfig.eachPageShowCount);
               this.tablemateData.paginationconfig.totalPageCount = count;
            },
            viewNeedData(response){
                let curpage = this.tablemateData.paginationconfig.currentPageCode;
                let eachMany = this.tablemateData.paginationconfig.eachPageShowCount;
                let startpos = ( curpage- 1) * eachMany;
                this.tablemateData.tbodyData = response.body.tableList.slice(startpos, startpos+eachMany);
                console.log("视图数据" ,this.tablemateData.tbodyData);
            },
            // allSelect() {
            //     this.tablemateData.tbodyData.forEach(item => {
            //         item.perCheck = this.allCheck
            //     });
            //     this.tableData.tbodyData.forEach(item => item.checked = true);
            // },
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
                            setTimeout(() => {that.tablemateData.config.isshowWaiting = false;},500);
                            //this.tableData.config.isshowWaiting = false;
                            response.body.tableList.forEach((item,index) => item.ID = index);// 增加每条记录标识
                            // 过滤掉已经删除过的数据
                            this.deleteItemArr.forEach((item,index) => {
                                 response.body.tableList.forEach((item2,index2) => {
                                     if(item == item2.ID){
                                         response.body.tableList.splice(index2,1);
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
                            setTimeout(() => {that.tablemateData.config.isshowWaiting = false;},500);
                            //this.tableData.config.isshowWaiting = false;
                            let startpos = (data.pageCode - 1) * data.showMany;
                            response.body.tableList.forEach((item,index) => item.ID = index);// 增加每条记录标识
                            this.deleteItemArr.forEach((item,index) => {
                                 response.body.tableList.forEach((item2,index2) => {
                                     if(item == item2.ID){
                                         response.body.tableList.splice(index2,1);
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
                }

        }
    };
    // 定义等待组价
    Vue.component('waiting', {
        props: ["waiting"],
        template:
        `<div v-if="tabaleData.config.isshowWaiting" class="waiting">
            <img src="../static/loading.svg">
        </div>`,
        data() {
            return {
                tabaleData: this.waiting
            }
        }
    });
    // 定义基本表格
    Vue.component('my-table', {
        props: ['tabledata'],
        template: `<div>
            <table class="zdy-table">
                <thead>
                     <th v-if="tableData.config.ishaveCheckbox"><input type="checkbox" ref="allcheck" @click="allSelect" class="all_check"></th>
                     <th v-for="(item,index) in tableData.theadData" :key="index">{{item.theadText}}</th>
                     <th v-if="tableData.config.ishaveHandle">操作</th>
                </thead>
                <tbody>
                    <tr v-for="(item1,index1) in tabledata.tbodyData" :key="index1" v-if="isDeletaRow">
                        <td v-if="tableData.config.ishaveCheckbox"><input type="checkbox" ref="checkbox"  @click.stop="singleSelect(item1)"></td>
                        <td v-for="(item2,index2) in tableData.theadData">{{item1[item2.fieldName]}}</td>
                        <td v-if="tableData.config.ishaveHandle">
                            <a class="td-button td-button-delete table_btn" @click.stop="onTdDeleta">删除</a>
                            <a class="td-button td-button-examine table_btn" @click.stop="onTdExamine">查看</a>
                        </td>         
                    </tr>
                </tbody>
            </table>
        </div>`,
        data() {
            return {
                tableData: this.tabledata,
                // data:this.tabledata.tbodyData,
                isDeletaRow: true, // 默认显示该列
            }
        },
        created() {
            this.tableData.tbodyData.forEach(item => item.checked = false);
            
        },
        methods: {
            onTdDeleta(e) {
                let target = e.target;
                target.parentNode.parentNode.remove();
                //this.isDeletaRow = false;
            },
            // 实现全选、反选
             allSelect() {
                let random = this.tableData.tbodyData.every(item =>!item.checked);
                if(random){
                    this.tableData.tbodyData.forEach(item =>item.checked = true);
                    this.$refs.checkbox.forEach(item =>item.checked = true);
                }else{
                    let random = this.tableData.tbodyData.every(item =>item.checked);
                    if(random){
                        this.tableData.tbodyData.forEach(item => item.checked = false);
                        this.$refs.checkbox.forEach(item =>item.checked = false);
                    }else{
                         this.$refs.allcheck.disabled = true;
                    }
                }
            },
            singleSelect(item1) {
                    item1.checked= !item1.checked;
                    this.tabledata.tbodyData.forEach(item2 =>{
                        if(item2.checked){
                           //当当前的这个按钮被选之后，正好所有的按钮都处于选择状态时 
                            let allChecked = this.tableData.tbodyData.every(item => item.checked);
                            console.log('判断是否全选', allChecked);
                            if(allChecked){
                                this.$refs.allcheck.disabled = false;
                                this.$refs.allcheck.checked = true;
                            }
                        }else{
                            this.$refs.allcheck.disabled = false;
                            this.$refs.allcheck.checked = false;
                            console.log('mmmmmmfalse');
                        }
                    });
                },
            onTdExamine() { }
        },
        watch: {
            // 注意：当监听的数据结构为数组或者是对象 newval and oldval 是同一个指针地址
            'tableData.paginationconfig.eachPageShowCount': {
                handler: function (newVal, oldVal) {
                    console.log('变换着的记录条数', '新值==>', newVal, '旧值==>', oldVal);
                    if (oldVal > newVal) {
                        mine.tableData.tbodyData = mine.tableData.tbodyData.slice(0, newVal);
                        console.log('我是变换着的数据', mine.tableData.tbodyData);
                    } else {
                        // 此处调用查询接口 
                    }
                },
                deep: true //对象内部的属性监听，也叫深度监听
            }
        }
    });

    // 定义功能性表格按钮
    Vue.component('my-table-button', {
        props: ['tablebutton'],
        template: `<div v-if="tableButton.config.isfunctionTablle">
                <ul class="table-button">
                    <li class="table-button-and table_btn" @click.stop="onAnd" v-if="tableButton.config.hasAddBtn">新增</li>
                    <li class="table-button-delete table_btn" @click.stop="onDelete" v-if="tableButton.config.hasDelBtn">删除</li>
                    <li class="table-button-modify table_btn" @click.stop="onModify" v-if="tableButton.config.hasUpdBtn">修改</li>
                    <li class="table-button-examine table_btn" @click.stop="onExamine" v-if="tableButton.config.hasExaBtn">查看</li>
                    <div style="display:none;" ref="dialog"><dialog-box :dialogbox="tableButton"></dialog-box></div>
                </ul>
           </div>`,
        data() {
            return {
                tableButton: this.tablebutton,
                isshowDialog: false
            }
        },
        methods: {
            onAnd(e) {
                this.$refs.dialog.style.display = 'block';
                //this.isshowDialog = true;
            },
            onDelete() {
                document.getElementsByClassName('all_check')[0].checked = false;
                var a_target = [];//缓存将要批量删除的记录ID
                this.tableButton.tbodyData.forEach((item, index) => {
                    if (item.checked) {
                        a_target.push(item.ID);
                    }
                });
                let a_tep = this.tableButton.tbodyData.filter(function (item) { return !item.checked });
                this.tableButton.tbodyData = a_tep;
                var requestInfo = {};
                requestInfo.handleType = 'delete';
                requestInfo.deleteWhichItem = a_target;
                this.$emit('deleteDATA', requestInfo);
            },
            onModify() {
                var requestInfo = {
                    handleType: 'updata'
                };
                this.$emit('updateDATA', requestInfo);
            },
            onExamine() {
                var requestInfo = {
                    handleType: 'select'
                };
                this.$emit('selectDATA', requestInfo);
            }
        }
    });
    // 自定义新增弹框
    Vue.component('dialog-box', {
        props: ['dialogbox'],
        template: `<div class="dialogbox">
                <h3 style="text-align:center;padding:1rem;">新增记录</h3>
                <div v-for="(item,index) in tableData.theadData">
                    <p>{{item.theadText}}<input type="text" :class="item.fieldName+index" /></p>
                </div>
                <div style="text-align:center;">
                    <a class="dialog-btn-close" @click.stop="onClose">x</a>
                    <a class="dialog-btn-cancel" @click.stop="onCancel">取消</a>
                    <a class="dialog-btn-submit" @click.stop="onSubmit">提交</a>
                </div>
            </div>`,
        data() {
            return {
                tableData: this.dialogbox,
                // data:this.tabledata.tbodyData,
                isDeletaRow: true // 默认显示该列
            }
        },
        methods: {
            onClose(e) {
                e.target.parentNode.parentNode.parentNode.style.display = 'none';
            },
            onCancel(e) {
                e.target.parentNode.parentNode.parentNode.style.display = 'none';
            },
            onSubmit() {
                var that = this;
                // 获取表格中输入的字段值
                var requestInfo = {}; // 上送报文数据
                requestInfo.handleType = 'add';
                that.tableData.theadData.forEach((item, index) => {
                    requestInfo[item.fieldName] = document.getElementsByClassName(item.fieldName + index)[0].value;
                });
                this.$emit('addDATA', requestInfo)
            }
        }
    });

    /**
     * 功能：自定义分页器
     * 原理：每次只请求当前页的数据 
     * 注意：总页数需要计算 
     * @type {Array}
     */
    Vue.component('my-pagination', {
        props: ['paginationconfig'],
        template: `<div>
                <div style="float:left;">
                    <ul class="pagination">
                        <li @click.stop="switchFirstPage">首页</li>
                        <li class="prev" @click.stop="onPrev"><</li>
                        <li v-for="n in paginationConfig.paginationconfig.totalPageCount" ref="my-li" @click="swicthCurrentPage">
                        {{n}}
                        </li>
                        <li class="next" @click.stop="onNext">></li>
                        <li @click.stop="switchLastPage">尾页</li>
                        <!--<li class="search-page">跳到第
                            <input type="text" class="link-which-page" v-model="linkPage" @change="onSearhcPage">页
                            <input  type="button" class="sure-search" placeholder = "确定" value="确定" style="padding:0 1rem;">
                        </li>-->
                    </ul>
                </div>
                <div style="float:right;"">
                    <form>
                        每页显示记录
                            <select name="" id="" ref="my-select" @change="onEachPageShowMany" v-model="showMany">
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="30">30</option>
                                <option value="40">40</option>
                            </select>
                            条
                        
                    </form> 
                </div>   
            </div>`,
        data() {
            return {
                paginationConfig: this.paginationconfig,
                curPageIndex: null,
                linkPage: 2,
                myLi: null,
                showMany: 10,
                selectDATA: {}
            }
        },
        created() {
            this.showMany = this.paginationConfig.paginationconfig.eachPageShowCount;
            console.log('默认每页显示', this.showMany);
        },
        mounted() {
            this.myLi = this.$refs['my-li'];
            this.myLi[0].className = 'current-page';
            let curPage = document.getElementsByClassName('current-page')[0];
            this.curPageIndex = this.myLi.indexOf(curPage);
        },
        methods: {
            onPrev() {
                this.myLi.forEach((item) => item.className = '');
                this.curPageIndex--;
                if (this.curPageIndex == -1) {
                    this.curPageIndex = 0;
                }
                this.myLi[this.curPageIndex].className = 'current-page';
                this.onEachPageShowMany();
            },
            onNext() {
                this.myLi.forEach((item) => {
                    if (item.className = 'current-page') {
                        item.className = '';
                    }
                    //break;
                });
                this.curPageIndex++;
                if (this.curPageIndex == this.myLi.length) {
                    this.curPageIndex = this.myLi.length - 1;
                }
                this.myLi[this.curPageIndex].className = 'current-page';
                this.onEachPageShowMany();
            },
            onSearhcPage() {
                var that = this;
                if (this.linkPage >= this.myLi.length) {
                    this.linkPage = this.myLi.length;
                }
                this.myLi.forEach((item, index) => {
                    if (item.innerText == that.linkPage) {
                        that.myLi.forEach((item2) => item2.className = '');
                        item.className = 'current-page'
                    }
                });
                this.onEachPageShowMany();
            },
            switchFirstPage() {
                this.calcelCurrentClass();
                this.myLi[0].className = 'current-page';
                this.onEachPageShowMany();
            },
            switchLastPage() {
                this.calcelCurrentClass();
                this.myLi[this.myLi.length - 1].className = 'current-page';
                this.onEachPageShowMany();
            },
            swicthCurrentPage(e) {
                this.calcelCurrentClass();
                e.target.className = 'current-page';
                this.onEachPageShowMany();
            },
            calcelCurrentClass() {
                this.myLi.forEach((item) => {
                    if (item.className = 'current-page') {
                        item.className = '';
                    }
                    //break;
                });
            },
            onEachPageShowMany() {
                this.selectDATA.handleType = 'select';
                this.selectDATA.showMany = this.showMany / 1;
                this.selectDATA.pageCode = document.getElementsByClassName('current-page')[0].innerText / 1;
                this.$emit('get-show-data', this.selectDATA);
            }
        }

    });

    // 自定义表格组件
    Vue.component('zdy-table', opts);
}    
