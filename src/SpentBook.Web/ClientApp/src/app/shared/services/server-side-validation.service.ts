// Angular
import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

// App
import { ProblemDetailsItem, ProblemDetails } from '@app/core';

// Module
import { BoxErrorComponent } from '../components/box-error/box-error.component';

export interface FieldError {
  name: string;
  errors: { [id: string]: ProblemDetailsItem; }
}

@Injectable({
  providedIn: 'root'
})
export class ServerSideValidationService {

  constructor() { }

  /*
    Esse método prioriza os erros da seguinte forma:
    1) Se um campo do lado serverside tiver o mesmo nome de um 
       campo do lado clientsidem então exibe o erro no campo
    2) Se existir campos do lado serverside, mas nenhum der "match" 
       no front, então chama a action "unknownFieldsAction"
    3) Se não existir a situação 1 e 2, então chama a action "unknownErrorAction"
  */
  public validate(
    componentInstance: Object,
    serverError: any,
    knownFieldsAction: (knownFields: FieldError[]) => void,
    unknownFieldsAction: (unknownFields: FieldError[]) => void,
    genericErrorAction: (problemDetails: ProblemDetails) => void
  ) {
    let knownFields = [];
    let unknownFields = [];
    let problemDetails = <ProblemDetails>serverError.error;

    if (problemDetails.errors != null) {
      for (let fieldName in problemDetails.errors) {
        let field = componentInstance[this.toLowerCaseFirstLetter(fieldName)];
        let fieldErrors = problemDetails.errors[fieldName];
        if (field == null) {
          unknownFields.push({
            name: fieldName,
            errors: fieldErrors
          });
        }
        else {
          knownFields.push({
            name: fieldName,
            errors: fieldErrors
          });

          var errors = {};
          for (let index in fieldErrors) {
            let e = fieldErrors[index];
            errors[this.toLowerCaseFirstLetter(e.type)] = true;
          }
          field.setErrors(errors);
        }
      }

      if (knownFields.length > 0) {
        knownFieldsAction(knownFields);
      }
      else if (unknownFields.length > 0) {
        unknownFieldsAction(unknownFields);
      }
      else {
        genericErrorAction(problemDetails);
      }
    }
    else {
      genericErrorAction(problemDetails);
    }
  }

  public validateWithBoxError(
    componentInstance: Object,
    serverError: any,
    boxError: BoxErrorComponent
  ) {
    this.validate(
      componentInstance,
      serverError,
      (knownFieldsErrors) => {
        boxError.show = false;
      },
      (unknownFieldsErrors) => {
        boxError.unknownFieldsErrors = unknownFieldsErrors;
        boxError.show = true;
      },
      (problemDetails) => {
        boxError.problemDetails = problemDetails;
        boxError.show = true;
      });
  }

  public hasError(control: FormControl, errorName: string) {
    if (control && control.errors) {
      for (var i in control.errors) {
        if (i.toLowerCase() == errorName.toLowerCase())
          return true;
      }
    }
    return false;
  }

  public hiddenError(control: FormControl, errorName: string) {
    return !this.hasError(control, errorName);
  }

  private toLowerCaseFirstLetter(value: string): string {
    return value.charAt(0).toLowerCase() + value.slice(1);
  }
}
