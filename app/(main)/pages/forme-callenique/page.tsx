"use client";

import { FormeCalleniqueService } from '@/demo/service/FormeCalleniqueService';
import { Depot, FormeCallenique } from '@/types/DataConfig';
import { log } from 'console';
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

function FormeCalleniqueCrud() {
    let emptyFormeCallenique: FormeCallenique = {
        id: 0,
        designation: ''
    }
    const [formeCallenique,setFormeCallenique]= useState<FormeCallenique>(emptyFormeCallenique);
    const [formeCalleniques,setFormeCalleniques] = useState(false);
    const [formeCalleniqueDialog,setFormeCalleniqueDialog] = useState(false);
    const [deleteFormeCalleniqueDialog, setDeleteFormeCalleniqueDialog] = useState(false);
    const [deleteFormeCalleniquesDialog, setDeleteFormeCalleniquesDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const [filters,setFilters] = useState<DataTableFilterMeta>({});
    const [selectedFormeCalleniques,setSelectedFormeCalleniques] = useState(null);
    const [loading,setLoading] = useState(false);
    const dataTable = useRef<DataTable<any>>(null);
    const toast = useRef<Toast>(null);
    const clearFilter = () => {
        initFilter();
    }

    const initFilter = () => {
            setFilters({
                global:
                    { value: null, matchMode: FilterMatchMode.CONTAINS },
                    'designation': {
                        operator: FilterOperator.AND,
                        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
                    }
            })
            setGlobalFilter('')
        }
    const openNew = () => {
        setFormeCalleniqueDialog(true);
        setSubmitted(false)
        setFormeCallenique(emptyFormeCallenique);
    }

    const hideDialog = () => {
        setSubmitted(false)
        setFormeCalleniqueDialog(false)
    }

    const hideDeleteFormeCalleniqueDialog = () => {
        setDeleteFormeCalleniqueDialog(false)
    }

    const hideDeleteFormeCalleniquesDialog = () => {
        setDeleteFormeCalleniquesDialog(false)
    }

    const saveFormeCallenique = () => {
        formeCallenique.designation && setSubmitted(true);
        if(formeCallenique.id){
            formeCallenique.designation &&  FormeCalleniqueService.updateFormeCallenique(formeCallenique).then((res) => {
                console.log(res);
                res.json().then((data) => {
                    res.status === 200 && setFormeCallenique(data);
                    toast.current?.show({
                        severity: res.status === 200 ? 'success' : 'error',
                        summary: res.status === 200 ? 'Succès' : 'Erreur',
                        detail:  res.status === 200 ?'Suppression effectuée avec succès': data?.message,
                        life: 3000
                    });
                })
                res?.status === 200 && setFormeCalleniqueDialog(false)
                res?.status === 200 && setFormeCallenique(emptyFormeCallenique);
            }).catch((err) => {
                console.log(err);
            })
        }else{
            formeCallenique.designation &&  FormeCalleniqueService.createFormeCallenique(formeCallenique).then((res) => {
                console.log(res);
                res.json().then((data) => {
                    res.status === 200 && setFormeCallenique(data);
                    toast.current?.show({
                        severity: res.status === 200 ? 'success' : 'error',
                        summary: res.status === 200 ? 'Succès' : 'Erreur',
                        detail:  res.status === 200 ?'Suppression effectuée avec succès': data?.message,
                        life: 3000
                    });
                })
                res?.status === 200 && setFormeCalleniqueDialog(false)
                res?.status === 200 && setFormeCallenique(emptyFormeCallenique);
            }).catch((err) => {
                console.log(err);
            })

        }
    }

    const editFormeCallenique = (formeCallenique: FormeCallenique) => {
        setFormeCallenique({...formeCallenique});
        setFormeCalleniqueDialog(true);
    }

    const confirmDeleteFormeCallenique = (formeCallenique: FormeCallenique) =>{
        setFormeCallenique(formeCallenique);
        setDeleteFormeCalleniqueDialog(true);
    }

    const deleteFormeCallenique = () => {
        FormeCalleniqueService.deleteFormeCallenique(formeCallenique).then((res) => {
            console.log(res);
            res?.status === 200 &&
            toast.current?.show({
                severity:  'success',
                summary: 'Succès',
                detail:  'Suppression effectuée avec succès',
                life: 3000
            });
            res?.status === 200 && setFormeCallenique(emptyFormeCallenique);
            res?.status === 200 && setDeleteFormeCalleniqueDialog(false);
        })
    }

    const exportCSV = () => {
        dataTable.current?.exportCSV();
    }

    const confirmDeleteSelectedFormeCallenique = () => {
        setDeleteFormeCalleniquesDialog(true)
    }

    const deleteSelectedFormeCallenique = () => {
        (selectedFormeCalleniques as any).forEach((formeCallenique: any) => {
            FormeCalleniqueService.deleteFormeCallenique(formeCallenique).then((res) => {
                console.log(res);
                res?.status === 200 &&
                toast.current?.show({
                    severity:  'success',
                    summary: 'Succès',
                    detail:  'Suppression effectuée avec succès',
                    life: 3000
                });
                res?.status === 200 && setFormeCallenique(emptyFormeCallenique);
                res?.status === 200 && setDeleteFormeCalleniquesDialog(false);
            })
        });

    }

    useEffect(() => {
        FormeCalleniqueService.getFormeCalleniques().then((res) => {
            res.status === 200 &&
            res.json().then((data) => {
                console.log(data);
                setFormeCalleniques(data);
            })
        }).catch((err) => {
            console.log(err);
        })
        initFilter();
    },[formeCallenique])

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        setFormeCallenique({...formeCallenique,[name]: val});
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className='my-2'>
                    <Button label='Nouveau' icon='pi pi-plus' severity='success' className='mr-2' onClick={openNew}></Button>
                    <Button label='Supprimer' icon='pi pi-trash' severity='danger' onClick={confirmDeleteSelectedFormeCallenique} disabled={!selectedFormeCalleniques || !(selectedFormeCalleniques as any).length}></Button>
                </div>
            </React.Fragment>
        );
    };

     const rightToolbarTemplate = () => {
            return (
            <React.Fragment>
                <div>
                    <Button label='Exporter' icon='pi pi-upload' severity='help' onClick={exportCSV}></Button>
                </div>
            </React.Fragment>
    )};

    const actionBodyTemplate = (rowData: Depot) => {
        return (
            <>
                <Button className='mr-2' icon='pi pi-pencil' rounded severity='success' onClick={() => editFormeCallenique(rowData)}></Button>
                <Button className='mr-2' icon='pi pi-trash' rounded severity='warning' onClick={() => confirmDeleteFormeCallenique(rowData)}></Button>
            </>
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
    );

    const formeCalleniqueDialogFooter = (
        <>
            <Button label='Annuler' icon='pi pi-times' text onClick={hideDialog}></Button>
            <Button label='Enregistrer' icon='pi pi-check' text onClick={saveFormeCallenique}></Button>
        </>
    )

    const deleteFormeCalleniqueDialogFooter = (
        <>
            <Button label='Non' icon='pi pi-times' text onClick={hideDeleteFormeCalleniqueDialog}></Button>
            <Button label='Oui' icon='pi pi-check' text onClick={deleteFormeCallenique}></Button>
        </>
    )

    const deleteFormeCalleniquesDialogFooter = (
        <>
            <Button label='Non' icon='pi pi-times' text onClick={hideDeleteFormeCalleniquesDialog}></Button>
            <Button label='Oui' icon='pi pi-check' text onClick={deleteSelectedFormeCallenique}></Button>
        </>
    )


  return (
    <div className='grid crud-demo'>
        <div className="col-12">
            <div className="card">
                <Toast ref={toast}></Toast>
                <Toolbar className='mb-4'
                    left={leftToolbarTemplate}
                    right={rightToolbarTemplate}
                ></Toolbar>
                <DataTable
                    ref={dataTable}
                    value={formeCalleniques}
                    selection={selectedFormeCalleniques}
                    onSelectionChange={(e) => setSelectedFormeCalleniques(e.value as any)}
                    dataKey='id'
                    paginator
                    rows={10}
                    loading={loading}
                    rowsPerPageOptions={[5,10,25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} forme(s) callenique(s)"
                    globalFilter={globalFilter}
                    emptyMessage="Aucune forme callenique trouvée."
                    header={header}
                    filters={filters}
                    responsiveLayout='scroll'
                >
                    <Column selectionMode='multiple' headerStyle={{width: '4rem'}}></Column>
                    <Column field='designation' header='Désignation' sortable></Column>
                    <Column body={actionBodyTemplate} headerStyle={{minWidth:'10rem'}}/>
                </DataTable>

                <Dialog
                    visible={formeCalleniqueDialog}
                    style={{ width: '450px'}}
                    header='Forme callenique détails'
                    modal
                    className='p-fluid'
                    footer={formeCalleniqueDialogFooter}
                    onHide={hideDialog}
                >
                    <div className='field'>
                        <label htmlFor="designation">Désignation</label>
                            <InputText
                                id='designation'
                                value={formeCallenique.designation}
                                onChange = {(e) => onInputChange(e, 'designation')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !formeCallenique.designation
                                })}
                            />
                            {submitted
                            && !formeCallenique.designation
                            && <small className='p-invalid'>Ce champs est obligatoire</small>}
                    </div>
                </Dialog>

                <Dialog
                    visible={deleteFormeCalleniqueDialog}
                    style={{ width: '450px'}}
                    header='Confirmer'
                    modal
                    footer={deleteFormeCalleniqueDialogFooter}
                    onHide={hideDeleteFormeCalleniqueDialog}
                >
                    <div className='flex align-items-center justify-content-center'>
                        <i className='pi pi-exclamation-triangle mr-3' style={{width: '4rem'}}></i>
                        {formeCallenique &&
                            <span>
                                Êtes-vous sure de vouloir supprimer <b>{formeCallenique.designation}</b>
                            </span>}
                    </div>
                </Dialog>

                <Dialog
                    visible={deleteFormeCalleniquesDialog}
                    style={{width: '450px'}}
                    header='Confirmation'
                    modal
                    footer={deleteFormeCalleniquesDialogFooter}
                    onHide={hideDeleteFormeCalleniquesDialog}
                >
                    <div className='flex align-items-center justify-content-center'>
                        <i className='pi pi-exclamation-triangle mr-3' ></i>
                            {formeCallenique && <span>Êtes-vous sûre de vouloir supprimer les formes calleniques selectionnées ?</span>}
                    </div>
                </Dialog>
            </div>
        </div>
    </div>
  )
}

export default FormeCalleniqueCrud
