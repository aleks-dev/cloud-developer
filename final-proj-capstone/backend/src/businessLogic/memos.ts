import * as uuid from 'uuid'
import { Memo } from '../models/Memo'
import { CreateMemoRequest } from '../requests/CreateMemoRequest'
import { MemosRepo } from '../data/memosRepo'

const memosRepo = new MemosRepo()


export async function getAllMemos(userId: string)
: Promise<Memo[]> {
  return await memosRepo.getAllMemos(userId)
}

export async function searchMemos(userId: string, searchPhrase: string, esHost: string, searchObj: any)
: Promise<string> { //Promise<Memo[]> {
  return await memosRepo.searchMemos(userId, searchPhrase, esHost, searchObj)
}

export async function createMemo(
  createMemoRequest: CreateMemoRequest,
  userId: string
): Promise<Memo> {

  const itemId = uuid.v4()

  return await memosRepo.createMemo({      
    memoId: itemId,
    userId: userId,
    memoName: createMemoRequest.memoName,
    createdDate: new Date().toISOString(),
    photoUrl: null
  })
}

  export async function updatePhotoUrl(
    memoId: string, 
    userId: string) 
  {
    await memosRepo.updatePhotoUrl(memoId, userId)
  }


  export async function deleteMemo(
    memoId: string,
    userId: string
  ) {  
    await memosRepo.deleteMemo(memoId, userId)
  }


  export async function getUploadUrl(
    memoId: string,
    userId: string
  ): Promise<String> 
  {
    return await memosRepo.getUploadUrl(memoId, userId)
  }


  export async function memoExists(
    memoId: string,
    userId: string
  ): Promise<Boolean> 
  {
    return await memosRepo.memoExists(memoId, userId)
  }