<template>
  <v-row align="center" justify="center">
    <v-layout row justify-center align-center>
      <v-flex>
        <v-card class="d-flex pa-12">
          <div v-if="$apollo.queries.todoList.loading">Loading...</div>
          <v-row justify="space-around" v-if="!$apollo.queries.todoList.loading">
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
                  <template v-slot:append>
                    <v-fade-transition leave-absolute>
                      <v-progress-circular
                        v-if="$apollo.queries.todoList.loading"
                        size="24"
                        color="info"
                        indeterminate
                      ></v-progress-circular>
                      <v-icon>note_add</v-icon>
                    </v-fade-transition>
                  </template>
                </v-text-field>
              </v-list-item>
            </v-list>
            <!-- </v-row> -->
            <!-- <v-row justify="space-around" v-if="!$apollo.queries.todoList.loading"> -->
            <v-list subheader style="width: 100% !important">
              <v-list-item>
                <v-card-title v-if="todayTodos.length">
                  <v-btn color="blue-grey" class="ma-2 white--text">Today ({{todayTodos.length}})</v-btn>
                </v-card-title>
              </v-list-item>
              <draggable
                v-model="todos"
                group="todos"
                @start="drag=true"
                @end="drag=false"
                :move="checkMove"
              >
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
                  <v-list-item-icon>
                    <v-btn color="primary" depressed @click="editTodo(todo); updateDialog = true;">
                      <v-icon>create</v-icon>
                    </v-btn>&nbsp;&nbsp;
                    <v-btn color="primary" depressed @click.stop="dialog = true; targetTodo = todo">
                      <v-icon>delete_forever</v-icon>
                    </v-btn>
                  </v-list-item-icon>
                </v-list-item>
              </draggable>
            </v-list>
            <v-list subheader style="width: 100% !important">
              <v-list-item>
                <v-card-title v-if="pendingTodos.length">
                  <v-btn
                    color="blue-grey"
                    class="ma-2 white--text"
                  >Pending ({{pendingTodos.length}})</v-btn>
                </v-card-title>
              </v-list-item>
              <draggable
                v-model="todos"
                group="todos"
                @start="drag=true"
                @end="drag=false"
                :move="checkMove"
              >
                <v-list-item v-for="todo in pendingTodos" :key="todo._id">
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
                  <v-list-item-icon>
                    <v-btn color="primary" depressed @click="editTodo(todo); updateDialog = true;">
                      <v-icon>create</v-icon>
                    </v-btn>&nbsp;&nbsp;
                    <v-btn color="primary" depressed @click.stop="dialog = true; targetTodo = todo">
                      <v-icon>delete_forever</v-icon>
                    </v-btn>
                  </v-list-item-icon>
                </v-list-item>
              </draggable>
            </v-list>
          </v-row>
        </v-card>
        <!-- Update TODO Dialog -->
        <v-dialog v-if="updateDialog" v-model="updateDialog" persistent max-width="600px">
          <v-card>
            <v-card-title>
              <span class="headline">Update Todo</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field v-model="editedTodo.title" label="Todo*" required></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
              <small>*indicates required field</small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="updateDialog = false">Close</v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="doneEdit(editedTodo); updateDialog = false;"
              >Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- Delete Confirm Dialog -->
        <v-dialog v-model="dialog" max-width="290">
          <v-card>
            <v-card-title class="headline">Do you want to Delete?</v-card-title>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn color="green darken-1" text @click="dialog = false">Disagree</v-btn>

              <v-btn
                color="green darken-1"
                text
                @click="removeTodo(targetTodo);dialog = false"
              >Agree</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
import draggable from "vuedraggable";
import {
  TODO_LIST_QUERY,
  TODO_ADD_MUTATION,
  TODO_UPDATE_MUTATION,
  TODO_DELETE_MUTATION
} from "../gql/todo.gql";

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
    todoList: {
      query: TODO_LIST_QUERY
    }
  },
  components: {
    draggable
  },
  methods: {
    checkMove(e) {
      window.console.log(e.draggedContext);
    },
    isLogged() {
      if (localStorage.token) {
        return true;
      }
      return false;
    },
    async addTodo() {
      const value = this.newTodo && this.newTodo.trim();
      if (!value) {
        return;
      }
      this.loading = true;
      const postBody = {
        title: value
      };
      await this.$apollo.mutate({
        mutation: TODO_ADD_MUTATION,
        variables: { input: postBody },
        refetchQueries: [
          {
            query: TODO_LIST_QUERY
          }
        ]
      });
      this.newTodo = "";
      this.$apollo.listThought;
    },
    async removeTodo(todo) {
      const todoId = todo._id;
      await this.$apollo.mutate({
        mutation: TODO_DELETE_MUTATION,
        variables: { id: todoId },
        refetchQueries: [
          {
            query: TODO_LIST_QUERY
          }
        ]
      });
      this.newTodo = "";
    },
    editTodo(todo) {
      this.beforeEditCache = todo.title;
      this.editedTodo = { ...todo };
    },
    doneEdit(todo) {
      if (!this.editedTodo) {
        return;
      }
      this.editedTodo = null;
      todo.title = todo.title.trim();
      if (!todo.title) {
        this.removeTodo(todo);
      }
      this.updateTodo(todo);
    },
    async updateTodo(todo) {
      const todoId = todo._id;
      const isCompleted = !!todo.isCompleted;
      await this.$apollo.mutate({
        mutation: TODO_UPDATE_MUTATION,
        variables: {
          id: todoId,
          input: {
            title: todo.title,
            isCompleted
          }
        },
        refetchQueries: [
          {
            query: TODO_LIST_QUERY
          }
        ]
      });
    },
    pending(todos) {
      return todos.filter(todo => {
        const today = new Date();
        const createdAt = new Date(todo.createdAt);
        const dayCreatedDate = createdAt.getDate();
        const monthCreatedDate = createdAt.getMonth();
        return (
          (!todo.isCompleted &&
            dayCreatedDate < today.getDate() &&
            monthCreatedDate === today.getMonth()) ||
          (!todo.isCompleted && monthCreatedDate < today.getMonth())
        );
      });
    },
    today(todos) {
      return todos.filter(todo => {
        const today = new Date();
        const createdAt = new Date(todo.createdAt);
        const dayCreatedDate = createdAt.getDay();
        const monthCreatedDate = createdAt.getMonth();
        return (
          dayCreatedDate === today.getDay() &&
          monthCreatedDate === today.getMonth()
        );
      });
    }
  },
  computed: {
    pendingTodos: {
      get() {
        return this.pending(this.todoList.data);
      }
    },
    todayTodos: {
      get() {
        return this.today(this.todoList.data);
      }
    }
  }
};
</script>
