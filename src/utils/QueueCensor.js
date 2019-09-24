const queueCensor = (queue) => {
    const ServiceCensor = (name) => name[0]

    const newList = []
    queue.forEach(q => {
        const newItem = {
            ServiceId: q.ServiceId,
            ServiceName: ServiceCensor(q.ServiceName),
            ChannelId: q.ChannelId,
            ChannelName: ServiceCensor(q.ChannelName),
            ContactType: q.ContactType,
            Direction: q.Direction,
            MaxQueueTime: q.MaxQueueTime,
            QueueLength: q.QueueLength
        }
        newList.push(newItem)
    })
    return newList
}
export default queueCensor