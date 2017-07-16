<template>
    <div>
        <table class="zdy-table">
            <thead>
                <th v-if="tabledata.config.ishaveCheckbox">
                    <input type="checkbox" ref="allcheck" @click="allSelect" class="all_check">
                </th>
                <th v-for="(item,index) in tabledata.theadData" :key="index">{{item.theadText}}</th>
                <th v-if="tabledata.config.ishaveHandle">操作</th>
            </thead>
            <tbody>
                <tr v-for="(item1,index1) in tabledata.tbodyData" :key="index1" v-if="isDeletaRow">
                    <td v-if="tabledata.config.ishaveCheckbox">
                        <input type="checkbox" ref="checkbox" :checked="item1.checked" @click.stop="singleSelect(item1)">
                    </td>
                    <td v-for="(item2,index2) in tabledata.theadData" :class="item2.class">{{item1[item2.fieldName]}}</td>
                    <td v-if="tabledata.config.ishaveHandle">
                        <a class="td-button td-button-delete table_btn" @click.stop="onTdDeleta">删除</a>
                        <a class="td-button td-button-examine table_btn" @click.stop="onTdExamine">查看</a>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    props: ['tabledata'],

    data() {
        return {
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
            let random = this.tableData.tbodyData.every(item => !item.checked);
            if (random) {
                this.tableData.tbodyData.forEach(item => item.checked = true);
                this.$refs.checkbox.forEach(item => item.checked = true);
            } else {
                let random = this.tableData.tbodyData.every(item => item.checked);
                if (random) {
                    this.tableData.tbodyData.forEach(item => item.checked = false);
                    this.$refs.checkbox.forEach(item => item.checked = false);
                } else {
                    // this.$refs.allcheck.disabled = true;
                    this.tableData.tbodyData.forEach(item => item.checked = true);
                    this.$refs.checkbox.forEach(item => item.checked = true);

                }
            }
        },
        singleSelect(item1) {
            item1.checked = !item1.checked;
            this.tabledata.tbodyData.forEach(item2 => {
                if (item2.checked) {
                    //当当前的这个按钮被选之后，正好所有的按钮都处于选择状态时 
                    let allChecked = this.tableData.tbodyData.every(item => item.checked);
                    console.log('判断是否全选', allChecked);
                    if (allChecked) {
                        this.$refs.allcheck.disabled = false;
                        this.$refs.allcheck.checked = true;
                    }
                } else {
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
}
</script>
