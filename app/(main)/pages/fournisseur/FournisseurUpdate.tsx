"use client";
import { FournisseurService } from '@/demo/service/FournisseurService';
import { DataConfig } from '@/types/DataConfig';
import { error, log } from 'console';
import { MessageSeverity } from 'primereact/api';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react'

type FournisseurUpdateComponentProps = {
    fournisseur: DataConfig.Fournisseur,
    setFournisseur: React.Dispatch<React.SetStateAction<DataConfig.Fournisseur>>,
    onClose: (state: boolean) => void
}


const OverlayUpdateFournisseur = ({fournisseur,setFournisseur,onClose}: FournisseurUpdateComponentProps) => {

    const [displayBasic, setDisplayBasic] = useState(false);
    const toast = useRef<Toast>(null);

    const basicDialogFooter = () => {
        return(
            <div className='flex flex-wrap gap-2'>
                <Toast ref={toast} />
                <Button type='button' label='Annuler' icon='pi pi-times' severity='danger' outlined onClick={() => onClose(false)}/>
                <Button type='button' label='enregistrer' onClick={updateFournisseur}/>
            </div>
        )
    }

    const [updatedData, setUpdatedData] =useState<DataConfig.Fournisseur>({
        id: fournisseur?.id || 0,
            nom: fournisseur?.nom || '',
            prenom: fournisseur?.prenom || '',
            telephone: fournisseur?.telephone || '',
            tauxVente: fournisseur?.tauxVente || 0
        });

    const showError = ({severity,summary,detail}: {severity: MessageSeverity,summary: string, detail: string}) => {
        toast.current?.show({
            severity: severity,
            summary: summary,
            detail: detail,
            life: 3000
        });
    };



    const updateFournisseur = (event: any) =>{
        console.log(updatedData);
        FournisseurService.updateFournisseur(updatedData)
        .then((res) => {
            console.log(res);
            toast.current?.show({
                severity: "success",
                summary: "Succès",
                detail:"Enregistrement effectué avec succès",
                life:3000
            })

            res.status != 200 && toast.current?.show({
                severity: "error",
                summary: "Attention",
                detail:res.message,
                life:3000
            })
            onClose(false)

        })
        .catch((err) =>{
            console.log(err);
        })
        resetFournisseur(event)
    }


    const resetFournisseur = (e: any) => {
        e.preventDefault();

        setDisplayBasic(false)
    }

    const handleChangeFournisseur = (e: any) => {
        let value = e.target.value;
        setUpdatedData(
            {...updatedData,
            [e.target.name]: value
        })
    }
  return (
    <div>

        <Dialog header="Ajouter un fournisseur" visible={true} style={{ width: '40vw' }} modal footer={basicDialogFooter} onHide={() => onClose(false)}>
            <form className='p-fluid' >
                <div className="field grid">
                    <label htmlFor="nom" className="col-12 mb-2 md:col-2 md:mb-0">
                            Nom
                    </label>
                    <div className="col-12 md:col-10">
                        <InputText
                            id="nom"
                            type="text"
                            name='nom'
                            defaultValue={fournisseur.nom}
                            required
                            onChange={(e) => {
                                handleChangeFournisseur(e)
                            }}
                            />
                    </div>
                </div>
                <div className="field grid">
                    <label htmlFor="prenom" className="col-12 mb-2 md:col-2 md:mb-0">
                            Prénom
                    </label>
                    <div className="col-12 md:col-10">
                        <InputText id="prenom" type="text"
                            name='prenom'
                            defaultValue={fournisseur.prenom}
                            onChange={(e) => handleChangeFournisseur(e)}/>
                    </div>
                </div>
                <div className="field grid">
                    <label htmlFor="telephone" className="col-12 mb-2 md:col-2 md:mb-0">
                            Téléphone
                    </label>
                    <div className="col-12 md:col-10">
                        <InputText id="telephone" type="text"
                            name='telephone'
                            defaultValue={fournisseur.telephone}
                            onChange={(e) => handleChangeFournisseur(e)}/>
                    </div>
                </div>
                <div className="field grid">
                    <label htmlFor="tauxVente" className="col-12 mb-2 md:col-2 md:mb-0">
                            Taux(%)
                    </label>
                    <div className="col-9 md:col-3">
                        <InputNumber id="tauxVente" tooltip='le taux de vente' min={0.0} max={100}
                            name='tauxVente'
                            defaultValue={fournisseur.tauxVente}
                            required
                            onChange={(e) => handleChangeFournisseur(e)}/>
                    </div>
                </div>
            </form>
        </Dialog>
    </div>
  )
}

export default OverlayUpdateFournisseur
