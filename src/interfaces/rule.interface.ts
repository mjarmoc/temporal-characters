import { IPerson } from './person.interface';

export interface IRule {
  propertyName: keyof IPerson;
  operator: IRuleOperator;
  value: any;
}

export enum IRuleOperator {
  EQUALS = 'equals',
  GREATER = 'greater',
  LESS = 'less',
  CONTAINS = 'contains',
}
