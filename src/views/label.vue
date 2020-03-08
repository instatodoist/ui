<template>
  <v-row align="center" justify="center">
    <v-layout row justify-center align-center>
      <v-flex>
        <v-card class="d-flex pa-12">
          <div v-if="isLoading">Loading...</div>
          <v-row justify="space-around" v-if="!isLoading">
            <v-list subheader style="width: 100% !important">
              <v-list-item>
                <v-card-title>
                  <v-btn color="blue-grey" class="ma-2 white--text">Labelled ({{todayTodos.length}})</v-btn>
                </v-card-title>
              </v-list-item>
                <v-list-item v-for="todo in todayTodos" :key="todo._id">
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
                  </v-list-item-content>
                  <!-- <v-list-item-icon>
                    <v-btn color="primary" depressed @click="editTodo(todo); updateDialog = true;">
                      <v-icon>create</v-icon>
                    </v-btn>&nbsp;&nbsp;
                    <v-btn color="primary" depressed @click.stop="dialog = true; targetTodo = todo">
                      <v-icon>delete_forever</v-icon>
                    </v-btn>
                  </v-list-item-icon> -->
                </v-list-item>
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
  TODO_LIST_QUERY
} from '../gql/todo.gql';

export default {
  order: 0,
  name: 'LabelTodo',
  data() {
    return {
      loading: false,
      isLoading: false,
      targetTodo: '',
      updateDialog: false,
      dialog: false,
      isLoggedIn: this.isLogged(),
      showModal: false,
      todos: [],
      menu: '',
      editedTodo: null,
      visibility: 'all',
      drag: false,
      isInbox: false,
      todayTodos: []
    };
  },
  methods: {
    isLogged() {
      if (localStorage.token) {
        return true;
      }
      return false;
    },
  },
  async created() {
    this.isLoading = true;
    const todayTodos = await this.$apollo.query({
      query: TODO_LIST_QUERY,
      variables: {
        filter: {
          labelId: this.$route.params.label
        }
      }
    });
    this.isLoading = false;
    this.todayTodos = todayTodos.data.todoList.data;
  }
};
</script>
