<template>
  <v-container class="pa-2" fluid>
    <v-card color="basil">
      <div class="text-center" style="min-height: 500px;" v-if="$apollo.queries.todoCompleted.loading">
          <v-progress-circular
            class="mt-10"
            :size="50"
            color="primary"
            indeterminate
          ></v-progress-circular>
        </div>
      <v-timeline dense clipped v-if="!$apollo.queries.todoCompleted.loading" align-top class="ma-10">

        <v-timeline-item fill-dot class="white--text mb-12" color="orange" large>
          <template v-slot:icon>
            <span>
              <v-icon>note_add</v-icon>
            </span>
          </template>
        </v-timeline-item>

        <!-- <v-timeline-item class="mb-6" hide-dot>
          <span>TODAY</span>
        </v-timeline-item> -->

        <v-timeline-item
          color="green"
          class="mb-4"
          small
          v-for="event in todoCompleted.data"
          :key="event._id"
        >
          <span>{{event._id | formatDateLess}}</span>

          <v-row style="border-bottom: 1px solid #ccc;" class="pt-1" justify="space-between" v-for="(todo, index) in event.list" :key="todo._id">
            <v-col cols="1">
              <strong>{{index + 1}}</strong>
            </v-col>
            <v-col cols="4">

              {{todo.title}}
            </v-col>
            <v-col cols="3">

              {{todo.updatedAt | formatDate}}
            </v-col>
            <v-col cols="3">

              {{todo.createdAt | formatDate}}
            </v-col>
            <!-- <v-col class="text-right" cols="5">
              <v-btn class="ma-1" tile outlined color="success">{{todo.createdAt | formatDate}}</v-btn>
            </v-col> -->
          </v-row>
        </v-timeline-item>

        <!-- <v-timeline-item class="mb-4" hide-dot>
          <v-btn class="mx-0" color="white">Resend Email</v-btn>
        </v-timeline-item>-->
      </v-timeline>
    </v-card>
  </v-container>
</template>

<script>
import gql from 'graphql-tag';
import { TODO_COMPLETED_QUERY } from '../gql/todo.gql';

export default {
  name: 'TodoComplete',
  apollo: {
    todoCompleted: {
      query: TODO_COMPLETED_QUERY
    }
  },
  methods: {
    refetch() {
      this.$apollo.queries.todoCompleted.refetch();
    }
  }
};
</script>
