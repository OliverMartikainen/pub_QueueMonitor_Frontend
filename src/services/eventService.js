import config from '../utils/config'
const baseUrl = `${config.baseUrl}/push`

const getDataUpdates = () => new EventSource(`${baseUrl}/dataUpdates`) 
const getTeamUpdates = () => new EventSource(`${baseUrl}/teamUpdates`)


export default { getDataUpdates, getTeamUpdates }