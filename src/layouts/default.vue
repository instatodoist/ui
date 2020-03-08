<template>
  <div>
    <v-navigation-drawer v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" app>
      <v-list dense>
        <template v-for="item in items">
          <v-row v-if="item.heading" :key="item.heading" align="center">
            <v-col cols="6">
              <v-subheader v-if="item.heading">{{ item.heading }}</v-subheader>
            </v-col>
            <v-col cols="6" class="text-center">
              <a href="#!" class="body-2 black--text">EDIT</a>
            </v-col>
          </v-row>
          <v-list-group
            v-else-if="item.children"
            :key="item.text"
            v-model="item.model"
            :prepend-icon="item.model ? item.icon : item['icon-alt']"
            append-icon
          >
            <template v-slot:activator>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>{{ item.text }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
            <!-- Iterate child sub-links -->
            <v-list-item v-for="(child, i) in item.children" :key="i" @click="navigateToRoute(child.link)">
              <v-list-item-action>
                <v-icon>{{ child.icon || ''}}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{ child.text}}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <!-- END-->
          </v-list-group>
          <!-- Iterate child links -->
          <v-list-item v-else :key="item.text" :to="item.link? item.link: '/'">
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <!-- END-->
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app color="blue darken-3" dark>
      <v-toolbar-title style="width: 300px" class="ml-0 pl-4">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <span class="hidden-sm-and-down">{{title}}</span>
      </v-toolbar-title>
      <!-- <v-text-field
        flat
        solo-inverted
        hide-details
        prepend-inner-icon="search"
        label="Search"
        class="hidden-sm-and-down"
      ></v-text-field> -->
      <div class="flex-grow-1"></div>
      <!-- <v-btn icon>
        <v-icon>apps</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>notifications</v-icon>
      </v-btn> -->
      <v-btn icon large>
        <v-icon @click="logout()" title="Log Out">logout</v-icon>
        <!-- <v-avatar size="32px" item>
          <v-img src="https://cdn.vuetifyjs.com/images/logos/logo.svg" alt="Vuetify"></v-img>
        </v-avatar>-->
      </v-btn>
    </v-app-bar>
    <v-content>
      <v-container class="fill-height" fluid>
        <slot />
      </v-container>
    </v-content>
    <v-dialog v-if="labelDialog" v-model="labelDialog" persistent max-width="600px">
          <v-card>
            <v-card-title>
              <span class="headline">Add Label</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field v-model="label.name" label="Label*" required></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
              <!-- <small>*indicates required field</small> -->
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="labelDialog = false">Close</v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="saveLabel(label); labelDialog = false;"
              >Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
  </div>
</template>

<script>
import localStorageService from '../services/localStorage';
import { TODO_LABEL_QUERY, TODO_LABEL_ADD_MUTATION } from '../gql/todo.gql';

export default {
  name: 'DefaultLayout',
  data() {
    return {
      drawer: null,
      labelDialog: false,
      label: {
        name: ''
      },
      items: [
        { icon: 'email', text: 'Inbox', link: '/inbox' },
        { icon: 'contacts', text: 'Today', link: '/dashboard' },
        { icon: 'note_add', text: 'Completed Todos', link: '/completed-todos' },
        { icon: 'chat_bubble', text: 'My Goals', link: '/thoughts' },
        // { icon: "history", text: "Frequently contacted" },
        // { icon: "content_copy", text: "Duplicates" },
        // {
        //   icon: 'keyboard_arrow_up',
        //   'icon-alt': 'keyboard_arrow_down',
        //   text: 'Labels',
        //   model: true,
        //   children: [{ icon: 'add', text: 'Create label' }],
        // },
      // {
      //   icon: "keyboard_arrow_up",
      //   "icon-alt": "keyboard_arrow_down",
      //   text: "More",
      //   model: false,
      //   children: [
      //     { text: "Import" },
      //     { text: "Export" },
      //     { text: "Print" },
      //     { text: "Undo changes" },
      //     { text: "Other contacts" }
      //   ]
      // },
      // { icon: 'settings', text: 'Settings' },
      // { icon: "chat_bubble", text: "Send feedback" },
      // { icon: "help", text: "Help" },
      // { icon: "phonelink", text: "App downloads" },
      // { icon: "keyboard", text: "Go to the old version" }
      ],
    };
  },
  methods: {
    logout() {
      return localStorageService.destroySession().then(() => {
        this.$router.push('/login');
      });
    },
    navigateToRoute(link) {
      if (link) {
        this.$router.push(link);
      } else {
        this.labelDialog = true;
      }
    },
    async getLabel() {
      const response = await this.$apollo.query({ query: TODO_LABEL_QUERY });
      const responseData = response.data.todoLabelList;
      const responseLinks = responseData.map(item => ({
        ...item, link: (item._id) ? `/labelled-todos/${item._id}` : '', text: (item.name) ? `${item.name}` : 'blank_label'
      }));
      const labels = {
        icon: 'keyboard_arrow_up',
        'icon-alt': 'keyboard_arrow_down',
        text: 'Labels',
        model: true,
        children: [{ icon: 'add', text: 'Create label' }],
      };
      labels.children = [...responseLinks, ...labels.children];
      this.items.push(labels);
    },
    async saveLabel(label) {
      const value = label.name && label.name.trim();
      if (!value) {
        return;
      }
      this.loading = true;
      const postBody = {
        name: value
      };
      await this.$apollo.mutate({
        mutation: TODO_LABEL_ADD_MUTATION,
        variables: { input: postBody },
        refetchQueries: [
          {
            query: TODO_LABEL_QUERY
          }
        ]
      });
      this.label.name = '';
    }
  },
  async created() {
    this.title = this.$APP_TITLE;
    this.getLabel();
  },
};
</script>
