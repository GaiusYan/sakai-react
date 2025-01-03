import { DataConfig, Fournisseurs } from "@/types/DataConfig";

import { BASE_URL } from "@/app/(main)/utilities/icons/config";
import { log } from "console";

export const FournisseurService = {

    async getFournisseurs(): Promise<DataConfig.Fournisseur[]>
    {
        const res = await fetch(`${BASE_URL}/v1/fournisseur`);
        if (!res.ok) {
            throw new Error("Erreur survenu lors de la récuperation des fournisseurs")
        }
        return res.json();
    },

    async getFournisseur(id: number | undefined): Promise<DataConfig.Fournisseur>
    {
        const res = await fetch(`${BASE_URL}/v1/fournisseur/${id}`);
        if (!res.ok) {
            throw new Error("Erreur survenu lors de la récuperation des fournisseurs")
        }
        return res.json();
    },

    async createFournisseur(fournisseur: DataConfig.Fournisseur): Promise<DataConfig.Fournisseur | any>{
        const req = fetch(`${BASE_URL}/v1/fournisseur`,{
            method: 'post',
            headers:{
                "Content-type":'application/json'
            },
            body: JSON.stringify(fournisseur)
        })
        const res = await req;
        return res.json();
    },

    async updateFournisseur(fournisseur: DataConfig.Fournisseur): Promise<DataConfig.Fournisseur | any>{
        const req = fetch(`${BASE_URL}/v1/fournisseur/${fournisseur.id}`,{
            method: 'put',
            headers:{
                "Content-type":'application/json'
            },
            body: JSON.stringify(fournisseur)
        })
        const res = await req;
        return res.json();
    },

    async deleteFournisseur(fournisseur: DataConfig.Fournisseur): Promise<DataConfig.Fournisseur | any>{
        const req = fetch(`${BASE_URL}/v1/fournisseur/${fournisseur.id}`,{
            method: 'delete',
            headers:{
                "Content-type":'application/json'
            }
        })
        const res = await req;
        return res.json();
    }

}


