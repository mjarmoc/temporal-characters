import { Connection, Client } from '@temporalio/client';
import { searchForPeople } from './workflows';
import { nanoid } from 'nanoid';
import { IRuleOperator } from './interfaces';

async function run() {
  // Connect to the default Server location
  const connection = await Connection.connect({ address: 'localhost:7233' });

  // Create New Temporal Client
  const client = new Client({
    connection,
  });

  // Start Workflow
  const handle = await client.workflow.start(searchForPeople, {
    taskQueue: 'hello-world',
    args: [
      [
        { propertyName: 'eye_color', value: 'red', operator: IRuleOperator.EQUALS },
        { propertyName: 'name', value: '[0-9]', operator: IRuleOperator.CONTAINS },
      ],
    ],
    workflowId: 'workflow-' + nanoid(),
  });
  console.log(`Started workflow ${handle.workflowId}`);
  console.log(await handle.result());
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
