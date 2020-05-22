<template lang="pug">
.row.middle-xs.center-xs.login-container
  .login-body
    img(alt="Pyramid Project Logo" src="@assets/logo-login.png")
    .form-wapper
      .field
        .fal.fa-user
        PyramidInput(
          @input="resetErrors"
          v-model="credentials.email"
          placeholder="Your Email"
        )
      .field
        .fal.fa-key
        PyramidInput(
          @input="resetErrors"
          v-model="credentials.password"
          type="password"
          placeholder="Your password"
        )
      .field(v-for="error in errors")
        .fal.fa-exclamation
        p {{ error }}
    button.button.round(@click="submitLogin")
      .far.fa-arrow-right
    img.login-background(alt="Pyramid Project Gradient" src="@assets/login-background.png")
</template>

<script>
import { LoginUser } from '@frontend/apollo/users/mutations.gql';

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
          mutation: LoginUser,
          variables: this.credentials,
        })
        .then(async (response) => {
          await this.$store.commit('setAuthToken', response.data.loginUser.token);
          this.$router.push({ name: 'Home' });
        })
        .catch((error) => {
          if (error.graphQLErrors) {
            this.errors = error.graphQLErrors.map((e) => e.message);
          } else {
            console.error(error);
          }
        });
    },
  },
  components: {
    PyramidInput: () => import('@frontend/components/forms/PyramidInput'),
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
}

.form-wapper {
  padding: 60px 0 20px;
}

.field {
  display: flex;
  .fal {
    margin-right: 10px;
    font-size: 16px;
    line-height: 38px;
    color: $blackCoral;
  }

  .input {
    margin-bottom: 10px;
  }
}

.button.round {
  display: block;
  color: $white;
  width: 54px;
  height: 54px;
  line-height: 54px;
  border-radius: 50%;
  background-image: linear-gradient(to right, $blue 0%, #0085FF 51%, $blue 100%);
  background-size: 200%;
  background-position: left center;
  transition: background 0.2s 0s ease;
  cursor: pointer;

  &:hover {
    background-position: right center;
  }
}
</style>
