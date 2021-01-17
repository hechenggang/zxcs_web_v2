<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
/* 基础样式 */

/* bg_color #FCFAF2 */
/* fd_cplor #1A2B3C */

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  outline: none;
  border: none;
  list-style: none;

}

html {
  font-size: 15px;
  background-color: #FCFAF2;
  color: #1A2B3C;
}

p {
  font-size: 1rem;
  line-height: 1.5rem;
}

a,
a:visited {
  color: #5698c3;
  text-decoration: none;
}

input {
  padding: 0.5rem;
  width: 100%;
  background-color: #ffffff;
  border-radius: 0.25rem;
  font-size: 1rem;
  line-height: 1.5rem;
}

ul {
  list-style: none;
}

.button,
.button:visited {
  display: block;
  text-align: center;
  padding: 0.25rem;
  margin: 0.5rem;
  cursor: pointer;
  color: #5698c3;
  border: 1.5px solid #5698c3;
  border-radius: 0.5rem;
}

.bg {
  background-color: #FCFAF2;
}

.bg_01 {
  background-color: #fcfaf2b0;
}

.shadow {
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

.fixed_full {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.fixed_bottom {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 50px;
  z-index: 2;
}

.fixed_top {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 50px;
  z-index: 3;
}

.flex_center {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  flex-direction: column;
}

.flex_between {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: nowrap;
  flex-direction: row;
}

.border {
  border: 2px solid #ffffff;
}

.border_bottom {
  border-bottom: 2px solid #ffffff;
}
.border_top {
  border-top: 2px solid #ffffff;
}

@keyframes frames_rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.animation_rotate {
  animation: frames_rotate 4s infinite linear;
}

.icon {
  width: 1.5rem;
  height: 1.5rem;
}

.rotate180 {
  transform: rotate(180deg);
}


.box {
  padding: 0.75rem 15%;
  overflow: auto;
}

@media screen and (max-width: 720px) {
  .box {
    padding: 0.75rem;
  }
}
</style>
