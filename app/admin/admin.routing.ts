import { Routes } from '@angular/router';
import { UseradminComponent } from './useradmin/useradmin/useradmin.component';




export const AdminRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: 'useradmin',
				component: UseradminComponent
			}
		
			  
			  
		]
	}
];
