import { Routes } from '@angular/router';
import { UseradminComponent } from './useradmin/useradmin/useradmin.component';

import { AdminmessageComponent } from './adminmessage/adminmessage/adminmessage.component';


export const AdminRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: 'useradmin',
				component: UseradminComponent
			},
		
			  {
				path: 'messageuser/:id',
				component: AdminmessageComponent
			  }
			  
			  
		]
	}
];
