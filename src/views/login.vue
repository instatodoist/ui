
<script>
export default {
  name: "LoginModal",
  data() {
    return {
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
  <div class="modal-mask t-modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <div class="modal-body">
          <div class="col-md-6">
            <div class="page-content">
              <h2>Login</h2>
              <div class="form-style form-style-3">
                <form @submit.prevent="handleSubmit">
                  <div class="form-inputs clearfix">
                    <p class="login-text">
                      <input
                        type="email"
                        value="Email"
                        placeholder="Email"
                        v-model="user.email"
                        required
                      />
                      <i class="icon-envelope"></i>
                    </p>
                    <p class="login-password">
                      <input
                        placeholder="Password"
                        type="password"
                        value="Password"
                        v-model="user.password"
                        required
                      />
                      <i class="icon-lock"></i>
                      <!-- <a href="javascript:void(0);" v-on:click="showForgot(true)">Forget</a> -->
                    </p>
                  </div>
                  <p class="form-submit login-submit">
                    <input
                      :disabled="isSubmit"
                      :value="!isSubmit? 'Log in' : 'Logging In ...'"
                      type="submit"
                      class="button color small login-submit submit"
                    />
                  </p>
                  <div class="rememberme"></div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <slot name="footer">
            <button
              class="button color small login-submit submit"
              type="button"
              data-dismiss="modal"
              @click="$emit('close')"
            >Cancel</button>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.t-modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.t-modal-mask .modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.t-modal-mask .modal-container {
  width: 300px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.t-modal-mask .modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.t-modal-mask .modal-body {
  margin: 20px 0;
}

.t-modal-mask .modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>