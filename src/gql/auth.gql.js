import gql from 'graphql-tag';

export const REGISTER_MUTATION = gql`
    mutation register( $input: UserRegisterInputType!) {
      register(input: $input){
        message
        hashToken
    }
  }
`;

export default {
  REGISTER_MUTATION,
};
