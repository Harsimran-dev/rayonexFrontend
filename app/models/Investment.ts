import { InvestmentType } from "./investmenttype";

export interface Investment {
    investmentType: InvestmentType;
    symbol: string;
    name: string;
    quantity: number;
    purchasePrice: number;
    purchaseDate: Date;
    currentPrice: number;
    marketValue: number;
    investmentDate: Date;
    investmentStatus: string;
    userId:string
}
