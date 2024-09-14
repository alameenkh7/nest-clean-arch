import { Deps } from "../../entitygateway";

export const name = 'delete-user'

export interface Input{
    userId: string
}

export interface Output{
    message:string
}

export const makeUC = 
({ userPersistor  }: Deps) =>
    async ({ userId }: Input): Promise<Output> => {
        userPersistor.deleteById(userId)
        return {
            message: `Removed user ${userId}`,
        }
    }