Ext.Loader.setConfig({
    enabled: true
});

Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.selection.CheckboxModel'
]);

Ext.onReady(function(){


    

    Ext.QuickTips.init();

 

Ext.create('Ext.data.Store', {
    storeId:'simpsonsStore',
    fields:['passed', 'url', 'assertions'],
    data:{
   "testSuiteName":"",
   "startDate":"2014-04-23T13:50:29.174Z",
   "endDate":"2014-04-23T13:51:07.736Z",
   "passed":false,
   "testCases":[
      {
         "type":"Siesta.Result.SubTest",
         "name":null,
         "startDate":1398261030697,
         "endDate":1398261044180,
         "passed":false,
         "url":"tests/signin/signin_up_owner.t.js",
         "assertions":[
            {
               "type":"Siesta.Result.Diagnostic",
               "description":"signout successfully"
            },
            {
               "type":"Siesta.Result.Assertion",
               "passed":false,
               "description":"Failed to signin",
               "annotation":"username=qq passwd=qqqqqq"
            },
            {
               "type":"Siesta.Result.Assertion",
               "passed":true,
               "description":"Waited 5432 ms",
               "isWaitFor":true
            }
         ]
      },
      {
         "type":"Siesta.Result.SubTest",
         "name":null,
         "startDate":1398261059699,
         "endDate":1398261067728,
         "passed":true,
         "url":"tests/project/project_CRUD.t.js",
         "assertions":[
            {
               "type":"Siesta.Result.Assertion",
               "passed":true,
               "description":"test for is"
            }
         ]
      },
      {
         "type":"Siesta.Result.SubTest",
         "name":null,
         "startDate":1398261059699,
         "endDate":1398261067728,
         "passed":true,
         "url":"tests/project/project_CRUD.t.js",
         "assertions":[
            {
               "type":"Siesta.Result.Assertion",
               "passed":true,
               "description":"test for is"
            }
         ]
      }
   ]
},
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            root: 'testCases'
        }
    }
});

// TODO assertions 有多個，click test case, show assertions in another panel
// TODO MVC
// TODO eclipse
// TODO git
var grid2 = Ext.create('Ext.grid.Panel', {
    title: 'Simpsons',
    store: Ext.data.StoreManager.lookup('simpsonsStore'),
    columns: [
        { text: 'Name',  dataIndex: 'passed' },
        { text: 'Email', dataIndex: 'url', flex: 1 },
        { text: 'Phone', dataIndex: 'assertions' }
    ],
    height: 2000,
    width: 1000
 
});

Ext.create('Ext.container.Viewport', {
    layout: 'border',
    items: [{
        region: 'north',
        html: '<h1 class="x-panel-header">UI Test Results</h1>',
        border: false,
        margins: '0 0 5 0'
    }, grid2]
});

   
 
});
