"use client";
import { TypeProduitService } from '@/demo/service/TypeProduitService';
import { TypeProduit } from '@/types/DataConfig'
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

function TypeProduitCrud() {
    let emptyTypeProduit : TypeProduit = {
        id: 0,
        designation: ''
    }
    const [typeProduit, setTypeProduit] = useState<TypeProduit>(emptyTypeProduit);
    const [typeProduits, setTypeProduits] = useState(null);
    const [selectedTypeProduits, setSelectedTypeProduits] = useState(null);
    const [typeProduitDialog,setTypeProduitDialog] = useState(false);
    const [deleteTypeProduitDialog, setDeleteTypeProduitDialog] = useState(false);
    const [deleteTypeProduitsDialog, setDeleteTypeProduitsDialog] = useState(false);
    const [submitted,setSubmitted] = useState(false);
    const [globalFilter,setGlobalFilter] = useState('');
    const [filters,setFilters] = useState<DataTableFilterMeta>({});
    const toast = useRef<Toast>(null);
    const dataTable = useRef<DataTable<any>>(null);
    const clearFilter = () => {
        clearFilter();
    }

    const openNew = () => {
        setSubmitted(false);
        setTypeProduit(emptyTypeProduit);
        setTypeProduitDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setTypeProduitDialog(false);
    }

    const hideDeleteTypeProduitDialog = () => {
        setDeleteTypeProduitDialog(false);
    }

    const hideDeleteTypeProduitsDialog = () => {
        setDeleteTypeProduitsDialog(false);
    }

    const saveTypeProduit = () => {
        !typeProduit.designation && setSubmitted(true);
        if (typeProduit.id) {

            typeProduit.designation &&
            TypeProduitService.updateTypeProduit(typeProduit).then((res) => {
                console.log(res);
                res.json().then((data) => {
                    toast.current?.show({
                        severity: res?.status === 200 ? 'success' : "error",
                        summary: res?.status === 200 ? "Succès" : "Erreur",
                        detail: res?.status === 200 ? "Enregistrement effectué avec succès" : data?.message,
                        life: 3000
                    });
                    res?.status === 200 && setTypeProduitDialog(false);
                    res?.status === 200 && setTypeProduit(emptyTypeProduit);
                })
            }).catch((err) => {
                console.log(err);
            })
        }else{
            typeProduit.designation &&
            TypeProduitService.createTypeProduit(typeProduit).then((res) => {
                console.log(res);
                res.json().then((data) => {
                    toast.current?.show({
                        severity: res?.status === 200 ? 'success' : "error",
                        summary: res?.status === 200 ? "Succès" : "Erreur",
                        detail: res?.status === 200 ? "Enregistrement effectué avec succès" : data?.message,
                        life: 3000
                    });
                });
                res?.status === 200 && setTypeProduitDialog(false);
                res?.status === 200 && setTypeProduit(emptyTypeProduit);
            }).catch((err) => {
                console.log(err);
            })
        }
    }

    const editTypeProduit = (typeProduit: TypeProduit) => {
        setTypeProduit({...typeProduit});
        setTypeProduitDialog(true);
    }

    const confirmDeleteTypeProduit = (typeProduit: TypeProduit) => {
        setTypeProduit({...typeProduit});
        setDeleteTypeProduitDialog(true);
    }

    const deleteTypeProduit = () => {
        TypeProduitService.deleteTypeProduit(typeProduit).then((res) => {
            console.log(res);
            toast.current?.show({
                severity: res?.status === 200 ? "success" : 'error',
                summary: res?.status === 200 ? "Succès" : "Erreur",
                detail: res?.status === 200 ? "Suppression effectuée avec succès" : "Erreur servenu lors de la suppression",
                life:3000
            })
            res?.status === 200 && setDeleteTypeProduitDialog(false);
            res?.status === 200 && setTypeProduit(emptyTypeProduit);
        })
    }

    const exportCSV = () => {
        dataTable.current?.exportCSV();
    }

    const confirmDeleteTypeProduits = () => {
        setDeleteTypeProduitsDialog(true);
    }

    const deleteSelectedTypeProduit = () => {
        (selectedTypeProduits as any)?.map((typeProduit: any) => {
            TypeProduitService.deleteTypeProduit(typeProduit).then((res) => {
                console.log(res);
                toast.current?.show({
                    severity: res?.status === 200 ? "success" : 'error',
                    summary: res?.status === 200 ? "Succès" : "Erreur",
                    detail: res?.status === 200 ? "Suppression effectuée avec succès" : "Erreur servenu lors de la suppression",
                    life:3000
                })
                let _typeProduits = (typeProduits as any)?.filter((val: any) => !(selectedTypeProduits as any)?.includes(val));
                res?.status === 200 && setTypeProduits(_typeProduits);
                res?.status === 200 && setSelectedTypeProduits(null);
                res?.status === 200 && setDeleteTypeProduitsDialog(false);
            })
        })
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


    useEffect(() => {
        TypeProduitService.getTypeProduits().then((res) => {
            res.json().then((data) => {
                console.log(data);
                res?.status === 200 &&
                setTypeProduits(data as any);
            });
        });
        initFilter();
    },[typeProduit]);


    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const value = (e.target && e.target.value);
        setTypeProduit({...typeProduit,[name]: value});
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label='Nouveau' icon='pi pi-plus' severity='success' className='mr-2' onClick={openNew}/>
                    <Button label='Supprimer' icon='pi pi-trash' severity='danger' className='mr-2' onClick={confirmDeleteTypeProduits}/>
                </div>
            </React.Fragment>
        )
    }

    const rightToolbarTemplate = () => {
        return(
            <React.Fragment>
                <div>
                    <Button label='Export' icon='pi pi-upload' severity='help' onClick={exportCSV}></Button>
                </div>
            </React.Fragment>
        )
    }

    const actionBodyTemplate = (dataRow: TypeProduit) => {
       return( <>
            <Button icon='pi pi-pencil' rounded severity='success' className='mr-2' onClick={() => editTypeProduit(dataRow)}/>
            <Button icon='pi pi-trash' rounded severity='warning' onClick={() =>confirmDeleteTypeProduit(dataRow)}/>
        </>)
    }

    const header = (
        <div className='flex flex-column md:flex-row md:justify-content-between md:align-center'>
            <h5 className='m-0'>Type de produits</h5>
            <span className='block mt-2 md:mt-0 p-input-icon-left'>
                <i className='pi pi-search'></i>
                <InputText type='search' onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder='Rechercher...'/>
            </span>
        </div>
    )

    const typeProduitDialogFooter = (
        <>
            <Button label='Annuler' icon='pi pi-times' text onClick={hideDialog}></Button>
            <Button label='Enregistrer' icon='pi pi-check' text onClick={saveTypeProduit}></Button>
        </>
    )

    const deleteTypeProduitDialogFooter = (
        <>
            <Button label='Non' icon='pi pi-times' text onClick={hideDeleteTypeProduitDialog}></Button>
            <Button label='Oui' icon='pi pi-check' text onClick={deleteTypeProduit}></Button>
        </>
    );

    const deleteTypeProduitsDialogFooter = (
        <>
            <Button label='Oui' icon='pi pi-times' text onClick={hideDeleteTypeProduitsDialog}></Button>
            <Button label='Oui' icon='pi pi-check' text onClick={deleteSelectedTypeProduit}></Button>
        </>
    );
  return (
    <div className='grid crud-demo'>
        <div className="col-12">
            <div className="card">
                <Toast ref={toast}/>
                <Toolbar
                    right={rightToolbarTemplate}
                    left={leftToolbarTemplate}
                    className='mb-4'
                />
                <DataTable
                    ref={dataTable}
                    value={typeProduits}
                    selection={selectedTypeProduits}
                    onSelectionChange={(e) => setSelectedTypeProduits(e.value as any)}
                    dataKey='id'
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5,10,25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} rayons"
                    globalFilter={globalFilter}
                    emptyMessage="Aucun type de produits trouvé."
                    header={header}
                    filters={filters}
                    responsiveLayout='scroll'
                >
                    <Column selectionMode='multiple' headerStyle={{width: '4rem'}}></Column>
                    <Column field='designation' header='Désignation' sortable></Column>
                    <Column body={actionBodyTemplate} headerStyle={{minWidth:'10rem'}}/>
                </DataTable>

                <Dialog
                    visible={typeProduitDialog}
                    style={{ width: '450px'}}
                    header="Type produit détails"
                    modal
                    className='p-fluid'
                    footer={typeProduitDialogFooter}
                    onHide={hideDialog}
                >
                    <div className='field'>
                        <label htmlFor='designation'>Désignation</label>
                        <InputText
                            id='designation'
                            value={typeProduit.designation}
                            onChange={(e) => onInputChange(e,'designation')}
                            required ={true}
                            autoFocus
                            className={classNames({
                                'p-invalid': submitted && !typeProduit.designation
                            })
                        }/>
                        {submitted && !typeProduit.designation && <small className='p-invalid'>Ce champs est obligatoire</small>}
                    </div>
                </Dialog>

                <Dialog
                    visible={deleteTypeProduitDialog}
                    style={{ width: '450px'}}
                    header='Confirmer'
                    modal
                    footer={deleteTypeProduitDialogFooter}
                    onHide={hideDeleteTypeProduitDialog}
                >
                    <div className='flex align-items-center justify-content-center'>
                        <i className='pi pi-exclamation-triangle mr-3' style={{width: '4rem'}}></i>
                            {typeProduit &&
                                <span>
                                    Êtes-vous sure de vouloir supprimer <b>{typeProduit.designation}</b>
                                </span>
                            }
                    </div>
                </Dialog>

                <Dialog
                    visible={deleteTypeProduitsDialog}
                    style={{width: '450px'}}
                    header='Confirmation'
                    modal
                    footer={deleteTypeProduitsDialogFooter}
                    onHide={hideDeleteTypeProduitsDialog}
                >
                    <div className='flex align-items-center justify-content-center'>
                        <i className='pi pi-exclamation-triangle mr-3' ></i>
                        {typeProduit && <span>Êtes-vous sûre de vouloir supprimer les rayons selectionnés ?</span>}
                    </div>
                </Dialog>
            </div>
        </div>
    </div>
  )
}

export default TypeProduitCrud
