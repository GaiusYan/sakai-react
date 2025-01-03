import { DataConfig, Etagere, FormeCallenique, Fournisseurs } from "@/types/DataConfig";
import { Depot } from "@/types/DataConfig";

import { BASE_URL } from "@/app/(main)/utilities/icons/config";
import { log } from "console";

export const FormeCalleniqueService = {

    async getFormeCalleniques(): Promise<Response>
    {
        const res = await fetch(`${BASE_URL}/v1/formeCallenique`);
        if (!res.ok) {
            throw new Error("Erreur survenu lors de la récuperation des formes calleniques")
        }
        return res;
    },

    async getFormeCallenique(id: number | undefined): Promise<Response>
    {
        const res = await fetch(`${BASE_URL}/v1/formeCallenique/${id}`);
        if (!res.ok) {
            throw new Error("Erreur survenu lors de la récuperation des formes calleniques")
        }
        return res.json();
    },

    async createEtagere(formeCallenique: FormeCallenique): Promise<Response>{
        const req = fetch(`${BASE_URL}/v1/formeCallenique`,{
            method: 'post',
            headers:{
                "Content-type":'application/json'
            },
            body: JSON.stringify(formeCallenique)
        })
        const res = await req;
        return res;
    },

    async updateEtagere(formeCallenique: FormeCallenique): Promise<Response>{
        const req = fetch(`${BASE_URL}/v1/formeCallenique/${formeCallenique.id}`,{
            method: 'put',
            headers:{
                "Content-type":'application/json'
            },
            body: JSON.stringify(formeCallenique)
        })
        const res = await req;
        return res;
    },

    async deteleEtagere(formeCallenique: FormeCallenique): Promise<Response>{
        const req = fetch(`${BASE_URL}/v1/formeCallenique/${formeCallenique.id}`,{
            method: 'delete',
            headers:{
                "Content-type":'application/json'
            }
        })
        const res = await req;
        return res;
    }

}


