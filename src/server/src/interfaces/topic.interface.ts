interface TopicInfo {
  topicId: number;
  topicName: string;
}

type TopicSearchQuery = {
  topics: string | undefined;
};

export { TopicInfo, TopicSearchQuery };
