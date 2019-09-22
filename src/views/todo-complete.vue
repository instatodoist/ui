<template>
  <v-container class="pa-2" fluid>
    <div v-if="$apollo.queries.todoList.loading">Loading...</div>
    <v-timeline dense clipped v-if="!$apollo.queries.todoList.loading" align-top="">
      <v-timeline-item fill-dot class="white--text mb-12" color="orange" large>
        <template v-slot:icon>
          <span>
            <v-icon>note_add</v-icon>
          </span>
        </template>
      </v-timeline-item>

      <!-- <v-timeline-item class="mb-6" hide-dot>
          <span>TODAY</span>
      </v-timeline-item>-->

      <v-timeline-item
        color="green"
        class="mb-4"
        small
        v-for="event in todoList.data"
        :key="event.id"
      >
        <v-row justify="space-between">
          <v-col cols="7">
            <!-- <v-chip class="white--text ml-0" color="purple" label small>APP</v-chip> -->
            {{event.title}}
          </v-col>
          <v-col class="text-right" cols="5">
            <v-btn class="ma-1" tile outlined color="success">{{event.createdAt | formatDate}}</v-btn>
          </v-col>
        </v-row>
      </v-timeline-item>

      <!-- <v-timeline-item class="mb-4" hide-dot>
          <v-btn class="mx-0" color="white">Resend Email</v-btn>
      </v-timeline-item>-->
    </v-timeline>
  </v-container>
</template>

<script>
import { TODO_LIST_QUERY } from "../gql/todo.gql";
import gql from "graphql-tag";

export default {
  name: "TodoComplete",
  apollo: {
    todoList: {
      query: TODO_LIST_QUERY,
      variables: {
        filter: {
          isCompleted: true
        }
      }
    }
  },
  methods: {
    refetch() {
      this.$apollo.queries.todoList.refetch();
    }
  }
};
</script>
