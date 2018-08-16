import React from 'react'
import '@babel/polyfill'

import { isOldView, getUrlParam, getQueryParam, getTicketName } from './utils'

export default class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isOldView: false,
      isLoading: true,
      error: null,
      ticketName: '',
      AP: null,
      url: '',
      priority: null
    }
  }

  componentDidMount() {
    this.injectAP()
  }

  injectAP = async () => {
    const allJS = getUrlParam('xdm_e', window.location.search) + getUrlParam('cp', window.location.search) + '/atlassian-connect/all.js';

    $.getScript(allJS, () => {
      this.setState({ AP }, this.fetchData)
    })
  }

  fetchData = () => {
    const { AP } = this.state
    const url = getUrlParam('xdm_e', window.location.search)
    
    AP.getLocation(async (location) => {
      const ticketName = getTicketName(location)
      const isOldView = getQueryParam('oldIssueView', location) === 'true'

      // get ticket data!
      const { id, key, self, ...ticketData } = await AP.request({
        url: `${url}/rest/api/2/issue/${ticketName}?fields=summary,priority,status,issuetype`,
        contentType: 'application/json',
        type: 'GET',
      })
      .then(data => JSON.parse(data.body))

      console.log('\n\n')
      console.log(ticketData)

      
      const priority = (Math.floor(Math.random() * 5) + 1).toString()
      this.setState({ AP, isLoading: false, isOldView, ticketName, url, priority })
    });
  }


  updatePriority = () => {
    const { AP, url, priority, ticketName } = this.state    

    const bodyData = {
      "fields": {
        "priority": {
          "id": priority
        }
      }
    }

    AP.request({
      url: `${url}/rest/api/2/issue/${ticketName}`,
      contentType: 'application/json',
      type: 'PUT',
      data: JSON.stringify(bodyData),
      error: function (response) {
        console.log('fail')
      }
    })
    .then((response) => {
      console.log('\n\n\n\n')
      console.log('success')

      // I break in new view!
      AP.jira.refreshIssuePage()

    })
  }


  render() {
    const { isLoading, AP, priority } = this.state
    return (!isLoading || !AP || !priority) ? (
      <div className="aui-page-panel main-panel">
        <h1>Hi, I'm a basic React app!</h1>
        <p>Press the button to change priority to {priority}.</p>
        <button className='active tab' onClick={this.updatePriority} >
          Click Me!
        </button>
        <iframe src="https://giphy.com/embed/brHaCdJqCXijm" width="100%" height="100%" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>
      </div>
    ) : <div>Loading!</div>
  }
}