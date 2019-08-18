
<script>
export default {
  name: "LoginModal",
  data() {
    return {
      dialog: true,
      err: "",
      isSubmit: false,
      user: {
        email: "",
        password: ""
      }
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
    showForgot(value) {
      this.$emit("loginSwapEvent", value);
    },
    handleSubmit() {
      this.err = "";
      this.isSubmit = true;
      const postData = {
        email: this.user.email,
        password: this.user.password
      };
      const query = `
      query {
        login(input: {email: "${postData.email}", password: "${postData.password}"}) {
          message
          user {
              email
          }
          token
        }
      }
      `;
      return fetch(`${this.$BASE_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/graphql"
        },
        body: query
      })
        .then(res => res.json())
        .then(response => {
          const { token, user, message } = response.data.login;
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
          this.isSubmit = false;
          this.dialog = false;
          this.$emit("close");
        })
        .catch(err => {
          this.isSubmit = false;
          this.err = err;
        });
    }
  }
};
</script>

<template>
  <v-dialog max-width="600px" v-model="dialog">
    <form @submit.prevent="handleSubmit">
    <v-card>
      <v-card-title>
        <span class="headline">Login</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field label="Email*" v-model="user.email" required></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field label="Password*" type="password" v-model="user.password" required></v-text-field>
            </v-col>
          </v-row>
        </v-container>
        <small>*indicates required field</small>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <!-- <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn> -->
        <v-btn type="submit" color="blue darken-1" text :disabled="isSubmit" :value="!isSubmit? 'Log in' : 'Logging In ...'">Login</v-btn>
      </v-card-actions>
    </v-card>
    </form>
  </v-dialog>
</template>