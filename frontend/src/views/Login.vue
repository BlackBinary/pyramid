<template lang="pug">
.row.middle-xs.center-xs.login-container
  .login-body
    img(alt="Pyramid Project Logo" src="@assets/logo-login.png")
    .form-wapper
      PyramidField(icon="fa-user")
        PyramidInput(
          @input="resetErrors"
          v-model="credentials.email"
          placeholder="Your Email"
        )
      PyramidField(icon="fa-key")
        PyramidInput(
          @input="resetErrors"
          v-model="credentials.password"
          type="password"
          placeholder="Your password"
        )
      button.button.round.m-t-lg(@click="submitLogin")
        .far.fa-arrow-right
    img.login-background(alt="Pyramid Project Gradient" src="@assets/login-background.png")
</template>

<script>
import { loginUserMutation } from '@frontend/apollo/users/mutations.gql';

export default {
  name: 'Login',
  data() {
    return {
      errors: [],
      credentials: {
        email: '',
        password: '',
      },
    };
  },
  methods: {
    resetErrors() {
      this.errors = [];
    },
    submitLogin() {
      this.resetErrors();

      this.$apollo
        .mutate({
          mutation: loginUserMutation,
          variables: this.credentials,
        })
        .then(async (response) => {
          await this.$store.commit('setAuthToken', response.data.loginUser.token);
          this.$store.dispatch('addToaster', { message: 'Loggedin succesfully', type: 'success' });
          this.$router.push({ name: 'Home' });
        })
        .catch((error) => {
          if (error.graphQLErrors) {
            this.errors = error.graphQLErrors.map((e) => e.message);
            this.$store.dispatch('addToaster', { message: this.errors[0], type: 'error' });
          } else {
            console.error(error);
          }
        });
    },
  },
  components: {
    PyramidInput: () => import('@frontend/components/forms/PyramidInput'),
    PyramidField: () => import('@frontend/components/forms/PyramidField'),
  },
};
</script>

<style lang="scss">
.login-container {
  min-height: 100vh;
}

.login-body {
  background: $gunMetal;
  padding: 71px 48px 150px;
  width: 318px;
  box-sizing: border-box;
  border-radius: 12px;
  box-shadow: 0 15px 25px 0 rgba($shadowColor, 0.6);
  position: relative;

  .login-background {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .form-wapper {
    padding: 60px 0 20px;
    text-align: left;
  }
}

</style>
