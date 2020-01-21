import filterUtils from './filterUtils'
import { queueCensor, agentCensor } from './censors'

//sorted in QueueSection
export const queueFormatter = (queue, activeProfileIds, teams, censor) => {
    try {
        if (activeProfileIds.length === 0 || queue.length === 0 || teams.length === 0) {
            return []
        }

        const activeQueueItems = filterUtils.findActiveQueueItems(queue, activeProfileIds, teams)

        return censor ? queueCensor(activeQueueItems) : activeQueueItems
    }
    catch (err) {
        console.error('QueueProfile error:', activeProfileIds, err)
        return queue
    }
}


//Agents need to be sorted before censoring (sorted by surname, censor removes it)
export const agentFormatter = (activeTeam, agents, censor, teams) => {
    if (!agents || agents.length === 0 || activeTeam.length === 0 || teams.length === 0) {
        return []
    }
    try {
        const activeAgents = filterUtils.findActiveAgents(agents, activeTeam)
        const AgentsSorted = activeAgents.sort((a1, a2) => (a1.AgentName < a2.AgentName ? -1 : 1))

        if (censor) {
            const allProfiles = teams.find(t => t.TeamName === 'ALL TEAMS').Profiles
            return agentCensor(AgentsSorted, allProfiles) //takes first names from agentProfiles and replaces agentsOnline names
        }

        return AgentsSorted

    } catch (error) {
        console.log('a', activeTeam, 'b', agents, 'c', censor, 'd', teams)
        console.error('Wild AgentSorting error', error)
        return []
    }
}