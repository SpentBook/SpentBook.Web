import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ProblemDetails, ProblemDetailsItem } from '../models/problem-details.model';
import { BoxErrorComponent } from '../components/box-error/box-error.component';

export interface UnknownFieldError {
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
    unknownFieldsAction: (unknownFields: UnknownFieldError[]) => void,
    unknownErrorAction: (problemDetails: ProblemDetails) => void
  ) {
    let unknownFields = [];
    let problemDetails = <ProblemDetails>serverError.error;
    let hasKnownFieldError = false;

    if (problemDetails.errors != null) {
      for (let fieldName in problemDetails.errors) {
        let field = componentInstance[this.toLowerCaseFirstLetter(fieldName) + "A"];
        let fieldErrors = problemDetails.errors[fieldName];
        if (field == null) {
          unknownFields.push({
            name: fieldName,
            errors: fieldErrors
          });
        }
        else {
          hasKnownFieldError = true;
          var errors = {};
          for (let index in fieldErrors) {
            let e = fieldErrors[index];
            errors[this.toLowerCaseFirstLetter(e.type)] = true;
          }
          field.setErrors(errors);
        }
      }

      if (!hasKnownFieldError) {
        if (unknownFields != null)
          unknownFieldsAction(unknownFields);
        else
          unknownErrorAction(problemDetails);
      }
    }
    else {
      unknownErrorAction(problemDetails);
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
      (unknownFieldsErrors) => {
        boxError.unknownFieldsErrors = unknownFieldsErrors;
      },
      (problemDetails) => {
        boxError.problemDetails = problemDetails;
      });
  }

  public hasError(control: FormControl, errorName: string) {
    if (control.errors != null) {
      for (var i in control.errors) {
        if (i.toLowerCase() == errorName.toLowerCase())
          return true;
      }
    }
    return false;
  }

  private toLowerCaseFirstLetter(value: string): string {
    return value.charAt(0).toLowerCase() + value.slice(1);
  }
}
