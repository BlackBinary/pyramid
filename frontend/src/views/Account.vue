<template lang="pug">
  div
    h2 Account
    p Here you'll find your information
    .form-wapper(v-if="account")
      .field
        PyramidInput(
          @input="resetErrors"
          v-model="account.email"
          placeholder="Your Email"
        )
      .field
        PyramidInput(
          @input="resetErrors"
          v-model="account.firstName"
          placeholder="Firstname"
        )
      .field
        PyramidInput(
          @input="resetErrors"
          v-model="account.lastName"
          placeholder="Lastname"
        )
      .field
        button.button(@click="updateAccount") Update Information
      .field(v-for="error in errors")
        .fal.fa-exclamation
        p {{ error }}
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
          },
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
