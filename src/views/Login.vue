<template>
  <Loading v-show="true" />
</template>

<script>
import Loading from "@/components/Loading.vue";

export default {
  name: "login",
  components: {
    Loading
  },
  mounted: function () {
    let code = localStorage["x-api-code"];
    if (code) {
      location.assign("/#/mybook");
    } else {
      code = this.$route.query.code;
      if (code) {
        localStorage["x-api-code"] = code;
        location.assign("/#/mybook");
      } else {
        // console.log("重定向到登录地址");
        location.assign(this.$root.api.login);
      }
    }
  },
};
</script>