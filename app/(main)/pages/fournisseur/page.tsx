"use client";

import React, { use, useCallback, useEffect, useState } from 'react';
import type {DataConfig} from '@/types/DataConfig';
import { DataTable, DataTableExpandedRows, DataTableFilterMeta } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { FournisseurService } from '@/demo/service/FournisseurService';
import { InputText } from 'primereact/inputtext';
import { error, log } from 'console';
import { Column } from 'primereact/column';
import { SplitButton } from 'primereact/splitbutton';
import OverlayAddFournisseur from './FournisseurCreate';
import { MenuItem } from 'primereact/menuitem';
import OverlayUpdateFournisseur from './FournisseurUpdate';
import SuppressionFournisseur from './FournisseurDelete';
import { create } from 'domain';

const Fournisseur = () => {

    const [fournisseurs,setFournisseurs] = useState<DataConfig.Fournisseur[]>([]);
    const [fournisseurSelected, setFournisseurSelected] =useState<DataConfig.Fournisseur>({
        id: 0,
        nom: '',
        prenom:'',
        telephone:'',
        tauxVente:0
    });
    const [fournisseur, setFournisseur] = useState<DataConfig.Fournisseur>({
            nom: '',
            prenom:'',
            telephone:'',
            tauxVente:0
    });
    const [filters,setFilters] = useState<DataTableFilterMeta>({});
    const [loading,setLoading] = useState(true);
    const [globalFilterValue,setGlobalFilterValue] = useState('');
    const [expandedRows,setExpandedRows] = useState<any[] | DataTableExpandedRows>([]);
    const [allExpanded,setAllExpanded] = useState(false)
    const [displayBasic, setDisplayBasic] = useState(false);
    const [isOpen,setIsOpen] = useState(false);
    const [isOpenDialogSuppressFournisseur, setIsOpenDialogSupressFournisseur] = useState(false);
    const clearFilter = () => {
        initFilters();
    }




    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let _filters = {...filters};
        (_filters['global'] as any).value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    }

    const refreshFournisseurs = () => {
        getFournisseurs()
    }

    const getFournisseurs = () : DataConfig.Fournisseur | void => {
        FournisseurService.getFournisseurs().then((data)=>{
            setFournisseurs(data)
            setLoading(false)
            return data
        }).catch((er) => {
            console.log(er);
        })
    }


    //Bouton de recherche et le bouton d'effacer
    const renderHeader = () => {
       return(
        <div className='flex justify-content-between'>
            <div className='flex flex-wrap gap-2'>
                <OverlayAddFournisseur
                setFournisseur={setFournisseur}
                fournisseur={fournisseur}
                onCreateFournisseur={(data: DataConfig.Fournisseur) => { setFournisseur(data) }}
                onClickCreateFournisseur={() => createFournisseur(fournisseur)}
                displayBasic={displayBasic}
                setDisplayBasic={setDisplayBasic}
                />
                <Button type='button' icon="pi pi-filter-slash" label='Annuler' outlined onClick={clearFilter}/>
            </div>
                <span className='p-input-icon-left'>
                    <i className='pi pi-search'></i>
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder='Recherche'/>
                </span>
        </div>
        )
    }

    const header1 = renderHeader();


    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
                        name: {
                            operator: FilterOperator.AND,
                            constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
                        },
                        'nom': {
                            operator: FilterOperator.AND,
                            constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
                        },
                        representative: { value: null, matchMode: FilterMatchMode.IN },
                        date: {
                            operator: FilterOperator.AND,
                            constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }]
                        },
                        balance: {
                            operator: FilterOperator.AND,
                            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
                        },
                        status: {
                            operator: FilterOperator.OR,
                            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
                        },
                        activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
                        verified: { value: null, matchMode: FilterMatchMode.EQUALS }
        })
        setGlobalFilterValue("");
    }

    const footerTemplate = (data: DataConfig.Fournisseur) => {
        return (
            <React.Fragment>
                <td colSpan={4} style={{ textAlign: 'right' }} className="text-bold pr-6">
                    Total fournisseur
                </td>
                <td>{calculateFournisseurTotal(fournisseurs)}</td>
            </React.Fragment>
        )
    }


    const getFournisseur = (id: number| undefined) : DataConfig.Fournisseur | void =>{
        FournisseurService.getFournisseur(id).then((res) =>{
            console.log(res)
            setFournisseurSelected(res)
            setIsOpen(true)
            return res
        }
        ).catch((err) => console.log(err))
    }


    const createFournisseur = (fournisseur: DataConfig.Fournisseur) =>{
        console.log(fournisseur);

        FournisseurService.createFournisseur(fournisseur)
        .then((res) => {
            console.log(res);
            setLoading(true);
            initFilters();
        })
        .catch((err) =>{
            console.log(err.message);
        } )
    }

    const spliButtonItemsActionFournisseur = (data: DataConfig.Fournisseur): MenuItem[] => {
        return (
            [{
                id:data.id?.toString(),
                label: "Modifier",
                icon:"pi pi-pencil",
                command: () => {
                    getFournisseur(data?.id)
                }
            },
            {
                id:data.id?.toString(),
                label: "Supprimer",
                icon:"pi pi-trash",
                command: () => {
                    setFournisseurSelected(data)
                    setIsOpenDialogSupressFournisseur(true)
                }
            }]
        )
    }

    const actionBody = (data: DataConfig.Fournisseur) => {
        return (
            <div>
                <div className="">
                    <SplitButton label="Action" icon="pi pi-action" model={spliButtonItemsActionFournisseur(data)} outlined severity='secondary'></SplitButton>
                </div>
            </div>
        )
    }

    const calculateFournisseurTotal = (data: DataConfig.Fournisseur[]) => {
        let total = 0;

        if(data.length > 0){
            for(let four of data){
                total++;
            }
        }
        return total;
    };

    useEffect(() => {
        setLoading(true);
        getFournisseurs()
        initFilters();
    },[]);

    useEffect(() => {
        getFournisseurs()
    }, [displayBasic === false, isOpen === false, isOpenDialogSuppressFournisseur === false])
return (
    <div className='grid'>
        <div className="col-12">
            <div className="card">
                <h5>Fournisseur</h5>
                <DataTable
                    value={fournisseurs}
                    paginator
                    rows={10}
                    dataKey='id'
                    emptyMessage="Aucun fournisseur"
                    loading={loading}
                    filters={filters}
                    filterDisplay='menu'
                    header={header1}
                >
                <Column field='nom' header='Nom' filter filterPlaceholder='Recherche par un nom' style={{ minWidth: '12rem' }}/>
                <Column field='prenom' header='Prénom' />
                <Column field='telephone' header='Numéro téléphonique'/>
                <Column field='tauxVente' header='Taux de vente' filter filterElement/>
                <Column header='Action' body={actionBody} field='id'>

                </Column>
                </DataTable>
            </div>
        </div>
        {isOpenDialogSuppressFournisseur &&
        <SuppressionFournisseur
            displayConfirmation={() => setIsOpenDialogSupressFournisseur(false)}
            fournisseur={fournisseurSelected}>
            {'Voulez-vous supprimez ce fournisseur'}
        </SuppressionFournisseur>}
        {isOpen &&
        <OverlayUpdateFournisseur
            fournisseur={fournisseurSelected}
            setFournisseur={setFournisseur}
            onClose={() => setIsOpen(false)}
        />}
    </div>
  )
}

export default Fournisseur
