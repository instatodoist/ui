<template>
  <v-row align="center" justify="center">
    <v-layout row justify-center align-center>
      <v-flex>
        <v-card class="d-flex pa-12">
          <div v-if="isLoading">Loading...</div>
          <v-row justify="space-around" v-if="!isLoading">
            <v-list>
              <v-list-item>
                <v-text-field
                  outlined
                  clearable
                  type="text"
                  autofocus
                  autocomplete="off"
                  placeholder="What needs to be done?"
                  v-model="newTodo"
                  @keyup.enter="addTodo"
                >
                  <!-- <template v-slot:append>
                    <v-fade-transition leave-absolute>
                      <v-progress-circular v-if="loading" size="24" color="info" indeterminate></v-progress-circular>
                      <v-icon>note_add</v-icon>
                    </v-fade-transition>
                  </template> -->
                </v-text-field>
              </v-list-item>
            </v-list>
            <v-list subheader style="width: 100% !important">
              <draggable
                v-model="todos"
                group="todos"
                @start="drag=true"
                @end="drag=false"
                :move="checkMove"
              >
                <v-list-item v-for="todo in todos" :key="todo._id">
                  <v-list-item-avatar>
                    <v-checkbox v-model="todo.isCompleted" @change="updateTodo(todo, true)"></v-checkbox>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title
                      v-if="todo.title"
                      class="body-2"
                      v-bind:class="{'strike-through': todo.isCompleted}"
                      v-text="todo.title"
                    ></v-list-item-title>
                    <v-list-item-title></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </draggable>
            </v-list>
          </v-row>
        </v-card>
      </v-flex>
    </v-layout>
  </v-row>
</template>
<style scoped>
.strike-through {
  text-decoration: line-through;
}
</style>


<script>
import {
  TODO_LIST_QUERY,
  TODO_ADD_MUTATION,
  TODO_UPDATE_MUTATION,
  TODO_DELETE_MUTATION
} from "../gql/todo.gql";
import draggable from "vuedraggable";
// import LoginModal from "./login.vue";
// import { setTimeout } from "timers";

export default {
  order: 0,
  name: "Home",
  data() {
    return {
      loading: false,
      isLoading: false,
      targetTodo: "",
      updateDialog: false,
      dialog: false,
      isLoggedIn: this.isLogged(),
      showModal: false,
      todos: [],
      newTodo: "",
      editedTodo: null,
      visibility: "all",
      drag: false
    };
  },
  apollo: {
    fetechTodos: {
      query: TODO_LIST_QUERY
    }
  },
  components: {
    // LoginModal,
    draggable
  },
  methods: {
    // refetch () {
    //   const data = this.$apollo.queries.fetechTodos.refetch();
    //   console.log(data);
    // },
    checkMove(e) {
      window.console.log(e.draggedContext);
    },
    isLogged() {
      if (localStorage.token) {
        return true;
      }
      return false;
    },
    // fetchTodo() {
    //   this.isLoading = true;
    //   return this.$apollo
    //     .query({
    //       query: TODO_LIST_QUERY,
    //     })
    //     .then(response => {
    //       this.isLoading = false;
    //       this.todos = response.data.todoList.data;
    //     });
    // },
    addTodo() {
      const value = this.newTodo && this.newTodo.trim();
      if (!value) {
        return;
      }
      this.loading = true;
      const postBody = {
        title: value
      };
      return this.$apollo
        .mutate({
          mutation: TODO_ADD_MUTATION,
          variables: {
            input: postBody
          },
          refetchQueries: [
            { query: TODO_LIST_QUERY }
          ]
        })
        .then(data => {
          this.newTodo = "";
          this.loading = false;
          // this.fetch();
        });
    }
  },
  created() {
    // if (this.isLoggedIn) {
    //  this.fetchTodo();
    // }
  }
};
</script>
