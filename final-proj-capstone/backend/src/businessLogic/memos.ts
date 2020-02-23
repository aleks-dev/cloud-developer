import * as uuid from 'uuid'
import { MemoItem } from '../models/MemoItem'
import { CreateMemoRequest } from '../requests/CreateMemoRequest'
import { MemosRepo } from '../data/memosRepo'
import { UpdateMemoRequest } from '../requests/UpdateMemoRequest'

const memosRepo = new MemosRepo()


export async function getAllMemos(userId: string)
: Promise<MemoItem[]> {
  return await memosRepo.getAllMemos(userId)
}

export async function createMemo(
  createMemoRequest: CreateMemoRequest,
  userId: string
): Promise<MemoItem> {

  const itemId = uuid.v4()

  return await memosRepo.createMemo({      
    memoId: itemId,
    userId: userId,
    memoName: createMemoRequest.memoName,
    dueDate: createMemoRequest.dueDate,
    createdAt: new Date().toISOString(),
    done: false,
    photoUrl: null //DOESN'T EXIST IN THE CreateMemoRequest, THEREFORE I ASSUME IT WILL NOT BE PASSED ON CREATION.
  })
}


export async function updateMemo(
    memoId: string,
    userId: string,
    updateMemoRequest: UpdateMemoRequest,
  ) {
    await memosRepo.updateMemo(memoId,
                                userId,
                                {
                                  memoName: updateMemoRequest.memoName,
                                  dueDate: updateMemoRequest.dueDate,
                                  done: updateMemoRequest.done
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