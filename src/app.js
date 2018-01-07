const {TextInput, Button, TextView, Picker,  Composite, ui, app} = require('tabris');
const ajax = require('./utils/ajax');
const parse = require('./utils/parse');

let searchContainer = new Composite({
  top: 20,
  right: 0,
  left: 0
}).appendTo(ui.contentView);
let input = new TextInput({
  left: 0,
  width: 200,
  message: '线路'
}).appendTo(searchContainer);
let searchStationInfo = new Button({
  right: 0,
  text: '查询线路信息'
}).appendTo(searchContainer);

let direPicker, direArr;
let stationPicker, stationArr;
let textView;

let isLunch = true;
app.on('foreground', ()=>{
  if(isLunch){
    const selBLine = localStorage.getItem('selBLine'),
        selBDir = localStorage.getItem('selBDir'),
        selBStop = localStorage.getItem('selBStop');
    if(selBLine && selBDir && selBStop){
      getBusInfo(selBLine, selBDir, selBStop);
    }    
  }
  isLunch = false;  
});

searchStationInfo.on('select', () => {
  direPicker && direPicker.dispose();
  stationPicker && stationPicker.dispose();
  textView && textView.dispose();

  ajax.get({
    act: 'getLineDirOption',
    selBLine: input.text
  }).then(res => {
    direArr = parse.dom(res);
    direPicker = new Picker({
      top: 'prev() 20',
      itemCount: direArr.length,
      itemText: (index) => direArr[index].text,
      selectionIndex: 0
    }).appendTo(ui.contentView);
    direPicker.on('select', ({index}) => {
      if(index > 0){
        ajax.get({
          act: 'getDirStationOption',
          selBLine: input.text,
          selBDir: direArr[index].value
        }).then(res => {
          stationArr = parse.dom(res);
          stationPicker = new Picker({
            top: 'prev() 20',
            itemCount: stationArr.length,
            itemText: (index) => stationArr[index].text,
            selectionIndex: 0
          }).appendTo(ui.contentView);
          stationPicker.on('select', ({index}) => {
            const selBLine = input.text,
            selBDir = direArr[direPicker.selectionIndex].value,
            selBStop = stationArr[index].value;
            localStorage.setItem('selBLine', selBLine);
            localStorage.setItem('selBDir', selBDir);
            localStorage.setItem('selBStop', selBStop);
            getBusInfo(selBLine, selBDir, selBStop);
          });
        });
      }
    });
  })
});

function getBusInfo(selBLine, selBDir, selBStop){
  ajax.get({
    act: 'busTime',
    selBLine,
    selBDir,
    selBStop
  }, 'json').then(res => {
    textView = new TextView({
      top: 'prev() 20',
      left: 0,
      right: 0,
      maxLines: 100,
      markupEnabled: true,
      text: parse.domText(res.html)
    }).appendTo(ui.contentView);
  })
}