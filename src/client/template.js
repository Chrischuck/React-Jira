const  htmlTemplate = reactDom =>{
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
      <link rel="stylesheet" href="//aui-cdn.atlassian.com/aui-adg/5.8.12/css/aui.css" media="all">
      <link rel="stylesheet" href="//aui-cdn.atlassian.com/aui-adg/5.8.12/css/aui-experimental.css" media="all">
      <!--[if IE 9]><link rel="stylesheet" href="//aui-cdn.atlassian.com/aui-adg/5.8.12/css/aui-ie9.css" media="all"><![endif]-->
      <link href="/css" rel="stylesheet">
      </head>
      <body>
        <section id="content" role="main" style='min-height:400px'>
          <div id="app">${ reactDom }</div>
          <script src="https://code.jquery.com/jquery-3.3.1.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>
          <script src="/js"></script>
        </section>
      </body>
    </html>
  `;
}

export default htmlTemplate