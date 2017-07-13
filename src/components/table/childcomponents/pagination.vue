<template>
    <div>
        <div style="float:left;">
            <ul class="pagination">
                <li @click.stop="switchFirstPage">首页</li>
                <li class="prev" @click.stop="onPrev"></li>
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
        <div style="float:right;">
            <form>
                每页显示记录
                    <select name=" " id=" " ref="my-select " @change="onEachPageShowMany " v-model="showMany ">
                        <option value="10 ">10</option>
                        <option value="20 ">20</option>
                        <option value="30 ">30</option>
                        <option value="40 ">40</option>
                    </select>
                    条
            </form> 
        </div>   
    </div>
</template>

<script>
export default {
    props: ['paginationconfig'],
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
}
</script>

