import { Deps } from "../../entitygateway";
import { v4 as UUID } from "uuid";
import { User } from "../../entities/User";

export const name = 'add-user';


export type Output = {
    message: string;
    id: string;
};

export interface Input {
    name: string;
    address: string;
    contact: number;
}

export const makeUC = 
    ({ userPersistor, userLoader }: Deps) =>
    async ({
        name,
        address,
        contact,
    }: Input): Promise<Output> => {
        const user = await userLoader.loadByName(name);
        

        if (user) {
            throw new Error('Name already exists');
        }

        const userToPersist: User = {
            id: UUID(),
            name,
            address,
            contact,
        };
        

        await userPersistor.persist(userToPersist);

        return {
            message: `User ${userToPersist.name} created`,
            id: userToPersist.id,
        };
    };