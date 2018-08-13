import React from 'react'
import '@babel/polyfill'

import { getUrlParam, getQueryParam, getTicketName } from './utils'

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

    // initialze AP
    $.getScript(allJS, () => {
      console.log('all.js loaded into add-on iframe!');
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
      const ticketData = await AP.request({
        url: `${url}/rest/api/2/issue/${ticketName}?fields=summary,priority,status,issuetype`,
        contentType: 'application/json',
        type: 'GET',
      })
      .then(data => JSON.parse(data.body))

      console.log(ticketData)

      
      const priority = (Math.floor(Math.random() * 5) + 1).toString()
      this.setState({ isLoading: false, isOldView, ticketName, url, priority })
    });
  }


  updatePriority = () => {
    const { AP, url, priority } = this.state    

    const bodyData = {
      "fields": {
        "summary": "5",
        "description": "This is a test",
        "priority": {
          "id": priority
        }
      }
    }

    AP.request({
      url: `${url}/rest/api/2/issue/TEST-1`,
      contentType: 'application/json',
      type: 'PUT',
      data: JSON.stringify(bodyData),
      error: function (response) {
        console.log('fail')
      }
    })
    .then((response) => {
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
      </div>
    ) : <div>Loading!</div>
  }
}