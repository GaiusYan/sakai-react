import {Rayon} from "@/types/DataConfig";
import { Depot } from "@/types/DataConfig";

import { BASE_URL } from "@/app/(main)/utilities/icons/config";
import { log } from "console";

export const RayonService = {

    async getRayons(): Promise<Response>
    {
        const res = await fetch(`${BASE_URL}/v1/rayon`);
        if (!res.ok) {
            throw new Error("Erreur survenu lors de la récuperation des rayons")
        }
        return res;
    },

    async getRayon(id: number | undefined): Promise<Response>
    {
        const res = await fetch(`${BASE_URL}/v1/Rayon/${id}`);
        if (!res.ok) {
            throw new Error("Erreur survenu lors de la récuperation des rayons")
        }
        return res.json();
    },

    async createRayon(Rayon: Rayon): Promise<Response>{
        const req = fetch(`${BASE_URL}/v1/Rayon`,{
            method: 'post',
            headers:{
                "Content-type":'application/json'
            },
            body: JSON.stringify(Rayon)
        })
        const res = await req;
        return res;
    },

    async updateRayon(rayon: Rayon): Promise<Response>{
        const req = fetch(`${BASE_URL}/v1/Rayon/${rayon.id}`,{
            method: 'put',
            headers:{
                "Content-type":'application/json'
            },
            body: JSON.stringify(rayon)
        })
        const res = await req;
        return res;
    },

    async deleteRayon(rayon: Rayon): Promise<Response>{
        const req = fetch(`${BASE_URL}/v1/Rayon/${rayon.id}`,{
            method: 'delete',
            headers:{
                "Content-type":'application/json'
            }
        })
        const res = await req;
        return res;
    }

}


