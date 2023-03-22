# Cypress demo project

## Setup

---

### **_1. REACT test_**

**Project location** = `tests\react`

Run:

```
npm install
```

### **_2. API tests_**

**Project location** = `tests\api`

Run:

```
npm install
```

## How to run tests and check the test results

---

We can run tests from command line and check the generated HTML report or we can see the application running in real time, using the cypress test runner.

**NOTE: All commands need to be run in the project location.**

### **_1. From command line_**

**Test report**

It will be generated in `report` folder, `test-report.html`, along with the screenshots and videos of the failing tests.
In this report we can filter tests by run status. So, we can choose not to display for example "Pending" , "Skipped" tests.

Custom commands are defined in: `package.json` > `scripts`

Run tests from a specific folder:

```
npm run tests -- --env="baseUrl=url" --spec="./cypress/integration/folder-name/**/*"
npm run report
```

Run all tests and generate report:

```
npm run tests
```

```
npm run tests -- --env="baseUrl=url"
```

Run only the tagged tests, with @SMOKE for eg:

```
npm run tests -- --env="baseUrl=url,grep=@SMOKE"
```

Detailed documentation can be found [here](https://docs.cypress.io/guides/guides/command-line.html#cypress-run)

### **_2. From cypress test runner (local)_**

Shows real-time run of the application under test.

_Scope_: To be used when developing or debugging the tests.

Open it:

```
npx cypress open
```

Search bar can be used to filter tests and then click "Run integration specs"

Detailed documentation cand be found [here](https://docs.cypress.io/guides/core-concepts/test-runner.html#Overview)

## Test data

Following data needs to be created on the environment in order for tests to run

Class:

```
V AUTOMATION QA
```

Users:

```
Username= automation-student
Name= Student Automation QA
```

```
Username= automation-parent
Name= Parent Automation QA
```

```
Username= automation-professor
Name= Professor Automation QA
```
