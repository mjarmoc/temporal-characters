import { MockActivityEnvironment } from '@temporalio/testing';
import { describe, it } from 'mocha';
import * as activities from '../activities';
import assert from 'assert';
import { IRuleOperator, IPerson } from '../interfaces';
import { readFileSync } from 'fs';
import { ApplicationFailure } from '@temporalio/client';

const repository = JSON.parse(readFileSync('./src/mocha/people.mock.json').toString());

describe('search repository', async () => {
  it('successfully fetches characters based on task criteria', async () => {
    const env = new MockActivityEnvironment();
    const result: IPerson[] = await env.run(activities.searchRepository, repository, [
      { propertyName: 'name' as keyof IPerson, value: '[0-9]', operator: IRuleOperator.CONTAINS },
      { propertyName: 'eye_color' as keyof IPerson, value: 'red', operator: IRuleOperator.EQUALS },
    ]);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, 'R2-D2');
  });
  it('successfully fetchets characters based on other Rules', async () => {
    const env = new MockActivityEnvironment();
    const result: IPerson[] = await env.run(activities.searchRepository, repository, [
      { propertyName: 'mass' as keyof IPerson, value: 80, operator: IRuleOperator.LESS },
      { propertyName: 'height' as keyof IPerson, value: 170, operator: IRuleOperator.GREATER },
    ]);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, 'Luke Skywalker');
  });
  it('successfully joins Rules for the same property', async () => {
    const env = new MockActivityEnvironment();
    const result: IPerson[] = await env.run(activities.searchRepository, repository, [
      { propertyName: 'mass' as keyof IPerson, value: 75, operator: IRuleOperator.GREATER },
      { propertyName: 'mass' as keyof IPerson, value: 80, operator: IRuleOperator.LESS },
    ]);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, 'Luke Skywalker');
  });
  it('successfully returns all Characters if no Rule is specified', async () => {
    const env = new MockActivityEnvironment();
    const result: IPerson[] = await env.run(activities.searchRepository, repository, []);
    assert.equal(result.length, 3);
  });
  it('throws if no Characters satisfies Rules is', async () => {
    const env = new MockActivityEnvironment();
    await assert.rejects(
      env.run(activities.searchRepository, repository, [
        { propertyName: 'height' as keyof IPerson, value: 10000, operator: IRuleOperator.EQUALS },
      ]),
      (err: any) => {
        return (
          err instanceof ApplicationFailure &&
          err.message === 'No Characters matches Rules' &&
          err.nonRetryable === true
        );
      }
    );
  });
});
