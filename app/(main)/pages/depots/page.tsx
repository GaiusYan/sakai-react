"use client"
import { DepotService } from '@/demo/service/DepotService';
import { Depot } from '@/types/DataConfig'
import { log } from 'node:console';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputNumberChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react'
import { addEmitHelper } from 'typescript';

function DepotCrud() {

    let emptyDepot: Depot = {
        id: 0,
        nom: '',
        adresse: ''
    }



    const [depots,setDepots] = useState(null);
    const [depotDialog, setDepotDialog] = useState(false);
    const [deleteDepotDialog, setDeleteDepotDialog] = useState(false)
    const [deleteDepotsDialog, setDeleteDepotsDialog] = useState(false)
    const [submitted,setSubmitted] = useState(false);
    const [globalFilter,setGlobalFilter] = useState('');
    const [filters,setFilters] = useState<DataTableFilterMeta>({});
    const [depot,setDepot] = useState<Depot>(emptyDepot);
    const [selectedDepots,setSelectedDepots] = useState(null);
    const [loading, setLoading] = useState(false);
    const toast = useRef<Toast>(null);
    const dataTable = useRef<DataTable<any>>(null);
    const clearFilter = () => {
        initFilter();
    }


    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        const value = e.target.value;
        let _filters = {...filters};
        (_filters['global'] as any).value = value;
    }

    const initFilter = () => {
        setFilters({
            global:
                { value: null, matchMode: FilterMatchMode.CONTAINS },
                'nom': {
                    operator: FilterOperator.AND,
                    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
                },
                'adresse': {
                    operator: FilterOperator.AND,
                    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
                }
        })
        setGlobalFilter('')
    }

    const openNew = () => {
        setDepot(emptyDepot);
        setSubmitted(false);
        setDepotDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setDepotDialog(false);
    }

    const hideDeleteDepotDialog = () => {
        setDeleteDepotDialog(false)
    }

    const hideDeleteDepotsDialog = () => {
        setDeleteDepotsDialog(false)
    }

    const saveDepot = () => {
        !depot.nom && setSubmitted(true)
        const _depots = [...(depots as any)];
        let _depot = {...depot};
        if(depot.id){
            const index = findIndexById(depot.id);
            console.log(depot);
            DepotService.updateDepot(depot).then((res) => {
                res.json().then((response) => {
                    toast.current?.show({
                        severity: res?.status === 200 ? 'success' : 'error',
                        summary: res?.status === 200 ?'Successful' : 'erreur',
                        detail: res?.status === 200 ? 'Enregistrement effectué avec succès' : response?.message,
                        life: 3000
                    });
                })
                console.log(res);

                res?.status === 200 && setDepotDialog(false);
                res?.status === 200 && setDepot(emptyDepot);
            }).catch((err) => {
                console.log(err);

            })

        } else {
            depot.nom &&
            DepotService.createDepot(_depot).then((res) => {
                res.json().then((response) => {
                    toast.current?.show({
                        severity: res?.status !== 200 ? 'error': 'success',
                        summary: res?.status !== 200 ? 'Erreur' : 'Succès',
                        detail: res?.status !==200 ? response?.message :  'Enregistrement effectué avec succès',
                        life: 3000
                    });
                })

                res?.status === 200 && setDepotDialog(false);
                res?.status === 200 && setDepot(emptyDepot);
            }).then((err) => {
                console.log(err);
            })
        }

    }

    const editDepot = (depot: Depot) => {
        setDepot({...depot});
        setDepotDialog(true)
    };

    const confirmDeleteDepot = (depot: Depot) => {
        setDepot(depot);
        setDeleteDepotDialog(true)
    };

    const deleteDepot = () => {
        DepotService.deleteDepot(depot).then((res) => {
            console.log(res);
            toast.current?.show({
                severity: res?.status === 200 ? 'success': 'error',
                summary: res?.status ===  200 ? 'Succès' : 'Erreur',
                detail: res?.status === 200 ? 'Suppression effectuée avec succès' : "Erreur survenue lors de la suppression",
                life: 3000
            });
            res?.status === 200 && setDeleteDepotDialog(false);
            res?.status === 200 && setDepot(emptyDepot);
        }).catch((err) => {
            console.log(err);
        })
    }

    const findIndexById = (id: number) => {
        let index = -1;
        for (let i = 0; i < (depots as any).length; i++) {
            index = i;
            break;
        }
        return index;
    }

    const exportCSV = () => {
        dataTable.current?.exportCSV();
    }

    const confirmDeleteSelected = () => {
        setDeleteDepotsDialog(true)
    };

    const deleteSelectedDepots = () => {
        let _depots = (depots as any)?.filter((val: any) => !(selectedDepots as any)?.includes(val));
        setDepots(_depots);
        (selectedDepots as any).forEach((d: any) => {
            /* console.log(d); */
            DepotService.deleteDepot(d).then((res)=> {
                console.log(res);

                res?.status === 200 && setDeleteDepotsDialog(false);
                res?.status === 200 && setSelectedDepots(null);
                res?.status === 200 &&
                toast.current?.show({
                    severity: res?.status === 200 ? 'success' : 'error',
                    summary: res?.status === 200 ? 'Succès' : 'Erreur',
                    detail: res?.status === 200 ? 'Suppression effectuée avec succès' : 'Erreur survenue lors de la suppression',
                    life: 3000
                });
            }).catch((err) => {
                console.log(err);
            })
        });
    }

    useEffect(() => {
        setLoading(true)
        DepotService.getDepots().then((data) => {
            console.log(data);
            setDepots(data as any)
            setLoading(false)
        }).catch((err) => {
            console.log(err);

        });
        initFilter();
    }, [depot]);

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        setDepot({...depot,[name]: val});
    }

    const onInputNumberChange = (e: InputNumberChangeEvent,name: string) =>{
        const val = (e.value) || 0;
        setDepot({...depot,[name]: val});
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className='my-2'>
                    <Button label='Nouveau' icon='pi pi-plus' severity='success' className='mr-2' onClick={openNew}></Button>
                    <Button label='Supprimer' icon='pi pi-trash' severity='danger' onClick={confirmDeleteSelected} disabled={!selectedDepots || !(selectedDepots as any).length}></Button>
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

    const actionBodyTemplate = (rowData: Depot) => {
        return (
            <>
                <Button icon='pi pi-pencil' rounded severity='success' className='mr-2' onClick={() => editDepot(rowData)}></Button>
                <Button icon='pi pi-trash' rounded severity='warning' onClick={() => confirmDeleteDepot(rowData)}></Button>
            </>
        )
    }

    const header =  (
        <div className='flex flex-column md:flex-row md:justify-content-between md:align-items-center'>
            <h5 className='m-0'>Dépot</h5>
            <span className='block mt-2 md:mt-0 p-input-icon-left'>
                <i className='pi pi-search'></i>
                <InputText type='search' onInput={(e)=> setGlobalFilter(e.currentTarget.value)} placeholder='Rechercher...'/>
            </span>
        </div>
    )

    const depotDialogFooter = (
        <>
            <Button label='Annuler' icon='pi pi-times' text onClick={hideDialog}></Button>
            <Button label='Enregistrer' icon='pi pi-check' text onClick={saveDepot}></Button>
        </>
    )

    const deleteDepotDialogFooter = (
        <>
            <Button label='Non' icon='pi pi-times' text onClick={hideDeleteDepotDialog}></Button>
            <Button label='Oui' icon='pi pi-check' text onClick={deleteDepot}></Button>
        </>
    )

    const deleteDepotsDialogFooter = (
        <>
            <Button label='Oui' icon='pi pi-times' text onClick={hideDeleteDepotsDialog}></Button>
            <Button label='Oui' icon='pi pi-check' text onClick={deleteSelectedDepots}></Button>
        </>
    )
  return (
    <div className='grid crud-demo'>
        <div className='col-12'>
            <div className='card'>
            <Toast ref={toast}></Toast>
            <Toolbar className='mb-4' left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
            <DataTable
                ref={dataTable}
                value={depots}
                selection={selectedDepots}
                onSelectionChange={(e) => setSelectedDepots(e.value as any)}
                dataKey='id'
                paginator
                rows={10}
                loading={loading}
                rowsPerPageOptions={[5,10,25]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} dépots"
                globalFilter={globalFilter}
                emptyMessage="Aucun dépot trouvé."
                header={header}
                filters={filters}
                responsiveLayout='scroll'
            >
                <Column selectionMode='multiple' headerStyle={{width: '4rem'}}></Column>
                <Column field='nom' header='Nom' sortable></Column>
                <Column field='adresse' header='Adresse' sortable></Column>
                <Column body={actionBodyTemplate} headerStyle={{minWidth:'10rem'}}/>
            </DataTable>

            <Dialog
                visible={depotDialog}
                style={{ width: '450px'}}
                header="Dépot détails"
                modal
                className='p-fluid'
                footer={depotDialogFooter}
                onHide={hideDialog}
                >
                    <div className='field'>
                        <label htmlFor='nom'>Nom</label>
                        <InputText
                            id='nom'
                            value={depot.nom}
                            onChange={(e) => onInputChange(e,'nom')}
                            required ={true}
                            autoFocus
                            className={classNames({
                                    'p-invalid': submitted && !depot.nom
                                })
                            }
                        />
                        {submitted && !depot.nom && <small className='p-invalid'>Ce champs est obligatoire</small>}
                    </div>
                    <div className='field'>
                        <label htmlFor='adresse'>Adresse</label>
                        <InputText
                            id='adresse'
                            value={depot.adresse}
                            onChange={(e) => onInputChange(e,'adresse')}
                            required
                            autoFocus
                            className={
                                classNames({
                                    'p-invalid': submitted && !depot.adresse
                                })
                            }
                        />
                    </div>
            </Dialog>

            <Dialog
                visible={deleteDepotDialog}
                style={{ width: '450px'}}
                header='Confirmer'
                modal
                footer={deleteDepotDialogFooter}
                onHide={hideDeleteDepotDialog}
            >
                <div className='flex align-items-center justify-content-center'>
                    <i className='pi pi-exclamation-triangle mr-3' style={{width: '4rem'}}></i>
                    {depot &&
                        <span>
                            Êtes-vous sure de vouloir supprimer <b>{depot.nom}</b>
                        </span>
                    }
                </div>
            </Dialog>

            <Dialog
                visible={deleteDepotsDialog}
                style={{width: '450px'}}
                header='Confirmation'
                modal
                footer={deleteDepotsDialogFooter}
                onHide={hideDeleteDepotsDialog}
            >
                <div className='flex align-items-center justify-content-center'>
                    <i className='pi pi-exclamation-triangle mr-3' ></i>
                    {depot && <span>Êtes-vous sûre de vouloir supprimer les dépots selectionnés ?</span>}
                </div>
            </Dialog>
            </div>
        </div>

    </div>
  )
}

export default DepotCrud
