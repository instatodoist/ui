import gql from 'graphql-tag';

export const TODO_ADD_THOUGHT = gql`
    mutation addThought( $input: ThoughtInputType!) {
        addThought(input: $input){
            message
            ok
        }
    }
`;

// export const TODO_UPDATE_MUTATION = gql`
//     mutation updateTodo( $id: ID!, $input: TodoInputType!) {
//         updateTodo(id: $id, input: $input){
//             message
//             ok
//         }
//     }
// `;

// export const TODO_DELETE_MUTATION = gql`
//     mutation deleteTodo( $id: ID!) {
//         deleteTodo(id: $id){
//             message
//             ok
//         }
//     }
// `;


export const THOUGHT_QUERY = gql`
    query listThought ($first: Int = 100, $offset: Int = 1){
        listThought (first: $first, offset: $offset ){
            totalCount
            data {
                _id
                title
                description
                createdAt
            }
        }
    }
`;

export default {
  THOUGHT_QUERY,
};
