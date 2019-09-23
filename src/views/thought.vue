<template>
  <v-container class="pa-2" fluid>
    <v-card color="basil">
      <v-card-title class="text-center justify-center py-6">
        <h1 class="font-weight-bold display-3 basil--text">Desires</h1>
      </v-card-title>
      <v-tabs v-model="tab" background-color="transparent" color="basil" grow>
        <v-tab v-for="item in items" :key="item">{{ item }}</v-tab>
      </v-tabs>
      <div v-if="$apollo.queries.listThought.loading" class="ma-4"></div>
      <v-tabs-items
        v-model="tab"
        v-if="!$apollo.queries.listThought.loading && tab === 0"
        class="mt-10"
      >
        <v-tab-item v-for="item in items" :key="item">
          <v-row v-if="!$apollo.queries.listThought.loading">
            <v-col cols="4" v-for="(card, i) in notAchieved" :key="i" ma-4>
              <v-card color="#fff" class="pa-5">
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title :title="card.title" class="headline">{{card.title}}</v-list-item-title>
                    <v-list-item-subtitle
                      v-bind:style="{color: getRandomColor}"
                    >{{card.createdAt | formatDate}}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-card-text>{{card.description}}</v-card-text>

                <v-card-actions class="center">
                  <div class="flex-grow-1"></div>
                  <v-btn icon @click="pinned(card)">
                    <v-icon>{{card.isPinned ? 'mdi-pin-off' : 'mdi-pin'}}</v-icon>
                  </v-btn>
                  <v-btn icon @click="dialogDelete = true; thoughtObj = card">
                    <v-icon>mdi-clipboard-play-outline</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs-items>
      <v-tabs-items
        v-model="tab"
        v-if="!$apollo.queries.listThought.loading && tab === 1"
        class="mt-10"
      >
        <v-tab-item v-for="item in items" :key="item">
          <v-row v-if="!$apollo.queries.listThought.loading">
            <v-col cols="4" v-for="(card, i) in achieved" :key="i" ma-4>
              <v-card color="#fff" class="pa-5">
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title :title="card.title" class="headline">{{card.title}}</v-list-item-title>
                    <v-list-item-subtitle
                      v-bind:style="{color: getRandomColor}"
                    >{{card.createdAt | formatDate}}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-card-text>{{card.description}}</v-card-text>

                <v-card-actions class="center">
                  <div class="flex-grow-1"></div>
                  <v-btn icon @click="markComplete(card)">
                    <v-icon>mdi-file-undo</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs-items>
    </v-card>

    <div v-if="$apollo.queries.listThought.loading">Loading ...</div>
    <v-btn bottom :color="getRandomColor" dark fab fixed right @click="dialog = !dialog">
      <v-icon>add</v-icon>
    </v-btn>
    <v-dialog v-model="dialog" persistent max-width="600px">
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
    <v-dialog v-model="dialogDelete" max-width="400">
      <v-card>
        <v-card-title class="headline">Is your desired completed?</v-card-title>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="green darken-1" text @click="dialogDelete = false">Disagree</v-btn>

          <v-btn color="green darken-1" text @click="markComplete();dialogDelete = false">Agree</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
  <!-- <div>
    <div v-if="$apollo.queries.listThought.loading"></div>
    <v-timeline v-if="!$apollo.queries.listThought.loading" dense align-top>
      <v-timeline-item v-for="(item, i) in listThought.data" :key="i" :color="getRandomColor" small>
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
  </div>-->
</template>
<script>
import gql from "graphql-tag";
import {
  THOUGHT_QUERY,
  ADD_THOUGHT_MUTATION,
  UPDATE_THOUGHT_MUTATION
} from "../gql/thought.gql";

export default {
  name: "Thought",
  data: () => ({
    dialogDelete: false,
    thoughtObj: null,
    loading: false,
    dialog: false,
    thought: {
      title: "",
      description: ""
    },
    tab: null,
    items: ["Going-On", "Archieved"]
  }),
  apollo: {
    listThought: {
      query: THOUGHT_QUERY
    }
  },
  methods: {
    refetch() {
      this.$apollo.queries.listThought.refetch();
    },
    async addThought() {
      const title = this.thought.title && this.thought.title.trim();
      const description =
        this.thought.description && this.thought.description.trim();
      if (
        !title &&
        !description &&
        typeof title === "string" &&
        typeof description === "string"
      ) {
        return;
      }
      this.loading = true;
      const postBody = {
        title,
        description
      };
      await this.$apollo.mutate({
        mutation: TODO_ADD_THOUGHT,
        variables: { input: postBody },
        refetchQueries: [
          {
            query: THOUGHT_QUERY
          }
        ]
      });
      this.loading = false;
      this.dialog = false;
    },
    async markComplete(item) {
      let postBody = null;
      const recordId =
        typeof item !== "undefined" ? item._id : this.thoughtObj._id;
      if (typeof item !== "undefined") {
        postBody = {
          title: item.title,
          description: item.description,
          isAchieved: false
        };
      } else {
        postBody = {
          title: this.thoughtObj.title,
          description: this.thoughtObj.description,
          isAchieved: true
        };
      }
      await this.$apollo.mutate({
        mutation: UPDATE_THOUGHT_MUTATION,
        variables: { id: recordId, input: postBody },
        refetchQueries: [
          {
            query: THOUGHT_QUERY
          }
        ]
      });
    },
    async pinned(thought) {
      const postBody = {
        title: thought.title,
        description: thought.description,
        isPinned: !thought.isPinned
      };
      await this.$apollo.mutate({
        mutation: UPDATE_THOUGHT_MUTATION,
        variables: { id: thought._id, input: postBody },
        refetchQueries: [
          {
            query: THOUGHT_QUERY
          }
        ]
      });
    }
  },
  computed: {
    getRandomColor() {
      const letters = "0123456789ABCDEF";
      let color = "#";
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    },
    achieved() {
      return this.listThought.data.filter(item => {
        return item.isAchieved === true;
      });
    },
    notAchieved: {
      get() {
        return this.listThought.data.filter(item => {
          return item.isAchieved === false || item.isAchieved === null;
        });
      }
    }
  }
};
</script>
