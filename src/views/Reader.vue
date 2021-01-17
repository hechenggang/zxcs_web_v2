<template>
  <div class="reader">
    <Loading v-bind:style="styleObject" v-show="show_loading" />

    <ul
      v-bind:style="styleObject"
      v-show="show_control"
      class="control bg shadow"
    >
      <li>
        <span v-on:click="indexChange(-1), (show_control = !show_control)">
          <img class="icon" src="@/assets/icon/arrow-left.svg" />
        </span>
        <span v-on:click="indexChange(1), (show_control = !show_control)">
          <img class="icon rotate180" src="@/assets/icon/arrow-left.svg" />
        </span>
      </li>
    </ul>

    <ul
      v-bind:style="styleObject"
      v-show="show_control"
      class="chapter_control control bg shadow"
    >
      <li>
        <div class="reader-buttons-top-left">
          <span v-on:click="book.track = !book.track">
            <img
              class="icon"
              title="取消跟踪"
              v-if="book.track"
              src="@/assets/icon/heart-fill.svg"
            />
            <img
              class="icon"
              title="跟踪"
              v-if="!book.track"
              src="@/assets/icon/heart-line.svg"
            />
          </span>
          <span>
            <img
              class="icon"
              title="晴天"
              v-if="book.color == 0"
              v-on:click="book.color = 1"
              src="@/assets/icon/sun.svg"
            />
            <img
              class="icon"
              title="阴天"
              v-if="book.color == 1"
              v-on:click="book.color = 2"
              src="@/assets/icon/moon.svg"
            />
            <img
              class="icon"
              title="对比"
              v-if="book.color == 2"
              v-on:click="book.color = 0"
              src="@/assets/icon/sunrise.svg"
            />
          </span>
        </div>
        <span v-on:click="show_chapters = !show_chapters">
          <img class="icon" title="显示目录" src="@/assets/icon/drag.svg" />
        </span>
      </li>
    </ul>

    <ul
      v-bind:style="styleObject"
      v-show="show_chapters"
      class="chapter_control control bg shadow"
    >
      <li>
        <span v-show="book.chapters_sort_by == 'asc'" v-on:click="sortChapters">
          <img
            class="icon rotate180"
            title="切换倒序"
            src="@/assets/icon/filter-alt.svg"
          />
        </span>
        <span
          v-show="book.chapters_sort_by == 'desc'"
          v-on:click="sortChapters"
        >
          <img
            class="icon"
            title="切换正序"
            src="@/assets/icon/filter-alt.svg"
          />
        </span>
        <span
          v-on:click="
            (show_chapters = !show_chapters), (show_control = !show_control)
          "
        >
          <img class="icon" title="显示目录" src="@/assets/icon/close.svg" />
        </span>
      </li>
    </ul>

    <div class="chapters bg" v-show="show_chapters" v-bind:style="styleObject">
      <ul class="list" ref="chapters">
        <li class="border_top" v-for="(v, i) in book.chapters" v-bind:key="i">
          <p @click="book.index = v.index">{{ v.title }}</p>
        </li>
      </ul>
    </div>

    <div
      class="reader_text bg"
      v-if="book.chapterHtml"
      ref="text"
      v-on:click="show_control = !show_control"
      v-html="book.chapterHtml"
      v-bind:style="styleObject"
    ></div>
  </div>
</template>

<script>
// 通过路由接收书籍ID
// 检查阅读记录，设置索引
// 书籍ID -> 请求目录
// 根据索引加载章节
// 加载云端进度
// import config from "../config.js";
import axios from "axios";
import Loading from "@/components/Loading.vue";

