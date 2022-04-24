import { initQueues, getQueueAllConfig } from './utils/queue.util';

// Initialize queues
const queueConfig = getQueueAllConfig();
const queues = initQueues(queueConfig);

export default queues;
