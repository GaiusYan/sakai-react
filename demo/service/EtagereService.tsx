import { DataConfig, Etagere, Fournisseurs } from "@/types/DataConfig";
import { Depot } from "@/types/DataConfig";

import { BASE_URL } from "@/app/(main)/utilities/icons/config";
import { log } from "console";

export const DepotService = {

    async getEtageres(): Promise<Etagere[]>
    {
        const res = await fetch(`${BASE_URL}/v1/etagere`);
        if (!res.ok) {
            throw new Error("Erreur survenu lors de la récuperation des etagères")
        }
        return res.json();
    },

    async getEtagere(id: number | undefined): Promise<Etagere>
    {
        const res = await fetch(`${BASE_URL}/v1/etagere/${id}`);
        if (!res.ok) {
            throw new Error("Erreur survenu lors de la récuperation des etagères ")
        }
        return res.json();
    },

    async createEtagere(etagere: Etagere): Promise<Response>{
        const req = fetch(`${BASE_URL}/v1/etagere`,{
            method: 'post',
            headers:{
                "Content-type":'application/json'
            },
            body: JSON.stringify(etagere)
        })
        const res = await req;
        return res;
    },

    async updateEtagere(etagere: Etagere): Promise<Response>{
        const req = fetch(`${BASE_URL}/v1/etagere/${etagere.id}`,{
            method: 'put',
            headers:{
                "Content-type":'application/json'
            },
            body: JSON.stringify(etagere)
        })
        const res = await req;
        return res;
    },

    async deleteDepot(etagere: Etagere): Promise<Response>{
        const req = fetch(`${BASE_URL}/v1/etagere/${etagere.id}`,{
            method: 'delete',
            headers:{
                "Content-type":'application/json'
            }
        })
        const res = await req;
        return res;
    }

}


