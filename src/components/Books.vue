<template>
    <ul class="books" v-if="$root.books">
        <li class="book" v-for="b in $root.books" :key="b.book_id">
          <div class="cover">
            <router-link
              :to="{ name: 'reader', params: { id: b.book_id, name: b.book_name }}"
            >
              <img v-lazy="$root.api.cover + b.book_id + '.webp'" />
            </router-link>
          </div>
          <div class="bookinfo">
            <router-link
              :to="{ name: 'reader', params: { id: b.book_id, name: b.book_name }}"
              class="book_name"
            >{{b.book_name}}</router-link>
            <p class="book_brief">作者：{{b.book_author.replace(/^\s+|\s+$/g, "")}}</p>
            <p class="book_brief">{{b.book_brief}}</p>
          </div>
        </li>
      </ul>
</template>

<style>
.loading {
  z-index: 999;
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

.books {
  padding: 1rem;
  padding-top: 0;
}

.book {
  display: flex;
  justify-content: left;
  padding: 0.75rem 0;
  border-top: .2rem solid #ffffff;
}

.cover img {
  display: inline-block;
  width: 5rem;
  margin-right: .5rem;
  border: .2rem solid #ffffff;
}

.bookinfo {
  display: flex;
  flex-direction: column;
}

.book_name {
  font-size: 1rem;
  line-height: 1.5rem;
  color:#5698c3;
  font-weight: bold;
}

.book_brief {
  line-height: 1.25rem;
  font-size: 0.9rem;
}
</style>