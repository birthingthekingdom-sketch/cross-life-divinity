import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

interface SyncQueue {
  id: string;
  action: 'lesson_completion' | 'quiz_submission' | 'test_completion';
  data: any;
  timestamp: number;
  synced: boolean;
}

const SYNC_QUEUE_KEY = 'bridge_academy_sync_queue';
const OFFLINE_CACHE_KEY = 'bridge_academy_offline_cache';

export async function saveLessonOffline(lessonId: number, content: any) {
  try {
    const cache = await AsyncStorage.getItem(OFFLINE_CACHE_KEY);
    const lessons = cache ? JSON.parse(cache) : {};
    lessons[`lesson_${lessonId}`] = {
      ...content,
      cachedAt: Date.now()
    };
    await AsyncStorage.setItem(OFFLINE_CACHE_KEY, JSON.stringify(lessons));
  } catch (error) {
    console.error('Error saving lesson offline:', error);
  }
}

export async function getLessonOffline(lessonId: number) {
  try {
    const cache = await AsyncStorage.getItem(OFFLINE_CACHE_KEY);
    if (!cache) return null;
    const lessons = JSON.parse(cache);
    return lessons[`lesson_${lessonId}`] || null;
  } catch (error) {
    console.error('Error getting lesson offline:', error);
    return null;
  }
}

export async function queueLessonCompletion(lessonId: number, courseId: number) {
  try {
    const queue = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
    const syncQueue: SyncQueue[] = queue ? JSON.parse(queue) : [];

    syncQueue.push({
      id: `lesson_${lessonId}_${Date.now()}`,
      action: 'lesson_completion',
      data: { lessonId, courseId },
      timestamp: Date.now(),
      synced: false
    });

    await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(syncQueue));
  } catch (error) {
    console.error('Error queuing lesson completion:', error);
  }
}

export async function queueQuizSubmission(quizId: number, answers: any, score: number) {
  try {
    const queue = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
    const syncQueue: SyncQueue[] = queue ? JSON.parse(queue) : [];

    syncQueue.push({
      id: `quiz_${quizId}_${Date.now()}`,
      action: 'quiz_submission',
      data: { quizId, answers, score },
      timestamp: Date.now(),
      synced: false
    });

    await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(syncQueue));
  } catch (error) {
    console.error('Error queuing quiz submission:', error);
  }
}

export async function queueTestCompletion(testId: number, score: number, answers: any) {
  try {
    const queue = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
    const syncQueue: SyncQueue[] = queue ? JSON.parse(queue) : [];

    syncQueue.push({
      id: `test_${testId}_${Date.now()}`,
      action: 'test_completion',
      data: { testId, score, answers },
      timestamp: Date.now(),
      synced: false
    });

    await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(syncQueue));
  } catch (error) {
    console.error('Error queuing test completion:', error);
  }
}

export async function syncQueuedData(apiBaseUrl: string, token: string) {
  try {
    const state = await NetInfo.fetch();
    if (!state.isConnected) {
      console.log('No internet connection - sync will retry later');
      return false;
    }

    const queue = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
    if (!queue) return true;

    const syncQueue: SyncQueue[] = JSON.parse(queue);
    const unsynced = syncQueue.filter(item => !item.synced);

    for (const item of unsynced) {
      try {
        let endpoint = '';
        let method = 'POST';

        switch (item.action) {
          case 'lesson_completion':
            endpoint = '/api/lessons/complete';
            break;
          case 'quiz_submission':
            endpoint = '/api/quizzes/submit';
            break;
          case 'test_completion':
            endpoint = '/api/practice-tests/complete';
            break;
        }

        const response = await fetch(`${apiBaseUrl}${endpoint}`, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(item.data)
        });

        if (response.ok) {
          item.synced = true;
        } else {
          console.error(`Failed to sync ${item.action}:`, response.statusText);
        }
      } catch (error) {
        console.error(`Error syncing ${item.action}:`, error);
      }
    }

    // Update queue with synced items
    await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(syncQueue));

    // Remove synced items after 24 hours
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    const filtered = syncQueue.filter(item => !(item.synced && item.timestamp < oneDayAgo));
    await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(filtered));

    return true;
  } catch (error) {
    console.error('Error syncing queued data:', error);
    return false;
  }
}

export async function getPendingSyncCount(): Promise<number> {
  try {
    const queue = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
    if (!queue) return 0;
    const syncQueue: SyncQueue[] = JSON.parse(queue);
    return syncQueue.filter(item => !item.synced).length;
  } catch (error) {
    console.error('Error getting pending sync count:', error);
    return 0;
  }
}

export async function clearSyncQueue() {
  try {
    await AsyncStorage.removeItem(SYNC_QUEUE_KEY);
  } catch (error) {
    console.error('Error clearing sync queue:', error);
  }
}
