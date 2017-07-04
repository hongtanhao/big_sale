import Vue from 'vue';
export default function () {
    var mine;
    var opts = {
        props: ['tablematedata'],
        template: `<div>
            <waiting :waiting="tablemateData" v-if="ishaveWaiting"></waiting>  
            <my-table-button :tablebutton="tablemateData" 
                @addDATA="onAddData"
                @deleteDATA="onDeleteData"
                @updateDATA="onUpdateData"
                @selectDATA="onSelectData"
                ></my-table-button>  
            <my-table :tabledata="tablemateData"></my-table>
            <my-pagination :paginationconfig="tablemateData" @get-show-data="eachPageShowMany"></my-pagination>
        </div>`,
        data() {
            return {
                tablemateData: this.tablematedata,
                eventUpData: null,
                ishaveWaiting:false
            }
        },
        components: {
            // 'my-table-button':'my-table-button',
            // 'my-table':'my-table',
            // 'my-pagination':'my-pagination'  
        },
        created(){
            this.ishaveWaiting = this.tablemateData.config.ishaveWaiting;
            console.log('是否有等待组件' ,this.tablemateData.config.ishaveWaiting);
        },
        methods: {
            // 组件拥有事件 不允许改动
            eachPageShowMany(showMany) {
                this.eventUpData = showMany;
                this.$emit('get-show-data', this.eventUpData);
            },
            onAddData(data) {
                this.$emit('addData', data);
            },
            onDeleteData(data) {
                this.$emit('deleteData', data);
            },
            onUpdateData(data) {
                this.$emit('updateData', data);
            },
            onSelectData(data) {
                this.$emit('selectData', data);
            }

        }
    };
    // 定义等待组价
    Vue.component('waiting', {
        props: ["waiting"],
        template:
        `<div v-if="tabaleData.config.isshowWaiting" class="waiting">
                 <svg t="1499090750144" class="icon" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3934" xmlns:xlink="http://www.w3.org/1999/xlink" width="80" height="80"><defs><style type="text/css"></style></defs><path d="M462 89l-10.5 10.5Q441 110 441 139.5t21 50q21 20.5 50 20.5t50-20.5q21-20.5 21-50t-21-50Q541 69 512 69t-50 20M188 207l-10.5 10.5Q167 228 167 256t20.5 48.5Q208 325 236 325t48.5-20.5Q305 284 305 256t-20.5-48.5Q264 187 236 187t-48 20M63 514q0 26 18.5 44t44 18q25.5 0 44-18t18.5-44q0-26-18.5-44.5t-44-18.5q-25.5 0-44 18.5T63 514m127 243l-8 8q-8 8-8 30.5t15.5 38.5q15.5 16 38 16t38.5-16q16-16 16-38.5T266 757q-16-16-38.5-16T190 757m277 156q0 19 14 33t33.5 14q19.5 0 33-14t13.5-33q0-20-13.5-33.5t-33-13.5q-19.5 0-33.5 13.5T467 913m304-108q0 14 10 23.5t24 9.5q14 0 24-9.5t10-23.5q0-14-10-24t-24-10q-14 0-24 10t-10 24m141-292q0 10 7 17t16.5 7q9.5 0 17-7t7.5-17q0-10-7.5-17t-17-7q-9.5 0-16.5 7t-7 17m-72-252q0 7 5 12t12 5q7 0 12-5t5-12q0-7-5-12t-12-5q-7 0-12 5t-5 12z" p-id="3935" fill="#d81e06"></path></svg>
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
                     <th v-if="tableData.config.ishaveCheckbox" @click.stop="onAllSelect">全选/取消</th>
                     <th v-for="(item,index) in tableData.theadData" :key="index">{{item.theadText}}</th>
                     <th v-if="tableData.config.ishaveHandle">操作</th>
                </thead>
                <tbody>
                    <tr v-for="(item1,index1) in tabledata.tbodyData" :key="index1" v-if="isDeletaRow">
                        <td v-if="tableData.config.ishaveCheckbox"><input type="checkbox" ref="checkbox" :checked="item1.checked" @click.stop="item1.checked= !item1.checked"></td>
                        <td v-for="(item2,index2) in tableData.theadData">{{item1[item2.fieldName]}}</td>
                        <td v-if="tableData.config.ishaveHandle">
                            <a class="td-button td-button-delete" @click.stop="onTdDeleta">删除</a>
                            <a class="td-button td-button-examine" @click.stop="onTdExamine">查看</a>
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
                isAllCheck: false  // 是否全选
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
            onAllSelect() {
                this.isAllCheck = !this.isAllCheck;
                if (this.isAllCheck) {
                   this.$refs.checkbox.forEach(item => item.checked = true);
                   this.tableData.tbodyData.forEach(item => item.checked = true);
                   console.log('已选择数据'  ,this.tableData.tbodyData);
                } else {
                   this.$refs.checkbox.forEach(item => item.checked = false);
                   this.tableData.tbodyData.forEach(item => item.checked = false);
                   console.log('已取消数据'  ,this.tableData.tbodyData);
                }
                //this.$refs.checkbox.forEach(item => item.checked = true);
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
                    <li class="table-button-and" @click.stop="onAnd">新增</li>
                    <li class="table-button-delete" @click.stop="onDelete">删除</li>
                    <li class="table-button-modify" @click.stop="onModify">修改</li>
                    <li class="table-button-examine" @click.stop="onExamine">查看</li>
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
                        <li class="prev" @click.stop="onPrev"></li>
                        <li v-for="n in paginationConfig.paginationconfig.totalPageCount" ref="my-li" @click="swicthCurrentPage">
                        {{n}}
                        </li>
                        <li class="next" @click.stop="onNext"></li>
                        <li @click.stop="switchLastPage">尾页</li>
                        <li class="search-page">跳到第
                            <input type="text" class="link-which-page" v-model="linkPage" @change="onSearhcPage">页
                            <input  type="button" class="sure-search" placeholder = "确定" value="确定" style="padding:0 1rem;">
                        </li>
                    </ul>
                </div>
                <div style="float:left;margin-left:20%;margin-top:2%">
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
