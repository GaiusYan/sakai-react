"use client";
import { FournisseurService } from '@/demo/service/FournisseurService';
import { DataConfig, onAddFournisseur } from '@/types/DataConfig';
import { error, log } from 'console';
import { MessageSeverity } from 'primereact/api';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react'


type FournisseurCreateComponentProps = {
    onCreateFournisseur: (data: DataConfig.Fournisseur) => void
    onClickCreateFournisseur: any
    setFournisseur: React.Dispatch<React.SetStateAction<DataConfig.Fournisseur>>
    fournisseur: DataConfig.Fournisseur,
    displayBasic: boolean,
    setDisplayBasic: React.Dispatch<React.SetStateAction<boolean>>
}


const OverlayAddFournisseur = ({
    onCreateFournisseur,
    onClickCreateFournisseur,
    setFournisseur,
    fournisseur,
    displayBasic,
    setDisplayBasic
}: FournisseurCreateComponentProps) => {


    // const [fournisseur, setFournisseur] = useState<DataConfig.Fournisseur>({
    //     nom: '',
    //     prenom:'',
    //     telephone:'',
    //     tauxVente:0
    // });
    const toast = useRef<Toast>(null);
    const basicDialogFooter = () => {
        return(
            <div className='flex flex-wrap gap-2'>
                <Toast ref={toast} />
                <Button type='button' label='Annuler' icon='pi pi-times' severity='danger' outlined onClick={(e) => resetFournisseur(e)}/>
                <Button type='button' label='enregistrer' onClick={createFournisseur}/>
            </div>
        )
    }

    const showError = ({severity,summary,detail}: {severity: MessageSeverity,summary: string, detail: string}) => {
        toast.current?.show({
            severity: severity,
            summary: summary,
            detail: detail,
            life: 3000
        });
    };

    const createFournisseur = (e: any) =>{
        console.log(fournisseur);

        if(fournisseur.nom === null || fournisseur.nom === '') fournisseur.nom;
        FournisseurService.createFournisseur(fournisseur)
        .then((res) => {
            console.log(res);
            toast.current?.show({severity: "success",summary: "Succès",detail:"Enregistrement effectué avec succès",life:3000})
        })
        .catch((err) =>{
            console.log(err.message);
        } )
        resetFournisseur(e)
    }


    const resetFournisseur = (e: any) => {
        e.preventDefault();
        setFournisseur({
            nom: '',
            prenom:'',
            telephone:'',
            tauxVente:0
        })
        setDisplayBasic(false)
    }

    const handleChangeFournisseur = ( e: any) => {
        let value = e.target.value;

        setFournisseur(
            {...fournisseur,
            [e.target.name]: value
        })
        // onCreateFournisseur(fournisseur)
    }
  return (
    <div>
        <Button type='button' icon="pi pi-plus" label='Ajouter' onClick={() => setDisplayBasic(true)}/>
        <Dialog header="Ajouter un fournisseur" visible={displayBasic} style={{ width: '40vw' }} modal footer={basicDialogFooter} onHide={() => setDisplayBasic(false)}>
            <form className='p-fluid' >
                <div className="field grid">
                    <label htmlFor="nom" className="col-12 mb-2 md:col-2 md:mb-0">
                            Nom
                    </label>
                    <div className="col-12 md:col-10">
                        <InputText id="nom" type="text"
                            name='nom'
                            value={fournisseur.nom}
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
                            value={fournisseur.prenom}
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
                            value={fournisseur.telephone}
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
                            value={fournisseur.tauxVente}
                            required
                            onValueChange={(e) => handleChangeFournisseur(e)}/>
                    </div>
                </div>
            </form>
        </Dialog>
    </div>
  )
}

export default OverlayAddFournisseur
