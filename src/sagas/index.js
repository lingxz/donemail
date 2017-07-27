import { all } from 'redux-saga/effects'
import { watchAuth } from './user';
import { watchFullSyncMailBox, watchPartialSyncMailBox, watchFetchAllLabels } from './mailbox';

export default function* rootSaga() {
  yield all([
    watchAuth(),
    watchFullSyncMailBox(),
    watchPartialSyncMailBox(),
    watchFetchAllLabels(),
  ])
}