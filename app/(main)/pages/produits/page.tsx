"use client";
import { ProduitService } from '@/demo/service/ProduitService';
import { ProduitType } from '@/types/DataConfig'
import { Button } from 'primereact/button';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import React, { useEffect, useState } from 'react'

function Page() {

    const [produit,setProduit] = useState<ProduitType>();
    const [produits,setProduits] = useState<ProduitType[]>([]);
    const [dataViewValue,setDataViewValue] = useState<ProduitType[]>([]);
    const [globalFilterValue,setGlobalFilterValue] = useState('');
    const [filteredValue,setFilteredValue] = useState<ProduitType[] | null>(null);
    const [layout,setLayout] = useState<'grid' | 'list' | (string & Record<string, unknown>)>('grid');
    const [sortKey,setSortKey] = useState(null);
     const [sortOrder, setSortOrder] = useState<0 | 1 | -1 | null>(null);
    const [sortField,setSortField] = useState('');

    const sortOptions = [
        {label: 'Prix unitaire elevé', value : 'prixUnitaire'},
        {label: 'Prix unitaire moins elevé', value : '!prixUnitaire'}
    ]


    useEffect(() => {
        //GetAllProduits
        ProduitService.getProduits().then((res) => {
            console.log(res);
            res.json().then((data) => {
                res?.status === 200 && setDataViewValue(data);
            })

        })
    },[]);

    const onFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setGlobalFilterValue(value);
        if(value.length === 0){
            setFilteredValue(null);
        }else {
            const filtered = dataViewValue?.filter((produit) => {
                const produitDesignationLowerCase = produit.designation.toLowerCase();
                const searchValueLowercase = value.toLowerCase();
                return produitDesignationLowerCase.includes(searchValueLowercase);
            });
            setFilteredValue(filtered);
        }
    }

    const onSortChange = (event: DropdownChangeEvent) =>{
        const value = event.value;

        if(value.indexOf('!') === 0 ){
            setSortOrder(-1);
            setSortField(value.substring(1,value.length));
            setSortKey(value);
        } else {
            setSortOrder(1);
            setSortField(value);
            setSortKey(value);
        }
    };

    const dataViewHeader = (
        <div className='flex flex-column md:flex-row md:justify-content-between gap-2'>
            <Dropdown
                value={sortKey}
                options={sortOptions}
                optionLabel='label'
                placeholder='Sort by prix unitaire'
                onChange={onSortChange}
            />
            <span className='p-input-icon-left'>
                <i className='pi pi-search'></i>
                <InputText
                    value={globalFilterValue}
                    onChange={onFilter}
                    placeholder='Rechercher par désignation'
                />
            </span>
            <DataViewLayoutOptions
                layout={layout}
                onChange={(e) =>setLayout(e.value)}
            ></DataViewLayoutOptions>
        </div>
    );

    const dataviewListItem = (data: ProduitType) => {
        return (
            <div className="col-12">
                <div className="flex flex-column md:flex-row align-items-center p-3 w-full">
                    <div className="flex-1 flex flex-column align-items-center text-center md:text-left">
                        <div className="font-bold text-2xl">{data?.designation}</div>
                        <div className='mb-2'>{data?.code}</div>
                    </div>
                </div>
                <div className="flex flex-row md:flex-column justify-content-between w-full md:w-auto align-items-center md:align-items-end mt-5 md:mt-0">
                    <span className='text-2xl font-semibold mb-2 align-self-center md:align-self-end'>{data?.prixUnitaire} FCFA</span>
                   <Button icon="pi pi-exclamation-circle" size="small" className="mb-2"></Button>
                </div>
            </div>
        )
    }


    const dataviewGridItem = (data : ProduitType) => {
        return (
            <div className='col-12 lg:col-4'>
                <div className="card m-3 border-1 surface-border">
                    <div className="flex flex-wrap gap-2 align-items-center justify-content-between mb-2">
                        <div className="flex align-items-center">
                        <i className="pi pi-tag mr-2"/>
                        <span className='font-semibold'>{data.id}</span>
                        </div>
                    </div>
                    <div className="flex flex-column align-items-center text-center mb-3">
                        <div className="text-2xl font-bold">{data.designation}</div>
                    </div>
                    <div className="flex align-items-center justify-content-between">
                        <span className="text-1xl font-semibold">{data.prixUnitaire} FCFA</span>
                        <Button icon="pi pi-exclamation-circle" size="small" className="mb-2"></Button>
                    </div>
                </div>
            </div>
        )
    }


    const itemTemplate = (data : ProduitType, layout : 'grid' | 'list' | (string & Record<string, unknown>)) => {

        if(!data){
            return;
        }

        if(layout === 'list'){
            return dataviewListItem(data);
        } else if( layout === 'grid'){
            return dataviewGridItem(data);
        }
    }
  return (
    <div className='grid'>
        <div className="col-12">
            <div className="card">
                <h5>Produits</h5>
                <DataView
                    value={filteredValue || dataViewValue}
                    layout={layout}
                    paginator
                    rows={9}
                    sortOrder={sortOrder}
                    sortField={sortField}
                    itemTemplate={itemTemplate}
                    header={dataViewHeader}
                    emptyMessage='Aucun produit'
                />
            </div>
        </div>
    </div>
  )
}

export default Page
