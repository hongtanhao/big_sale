<template>
    <div v-if="waiting.config.isshowWaiting" class="waiting">
        <img src="static/loading.svg">
    </div>
</template>
<script>
export default {
    props:['waiting'],
    data() {
        return {
        }
    }
}
</script>
