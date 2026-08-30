const RECOVERY_KEY = 'civicfix_recovery_snapshot';
const QUEUE_KEY = 'civicfix_recovery_queue';

// ─────────────────────────────────────────────────────────────────────────────
// SNAPSHOT
// ─────────────────────────────────────────────────────────────────────────────

export function saveRecoverySnapshot(state) {
  const snapshot = {
    timestamp: new Date().toISOString(),

    issues: state.issues || [],

    projects: state.projects || [],

    infrastructure: state.infrastructure || [],

    landUseZones: state.landUseZones || [],

    inspections: state.inspections || [],
  };

  try {
    localStorage.setItem(
      RECOVERY_KEY,
      JSON.stringify(snapshot)
    );

    return snapshot;
  } catch (error) {
    console.error(
      'Recovery snapshot write failed:',
      error
    );

    return null;
  }
}

export function getRecoverySnapshot() {
  try {
    const data = localStorage.getItem(RECOVERY_KEY);

    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(
      'Recovery snapshot read failed:',
      error
    );

    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// OFFLINE ACTION QUEUE
// ─────────────────────────────────────────────────────────────────────────────

export function queueRecoveryAction(action) {
  try {
    const existing = getRecoveryQueue();

    const recoveryAction = {
      ...action,

      recoveryId: `REC-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 7)}`,

      queuedAt: new Date().toISOString(),

      syncStatus: 'PENDING',
    };

    const updatedQueue = [
      ...existing,
      recoveryAction,
    ];

    localStorage.setItem(
      QUEUE_KEY,
      JSON.stringify(updatedQueue)
    );

    return recoveryAction;
  } catch (error) {
    console.error(
      'Recovery queue failed:',
      error
    );

    return null;
  }
}

export function getRecoveryQueue() {
  try {
    const data = localStorage.getItem(QUEUE_KEY);

    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(
      'Recovery queue read failed:',
      error
    );

    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// QUEUE MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────

export function updateRecoveryQueue(queue) {
  try {
    localStorage.setItem(
      QUEUE_KEY,
      JSON.stringify(queue)
    );

    return queue;
  } catch (error) {
    console.error(
      'Recovery queue update failed:',
      error
    );

    return null;
  }
}

export function removeRecoveryAction(recoveryId) {
  try {
    const existing = getRecoveryQueue();

    const updatedQueue = existing.filter(
      (item) =>
        item.recoveryId !== recoveryId
    );

    localStorage.setItem(
      QUEUE_KEY,
      JSON.stringify(updatedQueue)
    );

    return updatedQueue;
  } catch (error) {
    console.error(
      'Recovery action removal failed:',
      error
    );

    return null;
  }
}

export function clearRecoveryQueue() {
  try {
    localStorage.removeItem(QUEUE_KEY);
  } catch (error) {
    console.error(
      'Recovery queue clear failed:',
      error
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CLEAR ALL RECOVERY DATA
// ─────────────────────────────────────────────────────────────────────────────

export function clearRecoveryData() {
  try {
    localStorage.removeItem(
      RECOVERY_KEY
    );

    localStorage.removeItem(
      QUEUE_KEY
    );
  } catch (error) {
    console.error(
      'Recovery data clear failed:',
      error
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// RECOVERY STATUS
// ─────────────────────────────────────────────────────────────────────────────

export function getRecoveryStatus() {
  const snapshot =
    getRecoverySnapshot();

  const queue =
    getRecoveryQueue();

  return {
    hasSnapshot: !!snapshot,

    snapshotTimestamp:
      snapshot?.timestamp || null,

    pendingActions:
      queue.filter(
        (item) =>
          item.syncStatus === 'PENDING'
      ).length,

    queueLength:
      queue.length,
  };
}