import gql from 'graphql-tag';

export const ADD_GOAL_MUTATION = gql`
    mutation addThought( $input: ThoughtInputType!) {
        addThought(input: $input){
            message
            ok
        }
    }
`;

export const UPDATE_GOAL_MUTATION = gql`
    mutation updateThought( $id: ID!, $input: ThoughtInputType!) {
        updateThought(id: $id, input: $input){
            message
            ok
        }
    }
`;

// export const TODO_DELETE_MUTATION = gql`
//     mutation deleteTodo( $id: ID!) {
//         deleteTodo(id: $id){
//             message
//             ok
//         }
//     }
// `;


export const GOAL_QUERY = gql`
    query listThought ($limit: Int = 100, $offset: Int = 1){
        listThought (limit: $limit, offset: $offset ){
            totalCount
            data {
                _id
                title
                accomplishTenure
                isPinned
                isAchieved
                description
                createdAt
                updatedAt
            }
        }
    }
`;

export default {
    GOAL_QUERY,
};
