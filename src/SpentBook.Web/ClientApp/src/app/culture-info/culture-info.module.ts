// Angular
import { NgModule, LOCALE_ID } from '@angular/core';
import { MAT_DATE_FORMATS, DateAdapter } from '@angular/material';

// Module
import { CustomMomentDateAdapter } from './custom-moment-date-adapter';

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const APP_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'MMMM YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  providers: [
    { provide: LOCALE_ID, useValue: 'pt' },
    { provide: DateAdapter, useClass: CustomMomentDateAdapter  },
    { provide: MAT_DATE_FORMATS, useValue: APP_FORMATS }
  ],
  imports: [
    
  ],
  exports: [
    
  ]
})
export class CultureInfoModule { }
