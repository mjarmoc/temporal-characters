import { proxyActivities } from '@temporalio/workflow';

import type * as activities from './activities';
import { IPerson, IRule } from './interfaces';

const { fetchPage, searchRepository } = proxyActivities<typeof activities>({
  startToCloseTimeout: '15 minute',
  heartbeatTimeout: '1 minute',
});

// Workflow Execution
export async function searchForPeople(rules: IRule[]) {
  const peopleRepository = await createRepository();
  return await searchRepository(peopleRepository, rules);
}

async function createRepository(): Promise<IPerson[]> {
  let people: IPerson[] = [];
  let page = 'https://swapi.dev/api/people/?page=1';
  do {
    const results: any = await fetchPage(page);
    people = people.concat(results.data);
    page = results.nextPageURI;
  } while (page);
  return people;
}
