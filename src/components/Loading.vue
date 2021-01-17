<template>
<transition name="ani-loading">
    <div class="fixed_full flex_center bg_01 loading">
      <div class="loading-icon animation_rotate"></div>
    </div>
  </transition>
</template>

<style>
.loading {
  z-index: 999;
}
.loading-icon {
  width: 1rem;
  height: 1rem;
  border: .2rem solid #1a2b3c;
}
.ani-loading-enter-active {
  transition: all 0.15s ease-in;
}
.ani-loading-leave-active {
  transition: all 0.15s ease-out;
}
.ani-loading-enter,
.ani-loading-leave-to {
  transform: translateX(5px);
  opacity: 0;
}

</style>