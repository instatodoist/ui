<template>
  <v-container class="pa-2" fluid>
    <v-row>
         <v-timeline dense clipped>
      <v-timeline-item
        fill-dot
        class="white--text mb-12"
        color="orange"
        large
      >
        <template v-slot:icon>
          <span>JL</span>
        </template>
        <v-text-field
          v-model="input"
          hide-details
          flat
          label="Leave a comment..."
          solo
          @keydown.enter="comment"
        >
          <template v-slot:append>
            <v-btn
              class="mx-0"
              depressed
              @click="comment"
            >
              Post
            </v-btn>
          </template>
        </v-text-field>
      </v-timeline-item>

      <v-slide-x-transition
        group
      >
        <v-timeline-item
          v-for="event in timeline"
          :key="event.id"
          class="mb-4"
          color="pink"
          small
        >
          <v-row justify="space-between">
            <v-col cols="7" v-text="event.text"></v-col>
            <v-col class="text-right" cols="5" v-text="event.time"></v-col>
          </v-row>
        </v-timeline-item>
      </v-slide-x-transition>

      <v-timeline-item
        class="mb-6"
        hide-dot
      >
        <span>TODAY</span>
      </v-timeline-item>

      <v-timeline-item
        class="mb-4"
        color="grey"
        icon-color="grey lighten-2"
        small
      >
        <v-row justify="space-between">
          <v-col cols="7">This order was archived.</v-col>
          <v-col class="text-right" cols="5">15:26 EDT</v-col>
        </v-row>
      </v-timeline-item>

      <v-timeline-item
        class="mb-4"
        small
      >
        <v-row justify="space-between">
          <v-col cols="7">
            <v-chip
              class="white--text ml-0"
              color="purple"
              label
              small
            >
              APP
            </v-chip>
            Digital Downloads fulfilled 1 item.
          </v-col>
          <v-col class="text-right" cols="5">15:25 EDT</v-col>
        </v-row>
      </v-timeline-item>

      <v-timeline-item
        class="mb-4"
        color="grey"
        small
      >
        <v-row justify="space-between">
          <v-col cols="7">
            Order confirmation email was sent to John Leider (john@vuetifyjs.com).
          </v-col>
          <v-col class="text-right" cols="5">15:25 EDT</v-col>
        </v-row>
      </v-timeline-item>

      <v-timeline-item
        class="mb-4"
        hide-dot
      >
        <v-btn
          class="mx-0"
          color="white"
        >
          Resend Email
        </v-btn>
      </v-timeline-item>

      <v-timeline-item
        class="mb-4"
        color="grey"
        small
      >
        <v-row justify="space-between">
          <v-col cols="7">
            A $15.00 USD payment was processed on PayPal Express Checkout
          </v-col>
          <v-col class="text-right" cols="5">15:25 EDT</v-col>
        </v-row>
      </v-timeline-item>

      <v-timeline-item
        color="grey"
        small
      >
        <v-row justify="space-between">
          <v-col cols="7">
            John Leider placed this order on Online Store (checkout #1937432132572).
          </v-col>
          <v-col class="text-right" cols="5">15:25 EDT</v-col>
        </v-row>
      </v-timeline-item>
    </v-timeline>
      <!-- <v-timeline style="padding: 0 15% 15% 15%;">
        <v-timeline-item v-for="(item, i) in items" :key="i" cyan small>
          <template v-slot:opposite>
            <span :class="`headline font-weight-bold cyan--text`">{{item.createdAt | formatDate}}</span>
          </template>
          <div class="py-4">
            <h2 :class="`headline font-weight-light mb-4 cyan--text`">{{item.title}}</h2>
            <div>{{item.description}}</div>
          </div>
        </v-timeline-item>
      </v-timeline> -->
      <!-- <v-col v-for="(item, i) in items" :key="i">
        <v-card :color="item.color" dark>
          <v-list-item three-line>
            <v-list-item-content class="align-self-start">
              <v-list-item-title class="headline mb-2" v-text="item.title"></v-list-item-title>
              <v-list-item-subtitle v-text="item.description"></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>-->
    </v-row>
  </v-container>
</template>

<script>
import { THOUGHT_QUERY } from "../gql/thought.gql";

export default {
  name: "Thought",
  data() {
    return {
      items: [],
       events: [],
      input: null,
      nonce: 0,
    };
  },
  components: {},
  methods: {
      comment () {
        const time = (new Date()).toTimeString()
        this.events.push({
          id: this.nonce++,
          text: this.input,
          time: time.replace(/:\d{2}\sGMT-\d{4}\s\((.*)\)/, (match, contents, offset) => {
            return ` ${contents.split(' ').map(v => v.charAt(0)).join('')}`
          }),
        })

        this.input = null
      },
    fetchThoughts() {
      return this.$apollo
        .query({
          query: THOUGHT_QUERY
        })
        .then(response => {
          this.items = response.data.listThought.data;
        });
    }
  },
  created() {
    this.fetchThoughts();
  },
   computed: {
      timeline () {
        return this.events.slice().reverse()
      },
    },
};
</script>
