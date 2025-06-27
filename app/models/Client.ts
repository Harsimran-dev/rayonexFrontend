// src/app/models/client.model.ts

export interface Client {
    id?: number; // optional because for create you don't need it
    title: string;
    gender: string;
    firstName: string;
    surname: string;
    dateOfBirth: string;
    address?: string;
    postCode?: string;
    email?: string;
    telephone?: string;
    mobile?: string;
  }
  