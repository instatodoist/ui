<template>
  <div>
    <div v-if="$apollo.queries.listThought.loading"></div>
    <v-timeline v-if="!$apollo.queries.listThought.loading" dense align-top>
      <v-timeline-item v-for="(item, i) in listThought.data" :key="i" :color="getRandomColor" small>
        <!-- <template v-slot:opposite>
          <v-btn class="ma-2" outlined color="indigo" disabled>
            <span
              :class="`headline font-weight-bold ${getRandomColor}--text`"
            >{{item.createdAt | formatDate}}</span>
          </v-btn>
        </template>-->
        <div class="py-4">
          <h3>
            <v-btn class="ma-2" outlined color="indigo">
              <span>{{item.createdAt | formatDate}}</span>
            </v-btn>
          </h3>
          <h2 :class="`headline font-weight-light mb-4 ${getRandomColor}--text`">{{item.title}}</h2>
          <div>{{item.description}}</div>
        </div>
      </v-timeline-item>
    </v-timeline>
    <v-btn bottom :color="getRandomColor" dark fab fixed right @click="dialog = !dialog">
      <v-icon>add</v-icon>
    </v-btn>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <!-- <template v-slot:activator="{ on }">
        <v-btn color="primary" dark v-on="on">Open Dialog</v-btn>
      </template>-->
      <v-card>
        <v-card-title>
          <span class="headline">What are your thinking right now?</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="thought.title"
                  label="What topic your mind pointing right now?*"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="thought.description"
                  name="input-7-1"
                  label="Write in Detail"
                  required
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
          <v-btn color="blue darken-1" text @click="addThought">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import gql from 'graphql-tag';
import { THOUGHT_QUERY, TODO_ADD_THOUGHT } from '../gql/thought.gql';

export default {
  name: 'Thought',
  data: () => ({
    loading: false,
    dialog: false,
    thought: {
      title: '',
      description: '',
    },
  }),
  apollo: {
    listThought: {
      query: THOUGHT_QUERY,
    },
  },
  methods: {
    refetch() {
      this.$apollo.queries.listThought.refetch();
    },
    async addThought() {
      const title = this.thought.title && this.thought.title.trim();
      const description = this.thought.description && this.thought.description.trim();
      if (
        !title
        && !description
        && typeof title === 'string'
        && typeof description === 'string'
      ) {
        return;
      }
      this.loading = true;
      const postBody = {
        title,
        description,
      };
      await this.$apollo.mutate({
        mutation: TODO_ADD_THOUGHT,
        variables: { input: postBody },
        refetchQueries: [
          {
            query: THOUGHT_QUERY,
          },
        ],
      });
      this.loading = false;
      this.dialog = false;
    },
  },
  computed: {
    getRandomColor() {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    },
  },
};
</script>
