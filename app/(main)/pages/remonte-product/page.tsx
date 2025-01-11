"use client"
import { FileUpload, FileUploadHandlerEvent, FileUploadUploadEvent } from 'primereact/fileupload';
import { Toast } from 'primereact/toast'
import React, { useRef, useState } from 'react'
import { BASE_URL } from '../../utilities/icons/config';
import { ProductService } from '@/demo/service/ProductService';
import { ProduitService } from '@/demo/service/ProduitService';
import { fileURLToPath } from 'url';

function Page() {
    const toast = useRef<Toast>(null);
    const [totalSize,setTotalSize] = useState(0);

    const onUpload = (event: FileUploadHandlerEvent) => {
        console.log(event.files);
        const _file: File = event.files[0];
        _file && ProduitService.uploadProduits(_file).then((res) => {
            console.log(res);
            res.json().then((data) => {
                console.log(data);
                toast.current?.show({
                    severity: res?.status === 200 ? "success" : "error",
                    summary: res?.status === 200 ? "Succès": "Erreur",
                    detail:res?.status === 200 ? "Remontage effectué avec succès": data?.message,
                    life: 3000
                })
            }).catch((error) => {
                console.log(error);
            })

        }).catch((err) => {
            console.log(err);
        })
    }
  return (
    <div className='grid'>
        <Toast ref={toast}/>
        <div className='col-12'>
            <div className="card">
                <h5>Selectionner un fichier excel</h5>
                <FileUpload
                    name='file'
                    uploadHandler={onUpload}
                    accept='.xlsx'
                    customUpload={true}
                    multiple={true}
                    chooseLabel='Choisir'
                    uploadLabel='Remonter'
                    cancelLabel='Annuler'
                />
            </div>
        </div>
    </div>
  )
}

export default Page
