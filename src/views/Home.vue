<template>
  <section class="todoapp">
    <header class="header">
      <h1>todos</h1>
      <input
        class="new-todo"
        autofocus
        autocomplete="off"
        placeholder="What needs to be done?"
        v-model="newTodo"
        @keyup.enter="addTodo"
      />
    </header>

    <LoginModal v-if="showModal" @close="showModal = false"/>

    <section class="main" v-show="todos.length" v-cloak>
      <input id="toggle-all" class="toggle-all" type="checkbox" v-model="allDone" />
      <label for="toggle-all"></label>
      <ul class="todo-list">
        <li
          v-for="todo in filteredTodos"
          class="todo"
          :key="todo._id"
          :class="{ completed: todo.isCompleted, editing: todo == editedTodo }"
        >
          <div class="view">
            <input
              class="toggle"
              type="checkbox"
              v-model="todo.isCompleted"
              @change="updateTodo(todo, true)"
            />
            <label @dblclick="editTodo(todo)">{{ todo.title }}</label>
            <button class="destroy" @click="removeTodo(todo)"></button>
          </div>
          <input
            class="edit"
            type="text"
            v-model="todo.title"
            v-todo-focus="todo == editedTodo"
            @blur="doneEdit(todo)"
            @keyup.enter="doneEdit(todo)"
            @keyup.esc="cancelEdit(todo)"
          />
        </li>
      </ul>
    </section>
    <footer class="footer" v-cloak>
      <span class="todo-count">
        <strong>{{ remaining }}</strong>
        {{ remaining | pluralize }} left
      </span>
      <ul class="filters">
        <li>
          <a href="#/all" :class="{ selected: visibility == 'all' }">All</a>
        </li>
        <li>
          <a href="#/active" :class="{ selected: visibility == 'active' }">Active</a>
        </li>
        <li>
          <a href="#/completed" :class="{ selected: visibility == 'completed' }">Completed</a>
        </li>
      </ul>
      <button
        class="clear-completed"
        @click="removeCompleted"
        v-show="todos.length > remaining"
      >Clear completed</button>
    </footer>
  </section>
</template>

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
    filteredTodos() {
      return filters[this.visibility](this.todos);
    },
    remaining() {
      return filters.active(this.todos).length;
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
      return n === 1 ? "item" : "items";
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
      if (!this.isLoggedIn) {
        this.showModal = true;
        return false;
      }
      const value = this.newTodo && this.newTodo.trim();
      if (!value) {
        return;
      }
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
      this.editedTodo = todo;
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
    this.fetchTodo();
    window.addEventListener("hashchange", this.onHashChange);
    this.onHashChange();
  }
};
</script>
