// Angular
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  transform(value: string, limit = 25, completeWords = false, ellipsis = '...') {
    if (value == null)
      return "";
      
    if (completeWords) {
      var newLimit = value.substr(0, limit).lastIndexOf(' ');
      if (newLimit != -1) {        
        return value.substr(0, newLimit);
      }
    }
    
    var newValue = value.substr(0, limit);
    if (value.length > limit)
      return `${newValue}${ellipsis}`;

    return newValue;
  }
}
