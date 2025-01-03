import React, { useRef } from 'react'
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { DataConfig } from '@/types/DataConfig';
import { FournisseurService } from '@/demo/service/FournisseurService';
import { Toast } from 'primereact/toast';
import { log } from 'console';


type FournisseurDeleteComponentProps = {
    children: string,
    displayConfirmation: () => void,
    fournisseur: DataConfig.Fournisseur
}
const SuppressionFournisseur = ({children, displayConfirmation,fournisseur}: FournisseurDeleteComponentProps) => {

    const toast = useRef<Toast>(null);
    const confirmationDialogFooter = (
        <>
            <Toast ref={toast} />
            <Button type="button" label="Non" icon="pi pi-times" onClick={displayConfirmation} text/>
            <Button type="button" label="Oui" icon="pi pi-check" onClick={() => deleteFournisseur(fournisseur)} text autoFocus />
        </>
    );

const deleteFournisseur = (data :DataConfig.Fournisseur) => {
    FournisseurService.deleteFournisseur(data)
        .then((res) => {
            console.log(res);
            toast.current?.show({
                severity:  "success",
                summary:  res?.message,
                detail:  res?.description,
                life:3000
            })

            displayConfirmation()
        }).catch((err) => {
            console.log(err);
        })
}
  return (
    <Dialog header="Confirmation" visible={true} onHide={displayConfirmation} style={{ width: '350px' }} modal footer={confirmationDialogFooter}>
        <div className="flex align-items-center justify-content-center">
            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                {children}
        </div>
    </Dialog>
  )
}

export default SuppressionFournisseur
