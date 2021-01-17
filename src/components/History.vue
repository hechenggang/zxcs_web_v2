<template>
  <div class="history">
    <Loading v-if="$root.loading" />
    <ul class="books" v-if="$root.history">
      <li class="book" v-for="id in Object.keys(this.$root.history)" :key="id">
        <div class="cover">
          <router-link
            :to="{
              name: 'reader',
              params: { id: id, name: $root.history[id][1] },
            }"
          >
            <img v-lazy="$root.api.cover + id + '.webp'" />
          </router-link>
        </div>
        <div class="bookinfo">
          <router-link
            :to="{
              name: 'reader',
              params: { id: id, name: $root.history[id][1] },
            }"
            class="book_name"
            >{{ $root.history[id][1] }}</router-link
          >
          <p class="book_brief">阅读进度 {{ $root.history[id][0] }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";
import Loading from "@/components/Loading.vue";

export default {
  name: "history",
  components: {
    Loading,
  },
  
  mounted: function () {
    document.title = "阅读记录";
    this.get_books_history();
  },
  methods: {
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