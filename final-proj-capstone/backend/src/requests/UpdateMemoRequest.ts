/**
 * Fields in a request to update a single MEMO item.
 */
export interface UpdateMemoRequest {
  memoName: string
  dueDate: string
  done: boolean
}