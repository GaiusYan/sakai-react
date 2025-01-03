"use client";
import { EtagereService } from '@/demo/service/EtagereService';
import { Etagere } from '@/types/DataConfig';
import { log } from 'console';
import { globalAgent } from 'http';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react'
import { addEmitHelper, idText } from 'typescript';

function EtagereCrud() {

    let emptyEtagere: Etagere = {
        id: 0,
        designation: ''
    }

    const [etageres,setEtageres] = useState(null);
    const [etagereDialog, setEtagereDialog] = useState(false);
    const [deleteEtagereDialog,setDeleteEtagereDialog] = useState(false);
    const [deleteEtageresDialog,setDeleteEtageresDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const [filters,setFilters] = useState<DataTableFilterMeta>();
    const [etagere,setEtagere] = useState(emptyEtagere);
    const [selectedEtageres, setSelectedEtageres] = useState(null);
    const [loading,setLoading] = useState(false);
    const toast = useRef<Toast>(null);
    const dataTable = useRef<DataTable<any>>(null);
    const clearFilter = () => {
    }

    const openNew = () => {
        setEtagere(emptyEtagere);
        setSubmitted(false);
        setEtagereDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setEtagereDialog(false)
    }

    const hideDeleteEtagereDialog = () =>{
        setDeleteEtagereDialog(false);
    }

    const hideDeleteEtageresDialog = () => {
        setDeleteEtageresDialog(false);
    }

    const saveEtagere = () => {
        etagere.designation &&  setSubmitted(true)
        if(etagere.id){
            //TODO: Update etagère
        }else{
            etagere.designation && EtagereService.createEtagere(etagere).then((res) => {
                console.log(res);
                res?.status === 200 &&
                toast.current?.show({
                    severity: 'success',
                    summary: "Success",
                    detail: "Enregistrement effectué avec succès",
                    life: 3000
                })
                res?.status === 200 && setEtagereDialog(false);
                res?.status === 200 && setEtagere(emptyEtagere);
            })
        }
    }

    const editEtagere = (etagere: Etagere) => {
        setEtagere({...etagere})
        setEtagereDialog(true)
    }

    const confirmDeleteEtagere = (etagere: Etagere) => {
        setEtagere(etagere)
        setDeleteEtagereDialog(true)
    }

    const deleteEtagere = () => {
        toast.current?.show({
            severity: 'success',
            summary: "Success",
            detail: "Suppression effectuée avec succès",
            life: 3000
        })

        setDeleteEtagereDialog(false)
        setEtagere(emptyEtagere)
    }

    const exportCSV = () => {
        dataTable.current?.exportCSV();
    }

    const confirmDeleteSelected = () => {
        setDeleteEtageresDialog(true);
    }

    const deleteSelectedEtageres = () => {
        toast.current?.show({
            severity: 'success',
            summary:'Succès',
            detail: 'Suppression effectuée avec succès'
        })
    }

    useEffect(() => {
        EtagereService.getEtageres().then((res) => {
            res.json().then((response) => {
                console.log(response);
                res.status === 200 && setEtageres(response);
            })
        }).catch((err) => {
            console.log(err);
        })
    }, [etagere])

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> , name: string ) => {
        const value = (e.target && e.target.value || '')
        setEtagere({...etagere,[name]: value})
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label='Nouveau' icon='pi pi-plus' severity='success' className='mr-2' onClick={openNew}></Button>
                <Button label='Supprimer' icon='pi pi-trash' severity='danger' onClick={confirmDeleteSelected} disabled={!selectedEtageres || !(selectedEtageres as any).length}></Button>
            </React.Fragment>
        )
    }

    const rightToolbarTemplate = () => {
        return (
                <React.Fragment>
                    <div>
                        <Button label='Exporter' icon='pi pi-upload' severity='help' onClick={exportCSV}></Button>
                    </div>
                </React.Fragment>
        )
    };

    const actionBodyTemplate = (dataRow: Etagere) => {
        return(
            <React.Fragment>
                <Button icon='pi pi-pencil' rounded severity='success' className='mr-2' onClick={() => editEtagere(dataRow)}></Button>
                <Button icon='pi pi-trash' rounded severity='warning' onClick={() => confirmDeleteEtagere(dataRow)}></Button>
            </React.Fragment>
        )
    }

    const header = (
        <div className='flex flex-column md:flex-row md:justify-content-between md:align-items-center'>
            <h5 className='m-0'>Dépot</h5>
            <span className='block mt-2 md:mt-0 p-input-icon-left'>
                <i className='pi pi-search'></i>
                <InputText type='search' onInput={(e)=> setGlobalFilter(e.currentTarget.value)} placeholder='Rechercher...'/>
            </span>
        </div>
    )

    const etagereDialogFooter = (
        <>
            <Button label='Annuler' icon='pi pi-times' text onClick={hideDialog}></Button>
            <Button label='Enregistrer' icon='pi pi-check' text onClick={saveEtagere}></Button>
        </>
    )

    const deleteEtagereDialogFooter = () => {
        <>
            <Button label='Non' icon='pi pi-times' text onClick={hideDeleteEtagereDialog}></Button>
            <Button label='Non' icon='pi pi-check' text onClick={deleteEtagere}></Button>
        </>
    }

    const deleteEtageresDialogFooter = () => {
        <>
        <Button label='Non' icon='pi pi-times' text onClick={hideDeleteEtageresDialog}></Button>
        <Button label='Non' icon='pi pi-check' text onClick={deleteSelectedEtageres}></Button>
        </>
    }
  return (
    <div className='grid crud-demo'>
        <div className="col-12">
            <div className="card">
                <Toast ref={toast}></Toast>
                <Toolbar
                    className='mb-4'
                    left={leftToolbarTemplate}
                    right={rightToolbarTemplate}
                ></Toolbar>
                <DataTable
                    ref={dataTable}
                    value={etageres}
                    selection={selectedEtageres}
                    onSelectionChange={(e) => setSelectedEtageres(e.value as any)}
                    dataKey='id'
                    paginator
                    rows={10}
                    loading={loading}
                    rowsPerPageOptions={[5,10,25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Nombres {first} sur {last} de {totalRecords} étagère(s)"
                    globalFilter={globalFilter}
                    emptyMessage={"Aucun étagère"}
                    header={header}
                    filters={filters}
                    responsiveLayout='scroll'
                >
                <Column selectionMode='multiple' headerStyle={{width: '4rem'}}></Column>
                <Column field='designation' header='Désignation' sortable></Column>
                <Column body={actionBodyTemplate} headerStyle={{minWidth:'10rem'}}/>
                </DataTable>

                <Dialog
                    visible={etagereDialog}
                    style={{ width: '450px'}}
                    header='Dépot détails'
                    modal
                    className='p-fluid'
                    footer={etagereDialogFooter}
                    onHide={hideDialog}
                >
                    <div className='field'>
                        <label htmlFor="designation">Désignation</label>
                        <InputText
                            id='designation'
                            value={etagere.designation}
                            onChange = {(e) => onInputChange(e, 'designation')}
                            required
                            autoFocus
                            className={classNames({
                                'p-invalid': submitted && !etagere.designation
                            })}
                        />
                        {submitted && !etagere.designation && <small className='p-invalid'>Ce champs est obligatoire</small>}
                    </div>
                </Dialog>
            </div>
        </div>
    </div>
  )
}

export default EtagereCrud
