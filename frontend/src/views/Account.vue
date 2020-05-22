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
import gql from 'graphql-tag';

const accountQuery = gql`
  {
    account {
      id
      firstName
      lastName
      email
    }
  },
`;

export default {
  data() {
    return {
      errors: [],
      account: null,
    };
  },
  apollo: {
    account: {
      query: accountQuery,
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
          mutation: gql`
          mutation UpdateAccount($email: String!, $firstName: String!, $lastName: String!) {
            updateAccount(email: $email, firstName: $firstName, lastName: $lastName) {
              id
              firstName
              lastName
              email
            }
          }
        `,
          variables: { firstName, lastName, email },
          update: (store, { data: { updateAccount } }) => {
            store.writeQuery({ query: accountQuery, data: { account: updateAccount } });
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
