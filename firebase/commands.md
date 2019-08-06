#Firebase commands#
Run the emulator: firebase serve --only firestore

Run the tests (from the firestore-tests folder): npm run test  or npm run test trips-users.spec.js


# Firebase function testing #

Run the emulator
> firebase emulators:start

Set environment flag
> export FIRESTORE_EMULATOR_HOST=localhost:8080

Run a test script (in terminal with environment set)
> node ./functions/tests/test.js
> node .tests.js

Doing this will execute you code agains the emulator and Firestore functions will trigger
This makes it possible to create unit tests