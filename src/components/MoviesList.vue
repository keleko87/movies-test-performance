<template>
  <div class="movies-list">
    <h2>{{ title }}</h2>

    <div>
      <p>Performance get data</p>
      <small>Please, open browser console and press different buttons. You can check time to get response movies data</small>
      <p></p>
    </div>

    <div class="get-data">
      <button type="button" name="button" @click="getMovies1([urlData1, urlData2])">Get Movies1 (axios)</button>
      <button type="button" name="button" @click="getMovies2([urlData1, urlData2])">Get Movies2 (fetch)</button>
    </div>

    <div v-if="init && !movies.length">
      <loader></loader>
    </div>

    <div v-if="movies.length" class="movies-container">

      <div class="search">
        <span>Search by title</span>
        <input type="text" v-model="search" placeholder="Search">
      </div>

      <table>
        <thead>
          <tr>
            <th :class="{ 'sort' : currentSort === 'title' }" @click="sort('title')">
              <sort-field
                :field="'title'"
                :currentSort="currentSort"
                :currentSortDir="currentSortDir">
              </sort-field>
            </th>
            <th :class="{ 'sort' : currentSort === 'year' }" @click="sort('year')">
              <sort-field
                :field="'year'"
                :currentSort="currentSort"
                :currentSortDir="currentSortDir">
              </sort-field>
            </th>
            <th :class="{ 'sort' : currentSort === 'director' }" @click="sort('director')">
              <sort-field
                :field="'director'"
                :currentSort="currentSort"
                :currentSortDir="currentSortDir">
              </sort-field>
            </th>
            <th :class="{ 'sort' : currentSort === 'cast' }" @click="sort('cast')">
              <sort-field
                :field="'cast'"
                :currentSort="currentSort"
                :currentSortDir="currentSortDir">
              </sort-field>
            </th>
            <th :class="{ 'sort' : currentSort === 'genre' }" @click="sort('genre')">
              <sort-field
                :field="'genre'"
                :currentSort="currentSort"
                :currentSortDir="currentSortDir">
              </sort-field>
            </th>
            <th :class="{ 'sort' : currentSort === 'notes' }" @click="sort('notes')">
              <sort-field
                :field="'notes'"
                :currentSort="currentSort"
                :currentSortDir="currentSortDir">
              </sort-field>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="movie in filteredMovies ">
            <td>{{movie.title}}</td>
            <td>{{movie.year}}</td>
            <td>{{movie.director}}</td>
            <td>{{movie.cast}}</td>
            <td>{{movie.genre}}</td>
            <td>{{movie.notes}}</td>
          </tr>
        </tbody>
      </table>

      <div>
        <p>
          <button @click="prevPage">Previous</button>
          <small class="pagination">page {{currentPage}} / {{totalPages}}</small>
          <button @click="nextPage">Next</button>
        </p>

      </div>

      <div class="search">
        <span>Set pagination</span>
        <select class="page" name="pageSize" v-model="pageSize" placeholder="Page size">
          <option value="10" selected>10</option>
          <option value="25">25</option>
          <option value="50">50</option>
        </select>
      </div>

    </div>

  </div>
</template>

<script>

import axios from 'axios'
import SortField from './SortField'
import Loader from './Loader'

const urlData1 = '/data/movies-small.json'
const urlData2 = '/data/movies.json'

export default {
  name: 'MoviesList',

  components: {
    SortField,
    Loader
  },

  data () {
    return {
      title: 'List of Movies',
      init: false,
      urlData1,
      urlData2,
      movies: [],
      currentSort: 'title',
      currentSortDir: 'asc',
      pageSize: 10,
      currentPage: 1,
      search: ''
    }
  },

  methods: {
    async getMovies1 (urls) {
      this.init = true
      this.movies = []

      urls.forEach(async (url) => {
        console.time('getMovies1: ' + url)

        let movies = await axios.get(url)
        this.movies.push(...movies.data)

        console.timeEnd('getMovies1: ' + url)
      })
    },

    // Option 2: with fetch.
    async getMovies2 (urls) {
      this.init = true
      this.movies = []

      urls.forEach(async (url) => {
        console.time('getMovies2: ' + url)
        await fetch(url)
          .then(res => res.json())
          .then(res => {
            this.movies.push(...res)
          })
        console.timeEnd('getMovies2: ' + url)
      })
    },

    sort (s) {
      // Toggle direction sort
      if (s === this.currentSort) {
        this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' : 'asc'
      }
      this.currentSort = s
    },

    nextPage () {
      if ((this.currentPage * this.pageSize) < this.movies.length) this.currentPage++
    },

    prevPage () {
      if (this.currentPage > 1) this.currentPage--
    }
  },

  computed: {
    // Computed prop to sorted movies data
    sortedmovies () {
      return this.movies.sort((a, b) => {
        let modifier = 1

        if (this.currentSortDir === 'desc') modifier = -1
        if (a[this.currentSort] < b[this.currentSort]) return -1 * modifier
        if (a[this.currentSort] > b[this.currentSort]) return 1 * modifier

        return 0
      }).filter((row, index) => {
        let start = (this.currentPage - 1) * this.pageSize
        let end = this.currentPage * this.pageSize

        if (index >= start && index < end) return true
      })
    },

    // Calculate total pages
    totalPages () {
      return Math.ceil(this.movies.length / this.pageSize)
    },

    // Change page size
    setPageSize (size) {
      this.pageSize = size
    },

    // Search movie by title
    filteredMovies () {
      if (this.sortedmovies && this.sortedmovies.length) {
        return this.sortedmovies.filter((movie) => {
          return movie.title.toLowerCase().match(this.search)
        })
      }
    }
  }

}
</script>

<style scoped>
h2 {
  font-family: unset;
  color: #929292;
  /* text-align: left; */
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

table, td, th {
  border: 1px solid #ddd;
  text-align: left;
}

table {
  border-collapse: collapse;
  table-layout: fixed;
  width: 100%;
}


thead {
  background-color: #a8e6ca;
}

tr {
  border: 1px solid;
}

td, th {
  padding: 15px;
  width: 100px;
}

th {
  cursor: pointer;
}

button {
  background-color: #ffcf7b;
  padding: 10px 15px;
  border: 1px solid #ffcf7b;
  font-weight: bold;
}

.get-data button {
  background-color: #ee8592;
  padding: 10px 15px;
  border: 1px solid #ee8592;
  color: #FFF;
}

th.sort {
  background-color: #ffcf7b;
}

.movies-container {
  padding: 0 50px;
}

.pagination {
  padding: 1rem;
}

.search {
  font-weight: bold;
  margin: 2rem;
  text-align: left;
}

.search input {
  padding: 10px;
}

</style>
