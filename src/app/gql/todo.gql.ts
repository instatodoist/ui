import gql from 'graphql-tag';

const ToDo: any = {};

ToDo.fragments = {
  count: gql`
    fragment TodoCount on TodoListType {
        totalCount
    }
    `,
  cFields: gql`
    fragment TodoCFields on TodoType {
      _id
      title
      createdAt
      updatedAt
      label {
          name
      }
    }
    `,
  filelds: gql`
    fragment TodoFields on TodoType {
      _id
      title
      label {
          name
          _id
      }
      isCompleted
      createdAt
      updatedAt
      priority
      scheduledDate
      notes {
          description
          _id
          userId {
              email
              _id
          }
      }
      user {
          email
      }
    }
  `
};

export const TODO_LIST_QUERY = gql`
  query todoList ($first: Int = 100, $offset: Int = 1, $filter: TodoFilterInputType, $sort: TodoSortInputType){
    todoList (first: $first, offset: $offset, filter: $filter, sort: $sort ){
      ...TodoCount
      data {
          ...TodoFields
      }
    }
  }
  ${ToDo.fragments.count}
  ${ToDo.fragments.filelds}
`;

export const TODO_COMPLETED_QUERY = gql`
  query todoCompleted ($first: Int = 100, $offset: Int = 1, $filter: TodoCompletedFilterInputType, $sort: TodoCompletedSortInputType){
    todoCompleted (first: $first, offset: $offset, filter: $filter, sort: $sort ){
      totalCount
      data {
        _id
        count
        list {
          ...TodoCFields
        }
      }
    }
  }
  ${ToDo.fragments.cFields}
`;

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

export const TODO_LIST_COUNT_QUERY = gql`
  query todoCount($filter: TodoFilterInputType) {
    today: todoList (filter: { type: today} ){
      ...TodoCount
    }
    upcoming: todoList (filter: { type: upcoming} ){
      ...TodoCount
    }
    pending: todoList (filter: { type: pending} ){
      ...TodoCount
    }
    inbox: todoList (filter: { type: backlog} ){
      ...TodoCount
    },
    completed: todoList (filter: $filter){
      ...TodoCount
    },
  }
  ${ToDo.fragments.count}
`;

export const TODO_COMPLETED_COUNT_QUERY = gql`
  query{
    todoCompleted {
      totalCount
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

export const TODO_LABEL_UPDATE_MUTATION = gql`
  mutation addTodoLabel( $id: ID!, $input: TodoLabelInputType!) {
    updateTodoLabel(id: $id, input: $input){
      message
      ok
    }
  }
`;

export const TODO_LABEL_DELETE_MUTATION = gql`
  mutation deleteTodoLabel( $id: ID!) {
    deleteTodoLabel(id: $id){
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

// export const TODO_COUNT_FRAGMENT = gql`
//     fragment TodoCount on TodoListType {
//         count
//     }
// `;

// export const TODO_COUNT_QUERY = gql`
//     query todoCount ($first: Int = 100, $offset: Int = 1, $filter: TodoFilterInputType, $sort: TodoSortInputType){
//         today: todoList (first: $first, offset: $offset, filter: $filter, sort: $sort ){
//             ...TodoCount
//         }
//         # pending: todoList (first: $first, offset: $offset, filter: $filter, sort: $sort ){
//         #     ...${TODO_COUNT_FRAGMENT}
//         # }
//         # inbox: todoList (first: $first, offset: $offset, filter: $filter, sort: $sort ){
//         #     ...${TODO_COUNT_FRAGMENT}
//         # }
//     }
//     ${ToDo.fragments.count}
// `;

export default {
  TODO_ADD_MUTATION,
  TODO_DELETE_MUTATION,
  TODO_UPDATE_MUTATION,
  TODO_LIST_QUERY,
  TODO_COMPLETED_QUERY
};
