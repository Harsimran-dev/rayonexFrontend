import { Routes } from '@angular/router';
import { PersonaldetailsComponent } from './personaldetails/personaldetails/personaldetails.component';



import { WordReaderComponent } from './word-reader/word-reader.component';
import { CauseDialogComponent } from './cause-dialog/cause-dialog.component';
import { ClientFormComponent } from './client-form/client-form.component';
import { ClientDetailsComponent } from './client-details/client-details.component';
import { CreateTreatmentPlanComponent } from './create-treatment-plan/create-treatment-plan.component';
import { PitComponent } from './pit/pit.component';

export const ComponentsRoutes: Routes = [
	{
		path: 'personal-details',
		component: WordReaderComponent
	},
	{
		path: 'client',
		component: ClientFormComponent
	},
	{
		path: 'client-details/:id',
		component: ClientDetailsComponent
	},
	
	{
		path: 'cause',
		component: CauseDialogComponent
	},
	{
		path: 'create-treatment-plan',
		component: CreateTreatmentPlanComponent
	},
	{
		path: 'PIT',
		component: PitComponent
	}
];
