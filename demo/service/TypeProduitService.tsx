import {Rayon, TypeProduit} from "@/types/DataConfig";
import { Depot } from "@/types/DataConfig";

import { BASE_URL } from "@/app/(main)/utilities/icons/config";
import { log } from "console";

export const TypeProduitService = {

    async getTypeProduits(): Promise<Response>
    {
        const res = await fetch(`${BASE_URL}/v1/typeproduit`);
        if (!res.ok) {
            throw new Error("Erreur survenu lors de la récuperation des types de produits")
        }
        return res;
    },

    async getTypeProduit(id: number | undefined): Promise<Response>
    {
        const res = await fetch(`${BASE_URL}/v1/typeproduit/${id}`);
        if (!res.ok) {
            throw new Error("Erreur survenu lors de la récuperation des types de produits")
        }
        return res.json();
    },

    async createTypeProduit(typeProduit: TypeProduit): Promise<Response>{
        const req = fetch(`${BASE_URL}/v1/typeproduit`,{
            method: 'post',
            headers:{
                "Content-type":'application/json'
            },
            body: JSON.stringify(typeProduit)
        })
        const res = await req;
        return res;
    },

    async updateTypeProduit(typeProduit: TypeProduit): Promise<Response>{
        const req = fetch(`${BASE_URL}/v1/typeproduit/${typeProduit.id}`,{
            method: 'put',
            headers:{
                "Content-type":'application/json'
            },
            body: JSON.stringify(typeProduit)
        })
        const res = await req;
        return res;
    },

    async deleteTypeProduit(typeProduit: TypeProduit): Promise<Response>{
        const req = fetch(`${BASE_URL}/v1/typeproduit/${typeProduit.id}`,{
            method: 'delete',
            headers:{
                "Content-type":'application/json'
            }
        })
        const res = await req;
        return res;
    }
}


