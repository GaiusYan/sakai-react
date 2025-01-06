"use client";
import { RayonService } from '@/demo/service/RayonService';
import { Rayon } from '@/types/DataConfig'
import { log } from 'node:console';
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
import { addEmitHelper } from 'typescript';

function RayonCrud() {
    const emptyRayon : Rayon = {
        id: 0,
        designation:''
    }

    const [rayons,setRayons] = useState(null);
    const [rayon,setRayon] = useState<Rayon>(emptyRayon);
    const [selectedRayons,setSelectedRayons] = useState(null);
    const [rayonDialog, setRayonDialog] = useState(false);
    const [deleteRayonDialog,setDeleteRayonDialog] = useState(false);
    const [deleteRayonsDialog,setDeleteRayonsDialog] = useState(false);
    const [submitted,setSubmitted] = useState(false);
    const [globalFilter,setGlobalFilter] = useState('');
    const [filters,setFilters] = useState<DataTableFilterMeta>({});
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
        setRayon(emptyRayon);
        setRayonDialog(true);
        setSubmitted(false);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setRayonDialog(false);
    }

    const hideDeleteRayonDialog = () => {
        setDeleteRayonDialog(false);
    }

    const hideDeleteRayonsDialog = () => {
        setDeleteRayonsDialog(false);
    }

    const saveRayon = () => {
        !rayon.designation && setSubmitted(true);
        if(rayon.id){
            rayon.designation &&
            RayonService.updateRayon(rayon).then((res) => {
                res.json().then((data)=> {
                    toast.current?.show({
                        severity: res?.status !== 200 ? 'error': 'success',
                        summary: res?.status !== 200 ? 'Erreur' : 'Succès',
                        detail: res?.status !==200 ? data?.message :  'Enregistrement effectué avec succès',
                        life: 3000
                    });
                })

                res.status === 200 && setRayonDialog(false);
                res.status === 200 && setRayon(emptyRayon);

            })
        }else{
            rayon.designation &&
            RayonService.createRayon(rayon).then((res) => {
                res.json().then((data)=> {
                    toast.current?.show({
                        severity: res?.status !== 200 ? 'error': 'success',
                        summary: res?.status !== 200 ? 'Erreur' : 'Succès',
                        detail: res?.status !==200 ? data?.message :  'Enregistrement effectué avec succès',
                        life: 3000
                    });
                })

                res.status === 200 && setRayonDialog(false);
                res.status === 200 && setRayon(emptyRayon);

            })
        }

    }

    const editRayon = (rayon: Rayon) => {
        setRayon({...rayon});
        setRayonDialog(true);
    }

    const confirmDeleteRayon = (rayon: Rayon) => {
        setRayon({...rayon});
        setDeleteRayonDialog(true);
    }

    const deleteRayon = () => {
        RayonService.deleteRayon(rayon).then((res) => {
            console.log(res);
            toast.current?.show({
                severity: res?.status === 200 ? 'success': 'error',
                summary: res?.status ===  200 ? 'Succès' : 'Erreur',
                detail: res?.status === 200 ? 'Suppression effectuée avec succès' : "Erreur survenue lors de la suppression",
                life: 3000
            });

            res.status === 200 && setDeleteRayonDialog(false);
            res.status === 200 && setRayon(emptyRayon);
        })
    }

    const exportCSV = () => {
        dataTable.current?.exportCSV();
    }

    const confirmDeleteRayonsDialog = () => {
        setDeleteRayonsDialog(true);
    }

    const deleteSelectedRayons = () => {
        let _rayons = (rayons as any)?.filter((val: any) => !(selectedRayons as any)?.includes(val));
        (selectedRayons as any).forEach((rayon: any) => {
            RayonService.deleteRayon(rayon).then((res) => {
                toast.current?.show({
                    severity: res?.status === 200 ? 'success': 'error',
                    summary: res?.status ===  200 ? 'Succès' : 'Erreur',
                    detail: res?.status === 200 ? 'Suppression effectuée avec succès' : "Erreur survenue lors de la suppression",
                    life: 3000
                })
                res?.status === 200 && setRayons(_rayons);
                res?.status === 200 && setDeleteRayonsDialog(false);
                res?.status === 200 && setSelectedRayons(null);
            })
        });
    }

    useEffect(() => {
        RayonService.getRayons().then((res) => {
            res.json().then((data) => {
                console.log(data);
                res.status === 200 && setRayons(data as any);
            })
        })
        initFilter();
    },[rayon]);


    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
            const val = (e.target && e.target.value) || '';
            setRayon({...rayon,[name]: val});
    }

     const leftToolbarTemplate = () => {
            return (
                <React.Fragment>
                    <div className='my-2'>
                        <Button label='Nouveau' icon='pi pi-plus' severity='success' className='mr-2' onClick={openNew}></Button>
                        <Button label='Supprimer' icon='pi pi-trash' severity='danger' onClick={confirmDeleteRayonsDialog} disabled={!selectedRayons || !(selectedRayons as any).length}></Button>
                    </div>
                </React.Fragment>
            )
        };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div>
                    <Button label='Exporter' icon='pi pi-upload' severity='help' onClick={exportCSV}></Button>
                </div>
            </React.Fragment>
        )
    };

    const actionBodyTemplate = (rowData: Rayon) => {
        return (
            <>
                <Button icon='pi pi-pencil' rounded severity='success' className='mr-2' onClick={() => editRayon(rowData)}></Button>
                <Button icon='pi pi-trash' rounded severity='warning' onClick={() => confirmDeleteRayon(rowData)}></Button>
            </>
        )
    }


    const header =  (
        <div className='flex flex-column md:flex-row md:justify-content-between md:align-items-center'>
            <h5 className='m-0'>Rayons</h5>
                <span className='block mt-2 md:mt-0 p-input-icon-left'>
                    <i className='pi pi-search'></i>
                    <InputText type='search' onInput={(e)=> setGlobalFilter(e.currentTarget.value)} placeholder='Rechercher...'/>
                </span>
        </div>
    );


    const rayonDialogFooter = (
        <>
            <Button label='Annuler' icon='pi pi-times' text onClick={hideDialog}></Button>
            <Button label='Enregistrer' icon='pi pi-check' text onClick={saveRayon}></Button>
        </>
    )

    const deleteRayonDialogFooter = (
        <>
            <Button label='Non' icon='pi pi-times' text onClick={hideDeleteRayonDialog}></Button>
            <Button label='Oui' icon='pi pi-check' text onClick={deleteRayon}></Button>
        </>
    );

    const deleteRayonsDialogFooter = (
        <>
            <Button label='Oui' icon='pi pi-times' text onClick={hideDeleteRayonsDialog}></Button>
            <Button label='Oui' icon='pi pi-check' text onClick={deleteSelectedRayons}></Button>
        </>
    );
  return (
    <div className='grid crud-demo'>
        <div className='col-12'>
            <div className="card">
                <Toast ref={toast}></Toast>
                <Toolbar
                    className='mb-4'
                    right={rightToolbarTemplate}
                    left={leftToolbarTemplate}
                />
                <DataTable
                    ref={dataTable}
                    value={rayons}
                    selection={selectedRayons}
                    onSelectionChange={(e) => setSelectedRayons(e.value as any)}
                    dataKey='id'
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5,10,25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} rayons"
                    globalFilter={globalFilter}
                    emptyMessage="Aucun rayon trouvé."
                    header={header}
                    filters={filters}
                    responsiveLayout='scroll'
                >
                    <Column selectionMode='multiple' headerStyle={{width: '4rem'}}></Column>
                    <Column field='designation' header='Désignation' sortable></Column>
                    <Column body={actionBodyTemplate} headerStyle={{minWidth:'10rem'}}/>
                </DataTable>

                <Dialog
                    visible={rayonDialog}
                    style={{ width: '450px'}}
                    header="Dépot détails"
                    modal
                    className='p-fluid'
                    footer={rayonDialogFooter}
                    onHide={hideDialog}
                >
                    <div className='field'>
                        <label htmlFor='designation'>Désignation</label>
                            <InputText
                                id='designation'
                                value={rayon.designation}
                                onChange={(e) => onInputChange(e,'designation')}
                                required ={true}
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !rayon.designation
                                })
                                }/>
                    {submitted && !rayon.designation && <small className='p-invalid'>Ce champs est obligatoire</small>}
                    </div>
                </Dialog>

            <Dialog
                visible={deleteRayonDialog}
                style={{ width: '450px'}}
                header='Confirmer'
                modal
                footer={deleteRayonDialogFooter}
                onHide={hideDeleteRayonDialog}
            >
                <div className='flex align-items-center justify-content-center'>
                    <i className='pi pi-exclamation-triangle mr-3' style={{width: '4rem'}}></i>
                    {rayon &&
                        <span>
                            Êtes-vous sure de vouloir supprimer <b>{rayon.designation}</b>
                        </span>
                    }
                </div>
            </Dialog>

            <Dialog
                visible={deleteRayonsDialog}
                style={{width: '450px'}}
                header='Confirmation'
                modal
                footer={deleteRayonsDialogFooter}
                onHide={hideDeleteRayonsDialog}
            >
                <div className='flex align-items-center justify-content-center'>
                    <i className='pi pi-exclamation-triangle mr-3' ></i>
                    {rayon && <span>Êtes-vous sûre de vouloir supprimer les rayons selectionnés ?</span>}
                </div>
            </Dialog>
            </div>
        </div>
    </div>
  )
}

export default RayonCrud
