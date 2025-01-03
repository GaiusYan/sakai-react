"use client";
import { EtagereService } from '@/demo/service/EtagereService';
import { Etagere } from '@/types/DataConfig';
import { log } from 'console';
import { globalAgent } from 'http';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
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
        initFilter();
    }

    const initFilter = () => {
        setFilters({
            global:
                { value: null, matchMode: FilterMatchMode.CONTAINS },
                designation: {
                    operator: FilterOperator.AND,
                    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
                }
            })
        setGlobalFilter('')
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
            etagere.designation && EtagereService.updateEtagere(etagere).then((res) => {
                console.log(res);
                res.json().then((data) => {
                    console.log(data);

                    toast.current?.show({
                        severity: res.status === 200 ?'success': 'error',
                        summary: res.status === 200 ? "Success" : "Erreur",
                        detail: res.status === 200 ?  "Enregistrement effectué avec succès" : data?.message,
                        life: 3000
                    })
                    res?.status === 200 && setEtagereDialog(false);
                    res?.status === 200 && setEtagere(emptyEtagere);
                })
            })
        }else{
            etagere.designation && EtagereService.createEtagere(etagere).then((res) => {
                console.log(res);
                res.json().then((data) => {
                    toast.current?.show({
                        severity: res.status === 200 ?'success': 'error',
                        summary: res.status === 200 ? "Success" : "Erreur",
                        detail: res.status === 200 ?  "Enregistrement effectué avec succès" : data?.message,
                        life: 3000
                    })
                })
                res?.status === 200 && setEtagereDialog(false);
                res?.status === 200 && setEtagere(emptyEtagere);
            })
        }
    }

    const editEtagere = (etagere: Etagere) => {
        setEtagere({...etagere});
        setEtagereDialog(true);
    }

    const confirmDeleteEtagere = (etagere: Etagere) => {
        setEtagere(etagere)
        setDeleteEtagereDialog(true)
    }

    const deleteEtagere = () => {
        EtagereService.deteleEtagere(etagere).then((res) => {

            res?.status === 200 &&
            toast.current?.show({
                severity: 'success',
                summary: "Success",
                detail: "Suppression effectuée avec succès",
                life: 3000
            })
            res?.status && setDeleteEtagereDialog(false)
            res?.status && setEtagere(emptyEtagere)
        })
    }

    const exportCSV = () => {
        dataTable.current?.exportCSV();
    }

    const confirmDeleteSelected = () => {
        setDeleteEtageresDialog(true);
    }

    const deleteSelectedEtageres = () => {
        let _etageres = (etageres as any)?.filter((val: any) => !(selectedEtageres as any)?.includes(val))
        setEtageres(_etageres);
        (selectedEtageres as any).forEach((etagere: any) => {
            EtagereService.deteleEtagere(etagere).then((res) => {
                console.log(res);
                res?.status === 200 &&
                toast.current?.show({
                    severity: 'success',
                    summary:'Succès',
                    detail: 'Suppression effectuée avec succès'
                });
                res?.status === 200 && setDeleteEtageresDialog(false);
                res?.status === 200 && setSelectedEtageres(null);
            })
        });
    }

    useEffect(() => {
        EtagereService.getEtageres().then((res) => {
            res.json().then((data) => {
                console.log(data);
                res.status === 200 && setEtageres(data);
            })
        }).catch((err) => {
            console.log(err);
        })
        initFilter();
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
            <h5 className='m-0'>Etagère</h5>
            <span className='block mt-2 md:mt-0 p-input-icon-left'>
                <i className='pi pi-search'></i>
                <InputText
                    type='search'
                    onInput={
                        (e)=> setGlobalFilter(e.currentTarget.value)
                    }
                    placeholder='Rechercher...'
                />
            </span>
        </div>
    )

    const etagereDialogFooter = (
        <>
            <Button label='Annuler' icon='pi pi-times' text onClick={hideDialog}></Button>
            <Button label='Enregistrer' icon='pi pi-check' text onClick={saveEtagere}></Button>
        </>
    )

    const deleteEtagereDialogFooter = (
        <>
            <Button label='Non' icon='pi pi-times' text onClick={hideDeleteEtagereDialog}></Button>
            <Button label='Non' icon='pi pi-check' text onClick={deleteEtagere}></Button>
        </>
    );

    const deleteEtageresDialogFooter = (
        <>
        <Button label='Non' icon='pi pi-times' text onClick={hideDeleteEtageresDialog}></Button>
        <Button label='Non' icon='pi pi-check' text onClick={deleteSelectedEtageres}></Button>
        </>
    )


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

                <Dialog
                    visible={deleteEtagereDialog}
                    style={{width: '450px'}}
                    header={'Confirmer'}
                    modal
                    footer={deleteEtagereDialogFooter}
                    onHide={hideDeleteEtagereDialog}
                >
                    <div className='flex align-items-center justify-content-center'>
                    <i className='pi pi-exclamation-triangle mr-3' style={{width: '4rem'}}></i>
                        {etagere &&
                            <span>
                                Êtes-vous sure de vouloir supprimer <b>{etagere.designation}</b>
                            </span>
                        }
                    </div>

                </Dialog>

                <Dialog
                    visible={deleteEtageresDialog}
                    style={{width: '450px'}}
                    header={'Confirmer'}
                    modal
                    footer={deleteEtageresDialogFooter}
                    onHide={hideDeleteEtageresDialog}
                >
                    <div className='flex align-items-center justify-content-center'>
                    <i className='pi pi-exclamation-triangle mr-3' style={{width: '4rem'}}></i>
                        {etagere &&
                            <span>
                                Êtes-vous sure de vouloir supprimer les étagères selectionnés ?
                            </span>
                        }
                    </div>

                </Dialog>
            </div>
        </div>
    </div>
  )
}

export default EtagereCrud
