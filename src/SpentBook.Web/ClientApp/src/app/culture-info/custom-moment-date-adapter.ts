// Angular
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Injectable } from "@angular/core";

@Injectable()
export class CustomMomentDateAdapter extends MomentDateAdapter {
  getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
    if (style == 'narrow') {
      return super.getDayOfWeekNames('short').map(v => {
        return v[0];
      });
    }
    return super.getDayOfWeekNames(style);
  }
}