import { TestWorkflowEnvironment } from '@temporalio/testing';
import { after, before, it } from 'mocha';
import { Worker } from '@temporalio/worker';
import { searchForPeople } from '../workflows';
import assert from 'assert';
import { IRuleOperator } from '../interfaces/';
import * as activities from '../activities';

describe('Workflow', async () => {
  let testEnv: TestWorkflowEnvironment;

  before(async () => {
    testEnv = await TestWorkflowEnvironment.createLocal();
  });

  after(async () => {
    await testEnv?.teardown();
  });

  it('successfully completes the Workflow with a Rules defined in the Task', async () => {
    const { client, nativeConnection } = testEnv;
    const taskQueue = 'test';

    const worker = await Worker.create({
      connection: nativeConnection,
      taskQueue,
      workflowsPath: require.resolve('../workflows'),
      activities,
    });

    const result = await worker.runUntil(
      client.workflow.execute(searchForPeople, {
        args: [
          [
            { propertyName: 'eye_color', value: 'red', operator: IRuleOperator.EQUALS },
            { propertyName: 'name', value: '[0-9]', operator: IRuleOperator.CONTAINS },
          ],
        ],
        workflowId: 'test',
        taskQueue,
      })
    );
    assert.equal(result.length, 3);
    assert.equal(result[0].name, 'R2-D2');
    assert.equal(result[1].name, 'R5-D4');
    assert.equal(result[2].name, 'IG-88');
  });
});
