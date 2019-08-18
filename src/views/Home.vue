<template>
  <v-layout row justify-center align-center>
    <v-flex>
      <LoginModal v-if="!isLoggedIn" />
      <v-card class="d-flex pa-5">
        <v-row align="center" justify="center">
          <div class="text-center">
            <v-btn href="#/all" class="ma-2" :color="visibility == 'all'? 'primary': 'secondary'">
              All Todods
              ( {{todos.length}} )
            </v-btn>
            <v-btn
              href="#/active"
              class="ma-2"
              :color="visibility == 'active'? 'primary': 'secondary'"
            >
              Active Todods
              ( {{remaining}} )
            </v-btn>
            <v-btn
              href="#/completed"
              class="ma-2"
              :color="visibility == 'completed'? 'primary': 'secondary'"
            >Completed Todos ( {{completedTodosCount}} )</v-btn>
            <v-btn
              @click="removeCompleted"
              class="ma-2"
              v-show="todos.length > remaining"
            >Clear Completed Todos</v-btn>
             <v-progress-circular v-if="completedTodosCount > 0" :value="progress" class="mr-2" style="width:70px;height:70px;"></v-progress-circular>
          </div>
        </v-row>
        <!-- <v-row align="center" justify="center">
            
        </v-row>-->
      </v-card>
      <v-card class="d-flex pa-1">
        <v-row align="center" justify="center">
          <div class="text-center">
            <v-col>
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
                    <v-progress-circular v-if="loading" size="24" color="info" indeterminate></v-progress-circular>
                    <v-icon>note_add</v-icon>
                  </v-fade-transition>
                </template>
              </v-text-field>
            </v-col>
          </div>
        </v-row>
      </v-card>
      <v-card class="d-flex pa-5">
        <v-row justify="space-around">
          <v-simple-table style="width:100%;" fixed-header>
            <tbody>
              <tr v-for="todo in filteredTodos" :key="todo._id">
                <td>
                  <v-checkbox v-model="todo.isCompleted" @change="updateTodo(todo, true)"></v-checkbox>
                </td>
                <td v-bind:class="{'strike-through': todo.isCompleted}">{{ todo.title }}</td>
                <td class="text-right">
                  <v-btn
                    v-if="!todo.isCompleted"
                    color="primary"
                    depressed
                    @click="editTodo(todo); updateDialog = true;"
                  >
                  <v-icon>create</v-icon>
                  </v-btn>&nbsp;&nbsp;
                  <v-btn
                    color="primary"
                    depressed
                    @click.stop="dialog = true; targetTodo = todo"
                  >
                  <v-icon>delete_forever</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
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
          </v-simple-table>
        </v-row>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<style scoped>
.strike-through {
  text-decoration: line-through;
}
</style>


<script>
// visibility filters
const filters = {
  all(todos) {
    return todos;
  },
  active(todos) {
    return todos.filter(todo => !todo.isCompleted);
  },
  completed(todos) {
    return todos.filter(todo => todo.isCompleted);
  }
};

import LoginModal from "./login.vue";

export default {
  name: "Home",
  // app initial state
  data() {
    return {
      loading: false,
      targetTodo: "",
      updateDialog: false,
      dialog: false,
      isLoggedIn: this.isLogged(),
      showModal: false,
      todos: [],
      newTodo: "",
      editedTodo: null,
      visibility: "all"
    };
  },
  components: {
    LoginModal
  },

  computed: {
    progress() {
      return (
        (filters.completed(this.todos).length /
          this.todos.length) *
        100
      );
    },
    filteredTodos() {
      return filters[this.visibility](this.todos);
    },
    remaining() {
      return filters.active(this.todos).length;
    },
    completedTodosCount() {
      return filters.completed(this.todos).length;
    },
    allDone: {
      get() {
        return this.remaining === 0;
      },
      set(value) {
        this.todos.forEach(todo => {
          todo.isCompleted = value;
        });
      }
    }
  },

  filters: {
    pluralize(n) {
      return n === 1 ? "todo" : "todods";
    }
  },

  methods: {
    onHashChange() {
      const visibility = window.location.hash.replace(/#\/?/, "");
      if (filters[visibility]) {
        this.visibility = visibility;
      } else {
        window.location.hash = "";
        this.visibility = "all";
      }
    },
    accessToken() {
      return "Bearer " + localStorage.token;
    },
    isLogged() {
      if (localStorage.token) {
        return true;
      }
      return false;
    },
    fetchTodo() {
      return fetch(`${this.$BASE_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: "{ todoList { title _id isCompleted user {email}} }"
        })
      })
        .then(res => res.json())
        .then(data => {
          this.todos = data.data.todoList;
        });
    },
    addTodo() {
      // if (!this.isLoggedIn) {
      //   this.showModal = true;
      //   return false;
      // }
      const value = this.newTodo && this.newTodo.trim();
      if (!value) {
        return;
      }
      this.loading = true;
      const query = `
      mutation {
        addTodo(input: {title: "${value}"}) {
          message
        }
      }
      `;
      return fetch(`${this.$BASE_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/graphql",
          Authorization: this.accessToken()
        },
        body: query
      })
        .then(res => res.json())
        .then(data => {
          this.newTodo = "";
          this.loading = false;
          return this.fetchTodo();
        });
    },

    removeTodo(todo) {
      const todoId = todo._id;
      const query = `
      mutation {
        deleteTodo(id: "${todoId}") {
          message
        }
      }
      `;
      return fetch(`${this.$BASE_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/graphql",
          Authorization: this.accessToken()
        },
        body: query
      })
        .then(res => res.json())
        .then(data => {
          this.newTodo = "";
          this.fetchTodo();
        })
        .catch(err => {
          console.log(err);
        });
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

    updateTodo(todo) {
      const todoId = todo._id;
      const isCompleted = !!todo.isCompleted;
      const query = `
      mutation {
        updateTodo(id: "${todoId}", input: {title: "${todo.title}", isCompleted: ${isCompleted} }) {
          message
        }
      }
      `;
      return fetch(`${this.$BASE_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/graphql",
          Authorization: this.accessToken()
        },
        body: query
      })
        .then(res => res.json())
        .then(data => {
          this.newTodo = "";
          this.fetchTodo();
        })
        .catch(err => {
          console.log(err);
        });
    },

    cancelEdit(todo) {
      this.editedTodo = null;
      todo.title = this.beforeEditCache;
    },

    removeCompleted() {
      this.completedTodos = filters.completed(this.todos);
      this.completedTodos.forEach(todo => {
        this.removeTodo(todo);
      });
      this.todos = filters.active(this.todos);
    }
  },

  directives: {
    "todo-focus": function(el, binding) {
      if (binding.value) {
        el.focus();
      }
    }
  },
  created() {
    if (this.isLoggedIn) {
      this.fetchTodo();
    }
    window.addEventListener("hashchange", this.onHashChange);
    this.onHashChange();
  }
};
</script>
