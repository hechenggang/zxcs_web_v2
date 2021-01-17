<template>
  <div>
    <Loading v-if="$root.loading" />

    <div class="header" v-if="!$root.page.mybook.show_search">
      <div class="header-buttons-left">
        <span
          v-if="!$root.page.mybook.show_history"
          class="icon flex_center"
          title="打开阅读记录"
        >
          <img
            class="icon"
            @click="
              $root.page.mybook.show_history = !$root.page.mybook.show_history
            "
            src="@/assets/icon/book.svg"
          />
        </span>
        <span
          v-if="$root.page.mybook.show_history"
          @click="
            $root.page.mybook.show_history = !$root.page.mybook.show_history
          "
          class="icon flex_center"
          title="关掉阅读记录"
        >
          <img class="icon" src="@/assets/icon/close.svg" />
        </span>

        <span
          v-if="!$root.page.mybook.show_history"
          @click="get_random_books()"
          class="icon flex_center margin075"
          title="随机来点书"
        >
          <img class="icon" src="@/assets/icon/shuffle.svg" />
        </span>
      </div>

      <span
        v-if="!$root.page.mybook.show_history"
        @click="$root.page.mybook.show_search = !$root.page.mybook.show_search"
        class="icon flex_center"
        title="显示搜索框"
      >
        <img class="icon" src="@/assets/icon/search.svg" />
      </span>
    </div>

    <div class="header" v-if="$root.page.mybook.show_search">
      <input
        type="text"
        placeholder="搜索书名、作者"
        v-model="$root.page.mybook.keyword"
        @input="get_books_by_keyword($root.page.mybook.keyword)"
        v-focus
      />
      <div class="header-buttons">
        <span
          @click="
            $root.page.mybook.show_search = !$root.page.mybook.show_search
          "
          class="icon flex_center"
          title="关掉搜索框"
        >
          <img class="icon" src="@/assets/icon/close.svg" />
        </span>
      </div>
    </div>

    <Books v-if="!$root.page.mybook.show_history" />
    <History v-if="$root.page.mybook.show_history" />
  </div>
</template>

<script>
import axios from "axios";
import Loading from "@/components/Loading.vue";
import Books from "@/components/Books.vue";
import History from "@/components/History.vue";

export default {
  name: "mybook",
  components: {
    Loading,
    Books,
    History,
  },
  directives: {
    focus: {
      inserted: function (el) {
        el.focus();
      },
    },
  },
  mounted: function () {
    document.title = "我的书架";
    this.get_books("");
    this.get_books_history();
  },
  methods: {
    get_books_by_url: function (this_url) {
      if (this_url === this.$root.before_url) {
        return "";
      } else {
        this.$root.before_url = this_url;
      }
      this.$root.loading = true;
      axios
        .get(this_url, {
          headers: {
            "x-api-code": localStorage["x-api-code"],
          },
        })
        .then((response) => {
          this.$root.books = response.data.books;
          if (this.$root.books.length == 0) {
            alert("真的没有了");
          }
        })
        .catch((error) => {
          if (error.response.status in { 401: "", 403: "" }) {
            delete localStorage["x-api-code"];
            location.assign("/#/login");
          }
          if (error.response.data.code in { 429: "" }) {
            alert("慢一点");
          }
        })
        .finally(() => {
          this.$root.loading = false;
        });
    },
    get_books: function () {
      this.get_books_by_url(this.$root.api.books);
    },
    get_books_by_keyword: function (keyword) {
      keyword = keyword.replace(/^\s+|\s+$/g, "");
      this.get_books_by_url(this.$root.api.books + "?action=find&keyword=" + keyword);
    },
    get_random_books: function () {
      this.get_books_by_url(
        this.$root.api.books + "?action=random&ts=" + new Date().valueOf()
      );
    },
    get_books_history: function () {
      this.$root.loading = true;
      axios
        .get(this.$root.api.history + "?action=get.all", {
          headers: {
            "x-api-code": localStorage["x-api-code"],
          },
        })
        .then((response) => {
          this.$root.history = response.data.history;
          // update local history
          localStorage.history = JSON.stringify(this.$root.history);
          this.$root.loading = false;
        });
    },
  },
};
</script>

<style>
.header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 50px;
  padding: 0 1rem;

}
.header input {
  margin-right: 1rem;
}
.header-buttons-left {
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;
}
.header-buttons-left .margin075 {
  margin-left: 0.75rem;
}
</style>

