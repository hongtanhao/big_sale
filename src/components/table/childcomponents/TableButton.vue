<template>
    <div v-if="tableButton.config.isfunctionTablle">
        <ul class="table-button">
            <li class="table-button-and table_btn" @click.stop="onAnd" v-if="tableButton.config.hasAddBtn">新增</li>
            <li class="table-button-delete table_btn" @click.stop="onDelete" v-if="tableButton.config.hasDelBtn">删除</li>
            <li class="table-button-modify table_btn" @click.stop="onModify" v-if="tableButton.config.hasUpdBtn">修改</li>
            <li class="table-button-examine table_btn" @click.stop="onExamine" v-if="tableButton.config.hasExaBtn">查看</li>
            <div style="display:none;" ref="dialog">
                <dialog-box :dialogbox="tableButton"></dialog-box>
            </div>
        </ul>
    </div>
</template>

<script>
import DialogBox from './DialogBox';
export default {
    props: ['tablebutton'],
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
    },
    components:{
        DialogBox
    }
}
</script>
