<template>
<div id="__wrapper">

  <div class="app-content">
    <keep-alive>
      <transition name="drop">
        <router-view></router-view>
      </transition>
    </keep-alive>
  </div>
</div>
</template>

<script>

export default {
};
</script>

<style>
@import '../style/style.css';
@import '../style/bootstrap-flat.min.css';
</style>
