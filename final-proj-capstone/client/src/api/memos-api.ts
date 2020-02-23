import { apiEndpoint } from '../config'
import { Memo } from '../types/Memo';
import { CreateMemoRequest } from '../types/CreateMemoRequest';
import Axios from 'axios'
import { UpdateMemoRequest } from '../types/UpdateMemoRequest';

export async function getMemos(idToken: string): Promise<Memo[]> {
  console.log('Fetching memos')

  const response = await Axios.get(`${apiEndpoint}/memos`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Memos:', response.data)
  return response.data.items
}

export async function createMemo(
  idToken: string,
  newMemo: CreateMemoRequest
): Promise<Memo> {
  const response = await Axios.post(`${apiEndpoint}/memos`,  JSON.stringify(newMemo), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchMemo(
  idToken: string,
  memoId: string,
  updatedMemo: UpdateMemoRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/memos/${memoId}`, JSON.stringify(updatedMemo), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteMemo(
  idToken: string,
  memoId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/memos/${memoId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  memoId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/memos/${memoId}/photo`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
