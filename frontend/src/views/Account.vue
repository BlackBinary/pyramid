<template lang="pug">
  div
    h2 Account
    p Here you'll find your information
    .form-wapper(v-if="account")
      PyramidField(icon="fa-at")
        PyramidInput(
          @input="resetErrors"
          v-model="account.email"
          placeholder="Your Email"
        )
      PyramidField(icon="fa-user")
        PyramidInput(
          @input="resetErrors"
          v-model="account.firstName"
          placeholder="Firstname"
        )
      PyramidField(icon="fa-user")
        PyramidInput(
          @input="resetErrors"
          v-model="account.lastName"
          placeholder="Lastname"
        )
      button.button(@click="updateAccount") Update Information
</template>

<script>
import { getAccount } from '@frontend/apollo/users/queries.gql';
import { UpdateAccount } from '@frontend/apollo/users/mutations.gql';

export default {
  data() {
    return {
      errors: [],
      account: null,
    };
  },
  apollo: {
    account: {
      query: getAccount,
    },
  },
  methods: {
    resetErrors() {
      this.errors = [];
    },
    updateAccount() {
      const {
        firstName,
        lastName,
        email,
      } = this.account;

      this.$apollo
        .mutate({
          mutation: UpdateAccount,
          variables: { firstName, lastName, email },
          update: (store, { data: { updateAccount: account } }) => {
            store.writeQuery({
              query: getAccount,
              data: { account },
            });
            this.$store.dispatch('addToaster', { message: 'Saved', type: 'success' });
          },
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
