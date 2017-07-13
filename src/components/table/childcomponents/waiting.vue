<template>
    <div v-if="tabaleData.config.isshowWaiting" class="waiting">
        <img src="../../../../static/loading.svg">
    </div>
</template>
<script>
export default {
    data() {
        return {
            tabaleData: this.waiting
        }
    }
}
</script>
