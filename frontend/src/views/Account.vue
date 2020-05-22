<template lang="pug">
  div
    h2 Account
    p Here you'll find your information
    .form-wapper(v-if="account")
      .field
        PyramidInput(
          v-model="account.email"
          placeholder="Your Email"
        )
      .field
        PyramidInput(
          v-model="account.firstName"
          placeholder="Firstname"
        )
      .field
        PyramidInput(
          v-model="account.lastName"
          placeholder="Lastname"
        )
</template>

<script>
import gql from 'graphql-tag';

export default {
  data() {
    return {
      account: null,
    };
  },
  apollo: {
    account: {
      query: gql`
        {
          account {
            id
            firstName
            lastName
            email
          }
        },
      `,
    },
  },
  components: {
    PyramidInput: () => import('@frontend/components/forms/PyramidInput'),
  },
};
</script>
