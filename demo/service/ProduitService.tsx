import { BASE_URL } from "@/app/(main)/utilities/icons/config"
import { log } from "node:console";


export const ProduitService = {

    async uploadProduits(file: File): Promise<Response>{
        const formData = new FormData();
        formData.append('file',file);
        console.log(formData);
        const req = fetch(`${BASE_URL}/v1/produit/excel`,
            {
                method: 'post',
                body: formData
            }
        );
        const res = await req;
        return res;
    },

    async getProduits(): Promise<Response>{
        const req = fetch(`${BASE_URL}/v1/produit`,{
            method: 'get',
            headers: {
                "content-type": "application/json"
            }
        })
        const res = await req;
        return res;
    }
}
