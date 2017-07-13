<template>
    <div class="dialogbox">
        <h3 style="text-align:center;padding:1rem;">新增记录</h3>
        <div v-for="(item,index) in tableData.theadData">
            <p>{{item.theadText}}
                <input type="text" :class="item.fieldName+index" />
            </p>
        </div>
        <div style="text-align:center;">
            <a class="dialog-btn-close" @click.stop="onClose">x</a>
            <a class="dialog-btn-cancel" @click.stop="onCancel">取消</a>
            <a class="dialog-btn-submit" @click.stop="onSubmit">提交</a>
        </div>
    </div>
</template>

<script>
export default {
    props: ['dialogbox'],
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
}
</script>

