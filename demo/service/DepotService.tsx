import { DataConfig, Fournisseurs } from "@/types/DataConfig";
import { Depot } from "@/types/DataConfig";

import { BASE_URL } from "@/app/(main)/utilities/icons/config";
import { log } from "console";

export const DepotService = {

    async getDepots(): Promise<Depot[]>
    {
        const res = await fetch(`${BASE_URL}/v1/depot`);
        if (!res.ok) {
            throw new Error("Erreur survenu lors de la récuperation des depot")
        }
        return res.json();
    },

    async getDepot(id: number | undefined): Promise<Depot>
    {
        const res = await fetch(`${BASE_URL}/v1/depot/${id}`);
        if (!res.ok) {
            throw new Error("Erreur survenu lors de la récuperation des depots")
        }
        return res.json();
    },

    async createDepot(depot: Depot): Promise<Response>{
        const req = fetch(`${BASE_URL}/v1/depot`,{
            method: 'post',
            headers:{
                "Content-type":'application/json'
            },
            body: JSON.stringify(depot)
        })
        const res = await req;
        return res;
    },

    async updateDepot(depot: Depot): Promise<Response>{
        const req = fetch(`${BASE_URL}/v1/depot/${depot.id}`,{
            method: 'put',
            headers:{
                "Content-type":'application/json'
            },
            body: JSON.stringify(depot)
        })
        const res = await req;
        return res;
    },

    async deleteDepot(depot: Depot): Promise<Response>{
        const req = fetch(`${BASE_URL}/v1/depot/${depot.id}`,{
            method: 'delete',
            headers:{
                "Content-type":'application/json'
            }
        })
        const res = await req;
        return res;
    }

}


