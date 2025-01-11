import { useState } from "react";


declare namespace DataConfig{

    type Fournisseur = {
        id?: number;
        nom?:string;
        prenom?:string;
        telephone?:string;
        tauxVente?:number;
    }

}


export interface Fournisseurs{
    fournisseurs:DataConfig.Fournisseur[];
}


export interface onAddFournisseur{
    add: (fournisseur:DataConfig.Fournisseur) => void;
}

export type Depot = {
    id? : number,
    nom?: string,
    adresse? :  string
}

export type Etagere = {
    id?:number;
    designation?: string;
}

export type FormeCallenique = {
    id?: number,
    designation?: string
}


export type Rayon = {
    id?: number;
    designation?: string;
}

export type TypeProduit = {
    id?: number;
    designation?: string;
}


export type Produit = {
    id: number;
    code: number;
    designation: string;
    prixUnitaire: number;
    conditionnement: number;
    numLot: string;
    prixSession: number;
    qteAvant: number;
    qteAct: number;
    qteApres: number;
    seuilMin: number;
    seuilMax: number;
    dateHeure:Date;
    dateArriv:Date;
    heureArriv:Date;
    dateExp: Date;
    etat: number;
    codeBar:number;
    formeCallenique: FormeCallenique;
    etagere:Etagere;
    rayon: Rayon;
    depot:Depot;
    typeProduit: TypeProduit;
    fournisseur:DataConfig.Fournisseur;
}


export type ProduitType = {
    id: number;
    code: string;
    designation: string;
    prixUnitaire: string;
}
