import Bull from 'bull';
import Arena from 'bull-arena';
import { getQueues } from './utils/queue.util';

const arena = () => {
  const queues = getQueues();
  return Arena(
    {
      Bull,
      queues: Object.keys(queues).map((queueName) => ({
        type: 'bull',
        name: queueName,
        hostId: 'Scheduler',
        redis: queues[queueName].redis,
      })),
    },
    {
      basePath: '/arena',
      disableListen: false,
    },
  );
};
export default arena;
