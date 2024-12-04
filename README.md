# Hello Drata

## Task Objectives

The objective of the task was to:

1. Fetch the complete people data from SWAPI (Activity)
2. Filter the data based on provided Rules (Activity)
3. Rules should fulfil universal interface

### Fetch the People Data

The data needs to be statefully fetched page by page until the pagination is exhausted. Usually the most difficult part of such fetch is to create a retries, pauses and other infrastructure related issues. Here it was handled by Temporal out of the box.

I have decided to use URI pased pagination since this is the most compatible format for every type of pagianted requests because consumer does not need to implement any pagination logic (this is high relevant if working with token pased paginations). Also SWAPI fully implements it.

I have also created a Serializer for the incoming data, so we do not process any external unstructured data in our system. Serializer also creates proper types from strings. If the external SWAPI schema will introduce breaking change - the Activity will throw non retryable error, so we can adjust the Schema.

### Filter the data based on provided Rules (Activity)

After the internal repository for People is build we are able to search within it.

- If we provide no Rules, the Workflow will return all People.
- If we provide Rules that finds no match the Workflow will throw an error. (in real world scenario it would just return 4xx error)
- I also provided couple more rules to illustrate the generic character of interface.
- Rules can be combined like AND clause.
- Rules are passed as Arguments to Workflow. The required Rules are hardcoded in the code.
- Since we are not excepting rules provided outside of the code, we do not need to validate them.

## Running this task

Application setup and launch is based on `HelloWorld` example as required in the Task. It uses the default ports/values.

#### Version used

Ubuntu 22
Node v22.6.0
Temporal version 1.1.2 (Server 1.25.2, UI 2.32.0)

#### Workflow Execution

1. In terminal 1 run `temporal server start-dev` to start [Temporal Server](https://github.com/temporalio/cli/#installation).
2. Open terminal 2 to and run `npm install` to install dependencies.
3. Run `npm run start.watch` to start the Worker.
4. Open terminal 3 and run `npm run workflow` to run the Workflow Client.

You can check the Workflow execution at:
http://localhost:8233/namespaces/default/workflows

#### Tests

I have provided some basic tests for activities and workflow execution.
To run tests just run: `npm run test`

✓ throws if no Characters satisfies Rules
✓ successfully fetches characters based on task criteria
✓ successfully fetchets characters based on other Rules
✓ successfully joins Rules for the same property
✓ successfully returns all Characters if no Rule is specified