export default {
  name: "reader",
  components: {
    Loading,
  },
  data: function () {
    return {
      book: {
        id: null,
        name: "",
        index: null,
        chapters: [],
        chapters_sort_by: "asc",
        chapterHtml: "",
        chapterCache: {},
        track: false,
        color: null,
      },
      show_control: 0,
      show_loading: 0,
      show_chapters: 0,
      colors: {},
      styleObject: {},
    };
  },
  mounted: function () {
    // 配置色彩
    this.book.color = 0;

    // parse book id and book name from router
    this.book.id = this.$route.params.id;
    this.book.name = this.$route.params.name;
    if (!this.book.name) {
      if (JSON.parse(localStorage.history).hasOwnProperty(this.book.id)) {
        this.book.name = JSON.parse(localStorage.history)[this.book.id][1];
      } else {
        location.assign("/#/mybook");
      }
    }
    console.log(this.book.id, this.book.name);

    // set document title as book name
    document.title = this.book.name;

    // try to init book index from history
    let h = JSON.parse(localStorage.history);
    if (h.hasOwnProperty(this.book.id)) {
      this.book.index = h[this.book.id][0];
      this.book.track = true;
    } else {
      this.book.index = 0;
    }

    // 获取目录
    this.fetchCatalogue();
    // 获取云端最新章节
    this.get_book_history();
  },

  methods: {
    indexChange: function (N) {
      this.show_loading = 1;
      let a = Number(this.book.index) + Number(N);
      if (this.book.chapters[a]) {
        this.book.index = a;
      } else {
        if (a == -1) {
          alert("已经是开始位置了");
        } else if (a == this.book.chapters.length) {
          alert("已经是结束位置了");
        } else {
          alert("奇怪的错误");
        }
        this.book.index = 0;
        this.fetchChapter();
      }
    },
    get_book_history: function () {
      axios
        .get(
          this.$root.api.history + "?action=get.one&book_id=" + this.book.id,
          {
            headers: {
              "x-api-code": localStorage["x-api-code"],
            },
          }
        )
        .then((response) => {
          let index = response.data.history[0];
          if (index > this.book.index) {
            let result = confirm("继续阅读吗");
            if (result) {
              this.book.index = index;
              this.book.name = response.data.history[1];
            }
          }
        });
    },
    commit_book_history: function () {
      axios.get(
        this.$root.api.history +
          "?action=insert&book_id=" +
          this.book.id +
          "&book_name=" +
          this.book.name +
          "&book_index=" +
          this.book.index,
        {
          headers: {
            "x-api-code": localStorage["x-api-code"],
          },
        }
      );
    },
    remove_book_history: function () {
      axios.get(
        this.$root.api.history + "?action=remove&book_id=" + this.book.id,
        {
          headers: {
            "x-api-code": localStorage["x-api-code"],
          },
        }
      );
    },
    syncToHistory: function () {
      if (this.book.track) {
        let h = JSON.parse(localStorage.history);
        if (h.hasOwnProperty(this.book.id)) {
          h[this.book.id][0] = this.book.index;
        } else {
          h[this.book.id] = [this.book.index, this.book.name];
        }
        localStorage.history = JSON.stringify(h);
        this.commit_book_history();
      }
    },
    fetchChapter: function () {
      this.show_loading = true;
      axios
        .get(
          this.$root.api.chapter + "?id=" + this.book.id + "&index=" + this.book.index,
          {
            headers: {
              "x-api-code": localStorage["x-api-code"],
            },
          }
        )
        .then((response) => {
          this.book.chapterCache[this.book.id] = response.data.chapter;
          if (response.data.chapter) {
            this.book.chapterHtml = "";
            for (let i = 0; i < response.data.chapter.length; i++) {
              this.book.chapterHtml +=
                "<p>" +
                response.data.chapter[i].replace(/^\s+|\s+$/g, "") +
                "</p>";
            }
          }
        })
        .then(() => {
          // update history
          this.syncToHistory();
          // update title by chapter name
          if (this.book.chapters_sort_by == "asc") {
            document.title =
              this.book.chapters[this.book.index].title +
              " - " +
              this.book.name;
          } else {
            document.title =
              this.book.chapters[
                this.book.chapters.length - 1 - this.book.index
              ].title +
              " - " +
              this.book.name;
          }
        })
        .catch((error) => {
          if (error) {
            if (error.response.status == 404) {
              alert("错误代码 404");
              location.assign("/#/mybook");
            } else if (error.response.status in { 400: "", 401: "", 403: "" }) {
              alert("错误代码 400/401/403");
              delete localStorage["x-api-code"];
              location.assign("/#/login");
            } else {
              alert("意外错误");
              location.assign("/#/mybook");
            }
          }
        })
        .finally(() => {
          this.$refs.text.scrollTop = 0;
          this.show_chapters = 0;
          this.show_control = 0;
          this.show_loading = 0;
        });
    },
    fetchCatalogue: function () {
      this.show_loading = true;
      axios
        .get(this.$root.api.chapters + "?id=" + this.book.id, {
          headers: {
            "x-api-code": localStorage["x-api-code"],
          },
        })
        .then((response) => {
          if (response.data.chapters) {
            this.book.chapters = response.data.chapters;
          } else {
            alert("获取章节信息时出错");
            location.assign("/#/mybook");
          }
        })
        .then(() => {
          // fetch book catalogue succussful, then fetch chapter
          this.fetchChapter();
        })
        .catch((error) => {
          if (error) {
            if (error.response.status == 404) {
              alert("错误代码 404");
              location.assign("/#/mybook");
            } else if (error.response.status in { 400: "", 401: "", 403: "" }) {
              alert("错误代码 400/401/403");
              delete localStorage["x-api-code"];
              location.assign("/#/login");
            } else {
              alert("意外错误");
              location.assign("/#/mybook");
            }
          }
        })
        .finally(() => {
          this.show_loading = false;
        });
    },

    sortChapters: function () {
      // order 'desc' 'asc'
      if (this.book.chapters_sort_by == "asc") {
        this.book.chapters_sort_by = "desc";
      } else {
        this.book.chapters_sort_by = "asc";
      }
      function getSortFun(order, sortBy) {
        let ordAlpah = order == "asc" ? ">" : "<";
        let sortFun = new Function(
          "a",
          "b",
          "return a." + sortBy + ordAlpah + "b." + sortBy + "?1:-1"
        );
        return sortFun;
      }
      this.book.chapters.sort(getSortFun(this.book.chapters_sort_by, "index"));
    },
  },
  watch: {
    "book.index": function () {
      this.fetchChapter();
    },
    "book.track": function () {
      if (this.book.track) {
        this.syncToHistory();
      } else {
        let h = JSON.parse(localStorage.history);
        if (h.hasOwnProperty(this.book.id)) {
          delete h[this.book.id];
          this.remove_book_history();
        }
        localStorage.history = JSON.stringify(h);
      }
    },
    "book.color": function () {
      this.colors = this.$root.color.reader;
      console.log(this.colors[Object.keys(this.colors)[this.book.color]]);
      this.styleObject = {
        color: this.colors[Object.keys(this.colors)[this.book.color]][0],
        "background-color": this.colors[
          Object.keys(this.colors)[this.book.color]
        ][1],
      };
    },
  },
};
</script>

<style>
.reader-buttons-top-left {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: nowrap;
  flex-direction: row;
}
.reader-buttons-top-left span {
  margin-right: 0.75rem;
}
.reader_text {
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  -webkit-overflow-scrolling: touch;
  padding: 15px;
  overflow-y: scroll;
}

.reader_text p {
  text-indent: 34px;
  line-height: 34px;
  word-wrap: break-word;
  font-size: 17px;
}

.control {
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 2;
  padding: 5px;
  height: 50px;
}

.control > li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 30px;
  color: #5698c3;
}

.control span {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bolder;
  font-size: 20px;
  line-height: 20px;
}

.control > li p {
  font-size: 12px;
}

.chapter_control {
  top: 0;
  z-index: 3;
}

.list {
  display: block;
  overflow: auto;
}

.chapters {
  position: fixed;
  height: 100%;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
  overflow-y: scroll;
  padding: 60px 30px;
}
.chapters li {
  padding: 10px;
  list-style: none;
  cursor: pointer;
}

.chapters li p {
  font-size: 15px;
  line-height: 20px;
  list-style: none;
  color: #5698c3;
}
</style>
