interface TodoType {
    _id: string;
    title: string
}
export interface TodoListType {
    data: TodoType[],
    totalCount: number
}