import { TopicInfoDB } from '../../interfaces/database-interfaces/db-topics.interface';
import { TopicInfo } from '../../interfaces/topic.interface';

const topicDataPreparator = (topic: TopicInfoDB): TopicInfo => {
  const topicPrepared = {
    topicId: +topic.topic_id,
    topicName: topic.topic_name,
  };

  return topicPrepared;
};

export default topicDataPreparator;
