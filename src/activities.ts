import axios from 'axios';
import { IPerson, IRule, IRuleOperator, PaginatedResults } from './interfaces/';
import { PersonSerializer } from './serializers/person.serializer';
import { IStrapi } from './interfaces/swapi.interface';
import { ApplicationFailure } from '@temporalio/client';

export async function fetchPage(uri: string): Promise<PaginatedResults<IPerson>> {
  let results: IStrapi<IPerson>;
  try {
    results = (await axios.get<IStrapi<IPerson>>(uri)).data;
  } catch (e) {
    throw ApplicationFailure.create({ message: `Failed to fetch ${uri}` });
  }
  const parsed = results.results.map((result) => PersonSerializer.fromAPI(result));
  return {
    data: parsed,
    nextPageURI: results.next,
  };
}

export async function searchRepository(repository: IPerson[], rules: IRule[]): Promise<IPerson[]> {
  const results = repository.filter((person) => {
    let valid = true;
    for (const rule of rules) {
      valid = applyRule(person, rule);
      if (!valid) return;
    }
    if (valid) return person;
  });
  if (!results || results?.length === 0) {
    throw ApplicationFailure.create({ message: 'No Characters matches Rules', nonRetryable: true });
  }
  return results;
}

function applyRule(person: IPerson, rule: IRule): boolean {
  switch (rule.operator) {
    case IRuleOperator.EQUALS:
      return person[rule.propertyName] === rule.value;
    case IRuleOperator.CONTAINS:
      return new RegExp(rule.value).test(person[rule.propertyName].toString());
    case IRuleOperator.GREATER:
      return person[rule.propertyName] > rule.value;
    case IRuleOperator.LESS:
      return person[rule.propertyName] < rule.value;
    default:
      return false;
  }
}
