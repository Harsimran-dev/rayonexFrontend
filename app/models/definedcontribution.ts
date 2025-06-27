import { Investment } from "./Investment";

export interface DefinedContribution {
    name: string;
    minContribution: number;

    startDate: Date;
    endDate: string;
    planStatus: string;
    pensionPotId: number;
    currentContributedAmount: number;
    investmentOptions:Investment;
    
}
