import gql from 'graphql-tag';

export const TODO_ADD_MUTATION = gql`
    mutation addTodo( $input: TodoInputType!) {
        addTodo(input: $input){
            message
            ok
        }
    }
`;

export const TODO_UPDATE_MUTATION = gql`
    mutation updateTodo( $id: ID!, $input: TodoInputType!) {
        updateTodo(id: $id, input: $input){
            message
            ok
        }
    }
`;

export const TODO_DELETE_MUTATION = gql`
    mutation deleteTodo( $id: ID!) {
        deleteTodo(id: $id){
            message
            ok
        }
    }
`;


export const TODO_LIST_QUERY = gql`
    query todoList ($first: Int = 50, $offset: Int = 1, $filter: TodoFilterInputType){
        todoList (first: $first, offset: $offset, filter: $filter ){
            totalCount
            data {
                _id
                title
                label {
                    name
                    _id
                }
                isCompleted
                createdAt
                scheduledDate
                comments {
                    description
                }
                user {
                    email
                }
            }
        }
    }
`;


export const TODO_COMPLETED_QUERY = gql`
    query{
        todoCompleted {
        totalCount
        data {
            _id
            list {
                _id
                title
                createdAt
                updatedAt
                label {
                    name
                }
                comments {
                    description
                }
            }
        }
        }
    }
`;

export const TODO_LABEL_ADD_MUTATION = gql`
    mutation addTodoLabel( $input: TodoLabelInputType!) {
        addTodoLabel(input: $input){
            message
            ok
        }
    }
`;

export const TODO_LABEL_QUERY = gql`
    query {
        todoLabelList {
            name
            _id
        }
    }
`;

export default {
  TODO_ADD_MUTATION,
  TODO_DELETE_MUTATION,
  TODO_UPDATE_MUTATION,
  TODO_LIST_QUERY,
  TODO_COMPLETED_QUERY
};
